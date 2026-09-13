from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Item, Inventory, Character, User
from app.schemas import ItemResponse, PurchaseRequest, PurchaseResponse, InventoryItemResponse
from app.routers.deps import get_current_user

router = APIRouter()


@router.get("/shop/items", response_model=List[ItemResponse])
def get_shop_items(
    db: Session = Depends(get_db)
):
    """Retrieves all active items available in the shop."""
    items = db.query(Item).filter(Item.active == True).all()
    return items


@router.post("/shop/purchase", response_model=PurchaseResponse)
def purchase_item(
    purchase_in: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Purchases a shop item using actual database gold balance in an atomic transaction:
    - Verifies item exists and is active
    - Reads actual Gold from DB
    - Checks for sufficient Gold
    - Deducts Gold (preventing negative gold)
    - Updates/adds item in user's inventory
    - Returns updated Gold and inventory status
    """
    # 1. Verify item exists
    item = db.query(Item).filter(Item.id == purchase_in.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )

    # 2. Verify item is active
    if not item.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item is not available for purchase"
        )

    # 3. Read actual Gold from database
    character = current_user.character
    if not character:
        character = db.query(Character).filter(Character.user_id == current_user.id).first()
        if not character:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Character profile not found"
            )

    # 4. Check sufficient Gold
    if character.gold < item.price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient gold"
        )

    # Execute purchase transaction
    try:
        # 5. Deduct Gold (prevent negative Gold)
        character.gold -= item.price
        if character.gold < 0:
            raise ValueError("Negative gold balance detected")

        # 6. Add/update item in inventory
        inv_item = db.query(Inventory).filter(
            Inventory.user_id == current_user.id,
            Inventory.item_id == item.id
        ).first()

        if inv_item:
            inv_item.quantity += 1
        else:
            inv_item = Inventory(
                user_id=current_user.id,
                item_id=item.id,
                quantity=1
            )
            db.add(inv_item)

        db.commit()
        db.refresh(inv_item)
        db.refresh(character)

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Purchase failed: {str(e)}"
        )

    return PurchaseResponse(
        success=True,
        item_id=item.id,
        item_name=item.name,
        price_paid=item.price,
        remaining_gold=character.gold,
        inventory_quantity=inv_item.quantity
    )


@router.get("/inventory", response_model=List[InventoryItemResponse])
def get_user_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves all items in the authenticated user's inventory."""
    inventory_items = (
        db.query(Inventory)
        .filter(Inventory.user_id == current_user.id)
        .all()
    )
    return inventory_items
