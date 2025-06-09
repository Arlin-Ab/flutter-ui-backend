from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.schemas.project import ProjectOut
from app.schemas.user import UserOut

class CollaborationRequestCreate(BaseModel):
    project_code: str  # código amigable del proyecto
    message: str | None = None

class CollaborationRequestOut(BaseModel):
    id: UUID
    user_id: UUID
    project_id: UUID
    user: UserOut
    project: ProjectOut 
    message: str | None
    accepted: bool
    created_at: datetime

    class Config:
        from_attributes = True