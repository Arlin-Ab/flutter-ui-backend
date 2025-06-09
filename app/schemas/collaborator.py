from pydantic import BaseModel
from uuid import UUID
from app.schemas.user import UserOut
#aqui es todo lo que se permite
class CollaboratorBase(BaseModel):
    user_id: UUID
    project_id: UUID
    can_export: bool = False
    

class CollaboratorCreate(CollaboratorBase):
    pass

class CollaboratorOut(CollaboratorBase):
    id: UUID
    user: UserOut  # ← Añadido

    class Config:
        from_attributes = True

class CollaboratorUpdate(BaseModel):
    can_export: bool

