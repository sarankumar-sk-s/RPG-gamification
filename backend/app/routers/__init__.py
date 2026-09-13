from app.routers.auth import router as auth_router
from app.routers.missions import router as missions_router
from app.routers.tasks import router as tasks_router
from app.routers.activity import router as activity_router
from app.routers.shop import router as shop_router
from app.routers.deps import get_current_user

__all__ = [
    "auth_router",
    "missions_router",
    "tasks_router",
    "activity_router",
    "shop_router",
    "get_current_user",
]
