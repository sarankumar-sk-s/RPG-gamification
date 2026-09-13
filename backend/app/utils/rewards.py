from typing import Union, Tuple


DIFFICULTY_MAP = {
    1: (10, 5, "easy"),
    2: (25, 15, "medium"),
    3: (50, 30, "hard"),
    4: (100, 60, "epic"),
    5: (250, 150, "legendary"),
    "1": (10, 5, "easy"),
    "2": (25, 15, "medium"),
    "3": (50, 30, "hard"),
    "4": (100, 60, "epic"),
    "5": (250, 150, "legendary"),
    "easy": (10, 5, "easy"),
    "medium": (25, 15, "medium"),
    "hard": (50, 30, "hard"),
    "epic": (100, 60, "epic"),
    "legendary": (250, 150, "legendary"),
}


def calculate_task_rewards(difficulty: Union[int, str]) -> Tuple[int, int, str]:
    """Calculates (xp_reward, gold_reward, normalized_difficulty_str) based on task difficulty."""
    if isinstance(difficulty, str):
        key = difficulty.lower().strip()
    else:
        key = difficulty

    if key in DIFFICULTY_MAP:
        return DIFFICULTY_MAP[key]
    
    # Default fallback for unknown difficulty
    return (25, 15, "medium")
