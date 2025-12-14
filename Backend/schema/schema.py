"""
Api input request validation model where it validate the api request
"""

from pydantic import BaseModel
from pydantic import Field
from typing import Literal

class QueryRequest(BaseModel):
    """
    Base model for the API request.
    """
    User_Query:str = Field(..., description = "User input query for conversations")
    rag_type: Literal["structured", "unstructured"] = "structured"