import math
from datetime import date
from typing import Tuple, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import Character, TaskCompletion


def calculate_xp_required_for_level(level: int) -> int:
    """
    Calculates XP required for next level using formula:
    XP required for level = 100 * (level ^ 1.5)
    """
    return math.floor(100 * (level ** 1.5))


def process_xp_and_leveling(character: Character, xp_earned: int) -> Tuple[int, int, bool, int, int]:
    """
    Adds XP to character, handles single or multiple level-ups, and calculates level statistics.
    Returns: (old_level, new_level, level_up, current_xp, xp_required_for_next_level)
    """
    old_level = character.level
    character.xp += xp_earned
    current_xp = character.xp

    # Loop to support multiple level-ups if enough XP was earned in one task
    while current_xp >= calculate_xp_required_for_level(character.level):
        character.level += 1

    new_level = character.level
    level_up = new_level > old_level
    xp_required = calculate_xp_required_for_level(new_level)

    return old_level, new_level, level_up, current_xp, xp_required


def update_character_attribute(character: Character, category: Optional[str]) -> Dict[str, Any]:
    """
    Increments the attribute associated with the task category by +1 point.
    Categories: intellect -> Intellect, strength -> Strength, vitality -> Vitality, wisdom -> Wisdom, discipline -> Discipline.
    Returns: dict containing attribute name, old_value, new_value, and stat_gained.
    """
    category_clean = (category or "intellect").lower().strip()
    valid_attributes = {"intellect", "strength", "vitality", "wisdom", "discipline"}
    if category_clean not in valid_attributes:
        category_clean = "intellect"

    old_val = getattr(character, category_clean, 10)
    new_val = old_val + 1
    setattr(character, category_clean, new_val)

    return {
        "attribute": category_clean,
        "old_value": old_val,
        "new_value": new_val,
        "stat_gained": 1
    }


def calculate_and_update_streak(character: Character, user_id: int, today: date, db: Session) -> int:
    """
    Calculates and updates character daily streak:
    - First valid completion = streak 1
    - Consecutive days increase streak
    - Multiple completions on the same day count as one streak day
    - Broken streak (>1 day gap) resets to 1
    """
    # Check if user has already completed any task today before this completion
    today_completions = db.query(TaskCompletion).filter(
        TaskCompletion.user_id == user_id,
        TaskCompletion.completed_date == today
    ).count()

    if today_completions > 0:
        # Same-day completion: streak already updated for today
        return character.streak

    # First completion of today: query last completion prior to today
    last_completion = db.query(TaskCompletion).filter(
        TaskCompletion.user_id == user_id,
        TaskCompletion.completed_date < today
    ).order_by(TaskCompletion.completed_date.desc()).first()

    if not last_completion:
        # First completion ever
        character.streak = 1
    else:
        days_diff = (today - last_completion.completed_date).days
        if days_diff == 1:
            # Consecutive day!
            character.streak += 1
        else:
            # Broken streak (>1 day gap) - reset to 1
            character.streak = 1

    return character.streak
