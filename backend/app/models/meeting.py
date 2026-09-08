"""SQLAlchemy Meeting model.

Defines the database schema for a Zoom clone meeting room.
"""

from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from app.core.database import Base


class Meeting(Base):
    """Database model representing a single meeting instance.

    Attributes:
        id: Internal database primary key.
        meeting_id: External public-facing string ID.
        title: Display name of the meeting.
        description: Optional details or agenda.
        host_id: Foreign key to the User who created it.
        is_instant: Whether it was created on the spot or scheduled.
        status: Current state ('scheduled', 'active', 'ended').
        scheduled_start: Future start time, if applicable.
        duration_minutes: Expected length in minutes.
        invite_link: Full URL to join.
        created_at: Timestamp of creation.
    """

    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    is_instant = Column(Boolean, default=False)
    status = Column(String, default="scheduled")
    scheduled_start = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=60)
    invite_link = Column(String, unique=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
