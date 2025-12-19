import os
import tomllib

class Config:
    PROMPT = tomllib.load(open(os.path.join(".", "config", "prompts.toml"), "rb"))
    FILE_PATH = r"C:\Users\SumeetMaheshwari\Downloads\earth_book_2019_tagged.pdf"
    INDEX_NAME = "py-rag-tutorial-idx-1"
    EMBEDDING_DIMENSIONS = 1536