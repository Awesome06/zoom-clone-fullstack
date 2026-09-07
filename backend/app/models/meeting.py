from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    is_instant = Column(Boolean, default=False)
    status = Column(String, default="scheduled") # scheduled, active, ended
    scheduled_start = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=60)
    invite_link = Column(String, unique=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
