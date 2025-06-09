import uuid
import random
import string
from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate
from uuid import UUID


# Definimos los dispositivos permitidos
DEVICE_SIZES = {
    "realme_6": {"width": 1080, "height": 2400},
    "ipad_air": {"width": 1640, "height": 2360},
    "pixel_5": {"width": 1080, "height": 2340}
}

def generate_project_code(length=6):
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"PROJ-{suffix}"

def create_project(db: Session, project_data: ProjectCreate, owner_id: UUID):
    new_project = Project(
    id=uuid.uuid4(),
    name=project_data.name,
    code=generate_project_code(),
    owner_id=owner_id,
    screen_size_width=project_data.screen_size_width,
    screen_size_height=project_data.screen_size_height
)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

def get_user_projects(db: Session, user_id: UUID):
    return db.query(Project).filter(Project.owner_id == user_id).all()

def get_project_by_id(db: Session, project_id: UUID, user_id: UUID):
    return db.query(Project).filter(Project.id == project_id, Project.owner_id == user_id).first()
def get_project_by_id_raw(db: Session, project_id: UUID):
    return db.query(Project).filter(Project.id == project_id).first()

def user_can_access_project(db: Session, user_id: UUID, project_id: UUID) -> bool:
    from app.models.project import Project
    from app.models.collaborator import Collaborator

    # Dueño del proyecto
    project = db.query(Project).filter(Project.id == project_id).first()
    if project and project.owner_id == user_id:
        return True

    # Colaborador
    exists = db.query(Collaborator).filter_by(user_id=user_id, project_id=project_id).first()
    return exists is not None
def get_all_projects_for_user(db: Session, user_id: UUID):
    from app.models.project import Project
    from app.models.collaborator import Collaborator

    owned = db.query(Project).filter(Project.owner_id == user_id)
    collaborated = (
        db.query(Project)
        .join(Collaborator)
        .filter(Collaborator.user_id == user_id)
    )
    return owned.union(collaborated).all()
def update_project_screen_size(db: Session, project_id: UUID, device_name: str):
    if device_name not in DEVICE_SIZES:
        return None
    size = DEVICE_SIZES[device_name]
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return None
    project.screen_size_width = size["width"]
    project.screen_size_height = size["height"]
    db.commit()
    db.refresh(project)
    return project

def user_can_export_project(db: Session, user_id: UUID, project_id: UUID) -> bool:
    from app.models.project import Project
    from app.models.collaborator import Collaborator

    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return False

    if project.owner_id == user_id:
        return True

    collab = db.query(Collaborator).filter_by(user_id=user_id, project_id=project_id).first()
    return collab is not None and collab.can_export
