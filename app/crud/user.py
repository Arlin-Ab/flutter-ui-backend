from sqlalchemy.orm import Session
from app.models.user import User
from uuid import UUID

def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()
