from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: int
    item_type: str
    active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PurchaseRequest(BaseModel):
    item_id: int = Field(..., gt=0, description="ID of the item to purchase")


class PurchaseResponse(BaseModel):
    success: bool = True
    item_id: int
    item_name: str
    price_paid: int
    remaining_gold: int
    inventory_quantity: int


class InventoryItemResponse(BaseModel):
    id: int
    user_id: int
    item_id: int
    quantity: int
    item: ItemResponse
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
