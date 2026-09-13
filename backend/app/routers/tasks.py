from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models import Task, Mission, User, Character, TaskCompletion
from app.schemas import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskCompleteRequest,
    TaskCompleteResponse,
    AttributeUpdatedInfo,
    TaskCompletionResponse,
)

from app.routers.deps import get_current_user
from app.utils import calculate_task_rewards
from app.services import (
    process_xp_and_leveling,
    update_character_attribute,
    calculate_and_update_streak,
)

router = APIRouter()


def _get_user_mission(mission_id: int, user_id: int, db: Session) -> Mission:
    """Helper to retrieve a mission owned by user or raise HTTP 404."""
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == user_id
    ).first()
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    return mission


@router.post("/missions/{mission_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    mission_id: int,
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Creates a new task for a mission owned by the authenticated user."""
    _get_user_mission(mission_id, current_user.id, db)

    xp_reward, gold_reward, normalized_difficulty = calculate_task_rewards(task_in.difficulty)

    task = Task(
        mission_id=mission_id,
        user_id=current_user.id,
        title=task_in.title,
        description=task_in.description,
        category=task_in.category,
        difficulty=normalized_difficulty,
        xp_reward=xp_reward,
        gold_reward=gold_reward,
        repeat_type=task_in.repeat_type or "daily"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/missions/{mission_id}/tasks", response_model=List[TaskResponse])
def get_tasks_for_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves all tasks for a mission owned by the authenticated user."""
    _get_user_mission(mission_id, current_user.id, db)

    tasks = db.query(Task).filter(
        Task.mission_id == mission_id,
        Task.user_id == current_user.id
    ).all()
    return tasks


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Updates a task owned by the authenticated user."""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    if task_in.title is not None:
        task.title = task_in.title
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.category is not None:
        task.category = task_in.category
    if task_in.repeat_type is not None:
        task.repeat_type = task_in.repeat_type

    if task_in.difficulty is not None:
        xp_reward, gold_reward, normalized_difficulty = calculate_task_rewards(task_in.difficulty)
        task.difficulty = normalized_difficulty
        task.xp_reward = xp_reward
        task.gold_reward = gold_reward

    db.commit()
    db.refresh(task)
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deletes a task owned by the authenticated user."""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()
    return None


@router.post("/missions/{mission_id}/tasks/import", response_model=List[TaskResponse], status_code=status.HTTP_201_CREATED)
def import_tasks(
    mission_id: int,
    tasks_in: List[TaskCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Batch imports a JSON array of tasks into a mission owned by the authenticated user."""
    _get_user_mission(mission_id, current_user.id, db)

    created_tasks = []
    for item in tasks_in:
        xp_reward, gold_reward, normalized_difficulty = calculate_task_rewards(item.difficulty)
        task = Task(
            mission_id=mission_id,
            user_id=current_user.id,
            title=item.title,
            description=item.description,
            category=item.category,
            difficulty=normalized_difficulty,
            xp_reward=xp_reward,
            gold_reward=gold_reward,
            repeat_type=item.repeat_type or "daily"
        )
        db.add(task)
        created_tasks.append(task)

    db.commit()
    for task in created_tasks:
        db.refresh(task)

    return created_tasks


@router.post("/tasks/{task_id}/complete", response_model=TaskCompleteResponse)
def complete_task(
    task_id: int,
    payload: Optional[TaskCompleteRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Completes a task, awards XP/Gold, updates character attributes/streak/level in a single transaction."""
    # 1. Verify task ownership
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    today = date.today()

    # 2. Check if task was already completed today
    existing_completion = db.query(TaskCompletion).filter(
        TaskCompletion.task_id == task.id,
        TaskCompletion.completed_date == today
    ).first()

    if existing_completion:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task already completed today"
        )

    # Fetch character
    character = current_user.character
    if not character:
        character = db.query(Character).filter(Character.user_id == current_user.id).first()
        if not character:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Character not found"
            )

    what_you_did = payload.what_you_did if payload else None
    evidence_image_url = payload.evidence_image_url if payload else None

    # Perform gameplay state mutations in a transaction
    try:
        # Create completion record
        completion = TaskCompletion(
            task_id=task.id,
            mission_id=task.mission_id,
            user_id=current_user.id,
            completed_date=today,
            what_you_did=what_you_did,
            evidence_image_url=evidence_image_url,
            xp_earned=task.xp_reward,
            gold_earned=task.gold_reward
        )
        db.add(completion)

        # 1. Update streak
        current_streak = calculate_and_update_streak(character, current_user.id, today, db)

        # 2. Award Gold
        character.gold += task.gold_reward

        # 3. Process XP and Leveling (supports single or multiple level-ups)
        old_level, new_level, level_up, current_xp, xp_required = process_xp_and_leveling(
            character, task.xp_reward
        )

        # 4. Update attribute based on task category
        attr_info = update_character_attribute(character, task.category)

        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task already completed today"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error completing task: {str(e)}"
        )

    return TaskCompleteResponse(
        success=True,
        task_id=task.id,
        xp_earned=task.xp_reward,
        gold_earned=task.gold_reward,
        current_xp=current_xp,
        xp_required=xp_required,
        old_level=old_level,
        new_level=new_level,
        level_up=level_up,
        current_streak=current_streak,
        updated_attribute=AttributeUpdatedInfo(**attr_info)
    )


@router.get("/tasks/{task_id}/history", response_model=List[TaskCompletionResponse])
def get_task_history(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieves completion history for a specific task owned by the authenticated user."""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    history = db.query(TaskCompletion).filter(
        TaskCompletion.task_id == task_id,
        TaskCompletion.user_id == current_user.id
    ).order_by(TaskCompletion.completed_date.desc(), TaskCompletion.created_at.desc()).all()

    return history

