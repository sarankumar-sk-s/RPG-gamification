import sys
from pathlib import Path
from datetime import date

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError
from app.database.connection import engine, SessionLocal
from app.models import User, Character, Mission, Task, TaskCompletion


def run_checks():
    print("========================================")
    print("   PHASE 2 MODEL & DATABASE VERIFICATION ")
    print("========================================")

    # 1. Check all tables exist
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())
    expected_tables = {"users", "characters", "missions", "tasks", "task_completions", "alembic_version"}
    print(f"\n[1] Checking Tables: {expected_tables}")
    missing_tables = expected_tables - tables
    if missing_tables:
        print(f"❌ Missing tables: {missing_tables}")
        sys.exit(1)
    print(f"[OK] All {len(expected_tables)} expected tables exist.")

    # 2. Check Foreign Keys
    print("\n[2] Checking Foreign Keys:")
    for table_name in ["characters", "missions", "tasks", "task_completions"]:
        fks = inspector.get_foreign_keys(table_name)
        print(f" - {table_name}: {[fk['constrained_columns'] for fk in fks]}")
        assert len(fks) > 0, f"No foreign keys found for {table_name}"
    print("[OK] All Foreign Keys verified.")

    # 3. Check Relationships & CRUD in a Transaction
    print("\n[3] Testing ORM Relationships:")
    with SessionLocal() as db:
        try:
            # Create user
            test_user = User(email="hero@liferpg.com", password_hash="hashed_secret")
            db.add(test_user)
            db.flush()

            # Create character for user
            character = Character(
                user_id=test_user.id,
                level=1,
                xp=0,
                gold=50,
                intellect=12,
                strength=10,
                vitality=10,
                wisdom=14,
                discipline=11,
                streak=1
            )
            db.add(character)

            # Create mission
            mission = Mission(
                user_id=test_user.id,
                title="Master Python & Databases",
                description="Complete backend implementation",
                difficulty="hard"
            )
            db.add(mission)
            db.flush()

            # Create task
            task = Task(
                user_id=test_user.id,
                mission_id=mission.id,
                title="Implement Models",
                description="Write SQLAlchemy models for RPG backend",
                category="Coding",
                difficulty="medium",
                xp_reward=100,
                gold_reward=50,
                repeat_type="daily"
            )
            db.add(task)
            db.flush()

            # Verify relationships in memory / query
            assert test_user.character.user_id == test_user.id
            assert mission in test_user.missions
            assert task in mission.tasks
            assert task in test_user.tasks

            print("[OK] ORM relationships (User -> Character, User -> Mission -> Task) verified.")

            # 4. Check Duplicate-Completion Protection
            print("\n[4] Testing Duplicate Completion Protection:")
            today = date.today()
            completion1 = TaskCompletion(
                task_id=task.id,
                mission_id=mission.id,
                user_id=test_user.id,
                completed_date=today,
                what_you_did="Created models & Alembic migration",
                xp_earned=100,
                gold_earned=50
            )
            db.add(completion1)
            db.flush()
            print("[OK] First task completion created successfully.")

            completion2 = TaskCompletion(
                task_id=task.id,
                mission_id=mission.id,
                user_id=test_user.id,
                completed_date=today,
                what_you_did="Attempting duplicate completion on same day",
                xp_earned=100,
                gold_earned=50
            )
            db.add(completion2)

            caught_error = False
            try:
                db.flush()
            except IntegrityError as ie:
                caught_error = True
                db.rollback()
                print(f"[OK] Caught expected database constraint error on duplicate completion: uq_task_completion_task_date")

            assert caught_error, "Duplicate completion on same date did NOT raise IntegrityError!"

        finally:
            db.rollback()

    print("\n========================================")
    print("   ALL VERIFICATION CHECKS PASSED!      ")
    print("========================================")

if __name__ == "__main__":
    run_checks()
