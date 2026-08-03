from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import (
    UserCreate,
    UserResponse,
    ProfileUpdate,
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(tags=["Authentication"])


# -----------------------------
# Register
# -----------------------------
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_email = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "message": "Email already registered"
            }
        )

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User registered successfully",
        "data": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }

# -----------------------------
# Login
# -----------------------------
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Find user by email
    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    # Check if user exists
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        form_data.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT token
    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    # Return token in OAuth2 format
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# -----------------------------
# Get Profile
# -----------------------------
@router.get("/profile")
def profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "message": "Profile fetched successfully",
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }


# -----------------------------
# Update Profile
# -----------------------------
@router.put("/profile")
def update_profile(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.name = profile.name
    current_user.email = profile.email

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        }
    }