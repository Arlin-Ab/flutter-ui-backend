from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import openai
import os
import base64
import json
import uuid
import tempfile
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()


# Ruta para entrada por prompt (solo texto)
class PromptRequest(BaseModel):
    prompt: str
    mode: str = "new"
    
VALID_TYPES = {
    "button", "input", "card", "label", "textarea", "select",
    "icon", "image", "checkbox", "switch", "divider", "radio",
    "navbar", "row", "column", "grid", "fab", "appbar"
}
    
def assign_unique_ids(components: list[dict]) -> list[dict]:
    result = []
    for comp in components:
        if comp.get("type") not in VALID_TYPES:
            continue  # ignora tipos no válidos
        comp["id"] = str(uuid.uuid4())
        comp.pop("key", None)  # elimina posibles claves de React

        if "childrenComponents" in comp and isinstance(comp["childrenComponents"], list):
            comp["childrenComponents"] = assign_unique_ids(comp["childrenComponents"])
        result.append(comp)
    return result



@router.post("/generate/from_prompt")
async def generate_from_prompt(data: PromptRequest):
    try:
        if data.mode == "add":
            full_prompt = f"""
Quiero que generes solo una lista de componentes visuales (sin estructura de pantallas) en formato JSON plano.

Cada componente debe incluir:
- type: uno de los valores permitidos: "button", "input", "card", "label", "textarea", "select", "icon", "image", "checkbox", "switch", "divider", "radio", "navbar", "row", "column", "grid","fab", "appbar"
- label, placeholder, title o content: según el tipo
- styles: contiene top, left, width, height (valores entre 0 y 1, proporcionales al canvas)

Ejemplo esperado:
{{
  "components": [
    {{
      "type": "input",
      "placeholder": "Nombre completo",
      "styles": {{ "top": 0.2, "left": 0.1, "width": 0.8, "height": 0.1 }}
    }},
    {{
      "type": "button",
      "label": "Guardar",
      "styles": {{ "top": 0.35, "left": 0.3, "width": 0.4, "height": 0.1 }}
    }}
  ]
}}

Notas sobre componentes especiales:

- "fab": representa un botón flotante redondo, usualmente con un ícono como "add", "edit", "delete". Puede tener:
  - icon: nombre del ícono (ej. "add")
  - tooltip: texto visible al mantener el cursor
  - actionType: "none", "navigate" o "openDialog"
  - targetScreen: nombre de la pantalla de destino (si actionType es "navigate")
  - dialogTitle, dialogContent, confirmText, cancelText (si actionType es "openDialog")

- "appbar": representa una barra superior con:
  - title: texto del encabezado
  - height: altura entre 0.05 y 0.15
  - actions: lista de objetos con
    - icon
    - tooltip
    - action (igual que en fab)
    - targetScreen, dialogTitle, dialogContent, confirmText, cancelText

Restricciones:
- Solo debe haber **una** `appbar` y **una** `navbar` por pantalla.


Ahora genera componentes según esta descripción:
{data.prompt}

Devuelve solo el JSON plano, sin explicaciones ni formato markdown.
"""
        else:
            full_prompt = f"""
Quiero que generes una o más pantallas en formato JSON plano para representar una interfaz visual que será usada en un editor Flutter.

Cada pantalla debe contener:
- name: nombre breve de la pantalla (ej. "Login", "Formulario", "PerfilUsuario")
- components: lista de componentes visuales con los siguientes campos:

Cada componente debe incluir:
- type: uno de los valores permitidos:
  "button", "input", "card", "label", "textarea", "select",
  "icon", "image", "checkbox", "switch", "divider", "radio",
  "navbar", "row", "column", "grid", "fab", "appbar"
- label, placeholder, title o content: según el tipo
- styles: contiene top, left, width, height (valores entre 0 y 1, proporcionales al canvas)

Ejemplo de formato esperado:
{{
  "screens": [
    {{
      "name": "Login",
      "components": [
        {{
          "type": "label",
          "label": "Bienvenido",
          "styles": {{
            "top": 0.1,
            "left": 0.3,
            "width": 0.4,
            "height": 0.1
          }}
        }},
        {{
          "type": "input",
          "placeholder": "Correo electrónico",
          "styles": {{
            "top": 0.25,
            "left": 0.1,
            "width": 0.8,
            "height": 0.1
          }}
        }}
      ]
    }}
  ]
}}

Notas sobre componentes especiales:

- "fab": representa un botón flotante redondo, usualmente con un ícono como "add", "edit", "delete". Puede tener:
  - icon: nombre del ícono (ej. "add")
  - tooltip: texto visible al mantener el cursor
  - actionType: "none", "navigate" o "openDialog"
  - targetScreen: nombre de la pantalla de destino (si actionType es "navigate")
  - dialogTitle, dialogContent, confirmText, cancelText (si actionType es "openDialog")

- "appbar": representa una barra superior con:
  - title: texto del encabezado
  - height: altura entre 0.05 y 0.15
  - actions: lista de objetos con
    - icon
    - tooltip
    - action (igual que en fab)
    - targetScreen, dialogTitle, dialogContent, confirmText, cancelText

Restricciones:
- Solo debe haber **una** `appbar` y **una** `navbar` por pantalla.


Ahora genera el diseño basado en esta descripción:
{data.prompt}

Devuelve **solo el JSON plano**, sin comillas ni formato markdown, y sin explicaciones.
"""

        # Llamada a OpenAI
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "Eres un generador de interfaces Flutter visuales en formato JSON compatible con un editor de componentes."
                },
                {"role": "user", "content": full_prompt}
            ]
        )

        raw = response.choices[0].message.content.strip()
        parsed = json.loads(raw)

        # Modo agregar componentes directamente
        if data.mode == "add":
            components = parsed.get("components", [])
            return {"components": assign_unique_ids(components)}

        # Modo diseño completo o múltiples
        if "screens" in parsed:
            for screen in parsed["screens"]:
                screen["components"] = assign_unique_ids(screen.get("components", []))
            return {"designs": parsed["screens"]}

        parsed["components"] = assign_unique_ids(parsed.get("components", []))
        return {"design": parsed}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Error al parsear JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Ruta para entrada por boceto (imagen + texto)
