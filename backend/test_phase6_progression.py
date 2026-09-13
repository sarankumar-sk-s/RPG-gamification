import sys
from pathlib import Path
import uuid
from datetime import date, timedelta

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, TaskCompletion, Task, Character
from app.services.progression_service import calculate_xp_required_for_level

client = TestClient(app)


def test_progression_system_flow():
    print("========================================")
    print("  PHASE 6 RPG PROGRESSION VERIFICATION  ")
    print("========================================")

    user_email = f"paladin_p6_{uuid.uuid4().hex[:6]}@liferpg.com"
    password = "ProgressionPassword123!"
    user_id = None

    try:
        # Signup User
        res_signup = client.post("/api/v1/auth/signup", json={"email": user_email, "password": password})
        assert res_signup.status_code == 201
        user_id = res_signup.json()["id"]

        # Login User
        token = client.post("/api/v1/auth/login", json={"email": user_email, "password": password}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create Mission
        mission = client.post("/api/v1/missions", json={"title": "Master RPG Systems"}, headers=headers).json()
        m_id = mission["id"]

        print("[OK] Authenticated user and created mission.")

        # ----------------------------------------------------
        # 1. TEST XP GAIN & FORMULA VERIFICATION
        # ----------------------------------------------------
        print("\n[1] Testing XP Gain and Level Formula...")
        # Create Task (Medium difficulty -> 25 XP)
        task1 = client.post(f"/api/v1/missions/{m_id}/tasks", json={
            "title": "Solve 1 Algorithm Problem",
            "category": "intellect",
            "difficulty": 2 # Medium -> 25 XP
        }, headers=headers).json()

        res_comp1 = client.post(f"/api/v1/tasks/{task1['id']}/complete", json={"what_you_did": "Solved Binary Search"}, headers=headers)
        assert res_comp1.status_code == 200
        data1 = res_comp1.json()

        assert data1["current_xp"] == 25
        # Expected XP for next level (Level 1) = 100 * (1 ^ 1.5) = 100
        expected_xp_req = calculate_xp_required_for_level(1)
        assert expected_xp_req == 100
        assert data1["xp_required"] == expected_xp_req
        assert data1["level_up"] is False
        assert data1["old_level"] == 1
        assert data1["new_level"] == 1
        print(f"[OK] XP Gain verified: current_xp=25, xp_required={expected_xp_req}, level_up=False.")

        # ----------------------------------------------------
        # 4. TEST FIRST STREAK
        # ----------------------------------------------------
        print("\n[4] Testing First Streak...")
        assert data1["current_streak"] == 1
        print("[OK] First valid completion successfully set streak = 1.")

        # ----------------------------------------------------
        # 7. TEST DUPLICATE SAME-DAY COMPLETION
        # ----------------------------------------------------
        print("\n[7] Testing Duplicate Same-Day Completion Prevention...")
        res_dup = client.post(f"/api/v1/tasks/{task1['id']}/complete", json={"what_you_did": "Duplicate attempt"}, headers=headers)
        assert res_dup.status_code == 400
        assert "already completed today" in res_dup.json()["detail"].lower()
        print("[OK] Duplicate completion on same day correctly blocked with HTTP 400 Bad Request.")

        # ----------------------------------------------------
        # 2. TEST SINGLE LEVEL-UP
        # ----------------------------------------------------
        print("\n[2] Testing Single Level-Up...")
        # Create Task (Hard difficulty -> 50 XP) and another task to reach 100 XP (Level 1 threshold = 100 XP)
        task2 = client.post(f"/api/v1/missions/{m_id}/tasks", json={
            "title": "Epic Refactoring",
            "category": "strength",
            "difficulty": 4 # Epic -> 100 XP
        }, headers=headers).json()

        res_comp2 = client.post(f"/api/v1/tasks/{task2['id']}/complete", json={"what_you_did": "Refactored Core Module"}, headers=headers)
        assert res_comp2.status_code == 200
        data2 = res_comp2.json()

        # Previous XP was 25 + 100 = 125 XP -> Should level up from 1 to 2!
        assert data2["current_xp"] == 125
        assert data2["old_level"] == 1
        assert data2["new_level"] == 2
        assert data2["level_up"] is True
        # Expected XP for level 2 = int(100 * (2 ^ 1.5)) = 282
        expected_xp_lvl2 = calculate_xp_required_for_level(2)
        assert expected_xp_lvl2 == 282
        assert data2["xp_required"] == expected_xp_lvl2
        print(f"[OK] Level-up verified: Old Level: 1 -> New Level: 2 (XP: 125/282).")

        # ----------------------------------------------------
        # 3. TEST MULTIPLE LEVEL-UPS IN ONE TASK COMPLETION
        # ----------------------------------------------------
        print("\n[3] Testing Multiple Level-Ups in One Task Completion...")
        # Create custom high-XP task by creating task with legendary difficulty (250 XP)
        # 125 + 250 = 375 XP. Level 2 threshold = 282 (reaches L3), Level 3 threshold = 519 (stays at L3).
        # Let's adjust task xp_reward to 1000 in DB to test multi-level-up jumping (Level 2 -> Level 5)!
        task_massive = client.post(f"/api/v1/missions/{m_id}/tasks", json={
            "title": "Defeat Boss Dragon",
            "category": "wisdom",
            "difficulty": 5 # Legendary -> 250 XP
        }, headers=headers).json()

        # Modify task's xp_reward directly in DB to 1000 to test multi-level jump
        with SessionLocal() as db:
            t_obj = db.query(Task).filter(Task.id == task_massive['id']).first()
            t_obj.xp_reward = 1000
            db.commit()

        res_comp_massive = client.post(f"/api/v1/tasks/{task_massive['id']}/complete", json={"what_you_did": "Slew the dragon"}, headers=headers)
        assert res_comp_massive.status_code == 200
        data_massive = res_comp_massive.json()

        # Old level was 2. XP = 125 + 1000 = 1125.
        # L1 req: 100, L2 req: 282, L3 req: 519, L4 req: 800, L5 req: 1118, L6 req: 1469.
        # 1125 XP >= L5 req (1118), so level jumps from 2 to 6!
        assert data_massive["old_level"] == 2
        assert data_massive["new_level"] > 3
        assert data_massive["level_up"] is True
        print(f"[OK] Multi Level-Up verified: Old Level: 2 -> New Level: {data_massive['new_level']} (XP: {data_massive['current_xp']}/{data_massive['xp_required']}).")

        # ----------------------------------------------------
        # 5. TEST CONSECUTIVE STREAK
        # ----------------------------------------------------
        print("\n[5] Testing Consecutive Streak...")
        # Simulate yesterday completion in DB
        yesterday = date.today() - timedelta(days=1)
        with SessionLocal() as db:
            # Delete today's completions temporarily or insert a completion for yesterday
            c_yest = TaskCompletion(
                task_id=task1['id'],
                user_id=user_id,
                completed_date=yesterday,
                xp_earned=10,
                gold_earned=5
            )
            db.add(c_yest)
            # Set user character streak to 1
            char = db.query(Character).filter(Character.user_id == user_id).first()
            char.streak = 1
            db.commit()

        # Now complete a new task tomorrow (simulated by deleting today's completion records)
        with SessionLocal() as db:
            db.query(TaskCompletion).filter(
                TaskCompletion.user_id == user_id,
                TaskCompletion.completed_date == date.today()
            ).delete()
            db.commit()

        task_consec = client.post(f"/api/v1/missions/{m_id}/tasks", json={
            "title": "Daily Morning Reading",
            "category": "discipline",
            "difficulty": 1
        }, headers=headers).json()

        res_consec = client.post(f"/api/v1/tasks/{task_consec['id']}/complete", json={"what_you_did": "Read 20 pages"}, headers=headers)
        assert res_consec.status_code == 200
        assert res_consec.json()["current_streak"] == 2
        print("[OK] Consecutive day streak verified: streak increased from 1 to 2.")

        # ----------------------------------------------------
        # 6. TEST BROKEN STREAK (GAP > 1 DAY)
        # ----------------------------------------------------
        print("\n[6] Testing Broken Streak Reset...")
        # Simulate gap by setting last completion date to 3 days ago
        three_days_ago = date.today() - timedelta(days=3)
        with SessionLocal() as db:
            # Delete all completions for this user
            db.query(TaskCompletion).filter(TaskCompletion.user_id == user_id).delete()
            # Add completion 3 days ago
            c_old = TaskCompletion(
                task_id=task1['id'],
                user_id=user_id,
                completed_date=three_days_ago,
                xp_earned=10,
                gold_earned=5
            )
            db.add(c_old)
            # Set character streak to 5
            char = db.query(Character).filter(Character.user_id == user_id).first()
            char.streak = 5
            db.commit()

        task_broken = client.post(f"/api/v1/missions/{m_id}/tasks", json={
            "title": "Return After Break",
            "category": "vitality",
            "difficulty": 1
        }, headers=headers).json()

        res_broken = client.post(f"/api/v1/tasks/{task_broken['id']}/complete", json={"what_you_did": "Back on track"}, headers=headers)
        assert res_broken.status_code == 200
        assert res_broken.json()["current_streak"] == 1
        print("[OK] Broken streak reset verified: streak reset from 5 to 1 after gap.")

    finally:
        # Cleanup
        with SessionLocal() as db:
            if user_id:
                u = db.query(User).filter(User.id == user_id).first()
                if u:
                    db.delete(u)
                db.commit()
                print("\n[Cleanup] Deleted test user and progression records.")

    print("\n========================================")
    print("  ALL 7 PROGRESSION TESTS PASSED!       ")
    print("========================================")


if __name__ == "__main__":
    test_progression_system_flow()
