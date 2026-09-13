from typing import Optional
from pydantic import BaseModel, ConfigDict


class TaskCompleteRequest(BaseModel):
    what_you_did: Optional[str] = None
    evidence_image_url: Optional[str] = None


class AttributeUpdatedInfo(BaseModel):
    attribute: str
    old_value: int
    new_value: int
    stat_gained: int


class TaskCompleteResponse(BaseModel):
    success: bool = True
    task_id: int
    xp_earned: int
    gold_earned: int
    current_xp: int
    xp_required: int
    old_level: int
    new_level: int
    level_up: bool
    current_streak: int
    updated_attribute: AttributeUpdatedInfo

    model_config = ConfigDict(from_attributes=True)
