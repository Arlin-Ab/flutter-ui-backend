from sqlalchemy.orm import Session
from app.models.collaborator import Collaborator
from app.schemas.collaborator import CollaboratorCreate
from sqlalchemy.orm import joinedload
from uuid import UUID

def create_collaborator(db: Session, data: CollaboratorCreate) -> Collaborator:
    new_collab = Collaborator(**data.dict())
    db.add(new_collab)
    db.commit()
    db.refresh(new_collab)
    return new_collab

def get_collaborators_by_project(db: Session, project_id: UUID):
    return (
        db.query(Collaborator)
        .filter(Collaborator.project_id == project_id)
        .options(joinedload(Collaborator.user))  # ← Aquí se carga la relación
        .all()
    )

def get_collaborator_by_user_and_project(db: Session, user_id: UUID, project_id: UUID):
    return db.query(Collaborator).filter_by(user_id=user_id, project_id=project_id).first()

def get_by_id(db: Session, collab_id: UUID):
    return db.query(Collaborator).filter_by(id=collab_id).first()

def delete_collaborator(db: Session, collab_id: UUID):
    collab = db.query(Collaborator).filter_by(id=collab_id).first()
    if collab:
        db.delete(collab)
        db.commit()
    return collab
def update_permissions(db: Session, collab_id: UUID, can_export: bool):
    collab = db.query(Collaborator).filter_by(id=collab_id).first()
    if not collab:
        return None
    collab.can_export = can_export
    db.commit()
    db.refresh(collab)
    return collab


