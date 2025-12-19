## importing libraries
import os
import uuid
from dotenv import load_dotenv
load_dotenv()
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters  import RecursiveCharacterTextSplitter
from azure.identity import DefaultAzureCredential
from azure.identity import get_bearer_token_provider
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchField,
    SearchFieldDataType,
    VectorSearch,
    HnswAlgorithmConfiguration,
    VectorSearchProfile,
    AzureOpenAIVectorizer,
    AzureOpenAIVectorizerParameters,
    SearchIndex
)
from openai import AzureOpenAI
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from config.config import Config



class DataLoader:
    """
    A utility class for loading and splitting document data, typically from PDF files.
    This class uses PyPDFLoader for loading PDFs and RecursiveCharacterTextSplitter for chunking text.

    Attributes:
        file_path (str): Path to the file to be loaded.
    """

    def __init__(self, file_path: str):
        """
        Initializes the DataLoader with the path to the file.

        Args:
            file_path (str): Path to the file to be loaded.
        """
        self.file_path = file_path

    def load_data(self):
        """
        Loads the document from the specified file path using PyPDFLoader.

        Returns:
            list: A list of document objects, each representing a page from the PDF.
        """
        loader = PyPDFLoader(self.file_path)
        docs = loader.load()
        print(f"Number of pages in document: {len(docs)}")
        return docs

    def split_data(self, docs, chunk_size=1000, chunk_overlap=200):
        """
        Splits the loaded document into smaller chunks for easier processing.

        Args:
            docs (list): List of document objects to be split.
            chunk_size (int, optional): Size of each chunk in characters. Defaults to 1000.
            chunk_overlap (int, optional): Overlap between chunks in characters. Defaults to 200.

        Returns:
            list: A list of document chunks, each with a unique chunk_id in metadata.
        """
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            add_start_index=True
        )
        all_splits = text_splitter.split_documents(docs)
        print(f"Number of chunks created: {len(all_splits)}")
        for i, chunk in enumerate(all_splits):
            chunk.metadata["chunk_id"] = str(uuid.uuid4())

        return all_splits


