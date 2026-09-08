"""SQLAlchemy User model.

Defines the database schema for registered users.
"""

from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.core.database import Base


class User(Base):
    """Database model representing a registered platform user.

    Attributes:
        id: Internal database primary key.
        name: Full display name.
        email: Unique email address used for login/identification.
        avatar_url: Optional profile picture URL.
        created_at: Timestamp of account creation.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
