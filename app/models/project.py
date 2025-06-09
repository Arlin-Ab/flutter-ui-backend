import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

 
    screen_size_width = Column(Integer, default=1080, nullable=False)  
    screen_size_height = Column(Integer, default=2340, nullable=False)
    
    collaborators = relationship("Collaborator", back_populates="project", cascade="all, delete")
    designs = relationship("Design", back_populates="project", cascade="all, delete")
    requests = relationship("CollaborationRequest", back_populates="project")

