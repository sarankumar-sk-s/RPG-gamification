import sys
from pathlib import Path
import uuid

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Character, Item

client = TestClient(app)


def test_shop_and_inventory_flow():
    print("========================================")
    print("  PHASE 8 SHOP & INVENTORY VERIFICATION ")
    print("========================================")

    user_email = f"merchant_{uuid.uuid4().hex[:6]}@liferpg.com"
    password = "ShopPassword123!"
    user_id = None

    try:
        # Signup User (default 100 Gold)
        res_signup = client.post("/api/v1/auth/signup", json={"email": user_email, "password": password})
        assert res_signup.status_code == 201
        user_id = res_signup.json()["id"]

        # Login User
        token = client.post("/api/v1/auth/login", json={"email": user_email, "password": password}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        print("[OK] User registered and authenticated.")

        # ----------------------------------------------------
        # 1. LIST SHOP ITEMS
        # ----------------------------------------------------
        print("\n[1] Testing List Shop Items (GET /api/v1/shop/items)...")
        res_items = client.get("/api/v1/shop/items")
        assert res_items.status_code == 200
        items_data = res_items.json()
        assert len(items_data) >= 3

        item_names = [it["name"] for it in items_data]
        assert "XP Boost" in item_names
        assert "Focus Potion" in item_names
        assert "Character Badge" in item_names

        potion_item = next(it for it in items_data if it["name"] == "Focus Potion")
        badge_item = next(it for it in items_data if it["name"] == "Character Badge")
        print(f"[OK] Shop items listed successfully. Found {len(items_data)} items.")

        # ----------------------------------------------------
        # 2. PURCHASE ITEM & 3. CHECK GOLD & 4. CHECK INVENTORY
        # ----------------------------------------------------
        print("\n[2, 3 & 4] Testing Purchase Item, Gold Deduction & Inventory...")
        # Initial Gold = 100. Purchase Focus Potion (Price: 30)
        res_pur1 = client.post("/api/v1/shop/purchase", json={"item_id": potion_item["id"]}, headers=headers)
        assert res_pur1.status_code == 200
        pur1_data = res_pur1.json()

        assert pur1_data["success"] is True
        assert pur1_data["price_paid"] == 30
        assert pur1_data["remaining_gold"] == 70
        assert pur1_data["inventory_quantity"] == 1
        print("[OK] Purchased Focus Potion. Gold reduced from 100 to 70.")

        # Check user profile gold
        me_data = client.get("/api/v1/auth/me", headers=headers).json()
        assert me_data["character"]["gold"] == 70
        print("[OK] Confirmed Gold in character profile is 70.")

        # Check inventory endpoint
        res_inv1 = client.get("/api/v1/inventory", headers=headers)
        assert res_inv1.status_code == 200
        inv1_data = res_inv1.json()
        assert len(inv1_data) == 1
        assert inv1_data[0]["item_id"] == potion_item["id"]
        assert inv1_data[0]["quantity"] == 1
        print("[OK] Inventory endpoint returned purchased item with quantity = 1.")

        # Purchase same item again to verify quantity increments
        res_pur2 = client.post("/api/v1/shop/purchase", json={"item_id": potion_item["id"]}, headers=headers)
        assert res_pur2.status_code == 200
        assert res_pur2.json()["remaining_gold"] == 40
        assert res_pur2.json()["inventory_quantity"] == 2
        print("[OK] Purchased Focus Potion again. Quantity incremented to 2, remaining Gold = 40.")

        # ----------------------------------------------------
        # 5. TRY INSUFFICIENT GOLD
        # ----------------------------------------------------
        print("\n[5] Testing Insufficient Gold Protection...")
        # Current Gold = 40. Try purchasing Character Badge (Price: 100)
        res_insuff = client.post("/api/v1/shop/purchase", json={"item_id": badge_item["id"]}, headers=headers)
        assert res_insuff.status_code == 400
        assert "insufficient gold" in res_insuff.json()["detail"].lower()
        print("[OK] Purchase correctly blocked with HTTP 400 Bad Request (Insufficient gold).")

        # Verify Gold remained untouched at 40
        me_check = client.get("/api/v1/auth/me", headers=headers).json()
        assert me_check["character"]["gold"] == 40
        print("[OK] Confirmed Gold remained untouched after failed purchase.")

        # ----------------------------------------------------
        # 6. TRY INVALID ITEM / INACTIVE ITEM
        # ----------------------------------------------------
        print("\n[6] Testing Invalid / Inactive Item Protection...")
        # Non-existent item ID
        res_invalid = client.post("/api/v1/shop/purchase", json={"item_id": 99999}, headers=headers)
        assert res_invalid.status_code == 404
        print(" [OK] Non-existent item purchase attempt returned HTTP 404 Not Found.")

        # Inactive item
        with SessionLocal() as db:
            inactive_item = Item(
                name="Deprecated Elixir",
                description="No longer sold",
                price=10,
                item_type="potion",
                active=False
            )
            db.add(inactive_item)
            db.commit()
            inactive_id = inactive_item.id

        res_inactive = client.post("/api/v1/shop/purchase", json={"item_id": inactive_id}, headers=headers)
        assert res_inactive.status_code == 400
        assert "not available" in res_inactive.json()["detail"].lower()
        print(" [OK] Inactive item purchase attempt returned HTTP 400 Bad Request.")

        # Clean up inactive item
        with SessionLocal() as db:
            it_del = db.query(Item).filter(Item.id == inactive_id).first()
            if it_del:
                db.delete(it_del)
                db.commit()

    finally:
        # Cleanup test user
        with SessionLocal() as db:
            if user_id:
                u = db.query(User).filter(User.id == user_id).first()
                if u:
                    db.delete(u)
                db.commit()
                print("\n[Cleanup] Deleted test user and inventory records.")

    print("\n========================================")
    print("  ALL 6 SHOP & INVENTORY TESTS PASSED!  ")
    print("========================================")


if __name__ == "__main__":
    test_shop_and_inventory_flow()
