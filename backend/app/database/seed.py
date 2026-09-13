from app.database import SessionLocal
from app.models import Item


SEED_ITEMS = [
    {
        "name": "XP Boost",
        "description": "Increases XP gain",
        "price": 50,
        "item_type": "boost",
        "active": True,
    },
    {
        "name": "Focus Potion",
        "description": "Restores energy and focus",
        "price": 30,
        "item_type": "potion",
        "active": True,
    },
    {
        "name": "Character Badge",
        "description": "Special cosmetic badge for your profile",
        "price": 100,
        "item_type": "badge",
        "active": True,
    },
]


def seed_shop_items():
    """Seeds the initial shop items if they do not already exist."""
    with SessionLocal() as db:
        for seed_data in SEED_ITEMS:
            existing = db.query(Item).filter(Item.name == seed_data["name"]).first()
            if not existing:
                item = Item(**seed_data)
                db.add(item)
        db.commit()
        print("[OK] Shop items seeded successfully.")


if __name__ == "__main__":
    seed_shop_items()
