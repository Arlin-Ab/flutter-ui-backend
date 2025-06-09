from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class DesignCreate(BaseModel):
    project_id: UUID
    name: str
    data: Optional[dict] = None  # JSON

class DesignUpdate(BaseModel):
    name: Optional[str] = None
    data: Optional[dict] = None

class DesignOut(BaseModel):
    id: UUID
    name: str
    project_id: UUID
    data: Optional[dict]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
