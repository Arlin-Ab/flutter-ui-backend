from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.auth.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.collaboration_request import CollaborationRequestCreate, CollaborationRequestOut
from app.crud import collaboration_request as request_crud
from app.crud import collaborator as collaborator_crud

router = APIRouter()

@router.post("/", response_model=CollaborationRequestOut)
def send_collaboration_request(
    request_data: CollaborationRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = request_crud.create_request(db, str(current_user.id), request_data)
    if not req:
        raise HTTPException(status_code=400, detail="No se pudo crear la solicitud (ya existe o proyecto no encontrado)")
    return req

@router.get("/project/{project_id}", response_model=list[CollaborationRequestOut])
def get_pending_requests_by_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return request_crud.list_requests_by_project(db, str(project_id))

@router.post("/accept/{request_id}", response_model=CollaborationRequestOut)
def accept_collaboration_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = request_crud.accept_request(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada o ya aceptada")

    # Agregar automáticamente al colaborador
    from app.schemas.collaborator import CollaboratorCreate
    new_collab = CollaboratorCreate(
        user_id=req.user_id,
        project_id=req.project_id,
        can_export=False  # Por defecto, no puede exportar
    )
    collaborator_crud.create_collaborator(db, new_collab)
    return req
#para ver mis solicitudes a proyectos
@router.get("/mine", response_model=list[CollaborationRequestOut])
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = request_crud.get_requests_by_user(db, str(current_user.id))
    # Filtrar los que todavía tengan proyecto
    filtered = [r for r in requests if r.project is not None]
    return filtered

@router.delete("/reject/{request_id}", response_model=CollaborationRequestOut)
def reject_collaboration_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verifica si es dueño del proyecto
    req = request_crud.get_by_id(db, request_id)
    if not req or req.accepted:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada o ya aceptada")

    if req.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Solo el dueño del proyecto puede rechazar solicitudes")

    return request_crud.reject_request(db, request_id)

@router.delete("/cancel/{request_id}", response_model=CollaborationRequestOut)
def cancel_my_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = request_crud.cancel_request(db, request_id, str(current_user.id))
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada o ya aceptada")
    return req


