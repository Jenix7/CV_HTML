import os
import json
import re
import hashlib

# Importar configuración de DeepL
try:
    from config_deepl import DEEPL_API_KEY
    DEEPL_AVAILABLE = True
except ImportError:
    print("⚠️ No se encontró config_deepl.py - La traducción automática estará desactivada")
    DEEPL_AVAILABLE = False
    DEEPL_API_KEY = None

# Importar DeepL si está disponible
if DEEPL_AVAILABLE:
    try:
        import deepl
        translator = deepl.Translator(DEEPL_API_KEY)
        print("✅ DeepL inicializado correctamente")
    except ImportError:
        print("⚠️ La librería 'deepl' no está instalada. Ejecuta: pip install deepl")
        DEEPL_AVAILABLE = False
    except Exception as e:
        print(f"⚠️ Error al inicializar DeepL: {e}")
        DEEPL_AVAILABLE = False

# ============================================
# SISTEMA DE CACHÉ DE TRADUCCIONES
# ============================================

CACHE_FILE = "translation_cache.json"
translation_cache = {}

def load_translation_cache():
    """Carga el caché de traducciones desde el archivo"""
    global translation_cache
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                translation_cache = json.load(f)
            print(f"📦 Caché cargado: {len(translation_cache)} traducciones guardadas")
        except Exception as e:
            print(f"⚠️ Error cargando caché: {e}")
            translation_cache = {}
    else:
        translation_cache = {}

def save_translation_cache():
    """Guarda el caché de traducciones en el archivo"""
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(translation_cache, f, ensure_ascii=False, indent=2)
        print(f"💾 Caché guardado: {len(translation_cache)} traducciones")
    except Exception as e:
        print(f"⚠️ Error guardando caché: {e}")

def get_text_hash(text):
    """Genera un hash único para un texto"""
    return hashlib.md5(text.encode('utf-8')).hexdigest()

def translate_text(text, source_lang="ES", target_lang="EN-US"):
    """
    Traduce un texto usando DeepL con sistema de caché.
    Si el texto ya fue traducido antes, usa la traducción guardada.
    """
    if not DEEPL_AVAILABLE or not text or text.strip() == "":
        return text

    # Generar hash del texto
    text_hash = get_text_hash(text)

    # Verificar si ya está en caché
    if text_hash in translation_cache:
        return translation_cache[text_hash]

    # Traducir con DeepL
    try:
        result = translator.translate_text(text, source_lang=source_lang, target_lang=target_lang)
        translated = result.text

        # Guardar en caché
        translation_cache[text_hash] = translated

        return translated
    except Exception as e:
        print(f"      ⚠️ Error traduciendo '{text[:50]}...': {e}")
        return text

# ============================================
# FUNCIONES AUXILIARES
# ============================================

def natural_sort_key(s):
    """
    Clave de ordenamiento natural para ordenar correctamente números en strings.
    Convierte '10_PROYECTO' para que se ordene después de '2_PROYECTO'
    """
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', s)]

