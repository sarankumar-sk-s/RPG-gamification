import sys
from pathlib import Path
import uuid

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User

client = TestClient(app)


def test_missions_and_tasks_flow():
    print("========================================")
    print("   PHASE 4 MISSIONS & TASKS VERIFICATION")
    print("========================================")

    # Setup User A and User B for authorization testing
    user_a_email = f"usera_{uuid.uuid4().hex[:6]}@liferpg.com"
    user_b_email = f"userb_{uuid.uuid4().hex[:6]}@liferpg.com"
    password = "TestPassword123!"

    user_a_id = None
    user_b_id = None

    try:
        # Create User A
        res_a = client.post("/api/v1/auth/signup", json={"email": user_a_email, "password": password})
        assert res_a.status_code == 201
        user_a_id = res_a.json()["id"]

        # Create User B
        res_b = client.post("/api/v1/auth/signup", json={"email": user_b_email, "password": password})
        assert res_b.status_code == 201
        user_b_id = res_b.json()["id"]

        # Login User A
        login_a = client.post("/api/v1/auth/login", json={"email": user_a_email, "password": password})
        token_a = login_a.json()["access_token"]
        headers_a = {"Authorization": f"Bearer {token_a}"}

        # Login User B
        login_b = client.post("/api/v1/auth/login", json={"email": user_b_email, "password": password})
        token_b = login_b.json()["access_token"]
        headers_b = {"Authorization": f"Bearer {token_b}"}

        print("[OK] Created and authenticated User A and User B.")

        # 1. CREATE MISSION
        print("\n[1] Testing Create Mission (POST /api/v1/missions)...")
        mission_payload = {
            "title": "Backend Mastery",
            "description": "Build high-performance REST APIs",
            "difficulty": "hard"
        }
        res_m1 = client.post("/api/v1/missions", json=mission_payload, headers=headers_a)
        assert res_m1.status_code == 201, f"Create mission failed: {res_m1.status_code} - {res_m1.text}"
        m1_data = res_m1.json()
        m1_id = m1_data["id"]
        assert m1_data["title"] == "Backend Mastery"
        assert m1_data["difficulty"] == "hard"
        assert m1_data["user_id"] == user_a_id
        print(f"[OK] Mission created successfully (ID: {m1_id}).")

        # 2. GET MISSIONS
        print("\n[2] Testing Get Missions (GET /api/v1/missions)...")
        res_m_list = client.get("/api/v1/missions", headers=headers_a)
        assert res_m_list.status_code == 200
        m_list = res_m_list.json()
        assert len(m_list) >= 1
        assert any(m["id"] == m1_id for m in m_list)
        print("[OK] Retrieved missions list for User A.")

        # 3. GET ONE MISSION
        print(f"\n[3] Testing Get One Mission (GET /api/v1/missions/{m1_id})...")
        res_m_single = client.get(f"/api/v1/missions/{m1_id}", headers=headers_a)
        assert res_m_single.status_code == 200
        assert res_m_single.json()["id"] == m1_id
        print("[OK] Retrieved single mission details with linked tasks list.")

        # 4. UPDATE MISSION
        print(f"\n[4] Testing Update Mission (PUT /api/v1/missions/{m1_id})...")
        update_m_payload = {"title": "Backend & Database Mastery", "difficulty": 4} # 4 = epic
        res_m_up = client.put(f"/api/v1/missions/{m1_id}", json=update_m_payload, headers=headers_a)
        assert res_m_up.status_code == 200
        assert res_m_up.json()["title"] == "Backend & Database Mastery"
        assert res_m_up.json()["difficulty"] == "epic"
        print("[OK] Updated mission title and normalized difficulty to 'epic'.")

        # 6. CREATE TASK
        print(f"\n[6] Testing Create Task (POST /api/v1/missions/{m1_id}/tasks)...")
        task_payload = {
            "title": "Write Alembic Migrations",
            "description": "Run alembic revision and upgrade head",
            "category": "discipline",
            "difficulty": 3, # 3 = hard -> 50 XP, 30 Gold
            "repeat_type": "daily"
        }
        res_t1 = client.post(f"/api/v1/missions/{m1_id}/tasks", json=task_payload, headers=headers_a)
        assert res_t1.status_code == 201, f"Create task failed: {res_t1.status_code} - {res_t1.text}"
        t1_data = res_t1.json()
        t1_id = t1_data["id"]
        assert t1_data["title"] == "Write Alembic Migrations"
        assert t1_data["xp_reward"] == 50
        assert t1_data["gold_reward"] == 30
        assert t1_data["difficulty"] == "hard"
        print(f"[OK] Task created with calculated rewards: 50 XP, 30 Gold (ID: {t1_id}).")

        # 7. GET TASKS FOR MISSION
        print(f"\n[7] Testing Get Tasks (GET /api/v1/missions/{m1_id}/tasks)...")
        res_t_list = client.get(f"/api/v1/missions/{m1_id}/tasks", headers=headers_a)
        assert res_t_list.status_code == 200
        t_list = res_t_list.json()
        assert len(t_list) >= 1
        assert t_list[0]["id"] == t1_id
        print("[OK] Retrieved tasks for mission.")

        # 8. UPDATE TASK
        print(f"\n[8] Testing Update Task (PUT /api/v1/tasks/{t1_id})...")
        update_t_payload = {
            "title": "Write & Run Alembic Migrations",
            "difficulty": 5 # 5 = legendary -> 250 XP, 150 Gold
        }
        res_t_up = client.put(f"/api/v1/tasks/{t1_id}", json=update_t_payload, headers=headers_a)
        assert res_t_up.status_code == 200
        up_data = res_t_up.json()
        assert up_data["title"] == "Write & Run Alembic Migrations"
        assert up_data["difficulty"] == "legendary"
        assert up_data["xp_reward"] == 250
        assert up_data["gold_reward"] == 150
        print("[OK] Updated task and recalculated rewards for legendary difficulty (250 XP, 150 Gold).")

        # 10. BATCH IMPORT MULTIPLE TASKS
        print(f"\n[10] Testing Import Multiple Tasks (POST /api/v1/missions/{m1_id}/tasks/import)...")
        import_payload = [
            {
                "title": "Read SQLAlchemy 2.0 Docs",
                "category": "intellect",
                "difficulty": 1,
                "repeat_type": "once"
            },
            {
                "title": "30 Min Morning Workout",
                "category": "strength",
                "difficulty": 2,
                "repeat_type": "daily"
            },
            {
                "title": "Meditation & Focus",
                "category": "wisdom",
                "difficulty": "easy",
                "repeat_type": "daily"
            }
        ]
        res_imp = client.post(f"/api/v1/missions/{m1_id}/tasks/import", json=import_payload, headers=headers_a)
        assert res_imp.status_code == 201, f"Import tasks failed: {res_imp.status_code} - {res_imp.text}"
        imp_data = res_imp.json()
        assert len(imp_data) == 3
        print(f"[OK] Successfully batch-imported {len(imp_data)} tasks into mission.")

        # 9. DELETE TASK
        print(f"\n[9] Testing Delete Task (DELETE /api/v1/tasks/{t1_id})...")
        res_t_del = client.delete(f"/api/v1/tasks/{t1_id}", headers=headers_a)
        assert res_t_del.status_code == 204
        # Verify deletion
        res_t_check = client.put(f"/api/v1/tasks/{t1_id}", json={"title": "test"}, headers=headers_a)
        assert res_t_check.status_code == 404
        print("[OK] Task deleted successfully.")

        # 5. DELETE MISSION
        print(f"\n[5] Testing Delete Mission (DELETE /api/v1/missions/{m1_id})...")
        res_m_del = client.delete(f"/api/v1/missions/{m1_id}", headers=headers_a)
        assert res_m_del.status_code == 204
        # Verify deletion
        res_m_check = client.get(f"/api/v1/missions/{m1_id}", headers=headers_a)
        assert res_m_check.status_code == 404
        print("[OK] Mission deleted successfully.")

        # 11. TEST UNAUTHORIZED ACCESS & MULTI-TENANT SECURITY
        print("\n[11] Testing Unauthorized Access & Security Isolation...")
        # Create a mission for User A
        m_a = client.post("/api/v1/missions", json={"title": "User A Private Mission"}, headers=headers_a).json()
        m_a_id = m_a["id"]
        t_a = client.post(f"/api/v1/missions/{m_a_id}/tasks", json={"title": "User A Task"}, headers=headers_a).json()
        t_a_id = t_a["id"]

        # a) Unauthenticated access (no JWT token) -> Expect 401
        assert client.get("/api/v1/missions").status_code == 401
        assert client.get(f"/api/v1/missions/{m_a_id}").status_code == 401
        assert client.get(f"/api/v1/missions/{m_a_id}/tasks").status_code == 401
        print(" [OK] Unauthenticated requests correctly rejected with HTTP 401 Unauthorized.")

        # b) User B trying to access User A's mission -> Expect 404 Not Found
        assert client.get(f"/api/v1/missions/{m_a_id}", headers=headers_b).status_code == 404
        assert client.put(f"/api/v1/missions/{m_a_id}", json={"title": "Hacked"}, headers=headers_b).status_code == 404
        assert client.delete(f"/api/v1/missions/{m_a_id}", headers=headers_b).status_code == 404
        assert client.get(f"/api/v1/missions/{m_a_id}/tasks", headers=headers_b).status_code == 404
        assert client.post(f"/api/v1/missions/{m_a_id}/tasks", json={"title": "Hacked Task"}, headers=headers_b).status_code == 404
        print(" [OK] Cross-user mission access attempts correctly returned HTTP 404 Not Found.")

        # c) User B trying to update or delete User A's task -> Expect 404 Not Found
        assert client.put(f"/api/v1/tasks/{t_a_id}", json={"title": "Hacked Task"}, headers=headers_b).status_code == 404
        assert client.delete(f"/api/v1/tasks/{t_a_id}", headers=headers_b).status_code == 404
        print(" [OK] Cross-user task access attempts correctly returned HTTP 404 Not Found.")

    finally:
        # Cleanup database records
        with SessionLocal() as db:
            for uid in [user_a_id, user_b_id]:
                if uid:
                    u = db.query(User).filter(User.id == uid).first()
                    if u:
                        db.delete(u)
            db.commit()
            print("\n[Cleanup] Deleted test users, missions, and tasks from database.")

    print("\n========================================")
    print("  ALL 11 MISSIONS & TASKS TESTS PASSED! ")
    print("========================================")


if __name__ == "__main__":
    test_missions_and_tasks_flow()
