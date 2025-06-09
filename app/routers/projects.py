from fastapi import Query, APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.schemas.project import ProjectCreate, ProjectOut
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import  User
from app.models.project import Project
from app.crud.collaborator import get_collaborator_by_user_and_project
from fastapi.responses import FileResponse
from app.crud.design import get_designs_by_project
from app.crud.project import user_can_access_project, user_can_export_project
from app.export.generator import create_flutter_project
from app.crud import project as project_crud

router = APIRouter()

@router.post("/", response_model=ProjectOut)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return project_crud.create_project(db, project, current_user.id)

@router.get("/", response_model=list[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return project_crud.get_all_projects_for_user(db, current_user.id)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project_by_id(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = project_crud.get_project_by_id(db, project_id, current_user.id)
    
    # Si no es el dueño, verificar si es colaborador
    if not project:
        collab = get_collaborator_by_user_and_project(db, current_user.id, project_id)
        if not collab:
            raise HTTPException(status_code=403, detail="No tienes acceso a este proyecto")
        project = project_crud.get_project_by_id_raw(db, project_id)

    return project

@router.put("/{project_id}/update-screen", response_model=ProjectOut)
def update_project_screen_size_endpoint(
    project_id: UUID,
    device_name: str = Query(..., description="Dispositivo (realme_6, ipad_air, pixel_5)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = project_crud.get_project_by_id(db, project_id, current_user.id)
    if not project:
        collab = get_collaborator_by_user_and_project(db, current_user.id, project_id)
        if not collab:
            raise HTTPException(status_code=403, detail="No tienes acceso a este proyecto")
        project = project_crud.get_project_by_id_raw(db, project_id)

    updated_project = project_crud.update_project_screen_size(db, project.id, device_name)
    if not updated_project:
        raise HTTPException(status_code=400, detail="Dispositivo no válido o proyecto no encontrado")

    return updated_project

@router.get("/{project_id}/export-flutter", response_class=FileResponse)
def export_flutter_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar permisos
    if not user_can_export_project(db, current_user.id, project_id):
        raise HTTPException(status_code=403, detail="No tienes permisos de exportación")

    # Obtener proyecto y verificar existencia
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Obtener diseños
    designs = get_designs_by_project(db, project_id)
    if not designs:
        raise HTTPException(status_code=404, detail="Este proyecto no tiene diseños para exportar")

    # Convertir a dicts
    designs_data = [d.to_dict() if hasattr(d, "to_dict") else d.__dict__ for d in designs]

    # Tomar screen_size_width y height desde el proyecto (con fallback)
    screen_width = project.screen_size_width or 1080
    screen_height = project.screen_size_height or 2400

    # Generar ZIP
    zip_path = create_flutter_project("flutter_project", designs_data, screen_width, screen_height)

    return FileResponse(zip_path, filename="flutter_project.zip", media_type="application/zip")
