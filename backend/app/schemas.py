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
                "question": "Show revenue and profit"
            }
        }


class AskMetricData(BaseModel):
    metric: str
    api_used: str
    chart_type: str


class AskMeta(BaseModel):
    endpoint: str
    method: str
    timestamp: str
    metric: list[str]
    chart_type: list[str]


class AskResponseData(BaseModel):
    question: str
    intent: str
    metrics: list[AskMetricData]
    meta: AskMeta


class AskResponse(BaseModel):
    success: bool
    message: str
    data: Optional[AskResponseData] = None


class ErrorResponse(BaseModel):
    success: bool
    message: str

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "message": "Unable to identify requested metric."
            }
        }