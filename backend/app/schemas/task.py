from datetime import datetime
from enum import Enum
from typing import Optional, Union
from pydantic import BaseModel, ConfigDict, Field


class TaskCategory(str, Enum):
    INTELLECT = "intellect"
    STRENGTH = "strength"
    VITALITY = "vitality"
    WISDOM = "wisdom"
    DISCIPLINE = "discipline"


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = "intellect"
    difficulty: Union[int, str] = "medium"
    repeat_type: Optional[str] = "daily"


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[Union[int, str]] = None
    repeat_type: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    mission_id: Optional[int] = None
    user_id: int
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: str
    xp_reward: int
    gold_reward: int
    repeat_type: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
