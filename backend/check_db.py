import os
import sys
from pathlib import Path

# Ensure backend root is in Python path for import resolution
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy import inspect, text
from app.database.connection import engine, SessionLocal, check_db_connection


def main():
    print("=== Database Health Check ===")
    try:
        if check_db_connection():
            print("Status: Connected successfully (SELECT 1 passed)\n")
    except Exception as e:
        print(f"Status: Connection failed ({e})\n")
        return

    with engine.connect() as conn:
        version = conn.execute(text("SELECT version();")).scalar()
        db_name = conn.execute(text("SELECT current_database();")).scalar()
        user_name = conn.execute(text("SELECT current_user;")).scalar()
        print(f"Database Name: {db_name}")
        print(f"Connected User: {user_name}")
        print(f"PostgreSQL Version: {version}\n")

    print("=== Tables & Row Counts ===")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    with SessionLocal() as db:
        for table in sorted(tables):
            count = db.execute(text(f'SELECT COUNT(*) FROM "{table}"')).scalar()
            print(f" - {table}: {count} row(s)")


if __name__ == "__main__":
    main()
