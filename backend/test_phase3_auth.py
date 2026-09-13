import sys
from pathlib import Path
import uuid

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Character

client = TestClient(app)


def test_auth_flow():
    print("========================================")
    print("      PHASE 3 AUTHENTICATION VERIFICATION")
    print("========================================")

    test_uuid = str(uuid.uuid4())[:8]
    test_email = f"paladin_{test_uuid}@liferpg.com"
    test_password = "DragonSlayer2026!"

    created_user_id = None

    try:
        # 1. TEST SIGNUP
        print("\n[1] Testing Signup (POST /api/v1/auth/signup)...")
        signup_payload = {
            "email": test_email,
            "password": test_password
        }
        res_signup = client.post("/api/v1/auth/signup", json=signup_payload)
        assert res_signup.status_code == 201, f"Signup failed: {res_signup.status_code} - {res_signup.text}"
        signup_data = res_signup.json()
        
        created_user_id = signup_data["id"]
        assert signup_data["email"] == test_email.lower()
        assert "password_hash" not in signup_data, "SECURITY BUG: password_hash returned in signup response!"
        assert "character" in signup_data and signup_data["character"] is not None
        print("[OK] Signup successful. User ID:", created_user_id)
        print("[OK] Confirmed password_hash is NEVER returned.")

        # 2. TEST DUPLICATE SIGNUP
        print("\n[2] Testing Duplicate Signup Protection...")
        res_dup = client.post("/api/v1/auth/signup", json=signup_payload)
        assert res_dup.status_code == 400, f"Expected 400 Bad Request for duplicate email, got: {res_dup.status_code}"
        assert "already registered" in res_dup.json()["detail"].lower()
        print("[OK] Duplicate signup correctly blocked with HTTP 400 Bad Request.")

        # 3. TEST LOGIN (VALID CREDENTIALS)
        print("\n[3] Testing Login (POST /api/v1/auth/login)...")
        login_payload = {
            "email": test_email,
            "password": test_password
        }
        res_login = client.post("/api/v1/auth/login", json=login_payload)
        assert res_login.status_code == 200, f"Login failed: {res_login.status_code} - {res_login.text}"
        login_data = res_login.json()
        assert "access_token" in login_data and login_data["access_token"]
        assert login_data["token_type"] == "bearer"
        access_token = login_data["access_token"]
        print("[OK] Login successful. Access token received.")

        # 4. TEST INVALID LOGIN
        print("\n[4] Testing Invalid Login...")
        invalid_login_payload = {
            "email": test_email,
            "password": "WrongPassword!"
        }
        res_invalid_login = client.post("/api/v1/auth/login", json=invalid_login_payload)
        assert res_invalid_login.status_code == 401, f"Expected 401 Unauthorized for bad password, got: {res_invalid_login.status_code}"
        print("[OK] Invalid login correctly rejected with HTTP 401 Unauthorized.")

        # 5. TEST /auth/me WITH VALID TOKEN
        print("\n[5] Testing /auth/me with Valid JWT Token...")
        headers = {"Authorization": f"Bearer {access_token}"}
        res_me = client.get("/api/v1/auth/me", headers=headers)
        assert res_me.status_code == 200, f"/auth/me failed: {res_me.status_code} - {res_me.text}"
        me_data = res_me.json()
        assert me_data["id"] == created_user_id
        assert me_data["email"] == test_email.lower()
        assert "password_hash" not in me_data, "SECURITY BUG: password_hash returned in /auth/me response!"
        print("[OK] /auth/me returned current user profile successfully.")

        # 6. TEST /auth/me WITHOUT TOKEN
        print("\n[6] Testing /auth/me without Token...")
        res_me_no_token = client.get("/api/v1/auth/me")
        assert res_me_no_token.status_code == 401, f"Expected 401 for unauthenticated /auth/me, got: {res_me_no_token.status_code}"
        print("[OK] Protected endpoint /auth/me correctly rejected unauthenticated request.")

        # 7. CONFIRM CHARACTER CREATION AND DEFAULTS
        print("\n[7] Confirming Automatically Created Character Defaults...")
        character_data = me_data["character"]
        assert character_data is not None, "Character object missing from user profile!"

        expected_defaults = {
            "level": 1,
            "xp": 0,
            "gold": 100,
            "intellect": 10,
            "strength": 10,
            "vitality": 10,
            "wisdom": 10,
            "discipline": 10,
            "streak": 0,
        }

        print("  Character attributes returned:")
        for k, expected_v in expected_defaults.items():
            actual_v = character_data.get(k)
            print(f"   - {k}: {actual_v} (Expected: {expected_v})")
            assert actual_v == expected_v, f"Mismatch for character field '{k}': expected {expected_v}, got {actual_v}"

        print("[OK] Character defaults verified successfully.")

    finally:
        # Clean up database record
        if created_user_id:
            with SessionLocal() as db:
                user = db.query(User).filter(User.id == created_user_id).first()
                if user:
                    db.delete(user)
                    db.commit()
                    print("\n[Cleanup] Removed test user and associated character from database.")

    print("\n========================================")
    print("   ALL 7 AUTHENTICATION TESTS PASSED!   ")
    print("========================================")


if __name__ == "__main__":
    test_auth_flow()
