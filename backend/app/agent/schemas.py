from pydantic import BaseModel, Field
from typing import Optional


class AgentQuery(BaseModel):
    metric: str
    filters: list[dict] = Field(default_factory=list)
    group_by: list[str] = Field(default_factory=list)
    time_range: Optional[str] = None


class AgentResult(BaseModel):
    success: bool
    answer: str
    data: dict
    api_trace: list[dict]