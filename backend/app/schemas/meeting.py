from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserResponse

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_start: Optional[datetime] = None
    duration_minutes: int = 60

class MeetingCreate(MeetingBase):
    pass

class ScheduleMeetingRequest(MeetingBase):
    scheduled_start: datetime

class InstantMeetingResponse(BaseModel):
    meeting_id: str
    invite_link: str
    status: str

class MeetingResponse(MeetingBase):
    id: int
    meeting_id: str
    host_id: int
    is_instant: bool
    status: str
    invite_link: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class JoinMeetingRequest(BaseModel):
    meeting_id: str
    display_name: str

class JoinMeetingResponse(BaseModel):
    meeting: MeetingResponse
    participant_id: int
