from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import TaskCompletion, Task, Mission, User
from app.schemas import ActivityItemResponse
from app.routers.deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[ActivityItemResponse])
def get_recent_activity(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves recent completion activity feed for the authenticated user."""
    completions = (
        db.query(TaskCompletion, Task.title.label("task_title"), Mission.title.label("mission_title"))
        .join(Task, TaskCompletion.task_id == Task.id)
        .outerjoin(Mission, TaskCompletion.mission_id == Mission.id)
        .filter(TaskCompletion.user_id == current_user.id)
        .order_by(TaskCompletion.created_at.desc())
        .limit(limit)
        .all()
    )

    activity_items = []
    for tc, t_title, m_title in completions:
        item = ActivityItemResponse(
            id=tc.id,
            task_id=tc.task_id,
            task_title=t_title,
            mission_id=tc.mission_id,
            mission_title=m_title,
            completed_date=tc.completed_date,
            what_you_did=tc.what_you_did,
            evidence_image_url=tc.evidence_image_url,
            xp_earned=tc.xp_earned,
            gold_earned=tc.gold_earned,
            created_at=tc.created_at
        )
        activity_items.append(item)

    return activity_items
