import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.models.user import User
from app.schemas.meeting import (
    InstantMeetingResponse,
    JoinMeetingRequest,
    JoinMeetingResponse,
    MeetingResponse,
    ScheduleMeetingRequest,
)

router = APIRouter()


def generate_meeting_id():
    uid = uuid.uuid4().hex[:10]
    return f"{uid[:3]}-{uid[3:7]}-{uid[7:]}"


def get_host_user(db: Session):
    return db.query(User).filter(User.email == settings.DEFAULT_HOST_EMAIL).first()


@router.get("/upcoming", response_model=list[MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    host = get_host_user(db)
    if not host:
        return []
    now = datetime.now(UTC)
    return (
        db.query(Meeting)
        .filter(
            Meeting.host_id == host.id,
            Meeting.status == "scheduled",
            Meeting.scheduled_start >= now,
        )
        .order_by(Meeting.scheduled_start)
        .all()
    )


@router.get("/recent", response_model=list[MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db)):
    host = get_host_user(db)
    if not host:
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
    host = get_host_user(db)
    meeting_id = generate_meeting_id()
    invite_link = f"http://localhost:3000/meeting/{meeting_id}"

    new_meeting = Meeting(
        meeting_id=meeting_id,
        title=f"{host.name}'s Instant Meeting",
        host_id=host.id,
        is_instant=True,
        status="active",
        invite_link=invite_link,
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
    host = get_host_user(db)
    meeting_id = generate_meeting_id()
    invite_link = f"http://localhost:3000/meeting/{meeting_id}"

    new_meeting = Meeting(
        meeting_id=meeting_id,
        title=req.title,
        description=req.description,
        host_id=host.id,
        is_instant=False,
        status="scheduled",
        scheduled_start=req.scheduled_start,
        duration_minutes=req.duration_minutes,
        invite_link=invite_link,
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.post("/{meeting_id}/join", response_model=JoinMeetingResponse)
def join_meeting(meeting_id: str, req: JoinMeetingRequest, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    participant = Participant(meeting_id=meeting.id, display_name=req.display_name)
    db.add(participant)

    if meeting.status == "scheduled":
        meeting.status = "active"

    db.commit()
    db.refresh(participant)

    return JoinMeetingResponse(meeting=meeting, participant_id=participant.id)


@router.patch("/{meeting_id}/end", response_model=MeetingResponse)
def end_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    meeting.status = "ended"
    db.commit()
    db.refresh(meeting)
    return meeting
