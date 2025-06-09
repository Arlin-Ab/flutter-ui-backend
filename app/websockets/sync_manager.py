from fastapi import WebSocket
from typing import Dict, List, Tuple
from uuid import UUID

class SyncManager:
    def __init__(self):
        self.connections: Dict[UUID, List[Tuple[WebSocket, str, str]]] = {}
        # project_id -> List of (WebSocket, user_id, user_name)

    async def connect(self, project_id: UUID, websocket: WebSocket, user_id: str, user_name: str):
        await websocket.accept()
        if project_id not in self.connections:
            self.connections[project_id] = []
        self.connections[project_id].append((websocket, user_id, user_name))
        await self.broadcast_online_users(project_id)

    def disconnect(self, project_id: UUID, websocket: WebSocket):
        if project_id in self.connections:
            self.connections[project_id] = [
                (ws, uid, uname) for (ws, uid, uname) in self.connections[project_id] if ws != websocket
            ]
            if not self.connections[project_id]:
                del self.connections[project_id]

    async def broadcast(self, project_id: UUID, message: str, sender: WebSocket):
        for ws, _, _ in self.connections.get(project_id, []):
            if ws != sender:
                await ws.send_text(message)

    async def broadcast_online_users(self, project_id: UUID):
        if project_id not in self.connections:
            return

        online_users = [
            {"id": user_id, "name": user_name}
            for (_, user_id, user_name) in self.connections[project_id]
        ]

        #  Preparamos nueva lista limpia
        still_alive = []

        for ws, uid, uname in self.connections[project_id]:
            try:
                await ws.send_json({
                    "type": "online_users",
                    "payload": online_users,
                })
                still_alive.append((ws, uid, uname))  # Solo si funcionó
            except Exception as e:
                print(f"⛔ Error enviando a un websocket: {e}")

        # Actualizamos lista de conexiones limpias
        self.connections[project_id] = still_alive

manager = SyncManager()
