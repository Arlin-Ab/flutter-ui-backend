from fastapi import APIRouter, Depends
from app.schemas.user import UserOut
from app.models.user import User
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
