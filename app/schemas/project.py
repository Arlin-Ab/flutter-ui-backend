from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str
    screen_size_width: int = 1080  # Valor por defecto, opcional
    screen_size_height: int = 2340

class ProjectOut(BaseModel):
    id: UUID
    name: str
    code: str 
    owner_id: UUID
    created_at: datetime
    screen_size_width: int
    screen_size_height: int

    class Config:
        from_attributes = True  # Pydantic v2 (antes: orm_mode = True)
