import uuid
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models.meeting import Meeting
from app.models.user import User


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        host = db.query(User).filter(User.email == settings.DEFAULT_HOST_EMAIL).first()
        if not host:
            host = User(name=settings.DEFAULT_HOST_NAME, email=settings.DEFAULT_HOST_EMAIL)
            db.add(host)
            db.commit()
            db.refresh(host)

        meetings_count = db.query(Meeting).count()
        if meetings_count == 0:
            now = datetime.now(UTC)

            for i in range(1, 4):
                uid = uuid.uuid4().hex[:10]
                mid = f"{uid[:3]}-{uid[3:7]}-{uid[7:]}"
                m = Meeting(
                    meeting_id=mid,
                    title=f"Past Meeting {i}",
                    host_id=host.id,
                    is_instant=False,
                    status="ended",
                    scheduled_start=now - timedelta(days=i),
                    duration_minutes=30,
                    invite_link=f"http://localhost:3000/meeting/{mid}",
                )
                db.add(m)

            for i in range(1, 4):
                uid = uuid.uuid4().hex[:10]
                mid = f"{uid[:3]}-{uid[3:7]}-{uid[7:]}"
                m = Meeting(
                    meeting_id=mid,
                    title=f"Upcoming Sync {i}",
                    host_id=host.id,
                    is_instant=False,
                    status="scheduled",
                    scheduled_start=now + timedelta(days=i),
                    duration_minutes=60,
                    invite_link=f"http://localhost:3000/meeting/{mid}",
                )
                db.add(m)

            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
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
