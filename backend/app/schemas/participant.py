"""Pydantic schemas for Participant data validation and serialization."""

from datetime import datetime

from pydantic import BaseModel


class ParticipantBase(BaseModel):
    """Base fields shared across participant requests and responses."""
    display_name: str
    is_muted: bool = False
    is_video_on: bool = True


class ParticipantResponse(ParticipantBase):
    """Complete participant data payload returned to clients."""
    id: int
    meeting_id: int
    joined_at: datetime

    class Config:
        """Pydantic config to allow reading from SQLAlchemy ORM models."""
        from_attributes = True


class ParticipantUpdate(BaseModel):
    """Payload for updating a participant's audio/video state. Fields are optional."""
    is_muted: bool | None = None
    is_video_on: bool | None = None
