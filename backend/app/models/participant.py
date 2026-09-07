from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    display_name = Column(String, nullable=False)
    joined_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_muted = Column(Boolean, default=False)
    is_video_on = Column(Boolean, default=True)
