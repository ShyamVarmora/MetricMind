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
    email: str


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
                "question": "Show revenue"
            }
        }


class AskResponseData(BaseModel):
    metric: str
    analysis: str
    chart: str
    api_used: str

    class Config:
        json_schema_extra = {
            "example": {
                "metric": "totalSales",
                "analysis": "Revenue analysis requested.",
                "chart": "bar",
                "api_used": "/dashboard"
            }
        }


class AskResponse(BaseModel):
    success: bool
    message: str
    data: Optional[AskResponseData] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Metric identified successfully",
                "data": {
                    "metric": "totalSales",
                    "analysis": "Revenue analysis requested.",
                    "chart": "bar",
                    "api_used": "/dashboard"
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
                "message": "Unable to identify requested metric."
            }
        }