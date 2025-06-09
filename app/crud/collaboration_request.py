from sqlalchemy.orm import Session
from app.models.collaboration_request import CollaborationRequest
from app.models.project import Project
from app.models.collaborator import Collaborator
from app.schemas.collaboration_request import CollaborationRequestCreate
import uuid
from sqlalchemy.orm import joinedload

def create_request(db: Session, user_id: str, req: CollaborationRequestCreate):
    project = db.query(Project).filter(Project.code == req.project_code).first()
    if not project:
        return None

    # ❌ Si ya es colaborador, no permitir enviar solicitud
    is_collaborator = db.query(Collaborator).filter_by(user_id=user_id, project_id=project.id).first()
    if is_collaborator:
        return None

    # ❌ Si ya existe una solicitud pendiente, no duplicar
    exists = db.query(CollaborationRequest).filter_by(user_id=user_id, project_id=project.id).first()
    if exists:
        return None

    db_req = CollaborationRequest(
        id=str(uuid.uuid4()),
        user_id=user_id,
        project_id=project.id,
        message=req.message
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

def list_requests_by_project(db: Session, project_id: str):
    return db.query(CollaborationRequest)\
        .options(joinedload(CollaborationRequest.user))\
        .filter(CollaborationRequest.project_id == project_id)\
        .filter(CollaborationRequest.accepted == False)\
        .all()

def accept_request(db: Session, request_id: str):
    req = db.query(CollaborationRequest).filter_by(id=request_id).first()
    if not req or req.accepted:
        return None
    req.accepted = True
    db.commit()
    db.refresh(req)
    return req
def get_requests_by_user(db: Session, user_id: str):
    return (
        db.query(CollaborationRequest)
        .filter_by(user_id=user_id)
        .options(joinedload(CollaborationRequest.project))  # Esto carga el proyecto relacionado
        .all()
    )
#rechazado por el admin
def reject_request(db: Session, request_id: str):
    req = db.query(CollaborationRequest).filter_by(id=request_id, accepted=False).first()
    if not req:
        return None
    db.delete(req)
    db.commit()
    return req

def cancel_request(db: Session, request_id: str, user_id: str):
    req = db.query(CollaborationRequest)\
        .options(joinedload(CollaborationRequest.project))\
        .filter(CollaborationRequest.id == request_id, CollaborationRequest.user_id == user_id, CollaborationRequest.accepted == False)\
        .first()
    if not req:
        return None
    db.delete(req)
    db.commit()
    return req

def get_by_id(db: Session, request_id: str) -> CollaborationRequest | None:
    return db.query(CollaborationRequest).filter_by(id=request_id).first()


