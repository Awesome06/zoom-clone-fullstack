"""Main FastAPI application entry point.

Handles app initialization, CORS middleware, routing, and database seeding.
"""

import uuid
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models.meeting import Meeting
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan context manager for startup and shutdown events."""
    seed_database()
    yield


app = FastAPI(title="Zoom Clone API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
