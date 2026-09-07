from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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
    is_muted: Optional[bool] = None
    is_video_on: Optional[bool] = None
