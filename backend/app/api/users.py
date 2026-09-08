"""User API endpoints for the Zoom Clone backend.

Handles user profile and authentication context data retrieval.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    """Retrieve the profile data of the currently authenticated user (default host)."""
    if not (user := db.query(User).filter(User.email == settings.DEFAULT_HOST_EMAIL).first()):
        raise HTTPException(status_code=404, detail="Default host user not found")
    return user
