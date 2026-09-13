from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Mission, User
from app.schemas import MissionCreate, MissionUpdate, MissionResponse, MissionDetailResponse
from app.routers.deps import get_current_user
from app.utils import calculate_task_rewards

router = APIRouter()


@router.post("", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
def create_mission(
    mission_in: MissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Creates a new mission for the authenticated user."""
    _, _, normalized_difficulty = calculate_task_rewards(mission_in.difficulty)

    mission = Mission(
        user_id=current_user.id,
        title=mission_in.title,
        description=mission_in.description,
        difficulty=normalized_difficulty
    )
    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


@router.get("", response_model=List[MissionResponse])
def get_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lists all missions belonging to the authenticated user."""
    missions = db.query(Mission).filter(Mission.user_id == current_user.id).all()
    return missions


@router.get("/{mission_id}", response_model=MissionDetailResponse)
def get_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves a specific mission and its tasks if owned by the authenticated user."""
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == current_user.id
    ).first()

    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    return mission


@router.put("/{mission_id}", response_model=MissionResponse)
def update_mission(
    mission_id: int,
    mission_in: MissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates a mission owned by the authenticated user."""
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == current_user.id
    ).first()

    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )

    if mission_in.title is not None:
        mission.title = mission_in.title
    if mission_in.description is not None:
        mission.description = mission_in.description
    if mission_in.difficulty is not None:
        _, _, normalized_difficulty = calculate_task_rewards(mission_in.difficulty)
        mission.difficulty = normalized_difficulty

    db.commit()
    db.refresh(mission)
    return mission


@router.delete("/{mission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deletes a mission owned by the authenticated user."""
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == current_user.id
    ).first()

    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )

    db.delete(mission)
    db.commit()
    return None
