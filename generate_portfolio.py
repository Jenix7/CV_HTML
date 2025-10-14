import os
import json
import re

def natural_sort_key(s):
    """
    Clave de ordenamiento natural para ordenar correctamente números en strings.
    Convierte '10_PROYECTO' para que se ordene después de '2_PROYECTO'
    """
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s)]

def generate_portfolio_data():
    """
    Escanea la estructura de carpetas en 'proyectos/' y genera un JSON
    con toda la información del portfolio, incluyendo títulos y subtítulos.
    """

    base_path = "proyectos"

    # Mapeo de nombres de carpetas a claves del portfolio
    section_map = {
        "ARTE": "arte",
        "PROGRAMACION": "programacion",
        "DISENO": "diseño",
        "PRODUCCION": "produccion",
        "COMUNICACION": "comunicacion"
    }

    # Nombres legibles de las secciones
    section_names = {
        "arte": "ARTE",
        "programacion": "PROGRAMACIÓN",
        "diseño": "DISEÑO",
        "produccion": "PRODUCCIÓN",
        "comunicacion": "COMUNICACIÓN"
    }

    portfolio_data = {}

    # Recorrer cada sección
    for section_folder, section_key in section_map.items():
        section_path = os.path.join(base_path, section_folder)

        if not os.path.exists(section_path):
            print(f"⚠️  Sección no encontrada: {section_path}")
            portfolio_data[section_key] = {
                "name": section_names[section_key],
                "categories": []
            }
            continue

        categories = []

        # Obtener todas las carpetas de categorías y ordenarlas NATURALMENTE
        category_folders = [f for f in os.listdir(section_path)
                          if os.path.isdir(os.path.join(section_path, f))]
        category_folders.sort(key=natural_sort_key)  # Orden natural (1, 2, 3, ..., 10, 11)

        print(f"\n🔍 Procesando sección: {section_folder}")

        for category_folder in category_folders:
            category_path = os.path.join(section_path, category_folder)

            # Leer el archivo titulo.json
            titulo_path = os.path.join(category_path, "titulo.json")
            category_title = category_folder  # Por defecto usa el nombre de carpeta

            if os.path.exists(titulo_path):
                try:
                    with open(titulo_path, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        # Intentar parsear como JSON primero
                        try:
                            titulo_data = json.loads(content)
                            # Si es un objeto con clave
                            if isinstance(titulo_data, dict):
                                category_title = (titulo_data.get("titulo") or
                                                titulo_data.get("title") or
                                                titulo_data.get("nombre") or
                                                titulo_data.get("name") or
                                                category_folder)
                            # Si es solo un string directo
                            elif isinstance(titulo_data, str):
                                category_title = titulo_data
                        except json.JSONDecodeError:
                            # Si no es JSON válido, usar el contenido como texto plano
                            category_title = content

                        print(f"  📄 Título: '{category_title}'")
                except Exception as e:
                    print(f"  ⚠️  Error leyendo {titulo_path}: {e}")
                    print(f"     Usando nombre de carpeta: {category_folder}")
            else:
                print(f"  ⚠️  No se encontró titulo.json en {category_folder}, usando nombre de carpeta")

            # Obtener todas las carpetas de proyectos
            project_folders = [f for f in os.listdir(category_path)
                             if os.path.isdir(os.path.join(category_path, f))]
            project_folders.sort(key=natural_sort_key)  # Orden natural (1, 2, 3, ..., 10, 11)

            # Generar rutas a las portadas y leer info.json
            images = []
            for project_folder in project_folders:
                project_path = os.path.join(category_path, project_folder)

                # Buscar portada.jpg primero, luego portada.png
                portada_jpg = os.path.join(project_path, "portada.jpg")
                portada_png = os.path.join(project_path, "portada.png")

                portada_found = False
                portada_relative = None

                if os.path.exists(portada_jpg):
                    portada_relative = f"{section_path}/{category_folder}/{project_folder}/portada.jpg"
                    portada_found = True
                elif os.path.exists(portada_png):
                    portada_relative = f"{section_path}/{category_folder}/{project_folder}/portada.png"
                    portada_found = True

                if not portada_found:
                    print(f"    ⚠️  No se encontró portada en {project_folder}")
                    continue

                # Leer info.json
                info_path = os.path.join(project_path, "info.json")
                project_title = project_folder
                project_subtitle = ""

                if os.path.exists(info_path):
                    try:
                        with open(info_path, 'r', encoding='utf-8') as f:
                            info_content = f.read().strip()

                            # Parsear el formato "Tit:xxx\nSub:xxx"
                            lines = info_content.split('\n')
                            for line in lines:
                                line = line.strip()
                                if line.startswith('Tit:'):
                                    project_title = line[4:].strip()
                                elif line.startswith('Sub:'):
                                    project_subtitle = line[4:].strip()

                            print(f"    ✓ {project_title} - {project_subtitle}")
                    except Exception as e:
                        print(f"    ⚠️  Error leyendo {info_path}: {e}")
                else:
                    print(f"    ⚠️  No se encontró info.json en {project_folder}")

                # Agregar imagen con su información
                images.append({
                    "src": portada_relative,
                    "title": project_title,
                    "subtitle": project_subtitle
                })

            print(f"  ✅ {category_title}: {len(images)} imágenes")

            categories.append({
                "title": category_title,
                "images": images
            })

        portfolio_data[section_key] = {
            "name": section_names[section_key],
            "categories": categories
        }

    # Añadir sección TODO vacía
    portfolio_data["todo"] = {
        "name": "TODO",
        "categories": []
    }

    # Guardar el JSON
    output_file = "portfolio-data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(portfolio_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Archivo generado exitosamente: {output_file}")
    print(f"📊 Total de secciones procesadas: {len(portfolio_data) - 1}")  # -1 por TODO

    # Mostrar resumen
    print("\n📋 RESUMEN:")
    for key, data in portfolio_data.items():
        if key != "todo":
            total_images = sum(len(cat["images"]) for cat in data["categories"])
            print(f"  • {data['name']}: {len(data['categories'])} categorías, {total_images} imágenes")

