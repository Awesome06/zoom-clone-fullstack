"""Main FastAPI application entry point.

Handles app initialization, CORS middleware, routing, and database seeding.
"""

import uuid
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models.chat import ChatMessage
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.models.user import User


def seed_database():
    """Initialize the database schema and seed it with default mock data if empty.

    Creates a default host user and generates 3 past and 3 upcoming mock meetings
    to populate the frontend dashboard for demonstration purposes.
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Seed default host user
        if not (host := db.query(User).filter(User.email == settings.DEFAULT_HOST_EMAIL).first()):
            host = User(name=settings.DEFAULT_HOST_NAME, email=settings.DEFAULT_HOST_EMAIL)
            db.add(host)
            db.commit()
            db.refresh(host)

        # Seed mock meetings if the table is empty
        if db.query(Meeting).count() == 0:
            now = datetime.now(UTC)

            # Generate 3 past meetings
            for i in range(1, 4):
                uid = uuid.uuid4().hex[:10]
                mid = f"{uid[:3]}-{uid[3:7]}-{uid[7:]}"
                db.add(Meeting(
                    meeting_id=mid,
                    title=f"Past Meeting {i}",
                    host_id=host.id,
                    is_instant=False,
                    status="ended",
                    scheduled_start=now - timedelta(days=i),
                    duration_minutes=30,
                    invite_link=f"http://localhost:3000/meeting/{mid}",
                ))

            # Generate 3 upcoming meetings
            for i in range(1, 4):
                uid = uuid.uuid4().hex[:10]
                mid = f"{uid[:3]}-{uid[3:7]}-{uid[7:]}"
                db.add(Meeting(
                    meeting_id=mid,
                    title=f"Upcoming Sync {i}",
                    host_id=host.id,
                    is_instant=False,
                    status="scheduled",
                    scheduled_start=now + timedelta(days=i),
                    duration_minutes=60,
                    invite_link=f"http://localhost:3000/meeting/{mid}",
                ))

            db.commit()
    finally:
        db.close()

def cleanup_meetings():
    """Delete meetings older than 1 day, or ended meetings whose scheduled end time has passed."""
    db = SessionLocal()
    now = datetime.now(UTC)
    try:
        meetings = db.query(Meeting).all()
        for m in meetings:
            should_delete = False

            # Rule 1: Older than 1 day
            ref_time = m.scheduled_start or m.created_at
            if ref_time and ref_time.replace(tzinfo=UTC) < now - timedelta(days=1):
                should_delete = True

            # Rule 2: Ended and end time has passed
            if m.status == "ended":
                if m.scheduled_start:
                    end_time = m.scheduled_start.replace(tzinfo=UTC) + timedelta(
                        minutes=m.duration_minutes
                    )
                    if now >= end_time:
                        should_delete = True
                else:
                    should_delete = True # Instant meeting ended
            elif not m.is_instant and m.scheduled_start:
                # Rule 3: Scheduled meeting not explicitly ended, but time passed and empty
                end_time = m.scheduled_start.replace(tzinfo=UTC) + timedelta(
                    minutes=m.duration_minutes
                )
                if now >= end_time:
                    p_count = db.query(Participant).filter(Participant.meeting_id == m.id).count()
                    if p_count == 0:
                        should_delete = True

            if should_delete:
                db.query(Participant).filter(Participant.meeting_id == m.id).delete()
                db.query(ChatMessage).filter(ChatMessage.meeting_id == m.id).delete()
                db.delete(m)
        db.commit()
    except Exception as e:
        print(f"Cleanup error: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan context manager for startup and shutdown events."""
    seed_database()
    cleanup_meetings()  # Run cleanup on startup

    # Initialize Nightly Cron Job
    scheduler = BackgroundScheduler()
    scheduler.add_job(cleanup_meetings, "cron", hour=23, minute=59)
    scheduler.start()

    yield

    scheduler.shutdown()


app = FastAPI(title="Zoom Clone API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
