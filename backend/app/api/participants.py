from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.participant import Participant
from app.models.meeting import Meeting
from app.schemas.participant import ParticipantResponse, ParticipantUpdate

router = APIRouter()

@router.get("/{meeting_id}", response_model=List[ParticipantResponse])
def get_participants(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    participants = db.query(Participant).filter(Participant.meeting_id == meeting.id).all()
    return participants

@router.patch("/{participant_id}/toggle-mute", response_model=ParticipantResponse)
def toggle_mute(participant_id: int, req: ParticipantUpdate, db: Session = Depends(get_db)):
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
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
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    db.delete(participant)
    db.commit()
    return None
