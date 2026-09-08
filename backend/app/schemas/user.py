"""Pydantic schemas for User data validation and serialization."""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base fields shared across user requests and responses."""
    name: str
    email: EmailStr
    avatar_url: str | None = None


class UserResponse(UserBase):
    """Complete user profile payload returned to clients."""
    id: int
    created_at: datetime

    class Config:
        """Pydantic config to allow reading from SQLAlchemy ORM models."""
        from_attributes = True
