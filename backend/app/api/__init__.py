from fastapi import APIRouter

from .meetings import router as meetings_router
from .participants import router as participants_router
from .users import router as users_router

api_router = APIRouter()
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(meetings_router, prefix="/meetings", tags=["Meetings"])
api_router.include_router(participants_router, prefix="/participants", tags=["Participants"])