def translate_info_json(info_path):
    """
    Lee un info.json, lo traduce y crea un info_en.json
    Retorna ambos: datos en español y datos en inglés

    Soporta dos formatos:
    1. Formato personalizado con Tit:, Sub:, Des:, Prog:, Link_N:, Rela:
    2. Formato JSON estándar
    """
    if not os.path.exists(info_path):
        return None, None

    try:
        with open(info_path, 'r', encoding='utf-8') as f:
            info_content = f.read().strip()

        project_title = ""
        project_subtitle = ""
        project_description = ""
        project_links = []
        project_programs = []
        project_related = []
        project_active = True  # Por defecto, todos los proyectos están activos

        # Intentar detectar el formato
        is_custom_format = info_content.startswith('Tit:')

        if is_custom_format:
            # FORMATO PERSONALIZADO (Tit:, Sub:, Des:, etc.)
            lines = info_content.split('\n')
            current_field = None
            desc_lines = []

            for line in lines:
                line_stripped = line.strip()

                if line_stripped.startswith('Tit:'):
                    project_title = line_stripped[4:].strip()
                    current_field = None

                elif line_stripped.startswith('Sub:'):
                    project_subtitle = line_stripped[4:].strip()
                    current_field = None

                elif line_stripped.startswith('Des:'):
                    desc_lines = [line_stripped[4:].strip()]
                    current_field = 'description'

                elif line_stripped.startswith('Prog:'):
                    prog_content = line_stripped[5:].strip()
                    # Parsear lista separada por comas
                    project_programs = [p.strip() for p in prog_content.split(',') if p.strip()]
                    current_field = None

                elif line_stripped.startswith('Link_'):
                    # Formato: Link_1:("Texto","URL","icono.png")
                    match = re.search(r'Link_\d+:\("([^"]+)","([^"]+)","([^"]+)"\)', line_stripped)
                    if match:
                        link_text, link_url, link_icon = match.groups()
                        project_links.append({
                            "text": link_text,
                            "url": link_url,
                            "icon": link_icon
                        })
                    current_field = None

                elif line_stripped.startswith('Rela:'):
                    # Formato 1: Rela:("Texto","NOMBRE_CARPETA")
                    # Formato 2: Rela:("Texto","NOMBRE_CARPETA","icono.png")  ← ORDEN CORRECTO
                    # Formato 3: Rela:("Texto","icono.png","seccion","cat_idx","proj_idx")
                    match1 = re.search(r'Rela:\("([^"]+)","([^"]+)"\)', line_stripped)
                    match2 = re.search(r'Rela:\("([^"]+)","([^"]+)","([^"]+)"\)', line_stripped)
                    match3 = re.search(r'Rela:\("([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)"\)', line_stripped)

                    if match3:
                        # Formato completo con todos los datos (5 parámetros)
                        text, icon, section, cat_idx, proj_idx = match3.groups()
                        project_related.append({
                            "text": text,
                            "icon": icon,
                            "section": section,
                            "category_index": int(cat_idx),
                            "project_index": int(proj_idx)
                        })
                    elif match2:
                        # Formato intermedio: texto + carpeta + icono (3 parámetros)
                        text, folder_name, icon = match2.groups()  # ← ORDEN CAMBIADO
                        project_related.append({
                            "text": text,
                            "icon": icon,
                            "folder_name": folder_name  # Se resolverá después
                        })
                    elif match1:
                        # Formato simple: solo texto y nombre de carpeta (2 parámetros)
                        text, folder_name = match1.groups()
                        project_related.append({
                            "text": text,
                            "folder_name": folder_name  # Se resolverá después
                        })
                    current_field = None

                elif line_stripped.startswith('Active:'):
                    # Formato: Active:false o Active:true
                    active_value = line_stripped[7:].strip().lower()
                    project_active = active_value != "false"
                    current_field = None

                elif current_field == 'description' and line_stripped:
                    # Continuar agregando líneas a la descripción
                    desc_lines.append(line_stripped)

                elif not line_stripped and current_field == 'description':
                    # Línea vacía en descripción se convierte en salto de párrafo (solo uno)
                    desc_lines.append('')  # Línea vacía, el join agregará \n

            # Unir descripción
            project_description = '\n'.join(desc_lines).strip()

        else:
            # FORMATO JSON ESTÁNDAR
            try:
                data = json.loads(info_content)
                project_title = data.get("title", "")
                project_subtitle = data.get("subtitle", "")
                project_description = data.get("description", "")
                project_links = data.get("links", [])
                project_programs = data.get("programs", [])
                project_related = data.get("related", [])
                project_active = data.get("active", True)  # Por defecto true si no existe
            except json.JSONDecodeError:
                print(f"      ⚠️ Formato no reconocido en {info_path}")
                return None, None

        # Datos en español
        info_es = {
            "title": project_title,
            "subtitle": project_subtitle,
            "description": project_description,
            "links": project_links,
            "programs": project_programs,
            "related": project_related,
            "active": project_active
        }

        # Traducir a inglés si DeepL está disponible
        if DEEPL_AVAILABLE:
            # Traducir links (solo el texto, no URL ni icono)
            translated_links = []
            for link in project_links:
                if isinstance(link, dict):
                    translated_links.append({
                        "text": translate_text(link["text"]),
                        "url": link["url"],
                        "icon": link["icon"]
                    })
                else:
                    translated_links.append(link)

            info_en = {
                "title": translate_text(project_title),
                "subtitle": translate_text(project_subtitle),
                "description": translate_text(project_description),
                "links": translated_links,
                "programs": project_programs,  # Los nombres de programas no se traducen
                "related": project_related,  # Los nombres relacionados no se traducen
                "active": project_active  # El estado activo no se traduce
            }

            # Guardar info_en.json
            info_en_path = info_path.replace('info.json', 'info_en.json')
            with open(info_en_path, 'w', encoding='utf-8') as f:
                json.dump(info_en, f, ensure_ascii=False, indent=2)
        else:
            info_en = info_es

        return info_es, info_en

    except Exception as e:
        print(f"      ⚠️ Error procesando {info_path}: {e}")
        import traceback
        traceback.print_exc()
        return None, None

