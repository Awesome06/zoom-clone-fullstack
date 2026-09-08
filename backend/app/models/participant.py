"""SQLAlchemy Participant model.

Defines the database schema for a user attending a meeting.
"""

from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from app.core.database import Base


class Participant(Base):
    """Database model representing a meeting attendee's session state.

    Attributes:
        id: Internal database primary key.
        meeting_id: Foreign key linking to the Meeting.
        display_name: The name shown on their video tile.
        joined_at: Timestamp of entry.
        is_muted: Current microphone state.
        is_video_on: Current camera state.
    """

    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    display_name = Column(String, nullable=False)
    joined_at = Column(DateTime, default=lambda: datetime.now(UTC))
    is_muted = Column(Boolean, default=False)
    is_video_on = Column(Boolean, default=True)