if __name__ == "__main__":
    print("🚀 Generando portfolio-data.json...\n")
    try:
        generate_portfolio_data()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

    input("\n✅ Presiona ENTER para cerrar...")
    """
    Escanea la estructura de carpetas en 'proyectos/' y genera un JSON
    con toda la información del portfolio, incluyendo títulos y subtítulos.
    """

    base_path = "proyectos"

    # Mapeo de nombres de carpetas a claves del portfolio
    section_map = {
        "ARTE": "arte",
        "PROGRAMACION": "programacion",
        "DISENO": "diseño",
        "PRODUCCION": "produccion",
        "COMUNICACION": "comunicacion"
    }

    # Nombres legibles de las secciones
    section_names = {
        "arte": "ARTE",
        "programacion": "PROGRAMACIÓN",
        "diseño": "DISEÑO",
        "produccion": "PRODUCCIÓN",
        "comunicacion": "COMUNICACIÓN"
    }

    portfolio_data = {}

    # Recorrer cada sección
    for section_folder, section_key in section_map.items():
        section_path = os.path.join(base_path, section_folder)

        if not os.path.exists(section_path):
            print(f"⚠️  Sección no encontrada: {section_path}")
            portfolio_data[section_key] = {
                "name": section_names[section_key],
                "categories": []
            }
            continue

        categories = []

        # Obtener todas las carpetas de categorías y ordenarlas
        category_folders = [f for f in os.listdir(section_path)
                          if os.path.isdir(os.path.join(section_path, f))]
        category_folders.sort()  # Orden alfabético (numérico por el prefijo)

        print(f"\n🔍 Procesando sección: {section_folder}")

        for category_folder in category_folders:
            category_path = os.path.join(section_path, category_folder)

            # Leer el archivo titulo.json
            titulo_path = os.path.join(category_path, "titulo.json")
            category_title = category_folder  # Por defecto usa el nombre de carpeta

            if os.path.exists(titulo_path):
                try:
                    with open(titulo_path, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        # Intentar parsear como JSON primero
                        try:
                            titulo_data = json.loads(content)
                            # Si es un objeto con clave
                            if isinstance(titulo_data, dict):
                                category_title = (titulo_data.get("titulo") or
                                                titulo_data.get("title") or
                                                titulo_data.get("nombre") or
                                                titulo_data.get("name") or
                                                category_folder)
                            # Si es solo un string directo
                            elif isinstance(titulo_data, str):
                                category_title = titulo_data
                        except json.JSONDecodeError:
                            # Si no es JSON válido, usar el contenido como texto plano
                            category_title = content

                        print(f"  📄 Título: '{category_title}'")
                except Exception as e:
                    print(f"  ⚠️  Error leyendo {titulo_path}: {e}")
                    print(f"     Usando nombre de carpeta: {category_folder}")
            else:
                print(f"  ⚠️  No se encontró titulo.json en {category_folder}, usando nombre de carpeta")

            # Obtener todas las carpetas de proyectos
            project_folders = [f for f in os.listdir(category_path)
                             if os.path.isdir(os.path.join(category_path, f))]
            project_folders.sort()  # Orden alfabético (numérico por el prefijo)

            # Generar rutas a las portadas y leer info.json
            images = []
            for project_folder in project_folders:
                project_path = os.path.join(category_path, project_folder)

                # Buscar portada.jpg primero, luego portada.png
                portada_jpg = os.path.join(project_path, "portada.jpg")
                portada_png = os.path.join(project_path, "portada.png")

                portada_found = False
                portada_relative = None

                if os.path.exists(portada_jpg):
                    portada_relative = f"{section_path}/{category_folder}/{project_folder}/portada.jpg"
                    portada_found = True
                elif os.path.exists(portada_png):
                    portada_relative = f"{section_path}/{category_folder}/{project_folder}/portada.png"
                    portada_found = True

                if not portada_found:
                    print(f"    ⚠️  No se encontró portada en {project_folder}")
                    continue

                # Leer info.json
                info_path = os.path.join(project_path, "info.json")
                project_title = project_folder
                project_subtitle = ""

                if os.path.exists(info_path):
                    try:
                        with open(info_path, 'r', encoding='utf-8') as f:
                            info_content = f.read().strip()

                            # Parsear el formato "Tit:xxx\nSub:xxx"
                            lines = info_content.split('\n')
                            for line in lines:
                                line = line.strip()
                                if line.startswith('Tit:'):
                                    project_title = line[4:].strip()
                                elif line.startswith('Sub:'):
                                    project_subtitle = line[4:].strip()

                            print(f"    ✓ {project_title} - {project_subtitle}")
                    except Exception as e:
                        print(f"    ⚠️  Error leyendo {info_path}: {e}")
                else:
                    print(f"    ⚠️  No se encontró info.json en {project_folder}")

                # Agregar imagen con su información
                images.append({
                    "src": portada_relative,
                    "title": project_title,
                    "subtitle": project_subtitle
                })

            print(f"  ✅ {category_title}: {len(images)} imágenes")

            categories.append({
                "title": category_title,
                "images": images
            })

        portfolio_data[section_key] = {
            "name": section_names[section_key],
            "categories": categories
        }

    # Añadir sección TODO vacía
    portfolio_data["todo"] = {
        "name": "TODO",
        "categories": []
    }

    # Guardar el JSON
    output_file = "portfolio-data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(portfolio_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Archivo generado exitosamente: {output_file}")
    print(f"📊 Total de secciones procesadas: {len(portfolio_data) - 1}")  # -1 por TODO

    # Mostrar resumen
    print("\n📋 RESUMEN:")
    for key, data in portfolio_data.items():
        if key != "todo":
            total_images = sum(len(cat["images"]) for cat in data["categories"])
            print(f"  • {data['name']}: {len(data['categories'])} categorías, {total_images} imágenes")

if __name__ == "__main__":
    print("🚀 Generando portfolio-data.json...\n")
    try:
        generate_portfolio_data()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

    input("\n✅ Presiona ENTER para cerrar...")
