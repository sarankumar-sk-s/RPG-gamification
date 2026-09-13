import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import check_db_connection
from app.routers import auth_router, missions_router, tasks_router, activity_router, shop_router

load_dotenv()

app = FastAPI(
    title="Life RPG Backend",
    description="Backend API service for Life RPG gamification app",
    version="0.1.0"
)

# Register Routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(missions_router, prefix="/api/v1/missions", tags=["missions"])
app.include_router(tasks_router, prefix="/api/v1", tags=["tasks"])
app.include_router(activity_router, prefix="/api/v1/activity", tags=["activity"])
app.include_router(shop_router, prefix="/api/v1", tags=["shop", "inventory"])





# CORS Configuration
raw_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
)
origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "life-rpg-backend"
    }


@app.get("/health/db")
def health_db_check():
    try:
        check_db_connection()
        return {
            "status": "ok",
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "database": "disconnected",
                "error": str(e)
            }
        )
