from pydantic import BaseModel
from typing import Optional


class AgentQuery(BaseModel):
    metric: str
    filters: list[dict] = []
    group_by: list[str] = []
    time_range: Optional[str] = None