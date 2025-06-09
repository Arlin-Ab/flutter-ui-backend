from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from uuid import UUID
from app.websockets.sync_manager import manager
from app.auth.jwt import decode_access_token
from app.crud.collaborator import get_collaborator_by_user_and_project
from app.crud.project import get_project_by_id_raw
from app.database import SessionLocal
from app.crud.user import get_user_by_id  

router = APIRouter()



@router.websocket("/ws/sync/{project_id}")
async def websocket_sync(websocket: WebSocket, project_id: UUID):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        payload = decode_access_token(token)
        user_id = UUID(payload.get("sub"))
    except Exception as e:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    db = SessionLocal()
    try:
        project = get_project_by_id_raw(db, project_id)
        if not project:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        is_owner = project.owner_id == user_id
        is_collaborator = get_collaborator_by_user_and_project(db, user_id, project_id)

        if not (is_owner or is_collaborator):
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        
        user = get_user_by_id(db, user_id)
        user_name = user.full_name if user else "Anónimo"

    finally:
        db.close()

    await manager.connect(project_id, websocket, str(user_id), user_name)

    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(project_id, data, sender=websocket)
    except WebSocketDisconnect:
        manager.disconnect(project_id, websocket)
        await manager.broadcast_online_users(project_id)
