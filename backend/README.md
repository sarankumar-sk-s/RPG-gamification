# Life RPG - Backend API

FastAPI backend service for the Life RPG gamification app.

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI application entrypoint
│   ├── database.py      # Database connection & session setup
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic schemas for request/response validation
│   ├── routers/         # API endpoints & route handlers
│   ├── services/        # Business logic services
│   └── utils/           # Helper utilities
├── alembic/             # Database migration scripts
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── .gitignore
└── README.md
```

## Getting Started

### 1. Prerequisites
- Python 3.10+
- PostgreSQL database

### 2. Environment Setup
Copy `.env.example` to `.env` and adjust the variables as needed:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Health Check
Access http://localhost:8000/health to verify the backend is running.
