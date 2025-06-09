from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID


from app.auth.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.collaborator import CollaboratorCreate, CollaboratorOut
from app.crud import collaborator as collaborator_crud
from app.schemas.collaborator import CollaboratorUpdate

router = APIRouter()

@router.post("/", response_model=CollaboratorOut)
def create_collaborator(
    collab: CollaboratorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return collaborator_crud.create_collaborator(db, collab)

@router.get("/by-project/{project_id}", response_model=list[CollaboratorOut])
def list_collaborators(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return collaborator_crud.get_collaborators_by_project(db, project_id)

@router.get("/by-user-project/{user_id}/{project_id}", response_model=CollaboratorOut)
def get_by_user_and_project(
    user_id: UUID,
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    collab = collaborator_crud.get_collaborator_by_user_and_project(db, user_id, project_id)
    if not collab:
        raise HTTPException(status_code=404, detail="Collaborator not found")
    return collab

@router.delete("/{collab_id}", response_model=CollaboratorOut)
def delete_collaborator(
    collab_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    collab = collaborator_crud.delete_collaborator(db, collab_id)
    if not collab:
        raise HTTPException(status_code=404, detail="Collaborator not found")
    return collab


@router.patch("/{collab_id}", response_model=CollaboratorOut)
def update_collaborator_permissions(
    collab_id: UUID,
    update: CollaboratorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    collab = collaborator_crud.get_by_id(db, collab_id)
    if not collab:
        raise HTTPException(status_code=404, detail="Colaborador no encontrado")

    if collab.project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Solo el dueño del proyecto puede cambiar permisos")

    return collaborator_crud.update_permissions(db, collab_id, update.can_export)
