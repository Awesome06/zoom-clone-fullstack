"""Participant API endpoints for the Zoom Clone backend.

Handles fetching, muting, and removing meeting participants.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.schemas.participant import ParticipantResponse, ParticipantUpdate

router = APIRouter()


@router.get("/{meeting_id}", response_model=list[ParticipantResponse])
def get_participants(meeting_id: str, db: Session = Depends(get_db)):
    """Fetch all active participants currently in a specific meeting."""
    if not (meeting := db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()):
        raise HTTPException(status_code=404, detail="Meeting not found")

    return db.query(Participant).filter(Participant.meeting_id == meeting.id).all()


@router.patch("/{participant_id}/toggle-mute", response_model=ParticipantResponse)
def toggle_mute(participant_id: int, req: ParticipantUpdate, db: Session = Depends(get_db)):
    """Update a participant's audio or video state (e.g., mute/unmute)."""
    if not (participant := db.query(Participant).filter(Participant.id == participant_id).first()):
        raise HTTPException(status_code=404, detail="Participant not found")

    if req.is_muted is not None:
        participant.is_muted = req.is_muted
    if req.is_video_on is not None:
        participant.is_video_on = req.is_video_on

    db.commit()
    db.refresh(participant)
    return participant


@router.delete("/{participant_id}", status_code=204)
def remove_participant(participant_id: int, db: Session = Depends(get_db)):
    """Remove a participant from a meeting (e.g., when they leave or are kicked)."""
    if not (participant := db.query(Participant).filter(Participant.id == participant_id).first()):
        raise HTTPException(status_code=404, detail="Participant not found")

    meeting_id = participant.meeting_id
    db.delete(participant)
    db.commit()

    # Check if this was the last participant
    remaining = db.query(Participant).filter(Participant.meeting_id == meeting_id).count()
    if remaining == 0:
        from datetime import UTC, datetime, timedelta

        from app.models.chat import ChatMessage

        db.query(ChatMessage).filter(ChatMessage.meeting_id == meeting_id).delete()

        # If it's a scheduled meeting and the end time has passed, set it to ended
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if meeting and not meeting.is_instant and meeting.scheduled_start:
            end_time = meeting.scheduled_start.replace(tzinfo=UTC) + timedelta(
                minutes=meeting.duration_minutes
            )
            if datetime.now(UTC) >= end_time:
                meeting.status = "ended"

        db.commit()

    return