class VectorIndexBuilder:
    """
    A class for building and managing a vector search index in Azure Cognitive Search.
    This class handles index creation, embedding generation, and document upload.

    Attributes:
        index_name (str): Name of the Azure Cognitive Search index.
        embedding_dimensions (int): Dimensionality of the embedding vectors.
        embedding_model (str): Name of the embedding model, loaded from environment variables.
        embedding_deployment (str): Name of the embedding deployment, loaded from environment variables.
        credential (DefaultAzureCredential): Azure credentials for authentication.
        index_client (SearchIndexClient): Client for managing the search index.
        openai_client (AzureOpenAI): Client for generating embeddings.
        search_client (SearchClient): Client for uploading and searching documents.
    """

    def __init__(self, index_name: str, embedding_dimensions: int):
        """
        Initializes the VectorIndexBuilder with the specified index name and embedding dimensions.
        Sets up Azure clients and creates the search index.

        Args:
            index_name (str): Name of the Azure Cognitive Search index.
            embedding_dimensions (int): Dimensionality of the embedding vectors.
        """
        self.index_name = index_name
        self.embedding_dimensions = embedding_dimensions
        self.embedding_model = os.getenv("AZURE_OPENAI_EMBEDDING_MODEL_NAME", "text-embedding-3-small")
        self.embedding_deployment = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME", "text-embedding-3-small")
        self.credential = DefaultAzureCredential()
        self.index_client = SearchIndexClient(
            endpoint=os.getenv("AZURE_SEARCH_SERVICE"),
            credential=self.credential
        )
        self.openai_client = AzureOpenAI(
            api_key=os.getenv("AZURE_FOUNDRY_API_KEY"),
            azure_endpoint=os.getenv("AZURE_AI_SERVICES_ENDPOINT"),
            api_version='2024-12-01-preview'
        )
        self.search_client = SearchClient(
            endpoint=os.getenv("AZURE_SEARCH_SERVICE"),
            credential=AzureKeyCredential(os.getenv("AZURE_SEARCH_API_KEY")),
            index_name=index_name
        )
        self.create_index()

    def create_index(self):
        """
        Creates a new search index with the specified fields and vector search configuration.
        Uses HNSW for approximate nearest neighbor search and Azure OpenAI for vectorization.
        """
        print(f"Creating index: {self.index_name}")
        fields = [
            SearchField(name="chunk_id", type=SearchFieldDataType.String, key=True, sortable=True, filterable=True, facetable=True, analyzer_name="keyword"),
            SearchField(name="content", type=SearchFieldDataType.String, searchable=True),
            SearchField(name="metadata", type=SearchFieldDataType.String, searchable=True),
            SearchField(name="page_number", type=SearchFieldDataType.Int32, filterable=True, sortable=True, facetable=True),
            SearchField(name="text_vector", type=SearchFieldDataType.Collection(SearchFieldDataType.Single), vector_search_dimensions=self.embedding_dimensions, vector_search_profile_name="myHnswProfile")
        ]

        # Configure the vector search configuration
        vector_search = VectorSearch(
            algorithms=[
                HnswAlgorithmConfiguration(name="myHnsw"),
            ],
            profiles=[
                VectorSearchProfile(
                    name="myHnswProfile",
                    algorithm_configuration_name="myHnsw",
                    vectorizer_name="myOpenAI",
                )
            ],
            vectorizers=[
                AzureOpenAIVectorizer(
                    vectorizer_name="myOpenAI",
                    kind="azureOpenAI",
                    parameters=AzureOpenAIVectorizerParameters(
                        resource_url=os.getenv("AZURE_OPENAI_ENDPOINT"),
                        deployment_name=os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME"),
                        model_name=os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME"),
                        api_key=os.getenv("AZURE_FOUNDRY_API_KEY")
                    ),
                ),
            ],
        )

        # Create the search index
        index = SearchIndex(name=self.index_name, fields=fields, vector_search=vector_search)
        result = self.index_client.create_or_update_index(index)
        print(f"{result.name} created")

    def upload_data(self, chunks):
        """
        Uploads document chunks to the search index in batches.
        Generates embeddings for each chunk and uploads them to the index.

        Args:
            chunks (list): List of document chunks to upload.

        Raises:
            ValueError: If the chunks list is empty.
        """
        if not chunks:
            print("No chunks to upload.")
            raise ValueError("The chunks list is empty.")

        document = []
        batch_size = 10
        total_batches = len(chunks) // batch_size + (1 if len(chunks) % batch_size != 0 else 0)
        batches_processed = 0

        for index, chunk in enumerate(chunks):
            embedding = self.openai_client.embeddings.create(input=chunk.page_content, model="text-embedding-3-small")
            doc = {
                "chunk_id": chunk.metadata["chunk_id"],
                "content": chunk.page_content,
                "metadata": str(chunk.metadata),
                "page_number": chunk.metadata["page"],
                "text_vector": embedding.data[0].embedding
            }

            document.append(doc)
            if (index + 1) % batch_size == 0 or (index + 1) == len(chunks):
                result = self.search_client.merge_or_upload_documents(documents=document)

                print(f"Upload of batch of {len(document)} documents succeeded: {result[0].succeeded}")

                batches_processed += 1
                batches_remaining = total_batches - batches_processed
                print(f"Batch {batches_processed}/{total_batches} uploaded. Remaining: {batches_remaining}")

                # Clear the documents list for the next batch
                document = []
        print("All documents uploaded successfully.")


def main():
    file_path = Config.FILE_PATH
    index_name = Config.INDEX_NAME
    embedding_dimensions = Config.EMBEDDING_DIMENSIONS

    # Load and split data
    data_loader = DataLoader(file_path)
    docs = data_loader.load_data()
    all_splits = data_loader.split_data(docs, chunk_size=512, chunk_overlap=50)

    # Create vector index and upload data
    vector_index_builder = VectorIndexBuilder(index_name, embedding_dimensions)
    vector_index_builder.upload_data(all_splits)


if __name__ == "__main__":
    main()