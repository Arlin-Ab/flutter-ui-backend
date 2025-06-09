import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    collaborations = relationship("Collaborator", back_populates="user", cascade="all, delete")

