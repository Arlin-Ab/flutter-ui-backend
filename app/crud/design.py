from sqlalchemy.orm import Session
from app.models.design import Design
from app.schemas.design import DesignCreate, DesignUpdate
from uuid import UUID
import uuid

def create_design(db: Session, design_data: DesignCreate):
    design = Design(**design_data.dict())
    db.add(design)
    db.commit()
    db.refresh(design)
    return design

def get_designs_by_project(db: Session, project_id: UUID):
    return (
        db.query(Design)
        .filter(Design.project_id == project_id)
        .order_by(Design.created_at.asc()) 
        .all()
    )

def get_design_by_id(db: Session, design_id: UUID):
    return db.query(Design).filter(Design.id == design_id).first()

def update_design(db: Session, design_id: UUID, update_data: DesignUpdate):
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        return None

    update_dict = update_data.dict(exclude_unset=True)

    # 🔒 Si se está actualizando el campo "data", asegurarse de que cada componente tenga ID
    if "data" in update_dict and isinstance(update_dict["data"], dict):
        components = update_dict["data"].get("components", [])
        for comp in components:
            if "id" not in comp:
                comp["id"] = str(uuid.uuid4())  # 🆔 Generar un ID si no existe

        # Asigna la lista modificada de vuelta
        update_dict["data"]["components"] = components

    for key, value in update_dict.items():
        setattr(design, key, value)

    db.commit()
    db.refresh(design)
    return design

def user_can_access_design(db: Session, user_id: UUID, design_id: UUID) -> bool:
    design = get_design_by_id(db, design_id)
    if not design:
        return False

    # Dueño del proyecto
    if design.project.owner_id == user_id:
        return True

    # Colaborador con acceso
    from app.crud.collaborator import get_collaborator_by_user_and_project
    collab = get_collaborator_by_user_and_project(db, user_id, design.project_id)
    return collab is not None

def user_can_export_design(db: Session, user_id: UUID, design_id: UUID) -> bool:
    design = get_design_by_id(db, design_id)
    if not design:
        return False

    if design.project.owner_id == user_id:
        return True

    from app.crud.collaborator import get_collaborator_by_user_and_project
    collab = get_collaborator_by_user_and_project(db, user_id, design.project_id)
    return collab is not None and collab.can_export

def delete_design(db: Session, design_id: UUID) -> bool:
    design = db.query(Design).filter(Design.id == design_id).first()
    if not design:
        return False
    db.delete(design)
    db.commit()
    return True