@router.post("/generate/from_sketch")
async def generate_from_sketch(
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None)
):
    try:
        image_bytes = await file.read()
        base64_image = "data:{};base64,{}".format(
            file.content_type,
            base64.b64encode(image_bytes).decode("utf-8")
        )

        combined_prompt = f"""
Quiero que analices este boceto visual (imagen) y generes un JSON plano que represente la interfaz contenida en él.

El JSON debe tener el siguiente formato:

{{
  "components": [
    {{
      "id": "string",
      "type": "button" | "input" | "label" | "card" | "select" | "checkbox" | "switch" | "textarea" | "navbar" | "row" | "column" | "grid" | "fab" | "appbar",
      "label": "texto visible",
      "placeholder": "texto de ayuda (si aplica)",
      "title": "título (si aplica)",
      "content": "contenido (si aplica)",
      "styles": {{
        "top": 0.1,
        "left": 0.1,
        "width": 0.8,
        "height": 0.1
      }}
    }}
  ]
}}

Notas sobre componentes especiales:

- "fab": representa un botón flotante redondo, usualmente con un ícono como "add", "edit", "delete". Puede tener:
  - icon: nombre del ícono (ej. "add")
  - tooltip: texto visible al mantener el cursor
  - actionType: "none", "navigate" o "openDialog"
  - targetScreen: nombre de la pantalla de destino (si actionType es "navigate")
  - dialogTitle, dialogContent, confirmText, cancelText (si actionType es "openDialog")

- "appbar": representa una barra superior con:
  - title: texto del encabezado
  - height: altura entre 0.05 y 0.15
  - actions: lista de objetos con
    - icon
    - tooltip
    - action (igual que en fab)
    - targetScreen, dialogTitle, dialogContent, confirmText, cancelText
Restricciones:
- Solo debe haber **una** `appbar` y **una** `navbar` por pantalla.

Describe y convierte solo los elementos visuales del boceto en componentes del tipo anterior.  
Devuelve **solo el JSON plano sin explicaciones ni formato markdown**.

Descripción extra (si existe):  
{prompt or "Sin descripción textual, solo analizar la imagen."}
"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Eres un generador de interfaces Flutter visuales en formato JSON compatible con un editor de diseño de pantallas."},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": combined_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": base64_image
                            }
                        }
                    ]
                }
            ]
        )

        raw = response.choices[0].message.content.strip()
        parsed = json.loads(raw)
        parsed["components"] = assign_unique_ids(parsed.get("components", [])) 
        return {"design": parsed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/from_audio")
async def generate_from_audio(
    file: UploadFile = File(...),
    mode: str = Form("new")
):
    try:
        # Leer bytes del archivo subido
        audio_bytes = await file.read()

        # Guardar en archivo temporal .mp3
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp:
            temp.write(audio_bytes)
            temp_path = temp.name

        # Usar archivo real en la API de OpenAI
        with open(temp_path, "rb") as audio_file:
            transcript_response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )

        transcribed_text = transcript_response.strip()
        prompt_data = PromptRequest(prompt=transcribed_text, mode=mode)
        return await generate_from_prompt(prompt_data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando audio: {str(e)}")
    finally:
        # Limpieza del archivo temporal
        if os.path.exists(temp_path):
            os.remove(temp_path)

