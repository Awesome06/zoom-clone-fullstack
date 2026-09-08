"""Meeting API endpoints for the Zoom Clone backend.

Handles creation, retrieval, joining, and management of meetings.
"""

import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.chat import ChatMessage
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.models.user import User
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from app.schemas.meeting import (
    EditMeetingRequest,
    InstantMeetingResponse,
    JoinMeetingRequest,
    JoinMeetingResponse,
    MeetingResponse,
    ScheduleMeetingRequest,
)

router = APIRouter()


def generate_meeting_id() -> str:
    """Generate a unique 10-character formatted meeting ID (e.g., abc-defg-hij)."""
    uid = uuid.uuid4().hex[:10]
    return f"{uid[:3]}-{uid[3:7]}-{uid[7:]}"


def get_host_user(db: Session) -> User | None:
    """Retrieve the default host user based on configured settings."""
    return db.query(User).filter(User.email == settings.DEFAULT_HOST_EMAIL).first()


@router.get("/upcoming", response_model=list[MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    """Retrieve a chronologically ordered list of upcoming scheduled meetings
    for the default host.
    """
    if not (host := get_host_user(db)):
        return []

    return (
        db.query(Meeting)
        .filter(
            Meeting.host_id == host.id,
            Meeting.status == "scheduled",
            Meeting.scheduled_start >= datetime.now(UTC),
        )
        .order_by(Meeting.scheduled_start)
        .all()
    )


@router.get("/recent", response_model=list[MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db)):
    """Retrieve a reverse-chronologically ordered list of ended or past meetings
    for the default host.
    """
    if not (host := get_host_user(db)):
        return []

    now = datetime.now(UTC)
    return (
        db.query(Meeting)
        .filter(
            Meeting.host_id == host.id,
            (Meeting.status == "ended") | (Meeting.scheduled_start < now),
        )
        .order_by(desc(Meeting.scheduled_start))
        .all()
    )


@router.post("/instant", response_model=InstantMeetingResponse, status_code=201)
def create_instant_meeting(db: Session = Depends(get_db)):
    """Instantly create and activate a new meeting for the default host."""
    if not (host := get_host_user(db)):
        raise HTTPException(status_code=403, detail="Host user not found")

    meeting_id = generate_meeting_id()
    new_meeting = Meeting(
        meeting_id=meeting_id,
        title=f"{host.name}'s Instant Meeting",
        host_id=host.id,
        is_instant=True,
        status="active",
        invite_link=f"http://localhost:3000/meeting/{meeting_id}",
    )

    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

    return InstantMeetingResponse(
        meeting_id=new_meeting.meeting_id,
        invite_link=new_meeting.invite_link,
        status=new_meeting.status,
    )


@router.post("/schedule", response_model=MeetingResponse, status_code=201)
def schedule_meeting(req: ScheduleMeetingRequest, db: Session = Depends(get_db)):
    """Schedule a future meeting with a title, description, and duration."""
    if not (host := get_host_user(db)):
        raise HTTPException(status_code=403, detail="Host user not found")

    meeting_id = generate_meeting_id()
    new_meeting = Meeting(
        meeting_id=meeting_id,
        title=req.title,
        description=req.description,
        host_id=host.id,
        is_instant=False,
        status="scheduled",
        scheduled_start=req.scheduled_start,
        duration_minutes=req.duration_minutes,
        invite_link=f"http://localhost:3000/meeting/{meeting_id}",
    )

    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed information about a specific meeting by its ID."""
    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.patch("/{meeting_id}", response_model=MeetingResponse)
def edit_meeting(meeting_id: str, req: EditMeetingRequest, db: Session = Depends(get_db)):
    """Edit details of an existing scheduled meeting."""
    if not (host := get_host_user(db)):
        raise HTTPException(status_code=403, detail="Host user not found")

    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")

    if meeting.host_id != host.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this meeting")

    if meeting.status == "ended":
        raise HTTPException(status_code=400, detail="Cannot edit an ended meeting")

    if meeting.is_instant:
        raise HTTPException(status_code=400, detail="Cannot edit an instant meeting")

    if req.title is not None:
        meeting.title = req.title
    if req.description is not None:
        meeting.description = req.description
    if req.scheduled_start is not None:
        meeting.scheduled_start = req.scheduled_start
    if req.duration_minutes is not None:
        meeting.duration_minutes = req.duration_minutes

    db.commit()
    db.refresh(meeting)
    return meeting


@router.delete("/{meeting_id}", status_code=204)
def delete_meeting(meeting_id: str, db: Session = Depends(get_db)):
    """Delete a scheduled meeting and all its associated data."""
    if not (host := get_host_user(db)):
        raise HTTPException(status_code=403, detail="Host user not found")

    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")

    if meeting.host_id != host.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this meeting")

    db.query(Participant).filter(Participant.meeting_id == meeting.id).delete()
    db.query(ChatMessage).filter(ChatMessage.meeting_id == meeting.id).delete()
    db.delete(meeting)
    db.commit()
    return


@router.post("/{meeting_id}/join", response_model=JoinMeetingResponse)
def join_meeting(meeting_id: str, req: JoinMeetingRequest, db: Session = Depends(get_db)):
    """Add a participant to an existing meeting and activate it if it was scheduled."""
    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")

    if meeting.status == "ended":
        raise HTTPException(
            status_code=400, detail="This meeting has been ended and is no longer joinable"
        )

    participant = Participant(
        meeting_id=meeting.id,
        display_name=req.display_name,
        is_muted=req.is_muted,
        is_video_on=req.is_video_on,
    )
    db.add(participant)

    # Automatically activate scheduled meetings upon first join
    if meeting.status == "scheduled":
        meeting.status = "active"

    db.commit()
    db.refresh(participant)

    return JoinMeetingResponse(meeting=meeting, participant_id=participant.id)


@router.patch("/{meeting_id}/end", response_model=MeetingResponse)
def end_meeting(meeting_id: str, db: Session = Depends(get_db)):
    """Terminate an active meeting by updating its status to 'ended' and
    clearing its chat history.
    """
    from datetime import UTC, datetime, timedelta

    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")

    is_scheduled_and_passed = False
    if not meeting.is_instant and meeting.scheduled_start:
        end_time = meeting.scheduled_start.replace(tzinfo=UTC) + timedelta(
            minutes=meeting.duration_minutes
        )
        if datetime.now(UTC) >= end_time:
            is_scheduled_and_passed = True

    if meeting.is_instant or is_scheduled_and_passed:
        meeting.status = "ended"
        # Delete chat history explicitly when host ends for all and meeting officially ends
        db.query(ChatMessage).filter(ChatMessage.meeting_id == meeting.id).delete()

    db.commit()
    db.refresh(meeting)
    return meeting


@router.get("/{meeting_id}/chat", response_model=list[ChatMessageResponse])
def get_chat_messages(meeting_id: str, db: Session = Depends(get_db)):
    """Fetch all persisted chat messages for a given meeting."""
    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")

    return (
        db.query(ChatMessage)
        .filter(ChatMessage.meeting_id == meeting.id)
        .order_by(ChatMessage.timestamp.asc())
        .all()
    )


@router.post("/{meeting_id}/chat", response_model=ChatMessageResponse)
def send_chat_message(meeting_id: str, req: ChatMessageCreate, db: Session = Depends(get_db)):
    """Send a new chat message to a specific meeting."""
    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")

    msg = ChatMessage(meeting_id=meeting.id, sender_name=req.sender_name, text=req.text)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
