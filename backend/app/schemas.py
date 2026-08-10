from pydantic import BaseModel, EmailStr
from typing import Optional


# -----------------------------
# User Schemas
# -----------------------------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ProfileUpdate(BaseModel):
    name: str
    email: EmailStr


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


# -----------------------------
# Authentication Schemas
# -----------------------------

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# -----------------------------
# AI Ask Schemas
# -----------------------------

class AskRequest(BaseModel):
    question: str

    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is the total revenue?"
            }
        }


class ApiTrace(BaseModel):
    endpoint: str
    metric: str
    operation: str


class AskResponseData(BaseModel):
    answer: str

    # Can contain either normal metric results
    # or structured multi-step analysis results.
    data: dict | list[dict]

    api_trace: list[ApiTrace]


class AskResponse(BaseModel):
    success: bool
    message: str
    data: AskResponseData | None = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Question processed successfully",
                "data": {
                    "answer": "The total revenue is 29,358,677.22.",
                    "data": [
                        {
                            "total_sales": 29358677.22
                        }
                    ],
                    "api_trace": [
                        {
                            "endpoint": "/dashboard",
                            "metric": "totalSales",
                            "operation": "database_query"
                        }
                    ]
                }
            }
        }


class ErrorResponse(BaseModel):
    success: bool
    message: str

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "message": "Unable to identify a supported metric."
            }
        }