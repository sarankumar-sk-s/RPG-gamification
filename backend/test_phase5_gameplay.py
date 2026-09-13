import sys
from pathlib import Path
import uuid
from datetime import date

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, TaskCompletion

client = TestClient(app)


def test_gameplay_task_completion_flow():
    print("========================================")
    print("   PHASE 5 CORE GAMEPLAY VERIFICATION   ")
    print("========================================")

    user_a_email = f"hero_a_{uuid.uuid4().hex[:6]}@liferpg.com"
    user_b_email = f"hero_b_{uuid.uuid4().hex[:6]}@liferpg.com"
    password = "GameplayPassword123!"

    user_a_id = None
    user_b_id = None

    try:
        # Signup User A
        res_a = client.post("/api/v1/auth/signup", json={"email": user_a_email, "password": password})
        assert res_a.status_code == 201
        user_a_id = res_a.json()["id"]

        # Signup User B
        res_b = client.post("/api/v1/auth/signup", json={"email": user_b_email, "password": password})
        assert res_b.status_code == 201
        user_b_id = res_b.json()["id"]

        # Login User A
        token_a = client.post("/api/v1/auth/login", json={"email": user_a_email, "password": password}).json()["access_token"]
        headers_a = {"Authorization": f"Bearer {token_a}"}

        # Login User B
        token_b = client.post("/api/v1/auth/login", json={"email": user_b_email, "password": password}).json()["access_token"]
        headers_b = {"Authorization": f"Bearer {token_b}"}

        # Get initial user profile & character stats for User A
        me_before = client.get("/api/v1/auth/me", headers=headers_a).json()
        char_before = me_before["character"]
        initial_xp = char_before["xp"]
        initial_gold = char_before["gold"]
        initial_intellect = char_before["intellect"]
        initial_streak = char_before["streak"]

        print(f"[OK] Authenticated User A. Initial stats -> XP: {initial_xp}, Gold: {initial_gold}, Intellect: {initial_intellect}, Streak: {initial_streak}")

        # Create Mission & Task for User A
        mission_a = client.post("/api/v1/missions", json={"title": "Master Python OOP"}, headers=headers_a).json()
        m_id = mission_a["id"]

        task_payload = {
            "title": "Build Class Hierarchy",
            "description": "Implement inheritance and polymorphism examples",
            "category": "intellect",
            "difficulty": 3, # Hard -> 50 XP, 30 Gold
            "repeat_type": "daily"
        }
        task_a = client.post(f"/api/v1/missions/{m_id}/tasks", json=task_payload, headers=headers_a).json()
        t_id = task_a["id"]
        assert task_a["xp_reward"] == 50
        assert task_a["gold_reward"] == 30
        print(f"[OK] Created Task (ID: {t_id}) with rewards: 50 XP, 30 Gold.")

        # 1. COMPLETE TASK
        print("\n[1] Testing Task Completion (POST /api/v1/tasks/{id}/complete)...")
        complete_payload = {
            "what_you_did": "Studied Python OOP and created two inheritance examples.",
            "evidence_image_url": "https://example.com/evidence.jpg"
        }
        res_comp = client.post(f"/api/v1/tasks/{t_id}/complete", json=complete_payload, headers=headers_a)
        assert res_comp.status_code == 200, f"Task completion failed: {res_comp.status_code} - {res_comp.text}"
        comp_data = res_comp.json()

        assert comp_data["success"] is True
        assert comp_data["task_id"] == t_id
        assert comp_data["xp_earned"] == 50
        assert comp_data["gold_earned"] == 30
        assert "old_level" in comp_data
        assert "new_level" in comp_data
        assert "level_up" in comp_data
        assert "current_xp" in comp_data
        assert "xp_required" in comp_data
        assert "updated_attribute" in comp_data

        print("[OK] Task completed successfully. Response payload verified.")

        # 2. CHECK XP
        print("\n[2] Checking XP Increase...")
        me_after = client.get("/api/v1/auth/me", headers=headers_a).json()
        char_after = me_after["character"]
        assert char_after["xp"] == initial_xp + 50
        print(f"[OK] XP increased by 50 -> New XP: {char_after['xp']}.")

        # 3. CHECK GOLD
        print("\n[3] Checking Gold Increase...")
        assert char_after["gold"] == initial_gold + 30
        print(f"[OK] Gold increased by 30 -> New Gold: {char_after['gold']}.")

        # 4. CHECK ATTRIBUTE
        print("\n[4] Checking Category Attribute (Intellect) Increase...")
        assert char_after["intellect"] == initial_intellect + 1
        attr_info = comp_data["updated_attribute"]

        assert attr_info["attribute"] == "intellect"
        assert attr_info["old_value"] == initial_intellect
        assert attr_info["new_value"] == initial_intellect + 1
        assert attr_info["stat_gained"] == 1
        print(f"[OK] Intellect increased from {initial_intellect} to {char_after['intellect']}.")

        # 5. CHECK DATABASE COMPLETION
        print("\n[5] Verifying TaskCompletion Record in Database...")
        with SessionLocal() as db:
            completion_rec = db.query(TaskCompletion).filter(
                TaskCompletion.task_id == t_id,
                TaskCompletion.completed_date == date.today()
            ).first()
            assert completion_rec is not None
            assert completion_rec.user_id == user_a_id
            assert completion_rec.xp_earned == 50
            assert completion_rec.gold_earned == 30
            assert completion_rec.what_you_did == "Studied Python OOP and created two inheritance examples."
        print("[OK] Database completion record verified successfully.")

        # 6. COMPLETE SAME TASK AGAIN & 7. CONFIRM DUPLICATE REWARD IS PREVENTED
        print("\n[6 & 7] Testing Duplicate Completion Prevention on Same Day...")
        res_dup = client.post(f"/api/v1/tasks/{t_id}/complete", json=complete_payload, headers=headers_a)
        assert res_dup.status_code == 400, f"Expected 400 Bad Request for duplicate completion, got: {res_dup.status_code}"
        assert "already completed today" in res_dup.json()["detail"].lower()
        print("[OK] Duplicate task completion on same day correctly blocked with HTTP 400 Bad Request.")

        # 8. TEST ANOTHER USER'S TASK
        print("\n[8] Testing Cross-User Task Completion Security...")
        res_cross = client.post(f"/api/v1/tasks/{t_id}/complete", json=complete_payload, headers=headers_b)
        assert res_cross.status_code == 404, f"Expected 404 Not Found for completing another user's task, got: {res_cross.status_code}"
        print("[OK] Attempt by User B to complete User A's task correctly returned HTTP 404 Not Found.")

    finally:
        # Cleanup test records
        with SessionLocal() as db:
            for uid in [user_a_id, user_b_id]:
                if uid:
                    u = db.query(User).filter(User.id == uid).first()
                    if u:
                        db.delete(u)
            db.commit()
            print("\n[Cleanup] Deleted test users and gameplay records.")

    print("\n========================================")
    print("   ALL 8 GAMEPLAY VERIFICATION TESTS PASSED! ")
    print("========================================")


if __name__ == "__main__":
    test_gameplay_task_completion_flow()
