from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, collaborators, user, projects, designs, collaboration_request, ws_sync , generation


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Generador Flutter",
    description="Backend API para diseñar interfaces Flutter y exportarlas como código Flutter funcional.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(collaborators.router, prefix="/collaborators", tags=["Collaborators"])
app.include_router(collaboration_request.router, prefix="/collaboration-requests", tags=["Collaboration Requests"])
app.include_router(designs.router, prefix="/designs", tags=["Designs"])
app.include_router(ws_sync.router)
app.include_router(generation.router, tags=["Generation"])







