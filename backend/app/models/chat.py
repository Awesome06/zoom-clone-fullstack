"""SQLAlchemy Chat model.

Defines the database schema for a chat message within a meeting.
"""

from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.core.database import Base


class ChatMessage(Base):
    """Database model representing a single chat message sent in a meeting room.

    Attributes:
        id: Internal database primary key.
        meeting_id: Foreign key linking to the Meeting.
        sender_name: Display name of the user who sent it.
        text: Content of the message.
        timestamp: Time the message was sent.
    """

    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False)
    sender_name = Column(String, nullable=False)
    text = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(UTC))