def translate_titulo_json(titulo_path):
    """
    Lee un titulo.json, lo traduce y crea un titulo_en.json
    Retorna el título en español y en inglés
    """
    if not os.path.exists(titulo_path):
        return None, None

    try:
        with open(titulo_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()

        # Intentar parsear como JSON
        try:
            titulo_data = json.loads(content)
            if isinstance(titulo_data, dict):
                titulo_es = (titulo_data.get("titulo") or
                           titulo_data.get("title") or
                           titulo_data.get("nombre") or
                           titulo_data.get("name") or
                           "")
            elif isinstance(titulo_data, str):
                titulo_es = titulo_data
            else:
                titulo_es = content
        except json.JSONDecodeError:
            titulo_es = content

        # Traducir
        if DEEPL_AVAILABLE and titulo_es:
            titulo_en = translate_text(titulo_es)

            # Guardar titulo_en.json
            titulo_en_path = titulo_path.replace('titulo.json', 'titulo_en.json')
            with open(titulo_en_path, 'w', encoding='utf-8') as f:
                json.dump({"title": titulo_en}, f, ensure_ascii=False, indent=2)
        else:
            titulo_en = titulo_es

        return titulo_es, titulo_en

    except Exception as e:
        print(f"      ⚠️ Error procesando {titulo_path}: {e}")
        return None, None

# ============================================
# FUNCIÓN PARA RESOLVER PROYECTOS RELACIONADOS
# ============================================

def resolve_related_projects(portfolio_data_es, portfolio_data_en):
    """
    Resuelve los proyectos relacionados que tienen solo 'folder_name'
    y les asigna section, category_index y project_index correctos.
    """
    print("\n🔗 Resolviendo proyectos relacionados...")

    # Crear un mapa de carpetas a índices
    folder_to_indices = {}

    for section_key, section_data in portfolio_data_es.items():
        if section_key == "todo":
            continue

        for cat_idx, category in enumerate(section_data["categories"]):
            for proj_idx, project in enumerate(category["images"]):
                # Extraer nombre de carpeta del src
                src = project.get("src", "")
                folder_match = re.search(r'/([^/]+)/portada\.(jpg|png)$', src)
                if folder_match:
                    folder_name = folder_match.group(1)
                    # Quitar el número inicial de la carpeta
                    folder_without_number = re.sub(r'^\d+_', '', folder_name)

                    folder_to_indices[folder_without_number.upper()] = {
                        "section": section_key,
                        "category_index": cat_idx,
                        "project_index": proj_idx,
                        "title": project.get("title", folder_name)
                    }

    resolved_count = 0
    unresolved = []

    # Recorrer todos los proyectos y resolver los relacionados
    for section_key, section_data in portfolio_data_es.items():
        if section_key == "todo":
            continue

        for cat_idx, category in enumerate(section_data["categories"]):
            for proj_idx, project in enumerate(category["images"]):
                related = project.get("related", [])

                if not related:
                    continue

                new_related = []

                for rel in related:
                    if isinstance(rel, dict) and "folder_name" in rel:
                        # Necesita resolverse
                        folder_name = rel["folder_name"]
                        folder_upper = folder_name.upper()

                        # Buscar en el mapa
                        if folder_upper in folder_to_indices:
                            indices = folder_to_indices[folder_upper]
                            # Preservar el icono si el usuario lo especificó, sino usar relacionado.png
                            icon = rel.get("icon", "relacionado.png")
                            new_related.append({
                                "text": rel.get("text", indices["title"]),
                                "icon": icon,
                                "section": indices["section"],
                                "category_index": indices["category_index"],
                                "project_index": indices["project_index"]
                            })
                            resolved_count += 1
                            print(f"  ✅ '{rel.get('text')}' → {indices['section']}/{indices['category_index']}/{indices['project_index']} [icono: {icon}]")
                        else:
                            unresolved.append(f"{project.get('title')} → {folder_name}")
                            print(f"  ⚠️ No encontrado: '{folder_name}' en proyecto '{project.get('title')}'")
                    else:
                        # Ya está completo
                        new_related.append(rel)

                # Actualizar el proyecto con los relacionados resueltos
                project["related"] = new_related

                # También actualizar en portfolio_data_en
                if section_key in portfolio_data_en:
                    en_category = portfolio_data_en[section_key]["categories"][cat_idx]
                    en_project = en_category["images"][proj_idx]
                    en_project["related"] = new_related

    print(f"\n📊 Resumen de proyectos relacionados:")
    print(f"  ✅ Resueltos: {resolved_count}")
    print(f"  ⚠️ No resueltos: {len(unresolved)}")

    if unresolved:
        print("\n⚠️ Proyectos relacionados no encontrados:")
        for item in unresolved:
            print(f"    • {item}")

# ============================================
# FUNCIÓN PRINCIPAL
# ============================================

def generate_portfolio_data():
    """
    Escanea la estructura de carpetas en 'proyectos/' y genera un JSON
    con toda la información del portfolio en ESPAÑOL e INGLÉS,
    incluyendo títulos, subtítulos, imágenes y videos (MP4 y YouTube).
    """

    # Cargar caché de traducciones
    if DEEPL_AVAILABLE:
        load_translation_cache()

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
    section_names_es = {
        "arte": "ARTE",
        "programacion": "PROGRAMACIÓN",
        "diseño": "DISEÑO",
        "produccion": "PRODUCCIÓN",
        "comunicacion": "COMUNICACIÓN"
    }

    section_names_en = {
        "arte": "ART",
        "programacion": "PROGRAMMING",
        "diseño": "DESIGN",
        "produccion": "PRODUCTION",
        "comunicacion": "COMMUNICATION"
    }

    portfolio_data_es = {}
    portfolio_data_en = {}

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
            portfolio_data_es[section_key] = {
                "name": section_names_es[section_key],
                "categories": []
            }
            portfolio_data_en[section_key] = {
                "name": section_names_en[section_key],
                "categories": []
            }
            continue

        categories_es = []
        categories_en = []

        # Obtener todas las carpetas de categorías y ordenarlas NATURALMENTE
        category_folders = [f for f in os.listdir(section_path)
                          if os.path.isdir(os.path.join(section_path, f))]
        category_folders.sort(key=natural_sort_key)

        print(f"\n📂 Procesando sección: {section_folder}")

        for category_folder in category_folders:
            category_path = os.path.join(section_path, category_folder)

            # Leer el archivo titulo.json y traducirlo
            titulo_path = os.path.join(category_path, "titulo.json")
            category_title_es, category_title_en = translate_titulo_json(titulo_path)

            if not category_title_es:
                category_title_es = category_folder
                category_title_en = category_folder

            print(f"  📄 Título: '{category_title_es}' / '{category_title_en}'")

            # Obtener todas las carpetas de proyectos
            project_folders = [f for f in os.listdir(category_path)
                             if os.path.isdir(os.path.join(category_path, f))]
            project_folders.sort(key=natural_sort_key)

            # Generar rutas a las portadas y leer info.json
            images_es = []
            images_en = []

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

                # Leer y traducir info.json
                info_path = os.path.join(project_path, "info.json")
                info_es, info_en = translate_info_json(info_path)

                if not info_es:
                    info_es = {
                        "title": project_folder,
                        "subtitle": "",
                        "description": "",
                        "links": [],
                        "programs": [],
                        "related": [],
                        "active": True
                    }
                    info_en = info_es

                # Verificar si el proyecto está activo
                if not info_es.get("active", True):
                    print(f"    ⏭️  Saltado (inactivo): {info_es['title']}")
                    continue

                print(f"    ✅ {info_es['title']} / {info_en['title']}")

                # Buscar imágenes y videos adicionales
                additional_images = []
                img_number = 1

                while True:
                    img_path = os.path.join(project_path, f"{img_number}.png")
                    img_jpg = os.path.join(project_path, f"{img_number}.jpg")
                    video_mp4 = os.path.join(project_path, f"{img_number}.mp4")
                    video_json = os.path.join(project_path, f"{img_number}.json")

                    if os.path.exists(img_path):
                        additional_images.append({
                            "type": "image",
                            "src": f"{section_path}/{category_folder}/{project_folder}/{img_number}.png"
                        })
                        img_number += 1
                    elif os.path.exists(img_jpg):
                        additional_images.append({
                            "type": "image",
                            "src": f"{section_path}/{category_folder}/{project_folder}/{img_number}.jpg"
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

                # Agregar imagen con toda su información (ESPAÑOL)
                images_es.append({
                    "src": portada_relative,
                    "title": info_es["title"],
                    "subtitle": info_es["subtitle"],
                    "description": info_es["description"],
                    "links": info_es["links"],
                    "programs": info_es["programs"],
                    "related": info_es["related"],
                    "images": additional_images
                })

                # Agregar imagen con toda su información (INGLÉS)
                images_en.append({
                    "src": portada_relative,
                    "title": info_en["title"],
                    "subtitle": info_en["subtitle"],
                    "description": info_en["description"],
                    "links": info_en["links"],
                    "programs": info_en["programs"],
                    "related": info_en["related"],
                    "images": additional_images
                })

            print(f"  ✅ {category_title_es}: {len(images_es)} proyectos")

            categories_es.append({
                "title": category_title_es,
                "images": images_es
            })

            categories_en.append({
                "title": category_title_en,
                "images": images_en
            })

        portfolio_data_es[section_key] = {
            "name": section_names_es[section_key],
            "categories": categories_es
        }

        portfolio_data_en[section_key] = {
            "name": section_names_en[section_key],
            "categories": categories_en
        }


    # Procesar sección TODO de manera especial
    print(f"\n📂 Procesando sección especial: TODO")
    todo_json_path = os.path.join(base_path, "TODO", "todo.json")
    todo_projects = []

    if os.path.exists(todo_json_path):
        try:
            with open(todo_json_path, 'r', encoding='utf-8') as f:
                todo_list = json.load(f)
                print(f"  📄 Encontrado todo.json con {len(todo_list)} proyectos")

                # Para cada nombre de proyecto en la lista
                for project_name_input in todo_list:
                    # Buscar el proyecto en todas las secciones
                    found = False
                    for section_folder, section_key in section_map.items():
                        if found:
                            break
                        section_path = os.path.join(base_path, section_folder)
                        if not os.path.exists(section_path):
                            continue

                        category_folders = [f for f in os.listdir(section_path)
                                          if os.path.isdir(os.path.join(section_path, f))]

                        for category_folder in category_folders:
                            if found:
                                break
                            category_path = os.path.join(section_path, category_folder)
                            project_folders = [f for f in os.listdir(category_path)
                                             if os.path.isdir(os.path.join(category_path, f))]

                            for project_folder in project_folders:
                                # Extraer nombre sin el número inicial
                                folder_without_number = re.sub(r'^\d+_', '', project_folder)
                                input_without_number = re.sub(r'^\d+_', '', project_name_input)

                                if folder_without_number.upper() == input_without_number.upper():
                                    # Encontrado! Obtener la información del proyecto
                                    project_path = os.path.join(category_path, project_folder)

                                    # Buscar portada
                                    portada_jpg = os.path.join(project_path, "portada.jpg")
                                    portada_png = os.path.join(project_path, "portada.png")

                                    portada_relative = None
                                    if os.path.exists(portada_jpg):
                                        portada_relative = f"{section_path}/{category_folder}/{project_folder}/portada.jpg"
                                    elif os.path.exists(portada_png):
                                        portada_relative = f"{section_path}/{category_folder}/{project_folder}/portada.png"

                                    if portada_relative:
                                        # Obtener índices para navegación
                                        if project_folder in project_map:
                                            proj_info = project_map[project_folder]

                                            # Leer info.json (ya traducido)
                                            info_path = os.path.join(project_path, "info.json")
                                            info_es, info_en = translate_info_json(info_path)

                                            if not info_es:
                                                info_es = {"title": project_folder, "subtitle": "", "active": True}
                                                info_en = info_es

                                            # Verificar si el proyecto está activo
                                            if not info_es.get("active", True):
                                                print(f"    ⏭️  Saltado (inactivo): {info_es['title']} ({section_key})")
                                                found = True
                                                break

                                            todo_projects.append({
                                                "src": portada_relative,
                                                "title": info_es["title"],
                                                "subtitle": info_es["subtitle"],
                                                "section": proj_info['section'],
                                                "category_index": proj_info['category_index'],
                                                "project_index": proj_info['project_index']
                                            })

                                            print(f"    ✅ Agregado: {info_es['title']} ({section_key})")
                                            found = True
                                            break

                    if not found:
                        print(f"    ⚠️ No encontrado: {project_name_input}")

        except Exception as e:
            print(f"  ⚠️ Error procesando todo.json: {e}")
    else:
        print(f"  ⚠️ No se encontró {todo_json_path}")

    portfolio_data_es["todo"] = {
        "name": "TODO",
        "projects": todo_projects
    }

    portfolio_data_en["todo"] = {
        "name": "TODO",
        "projects": todo_projects
    }

    print(f"  ✅ TODO: {len(todo_projects)} proyectos seleccionados")

    # NUEVO: Resolver proyectos relacionados automáticamente
    resolve_related_projects(portfolio_data_es, portfolio_data_en)

    # Guardar los JSON (español e inglés)
    output_file_es = "portfolio-data.json"
    output_file_en = "portfolio-data_en.json"

    with open(output_file_es, 'w', encoding='utf-8') as f:
        json.dump(portfolio_data_es, f, ensure_ascii=False, indent=2)

    with open(output_file_en, 'w', encoding='utf-8') as f:
        json.dump(portfolio_data_en, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Archivos generados exitosamente:")
    print(f"   📄 {output_file_es} (Español)")
    print(f"   📄 {output_file_en} (Inglés)")
    print(f"📊 Total de secciones procesadas: {len(portfolio_data_es) - 1}")  # -1 por TODO

    # Guardar caché de traducciones
    if DEEPL_AVAILABLE:
        save_translation_cache()

    # Mostrar resumen
    print("\n📋 RESUMEN:")
    for key, data in portfolio_data_es.items():
        if key == "todo":
            print(f"  • {data['name']}: {len(data['projects'])} proyectos seleccionados")
        else:
            total_images = sum(len(cat["images"]) for cat in data["categories"])
            print(f"  • {data['name']}: {len(data['categories'])} categorías, {total_images} proyectos")

def translate_curriculum_files():
    """
    Traduce todos los archivos JSON de la carpeta curriculum
    """
    curriculum_files = [
        'desarrollo_web.json',
        'diseno_grafico.json',
        'edicion_video.json',
        'ilustracion.json',
        'modelado_3d.json',
        'videojuegos.json'
    ]

    curriculum_path = 'curriculum'

    if not os.path.exists(curriculum_path):
        print(f"⚠️ No se encontró la carpeta {curriculum_path}")
        return

    print(f"\n📂 Procesando archivos de curriculum...")
    translated_count = 0

    for filename in curriculum_files:
        filepath = os.path.join(curriculum_path, filename)

        if not os.path.exists(filepath):
            print(f"  ⚠️ No encontrado: {filename}")
            continue

        try:
            print(f"\n  📄 {filename}")

            # Leer archivo original
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Traducir
            title_es = data.get("title", "")
            description_es = data.get("description", "")

            print(f"     Traduciendo título...")
            title_en = translate_text(title_es)

            print(f"     Traduciendo descripción ({len(description_es)} caracteres)...")
            description_en = translate_text(description_es)

            # Crear estructura traducida
            data_en = {
                "title": title_en,
                "description": description_en
            }

            # Guardar versión en inglés
            filepath_en = filepath.replace('.json', '_en.json')
            with open(filepath_en, 'w', encoding='utf-8') as f:
                json.dump(data_en, f, ensure_ascii=False, indent=2)

            print(f"     ✅ Creado: {os.path.basename(filepath_en)}")
            print(f"        ES: {title_es[:50]}{'...' if len(title_es) > 50 else ''}")
            print(f"        EN: {title_en[:50]}{'...' if len(title_en) > 50 else ''}")

            translated_count += 1

        except Exception as e:
            print(f"     ❌ Error procesando {filename}: {e}")

    print(f"\n✅ Curriculum traducido: {translated_count}/{len(curriculum_files)} archivos")

    # Guardar caché después de traducir curriculum
    if DEEPL_AVAILABLE:
        save_translation_cache()

if __name__ == "__main__":
    print("🚀 Generando portfolio-data.json con traducción automática...\n")
    try:
        generate_portfolio_data()

        # NUEVO: Traducir archivos de curriculum
        if DEEPL_AVAILABLE:
            print("\n" + "="*60)
            print("🌍 TRADUCIENDO ARCHIVOS DE CURRICULUM")
            print("="*60)
            translate_curriculum_files()
        else:
            print("\n⚠️ Traducción de curriculum omitida (DeepL no disponible)")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
