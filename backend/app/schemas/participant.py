from datetime import datetime

from pydantic import BaseModel


class ParticipantBase(BaseModel):
    display_name: str
    is_muted: bool = False
    is_video_on: bool = True


class ParticipantResponse(ParticipantBase):
    id: int
    meeting_id: int
    joined_at: datetime

    class Config:
        from_attributes = True


class ParticipantUpdate(BaseModel):
    is_muted: bool | None = None
    is_video_on: bool | None = None
