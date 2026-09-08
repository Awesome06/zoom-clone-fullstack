"""Pydantic schemas for Chat validation and serialization."""

from datetime import datetime

from pydantic import BaseModel


class ChatMessageCreate(BaseModel):
    """Payload to submit a new chat message."""

    sender_name: str
    text: str


class ChatMessageResponse(BaseModel):
    """Payload returned for a fetched chat message."""

    id: int
    meeting_id: int
    sender_name: str
    text: str
    timestamp: datetime

    class Config:
        """Pydantic config to allow reading from SQLAlchemy ORM models."""

        from_attributes = True
