from datetime import datetime
from typing import Optional, List, Union
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.task import TaskResponse


class MissionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    difficulty: Optional[Union[int, str]] = "medium"


class MissionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    difficulty: Optional[Union[int, str]] = None


class MissionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    difficulty: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MissionDetailResponse(MissionResponse):
    tasks: List[TaskResponse] = []

    model_config = ConfigDict(from_attributes=True)
