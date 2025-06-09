import os
import shutil
import tempfile
from pathlib import Path
from zipfile import ZipFile
from jinja2 import Environment, FileSystemLoader

BASE_TEMPLATE_DIR = Path("templates/flutter_base")
COMPONENT_TEMPLATE_DIR = Path("templates/components")

env = Environment(loader=FileSystemLoader(str(COMPONENT_TEMPLATE_DIR)))

# Renderiza un componente individual con las dimensiones base del proyecto
def render_component(component: dict, screen_width: int, screen_height: int, is_child: bool = False) -> str:
    component_type = component.get("type")
    if not component_type:
        return "// componente desconocido"

    template_file = f"{component_type}_component.dart.jinja2"
    if not (COMPONENT_TEMPLATE_DIR / template_file).exists():
        return f"// plantilla no encontrada para {component_type}"

    template = env.get_template(template_file)

    props = {
        "component": component,
        "styles": component.get("styles", {}),
        "color": component.get("color", "#e5e7eb"),
        "options": component.get("options", []),
        "selectedValue": component.get("selectedValue", ""),
        "text": component.get("text", ""),
        "thickness": component.get("thickness", 1),
        "screen_width": screen_width,
        "screen_height": screen_height,
        "is_child": is_child,  
    }

    return template.render(
        **props,
        render_component=lambda c, sw, sh: render_component(c, sw, sh, is_child=True)
    )



# Renderiza una pantalla completa
def render_screen(screen_name: str, screen_title: str, components: list[dict], screen_width: int, screen_height: int) -> str:
    template = env.get_template("dynamic_screen.dart.jinja2")
    rendered_components = [
        render_component(c, screen_width, screen_height) for c in components
    ]
    return template.render(
        screen_name=screen_name,
        screen_title=screen_title,
        screen_width=screen_width,
        screen_height=screen_height,
        components=[
    {"component": original, "rendered": rendered}
    for original, rendered in zip(components, rendered_components)
]
    )

# Crea el proyecto Flutter y empaqueta todo en un ZIP
def create_flutter_project(project_name: str, designs: list[dict], screen_width: int, screen_height: int) -> str:
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        shutil.copytree(BASE_TEMPLATE_DIR, tmp_path / "flutter", dirs_exist_ok=True)

        screens_path = tmp_path / "flutter" / "lib" / "screens"
        os.makedirs(screens_path, exist_ok=True)

        for i, design in enumerate(designs):
            screen_class_name = f"Screen{i+1}" if i > 0 else "HomeScreen"
            screen_filename = screen_class_name[0].lower() + screen_class_name[1:] + ".dart"
            screen_code = render_screen(
                screen_class_name,
                design["name"],
                design["data"].get("components", []),
                screen_width,
                screen_height
            )
            with open(screens_path / screen_filename, "w", encoding="utf-8") as f:
                f.write(screen_code)

        # Crear ZIP
        zip_temp_path = tmp_path / "flutter.zip"
        with ZipFile(zip_temp_path, "w") as zipf:
            for foldername, _, filenames in os.walk(tmp_path / "flutter"):
                for filename in filenames:
                    filepath = Path(foldername) / filename
                    zipf.write(filepath, filepath.relative_to(tmp_path / "flutter"))

        final_zip_path = Path("exported_zips")
        final_zip_path.mkdir(exist_ok=True)
        export_path = final_zip_path / f"{project_name.replace(' ', '_').lower()}.zip"
        shutil.copy(zip_temp_path, export_path)

        return str(export_path)
