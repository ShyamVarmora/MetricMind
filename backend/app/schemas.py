from pydantic import BaseModel, EmailStr
from typing import Any, Optional


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


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class AskRequest(BaseModel):
    question: str

    class Config:
        json_schema_extra = {"example": {"question": "What is the total revenue?"}}


class ApiTrace(BaseModel):
    endpoint: str
    metric: str
    operation: str
    group_by: Optional[str] = None


class AskResponseData(BaseModel):
    answer: str
    data: dict | list[dict]
    api_trace: list[ApiTrace]
    query: dict[str, Any] = {}
    sql: Optional[str] = None
    params: list[Any] = []
    reasoning_steps: list[str] = []


class AskResponse(BaseModel):
    success: bool
    message: str
    data: AskResponseData | None = None


class ErrorResponse(BaseModel):
    success: bool
    message: str
