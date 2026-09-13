from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Character
from app.schemas import UserSignup, UserLogin, UserResponse, Token
from app.utils.security import hash_password, verify_password, create_access_token
from app.routers.deps import get_current_user

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(
    user_in: UserSignup,
    db: Session = Depends(get_db)
):
    """Registers a new user and automatically creates an initial character."""
    normalized_email = user_in.email.lower()

    # Prevent duplicate email registration
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    hashed_pwd = hash_password(user_in.password)

    # Create user
    new_user = User(
        email=normalized_email,
        password_hash=hashed_pwd
    )
    db.add(new_user)
    db.flush()

    # Automatically create a character with defaults
    new_character = Character(
        user_id=new_user.id,
        level=1,
        xp=0,
        gold=100,
        intellect=10,
        strength=10,
        vitality=10,
        wisdom=10,
        discipline=10,
        streak=0
    )
    db.add(new_character)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
def login(
    user_in: UserLogin,
    db: Session = Depends(get_db)
):
    """Authenticates user credentials and returns a JWT access token."""
    normalized_email = user_in.email.lower()

    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    """Returns the authenticated current user profile with character stats."""
    return current_user
