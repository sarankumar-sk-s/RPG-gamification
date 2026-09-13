import os
import sys
from pathlib import Path
from datetime import date
from urllib.parse import urlparse

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from alembic.config import Config
from alembic import command
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError
from app.database.connection import engine, SessionLocal, check_db_connection, DATABASE_URL
from app.models import User, Character, Mission, Task, TaskCompletion, Item, Inventory


def mask_url(url: str) -> str:
    """Mask credentials in database URL for safe display."""
    try:
        parsed = urlparse(url)
        netloc_parts = parsed.netloc.split("@")
        if len(netloc_parts) > 1:
            safe_netloc = f"****:****@{netloc_parts[-1]}"
        else:
            safe_netloc = parsed.netloc
        return f"{parsed.scheme}://{safe_netloc}{parsed.path}"
    except Exception:
        return "postgresql://****:****@****"


def step_1_check_connection():
    print("\n==================================================")
    print("STEP 1: DATABASE CONNECTION")
    print("==================================================")
    print(f"Target Database URL: {mask_url(DATABASE_URL)}")
    
    if "localhost:5432" in DATABASE_URL:
        print("[WARNING] The current DATABASE_URL is still pointing to localhost:5432!")
    else:
        print("[OK] DATABASE_URL is pointing to remote target.")

    try:
        check_db_connection()
        print("[SUCCESS] Connected to target database.")
    except Exception as e:
        print(f"[FAILED] Could not connect to target database: {e}")
        sys.exit(1)

    with engine.connect() as conn:
        db_name = conn.execute(text("SELECT current_database();")).scalar()
        user_name = conn.execute(text("SELECT current_user;")).scalar()
        version = conn.execute(text("SELECT version();")).scalar()
        print(f" - Current Database: {db_name}")
        print(f" - Connected User:   {user_name}")
        print(f" - Server Version:   {version.split(',')[0] if version else 'Unknown'}")


def step_2_run_alembic_migrations():
    print("\n==================================================")
    print("STEP 2: RUN ALEMBIC MIGRATIONS")
    print("==================================================")
    alembic_cfg = Config(str(backend_dir / "alembic.ini"))
    alembic_cfg.set_main_option("script_location", str(backend_dir / "alembic"))
    alembic_cfg.set_main_option("sqlalchemy.url", DATABASE_URL.replace("%", "%%"))
    
    try:
        print("Applying migrations (alembic upgrade head)...")
        command.upgrade(alembic_cfg, "head")
        print("[SUCCESS] Alembic migrations applied successfully.")
    except Exception as e:
        print(f"[FAILED] Alembic migration failed: {e}")
        sys.exit(1)


def step_3_verify_schema():
    print("\n==================================================")
    print("STEP 3: VERIFY SCHEMA & TABLES")
    print("==================================================")
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    expected_tables = {
        "users",
        "characters",
        "missions",
        "tasks",
        "task_completions",
        "items",
        "inventory",
        "alembic_version"
    }

    print(f"Discovered Tables: {sorted(existing_tables)}")
    missing = expected_tables - existing_tables
    if missing:
        print(f"[FAILED] Missing expected tables: {missing}")
        sys.exit(1)
    print(f"[SUCCESS] All {len(expected_tables)} required tables exist in target database.")

    # Check foreign keys
    print("\nVerifying Foreign Keys:")
    fk_checks = {
        "characters": ["user_id"],
        "missions": ["user_id"],
        "tasks": ["user_id"],
        "task_completions": ["task_id", "user_id"],
        "inventory": ["user_id", "item_id"]
    }
    for table_name, expected_cols in fk_checks.items():
        fks = inspector.get_foreign_keys(table_name)
        constrained = [col for fk in fks for col in fk.get("constrained_columns", [])]
        for ec in expected_cols:
            assert ec in constrained, f"Missing FK on {table_name}.{ec}"
        print(f" - {table_name}: OK (FKs: {constrained})")
    print("[SUCCESS] All Foreign Key constraints verified.")

    # Check unique constraints
    print("\nVerifying Unique Constraints:")
    task_comp_uq = inspector.get_unique_constraints("task_completions")
    inventory_uq = inspector.get_unique_constraints("inventory")
    print(f" - task_completions unique constraints: {[u['name'] for u in task_comp_uq]}")
    print(f" - inventory unique constraints: {[u['name'] for u in inventory_uq]}")


def step_4_seed_shop_items_if_needed():
    print("\n==================================================")
    print("STEP 4: SEED SHOP ITEMS (IF NEEDED)")
    print("==================================================")
    default_items = [
        {"name": "Health Potion", "description": "Restores vitality and energy.", "price": 25, "item_type": "consumable", "active": True},
        {"name": "Focus Elixir", "description": "Boosts intellect and concentration for the day.", "price": 40, "item_type": "consumable", "active": True},
        {"name": "Iron Sword", "description": "A sturdy blade increasing discipline and strength.", "price": 100, "item_type": "equipment", "active": True},
    ]
    with SessionLocal() as db:
        count = db.query(Item).count()
        if count == 0:
            for itm in default_items:
                db.add(Item(**itm))
            db.commit()
            print(f"[SUCCESS] Seeded {len(default_items)} standard shop items into database.")
        else:
            print(f"[OK] Shop items already present ({count} items found).")


