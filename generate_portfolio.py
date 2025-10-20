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
    con toda la información del portfolio, incluyendo títulos, subtítulos,
    imágenes y videos (MP4 y YouTube).
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

    # Diccionario para mapear nombres de carpetas a su ubicación
    project_map = {}

    # Primer paso: mapear todas las carpetas de proyectos
    print("\n🗺️ Mapeando estructura de proyectos...")
    for section_folder, section_key in section_map.items():
        section_path = os.path.join(base_path, section_folder)

        if not os.path.exists(section_path):
            continue

        category_folders = [f for f in os.listdir(section_path)
                          if os.path.isdir(os.path.join(section_path, f))]
        category_folders.sort(key=natural_sort_key)

        for cat_idx, category_folder in enumerate(category_folders):
            category_path = os.path.join(section_path, category_folder)

            project_folders = [f for f in os.listdir(category_path)
                             if os.path.isdir(os.path.join(category_path, f))]
            project_folders.sort(key=natural_sort_key)

            for proj_idx, project_folder in enumerate(project_folders):
                project_map[project_folder] = {
                    'section': section_key,
                    'category_index': cat_idx,
                    'project_index': proj_idx
                }
                print(f"  📁 Mapeado: {project_folder} -> {section_key}/{cat_idx}/{proj_idx}")

    # Recorrer cada sección
    for section_folder, section_key in section_map.items():
        section_path = os.path.join(base_path, section_folder)

        if not os.path.exists(section_path):
            print(f"⚠️ Sección no encontrada: {section_path}")
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

        print(f"\n📂 Procesando sección: {section_folder}")

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
                    print(f"  ⚠️ Error leyendo {titulo_path}: {e}")
                    print(f"     Usando nombre de carpeta: {category_folder}")
            else:
                print(f"  ⚠️ No se encontró titulo.json en {category_folder}, usando nombre de carpeta")

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
                    print(f"    ⚠️ No se encontró portada en {project_folder}")
                    continue

                # Leer info.json
                info_path = os.path.join(project_path, "info.json")
                project_title = project_folder
                project_subtitle = ""
                project_description = ""
                project_links = []
                project_programs = []
                project_related = []

                if os.path.exists(info_path):
                    try:
                        with open(info_path, 'r', encoding='utf-8') as f:
                            info_content = f.read().strip()

                            # Parsear el formato con soporte multi-línea
                            lines = info_content.split('\n')
                            i = 0
                            while i < len(lines):
                                line = lines[i].strip()

                                if line.startswith('Tit:'):
                                    project_title = line[4:].strip()
                                    i += 1

                                elif line.startswith('Sub:'):
                                    project_subtitle = line[4:].strip()
                                    i += 1

                                elif line.startswith('Des:'):
                                    # Leer descripción multi-línea
                                    desc_lines = [line[4:].strip()]
                                    i += 1
                                    # Continuar leyendo líneas hasta encontrar otra etiqueta o fin de archivo
                                    while i < len(lines):
                                        next_line = lines[i].strip()
                                        if next_line.startswith('Prog:') or next_line.startswith('Link_') or next_line.startswith('Rela:') or next_line.startswith('Tit:') or next_line.startswith('Sub:'):
                                            break
                                        if next_line:  # Solo añadir líneas no vacías
                                            desc_lines.append(next_line)
                                        else:  # Línea vacía = salto de párrafo
                                            desc_lines.append('\n')
                                        i += 1
                                    project_description = ' '.join(desc_lines)

                                elif line.startswith('Prog:'):
                                    # Parsear programas separados por comas
                                    programs_str = line[5:].strip()
                                    project_programs = [p.strip() for p in programs_str.split(',') if p.strip()]
                                    i += 1

                                elif line.startswith('Link_'):
                                    # Parsear Link_X:("texto","url","icono.png")
                                    try:
                                        link_content = line.split(':', 1)[1].strip()
                                        # Extraer contenido entre paréntesis
                                        if link_content.startswith('(') and link_content.endswith(')'):
                                            link_content = link_content[1:-1]
                                            # Separar por comas respetando comillas
                                            parts = []
                                            current = ""
                                            in_quotes = False
                                            for char in link_content:
                                                if char == '"':
                                                    in_quotes = not in_quotes
                                                elif char == ',' and not in_quotes:
                                                    parts.append(current.strip().strip('"'))
                                                    current = ""
                                                    continue
                                                current += char
                                            parts.append(current.strip().strip('"'))

                                            if len(parts) >= 3:
                                                project_links.append({
                                                    "text": parts[0],
                                                    "url": parts[1],
                                                    "icon": parts[2]
                                                })
                                    except Exception as e:
                                        print(f"    ⚠️ Error parseando link: {line} - {e}")
                                    i += 1

                                elif line.startswith('Rela:'):
                                    # Parsear Rela:("texto","carpeta_destino")
                                    try:
                                        rela_content = line.split(':', 1)[1].strip()
                                        # Extraer contenido entre paréntesis
                                        if rela_content.startswith('(') and rela_content.endswith(')'):
                                            rela_content = rela_content[1:-1]
                                            # Separar por comas respetando comillas
                                            parts = []
                                            current = ""
                                            in_quotes = False
                                            for char in rela_content:
                                                if char == '"':
                                                    in_quotes = not in_quotes
                                                elif char == ',' and not in_quotes:
                                                    parts.append(current.strip().strip('"'))
                                                    current = ""
                                                    continue
                                                current += char
                                            parts.append(current.strip().strip('"'))

                                            if len(parts) >= 2:
                                                button_text = parts[0]
                                                target_folder_input = parts[1]

                                                # Buscar el proyecto en el mapa (ignorando números al inicio)
                                                target_folder = None
                                                for folder_name in project_map.keys():
                                                    # Extraer nombre sin el número inicial
                                                    folder_without_number = re.sub(r'^\d+_', '', folder_name)
                                                    input_without_number = re.sub(r'^\d+_', '', target_folder_input)

                                                    if folder_without_number.upper() == input_without_number.upper():
                                                        target_folder = folder_name
                                                        break

                                                if target_folder and target_folder in project_map:
                                                    target_info = project_map[target_folder]
                                                    project_related.append({
                                                        "text": button_text,
                                                        "section": target_info['section'],
                                                        "category_index": target_info['category_index'],
                                                        "project_index": target_info['project_index']
                                                    })
                                                    print(f"    ✅ Relacionado: '{button_text}' -> {target_folder}")
                                                else:
                                                    print(f"    ⚠️ Proyecto relacionado no encontrado: {target_folder}")
                                    except Exception as e:
                                        print(f"    ⚠️ Error parseando relacionado: {line} - {e}")
                                    i += 1

                                else:
                                    i += 1

                            print(f"    ✓ {project_title} - {project_subtitle}")
                            print(f"      Links: {len(project_links)}, Programas: {len(project_programs)}, Relacionados: {len(project_related)}, Descripción: {len(project_description)} chars")
                    except Exception as e:
                        print(f"    ⚠️ Error leyendo {info_path}: {e}")
                else:
                    print(f"    ⚠️ No se encontró info.json en {project_folder}")

                # Buscar imágenes, videos MP4 y videos YouTube (1.jpg, 2.mp4, 3.json, etc.)
                additional_images = []
                img_number = 1
                while True:
                    img_jpg = os.path.join(project_path, f"{img_number}.jpg")
                    img_png = os.path.join(project_path, f"{img_number}.png")
                    video_mp4 = os.path.join(project_path, f"{img_number}.mp4")
                    video_json = os.path.join(project_path, f"{img_number}.json")

                    if os.path.exists(img_jpg):
                        additional_images.append({
                            "type": "image",
                            "src": f"{section_path}/{category_folder}/{project_folder}/{img_number}.jpg"
                        })
                        img_number += 1
                    elif os.path.exists(img_png):
                        additional_images.append({
                            "type": "image",
                            "src": f"{section_path}/{category_folder}/{project_folder}/{img_number}.png"
                        })
                        img_number += 1
                    elif os.path.exists(video_mp4):
                        additional_images.append({
                            "type": "video",
                            "src": f"{section_path}/{category_folder}/{project_folder}/{img_number}.mp4"
                        })
                        img_number += 1
                    elif os.path.exists(video_json):
                        try:
                            with open(video_json, 'r', encoding='utf-8') as vf:
                                video_data = json.load(vf)
                                additional_images.append({
                                    "type": "youtube",
                                    "src": video_data.get("url", "")
                                })
                        except Exception as e:
                            print(f"      ⚠️ Error leyendo {video_json}: {e}")
                        img_number += 1
                    else:
                        break

                if additional_images:
                    media_count = len(additional_images)
                    images_count = sum(1 for item in additional_images if item["type"] == "image")
                    videos_count = sum(1 for item in additional_images if item["type"] in ["video", "youtube"])
                    print(f"      Multimedia: {media_count} total ({images_count} img, {videos_count} vid)")

                # Agregar imagen con toda su información
                images.append({
                    "src": portada_relative,
                    "title": project_title,
                    "subtitle": project_subtitle,
                    "description": project_description,
                    "links": project_links,
                    "programs": project_programs,
                    "related": project_related,
                    "images": additional_images
                })

            print(f"  ✅ {category_title}: {len(images)} proyectos")

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
            print(f"  • {data['name']}: {len(data['categories'])} categorías, {total_images} proyectos")

if __name__ == "__main__":
    print("🚀 Generando portfolio-data.json...\n")
    try:
        generate_portfolio_data()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

    input("\n✅ Presiona ENTER para cerrar...")
