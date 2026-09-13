from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CharacterResponse(BaseModel):
    id: int
    user_id: int
    level: int
    xp: int
    gold: int
    intellect: int
    strength: int
    vitality: int
    wisdom: int
    discipline: int
    streak: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