def step_5_test_crud_and_gameplay_flow():
    print("\n==================================================")
    print("STEP 5: TEST COMPLETE CRUD & GAMEPLAY FLOW")
    print("==================================================")
    test_email = f"supabase_test_{int(date.today().strftime('%Y%m%d'))}_{os.getpid()}@liferpg.com"
    
    with SessionLocal() as db:
        try:
            # 1. Create User
            user = User(email=test_email, password_hash="test_secret_hash")
            db.add(user)
            db.flush()
            print(f" 1. Created User ID: {user.id} ({user.email})")

            # 2. Create Character
            character = Character(
                user_id=user.id,
                level=1,
                xp=0,
                gold=150,
                intellect=10,
                strength=10,
                vitality=10,
                wisdom=10,
                discipline=10,
                streak=0
            )
            db.add(character)
            db.flush()
            print(f" 2. Created Character ID: {character.id} (Gold: {character.gold}, Level: {character.level})")

            # 3. Create Mission
            mission = Mission(
                user_id=user.id,
                title="Supabase Migration Quest",
                description="Verify Supabase cloud database connectivity",
                difficulty="medium"
            )
            db.add(mission)
            db.flush()
            print(f" 3. Created Mission ID: {mission.id} ('{mission.title}')")

            # 4. Create Task
            task = Task(
                user_id=user.id,
                mission_id=mission.id,
                title="Execute Migration & Tests",
                description="Run Alembic and verify schema",
                category="Infrastructure",
                difficulty="hard",
                xp_reward=100,
                gold_reward=50,
                repeat_type="none"
            )
            db.add(task)
            db.flush()
            print(f" 4. Created Task ID: {task.id} (XP: {task.xp_reward}, Gold: {task.gold_reward})")

            # 5. Complete Task
            completion = TaskCompletion(
                task_id=task.id,
                mission_id=mission.id,
                user_id=user.id,
                completed_date=date.today(),
                what_you_did="Successfully migrated schema to Supabase",
                evidence_image_url="https://supabase.com/dashboard",
                xp_earned=task.xp_reward,
                gold_earned=task.gold_reward
            )
            db.add(completion)
            character.xp += task.xp_reward
            character.gold += task.gold_reward
            character.streak += 1
            db.flush()
            print(f" 5. Created Task Completion ID: {completion.id} (Character XP now: {character.xp}, Gold: {character.gold})")

            # 6. Test Shop & Inventory
            item = db.query(Item).first()
            assert item is not None, "No items found in shop to test inventory purchase"
            assert character.gold >= item.price, "Character has insufficient gold for test purchase"
            
            inv = Inventory(user_id=user.id, item_id=item.id, quantity=1)
            character.gold -= item.price
            db.add(inv)
            db.flush()
            print(f" 6. Purchased Item '{item.name}' (Inv ID: {inv.id}, Remaining Gold: {character.gold})")

            # 7. Test Duplicate Completion Constraint
            print(" 7. Testing duplicate completion constraint...")
            dup_completion = TaskCompletion(
                task_id=task.id,
                mission_id=mission.id,
                user_id=user.id,
                completed_date=date.today(),
                what_you_did="Duplicate completion attempt",
                xp_earned=task.xp_reward,
                gold_earned=task.gold_reward
            )
            db.add(dup_completion)
            caught_constraint = False
            try:
                db.flush()
            except IntegrityError:
                caught_constraint = True
                db.rollback()
                print("    [SUCCESS] Unique constraint blocked duplicate completion as expected.")

            assert caught_constraint, "Expected IntegrityError on duplicate completion was not raised!"

        finally:
            # Clean up test user and cascade-deleted data
            with SessionLocal() as cleanup_db:
                cleanup_user = cleanup_db.query(User).filter(User.email == test_email).first()
                if cleanup_user:
                    cleanup_db.delete(cleanup_user)
                    cleanup_db.commit()
                    print(f" 8. Cleaned up test record for '{test_email}'")

    print("[SUCCESS] All CRUD and gameplay flow operations passed on target database.")


def main():
    print("==================================================")
    print("   SUPABASE POSTGRESQL MIGRATION & VERIFICATION   ")
    print("==================================================")
    step_1_check_connection()
    step_2_run_alembic_migrations()
    step_3_verify_schema()
    step_4_seed_shop_items_if_needed()
    step_5_test_crud_and_gameplay_flow()
    print("\n==================================================")
    print("   ALL CHECKS SUCCESSFULLY COMPLETED!             ")
    print("==================================================")


if __name__ == "__main__":
    main()
