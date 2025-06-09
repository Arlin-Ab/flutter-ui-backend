from logging.config import fileConfig
import os
import sys
from sqlalchemy import engine_from_config, pool
from alembic import context

# Habilitar importación desde la carpeta raíz
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Cargar metadata y engine desde app
from app.database import Base, engine
from app.models import user, project, design, collaborator, collaboration_request  # importa todos tus modelos aquí

# Configuración Alembic
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
