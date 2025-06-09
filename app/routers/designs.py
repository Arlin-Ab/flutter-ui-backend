from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.crud import design as design_crud
from app.schemas.design import DesignCreate, DesignOut, DesignUpdate
from app.crud.design import user_can_access_design
from app.crud.project import user_can_access_project

router = APIRouter()

@router.post("/", response_model=DesignOut)
def create_design(
    design: DesignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return design_crud.create_design(db, design)

@router.get("/project/{project_id}", response_model=list[DesignOut])
def list_designs(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not user_can_access_project(db, current_user.id, project_id):
        raise HTTPException(status_code=403, detail="No tienes acceso a este proyecto")

    return design_crud.get_designs_by_project(db, project_id)

@router.get("/{design_id}", response_model=DesignOut)
def get_design(
    design_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not user_can_access_design(db, current_user.id, design_id):
        raise HTTPException(status_code=403, detail="No tienes acceso a este diseño")

    design = design_crud.get_design_by_id(db, design_id)
    if not design:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    return design

@router.put("/{design_id}", response_model=DesignOut)
def update_design(
    design_id: UUID,
    update: DesignUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = design_crud.update_design(db, design_id, update)
    if not updated:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
    return updated

@router.delete("/{design_id}", status_code=204)
def delete_design_endpoint(
    design_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not user_can_access_design(db, current_user.id, design_id):
        raise HTTPException(status_code=403, detail="No tienes acceso a este diseño")

    success = design_crud.delete_design(db, design_id)
    if not success:
        raise HTTPException(status_code=404, detail="Diseño no encontrado")
