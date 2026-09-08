"""Pydantic schemas for Meeting data validation and serialization."""

from datetime import datetime
from pydantic import BaseModel


class MeetingBase(BaseModel):
    """Base fields shared across meeting requests and responses."""
    title: str
    description: str | None = None
    scheduled_start: datetime | None = None
    duration_minutes: int = 60


class ScheduleMeetingRequest(MeetingBase):
    """Payload required to schedule a future meeting."""
    scheduled_start: datetime


class InstantMeetingResponse(BaseModel):
    """Optimized payload returned when instantly creating a meeting."""
    meeting_id: str
    invite_link: str
    status: str


class MeetingResponse(MeetingBase):
    """Complete meeting data payload returned to clients."""
    id: int
    meeting_id: str
    host_id: int
    is_instant: bool
    status: str
    invite_link: str
    created_at: datetime

    class Config:
        """Pydantic config to allow reading from SQLAlchemy ORM models."""
        from_attributes = True


class JoinMeetingRequest(BaseModel):
    """Payload required when a participant attempts to join a room."""
    meeting_id: str
    display_name: str
    is_muted: bool = False
    is_video_on: bool = True


class JoinMeetingResponse(BaseModel):
    """Response containing the meeting details and the new participant's ID."""
    meeting: MeetingResponse
    participant_id: int
