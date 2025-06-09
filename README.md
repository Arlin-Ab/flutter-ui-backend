# Flutter UI Backend

Backend desarrollado con FastAPI para servir como API de generación de interfaces Flutter a partir de texto o bocetos. Este servicio es utilizado por un editor visual de UI desarrollado en Next.js.

##  Tecnologías

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- OpenAI API
- WebSockets
- Python-Jose (JWT)
- Railway (deploy)

---

##  Requisitos

- Python 3.10 o superior
- PostgreSQL (en local o en la nube)
- OpenAI API Key (si se utiliza generación por prompt o imagen)

---

##  Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu_usuario/flutter-ui-backend.git
cd flutter-ui-backend

# Crear y activar entorno virtual (opcional)
python -m venv env
source env/bin/activate  # Linux/macOS
env\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt
