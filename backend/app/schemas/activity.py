from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class TaskCompletionResponse(BaseModel):
    id: int
    task_id: int
    mission_id: Optional[int] = None
    user_id: int
    completed_date: date
    what_you_did: Optional[str] = None
    evidence_image_url: Optional[str] = None
    xp_earned: int
    gold_earned: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ActivityItemResponse(BaseModel):
    id: int
    task_id: int
    task_title: Optional[str] = None
    mission_id: Optional[int] = None
    mission_title: Optional[str] = None
    completed_date: date
    what_you_did: Optional[str] = None
    evidence_image_url: Optional[str] = None
    xp_earned: int
    gold_earned: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
