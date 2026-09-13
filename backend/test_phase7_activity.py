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


def test_evidence_and_activity_flow():
    print("========================================")
    print("  PHASE 7 EVIDENCE & ACTIVITY VERIFICATION")
    print("========================================")

    user_a_email = f"scout_a_{uuid.uuid4().hex[:6]}@liferpg.com"
    user_b_email = f"scout_b_{uuid.uuid4().hex[:6]}@liferpg.com"
    password = "EvidencePassword123!"

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

        # Create Mission & Tasks for User A
        mission_a = client.post("/api/v1/missions", json={"title": "Master Full-Stack Dev"}, headers=headers_a).json()
        m_id = mission_a["id"]

        task1 = client.post(f"/api/v1/missions/{m_id}/tasks", json={
            "title": "Study Python Inheritance",
            "category": "intellect",
            "difficulty": 2 # Medium -> 25 XP, 15 Gold
        }, headers=headers_a).json()
        t1_id = task1["id"]

        task2 = client.post(f"/api/v1/missions/{m_id}/tasks", json={
            "title": "Build FastAPI REST Endpoint",
            "category": "discipline",
            "difficulty": 3 # Hard -> 50 XP, 30 Gold
        }, headers=headers_a).json()
        t2_id = task2["id"]

        print("[OK] Created test users, mission, and tasks.")

        # ----------------------------------------------------
        # 1. COMPLETE TASK WITH DESCRIPTION
        # ----------------------------------------------------
        print("\n[1] Testing Complete Task with Description...")
        desc_payload = {
            "what_you_did": "I learned Python inheritance and created an example class hierarchy."
        }
        res_c1 = client.post(f"/api/v1/tasks/{t1_id}/complete", json=desc_payload, headers=headers_a)
        assert res_c1.status_code == 200
        print("[OK] Task 1 completed with description.")

        # ----------------------------------------------------
        # 2. COMPLETE TASK WITH EVIDENCE URL
        # ----------------------------------------------------
        print("\n[2] Testing Complete Task with Evidence URL...")
        evidence_payload = {
            "what_you_did": "Implemented and tested FastAPI activity endpoints.",
            "evidence_image_url": "https://example.com/screenshots/fastapi_test_results.png"
        }
        res_c2 = client.post(f"/api/v1/tasks/{t2_id}/complete", json=evidence_payload, headers=headers_a)
        assert res_c2.status_code == 200
        print("[OK] Task 2 completed with evidence image URL.")

        # ----------------------------------------------------
        # 3. CHECK DATABASE PERSISTENCE
        # ----------------------------------------------------
        print("\n[3] Checking Database Persistence of Evidence & Activity Records...")
        with SessionLocal() as db:
            tc1 = db.query(TaskCompletion).filter(TaskCompletion.task_id == t1_id).first()
            assert tc1 is not None
            assert tc1.what_you_did == "I learned Python inheritance and created an example class hierarchy."
            assert tc1.evidence_image_url is None
            assert tc1.completed_date == date.today()
            assert tc1.xp_earned == 25
            assert tc1.gold_earned == 15

            tc2 = db.query(TaskCompletion).filter(TaskCompletion.task_id == t2_id).first()
            assert tc2 is not None
            assert tc2.what_you_did == "Implemented and tested FastAPI activity endpoints."
            assert tc2.evidence_image_url == "https://example.com/screenshots/fastapi_test_results.png"
            assert tc2.completed_date == date.today()
            assert tc2.xp_earned == 50
            assert tc2.gold_earned == 30
        print("[OK] Database persistence of what_you_did, evidence_image_url, completed_date, and rewards verified.")

        # ----------------------------------------------------
        # 4. GET TASK HISTORY
        # ----------------------------------------------------
        print(f"\n[4] Testing Get Task History (GET /api/v1/tasks/{t2_id}/history)...")
        res_hist = client.get(f"/api/v1/tasks/{t2_id}/history", headers=headers_a)
        assert res_hist.status_code == 200
        hist_data = res_hist.json()
        assert len(hist_data) == 1
        assert hist_data[0]["task_id"] == t2_id
        assert hist_data[0]["evidence_image_url"] == "https://example.com/screenshots/fastapi_test_results.png"
        print("[OK] Task history retrieved successfully.")

        # ----------------------------------------------------
        # 5. GET ACTIVITY FEED
        # ----------------------------------------------------
        print("\n[5] Testing Get Activity Feed (GET /api/v1/activity)...")
        res_act = client.get("/api/v1/activity", headers=headers_a)
        assert res_act.status_code == 200
        act_data = res_act.json()
        assert len(act_data) >= 2
        # Verify enriched task_title and mission_title
        t2_item = next(item for item in act_data if item["task_id"] == t2_id)
        assert t2_item["task_title"] == "Build FastAPI REST Endpoint"
        assert t2_item["mission_title"] == "Master Full-Stack Dev"
        assert t2_item["evidence_image_url"] == "https://example.com/screenshots/fastapi_test_results.png"
        print("[OK] Activity feed returned recent completions with task_title and mission_title.")

        # ----------------------------------------------------
        # 6. VERIFY USER ISOLATION
        # ----------------------------------------------------
        print("\n[6] Testing User Isolation & Security...")
        # User B accessing User A's task history -> Expect 404 Not Found
        res_cross_hist = client.get(f"/api/v1/tasks/{t2_id}/history", headers=headers_b)
        assert res_cross_hist.status_code == 404
        print(" [OK] User B attempt to access User A's task history returned HTTP 404 Not Found.")

        # User B calling /activity -> Expect 0 items from User A
        res_act_b = client.get("/api/v1/activity", headers=headers_b)
        assert res_act_b.status_code == 200
        act_b_data = res_act_b.json()
        assert len(act_b_data) == 0
        print(" [OK] User B activity feed contains zero items from User A.")

    finally:
        # Cleanup
        with SessionLocal() as db:
            for uid in [user_a_id, user_b_id]:
                if uid:
                    u = db.query(User).filter(User.id == uid).first()
                    if u:
                        db.delete(u)
            db.commit()
            print("\n[Cleanup] Deleted test users and activity records.")

    print("\n========================================")
    print("  ALL 6 EVIDENCE & ACTIVITY TESTS PASSED!")
    print("========================================")


if __name__ == "__main__":
    test_evidence_and_activity_flow()
