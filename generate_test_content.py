import os
import shutil
from PIL import Image, ImageDraw, ImageFont

def generate_test_content():
    """
    Genera contenido de prueba para todos los proyectos:
    - Crea imágenes 1.jpg, 2.jpg, 3.jpg (copia de portada con número)
    - Amplía info.json con Links y Descripción
    """

    base_path = "proyectos"

    section_folders = ["ARTE", "PROGRAMACION", "DISENO", "PRODUCCION", "COMUNICACION"]

    print("🚀 Generando contenido de prueba para proyectos...\n")

    total_projects = 0

    for section_folder in section_folders:
        section_path = os.path.join(base_path, section_folder)

        if not os.path.exists(section_path):
            continue

        # Obtener todas las carpetas de categorías
        category_folders = [f for f in os.listdir(section_path)
                          if os.path.isdir(os.path.join(section_path, f))]

        for category_folder in category_folders:
            category_path = os.path.join(section_path, category_folder)

            # Obtener todas las carpetas de proyectos
            project_folders = [f for f in os.listdir(category_path)
                             if os.path.isdir(os.path.join(category_path, f))]

            for project_folder in project_folders:
                project_path = os.path.join(category_path, project_folder)

                print(f"📁 Procesando: {section_folder}/{category_folder}/{project_folder}")

                # 1. Buscar portada
                portada_jpg = os.path.join(project_path, "portada.jpg")
                portada_png = os.path.join(project_path, "portada.png")

                portada_src = None
                if os.path.exists(portada_jpg):
                    portada_src = portada_jpg
                elif os.path.exists(portada_png):
                    portada_src = portada_png

                if not portada_src:
                    print(f"  ⚠️  No se encontró portada, saltando...")
                    continue

                # 2. Crear imágenes 1.jpg, 2.jpg, 3.jpg
                try:
                    portada_img = Image.open(portada_src)

                    for i in range(1, 4):
                        # Copiar imagen
                        img_copy = portada_img.copy()
                        draw = ImageDraw.Draw(img_copy)

                        # Obtener tamaño
                        width, height = img_copy.size

                        # Intentar cargar fuente grande, si no usar la default
                        try:
                            font_size = int(height * 0.3)  # 30% de la altura
                            font = ImageFont.truetype("arial.ttf", font_size)
                        except:
                            font = ImageFont.load_default()

                        # Dibujar número con fondo semi-transparente
                        text = str(i)

                        # Calcular posición centrada
                        bbox = draw.textbbox((0, 0), text, font=font)
                        text_width = bbox[2] - bbox[0]
                        text_height = bbox[3] - bbox[1]

                        x = (width - text_width) / 2
                        y = (height - text_height) / 2

                        # Fondo negro semi-transparente
                        padding = 40
                        overlay = Image.new('RGBA', img_copy.size, (0, 0, 0, 0))
                        overlay_draw = ImageDraw.Draw(overlay)
                        overlay_draw.rectangle(
                            [x - padding, y - padding, x + text_width + padding, y + text_height + padding],
                            fill=(0, 0, 0, 180)
                        )

                        # Combinar
                        img_copy = img_copy.convert('RGBA')
                        img_copy = Image.alpha_composite(img_copy, overlay)
                        img_copy = img_copy.convert('RGB')

                        # Dibujar texto
                        draw = ImageDraw.Draw(img_copy)
                        draw.text((x, y), text, fill=(255, 255, 255), font=font)

                        # Guardar
                        output_path = os.path.join(project_path, f"{i}.jpg")
                        img_copy.save(output_path, 'JPEG', quality=85)

                    print(f"  ✅ Imágenes 1.jpg, 2.jpg, 3.jpg creadas")

                except Exception as e:
                    print(f"  ❌ Error creando imágenes: {e}")

                # 3. Ampliar info.json
                info_path = os.path.join(project_path, "info.json")

                # Leer título y subtítulo existentes
                project_title = project_folder
                project_subtitle = "Proyecto de ejemplo"

                if os.path.exists(info_path):
                    try:
                        with open(info_path, 'r', encoding='utf-8') as f:
                            content = f.read().strip()
                            lines = content.split('\n')
                            for line in lines:
                                line = line.strip()
                                if line.startswith('Tit:'):
                                    project_title = line[4:].strip()
                                elif line.startswith('Sub:'):
                                    project_subtitle = line[4:].strip()
                    except Exception as e:
                        print(f"  ⚠️  Error leyendo info.json: {e}")

                # Crear nuevo contenido ampliado
                new_info_content = f"""Tit:{project_title}
Sub:{project_subtitle}
Link_1:("Ver Proyecto","https://ejemplo.com/proyecto","link.png")
Link_2:("Video Demo","https://www.youtube.com/watch?v=ejemplo","youtube.png")
Link_3:("Descargar","https://ejemplo.com/descarga","download.png")
Des:Este es un proyecto de ejemplo que demuestra las capacidades técnicas y creativas aplicadas. El proyecto incluye múltiples aspectos como diseño, desarrollo, animación y producción. Se utilizaron diversas herramientas profesionales para lograr un resultado de alta calidad que cumple con los estándares de la industria."""

                try:
                    with open(info_path, 'w', encoding='utf-8') as f:
                        f.write(new_info_content)
                    print(f"  ✅ info.json ampliado")
                except Exception as e:
                    print(f"  ❌ Error escribiendo info.json: {e}")

                total_projects += 1

    print(f"\n{'='*60}")
    print(f"✅ Proceso completado!")
    print(f"📊 Total de proyectos procesados: {total_projects}")
    print(f"{'='*60}")
    print("\n⚠️  IMPORTANTE:")
    print("   - Se han creado imágenes 1.jpg, 2.jpg, 3.jpg en cada proyecto")
    print("   - Se han ampliado todos los info.json con Links y Descripción")
    print("   - Ahora ejecuta generate_portfolio.py para actualizar el JSON")

if __name__ == "__main__":
    print("Verificando dependencias...\n")
    try:
        from PIL import Image, ImageDraw, ImageFont
        generate_test_content()
    except ImportError:
        print("❌ Error: Necesitas instalar Pillow")
        print("\nEjecuta en terminal:")
        print("   pip install Pillow")
        print("\nLuego vuelve a ejecutar este script.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

    input("\n✅ Presiona ENTER para cerrar...")

    section_folders = ["ARTE", "PROGRAMACION", "DISENO", "PRODUCCION", "COMUNICACION"]

    print("🚀 Generando contenido de prueba para proyectos...\n")

    total_projects = 0

    for section_folder in section_folders:
        section_path = os.path.join(base_path, section_folder)

        if not os.path.exists(section_path):
            continue

        # Obtener todas las carpetas de categorías
        category_folders = [f for f in os.listdir(section_path)
                          if os.path.isdir(os.path.join(section_path, f))]

        for category_folder in category_folders:
            category_path = os.path.join(section_path, category_folder)

            # Obtener todas las carpetas de proyectos
            project_folders = [f for f in os.listdir(category_path)
                             if os.path.isdir(os.path.join(category_path, f))]

            for project_folder in project_folders:
                project_path = os.path.join(category_path, project_folder)

                print(f"📁 Procesando: {section_folder}/{category_folder}/{project_folder}")

                # 1. Buscar portada
                portada_jpg = os.path.join(project_path, "portada.jpg")
                portada_png = os.path.join(project_path, "portada.png")

                portada_src = None
                if os.path.exists(portada_jpg):
                    portada_src = portada_jpg
                elif os.path.exists(portada_png):
                    portada_src = portada_png

                if not portada_src:
                    print(f"  ⚠️  No se encontró portada, saltando...")
                    continue

                # 2. Crear imágenes 1.jpg, 2.jpg, 3.jpg
                try:
                    portada_img = Image.open(portada_src)

                    for i in range(1, 4):
                        # Copiar imagen
                        img_copy = portada_img.copy()
                        draw = ImageDraw.Draw(img_copy)

                        # Obtener tamaño
                        width, height = img_copy.size

                        # Intentar cargar fuente grande, si no usar la default
                        try:
                            font_size = int(height * 0.3)  # 30% de la altura
                            font = ImageFont.truetype("arial.ttf", font_size)
                        except:
                            font = ImageFont.load_default()

                        # Dibujar número con fondo semi-transparente
                        text = str(i)

                        # Calcular posición centrada
                        bbox = draw.textbbox((0, 0), text, font=font)
                        text_width = bbox[2] - bbox[0]
                        text_height = bbox[3] - bbox[1]

                        x = (width - text_width) / 2
                        y = (height - text_height) / 2

                        # Fondo negro semi-transparente
                        padding = 40
                        overlay = Image.new('RGBA', img_copy.size, (0, 0, 0, 0))
                        overlay_draw = ImageDraw.Draw(overlay)
                        overlay_draw.rectangle(
                            [x - padding, y - padding, x + text_width + padding, y + text_height + padding],
                            fill=(0, 0, 0, 180)
                        )

                        # Combinar
                        img_copy = img_copy.convert('RGBA')
                        img_copy = Image.alpha_composite(img_copy, overlay)
                        img_copy = img_copy.convert('RGB')

                        # Dibujar texto
                        draw = ImageDraw.Draw(img_copy)
                        draw.text((x, y), text, fill=(255, 255, 255), font=font)

                        # Guardar
                        output_path = os.path.join(project_path, f"{i}.jpg")
                        img_copy.save(output_path, 'JPEG', quality=85)

                    print(f"  ✅ Imágenes 1.jpg, 2.jpg, 3.jpg creadas")

                except Exception as e:
                    print(f"  ❌ Error creando imágenes: {e}")

                # 3. Ampliar info.json
                info_path = os.path.join(project_path, "info.json")

                # Leer título y subtítulo existentes
                project_title = project_folder
                project_subtitle = "Proyecto de ejemplo"

                if os.path.exists(info_path):
                    try:
                        with open(info_path, 'r', encoding='utf-8') as f:
                            content = f.read().strip()
                            lines = content.split('\n')
                            for line in lines:
                                line = line.strip()
                                if line.startswith('Tit:'):
                                    project_title = line[4:].strip()
                                elif line.startswith('Sub:'):
                                    project_subtitle = line[4:].strip()
                    except Exception as e:
                        print(f"  ⚠️  Error leyendo info.json: {e}")

                # Crear nuevo contenido ampliado
                new_info_content = f"""Tit:{project_title}
Sub:{project_subtitle}
Link_1:("Ver Proyecto","https://ejemplo.com/proyecto","link.png")
Link_2:("Video Demo","https://www.youtube.com/watch?v=ejemplo","youtube.png")
Link_3:("Descargar","https://ejemplo.com/descarga","download.png")
Des:Este es un proyecto de ejemplo que demuestra las capacidades técnicas y creativas aplicadas. El proyecto incluye múltiples aspectos como diseño, desarrollo, animación y producción. Se utilizaron diversas herramientas profesionales para lograr un resultado de alta calidad que cumple con los estándares de la industria."""

                try:
                    with open(info_path, 'w', encoding='utf-8') as f:
                        f.write(new_info_content)
                    print(f"  ✅ info.json ampliado")
                except Exception as e:
                    print(f"  ❌ Error escribiendo info.json: {e}")

                total_projects += 1

    # 4. Crear carpeta de iconos de ejemplo (solo una vez en la raíz)
    if not icons_created:
        icons_path = os.path.join("images", "icons")
        os.makedirs(icons_path, exist_ok=True)

        # Crear iconos de ejemplo simples
        icon_names = ["link.png", "youtube.png", "download.png", "itchio.png", "github.png"]

        for icon_name in icon_names:
            icon_path = os.path.join(icons_path, icon_name)

            # Crear icono simple de 64x64
            icon_img = Image.new('RGB', (64, 64), color=(100, 100, 100))
            draw = ImageDraw.Draw(icon_img)

            # Dibujar borde
            draw.rectangle([2, 2, 61, 61], outline=(200, 200, 200), width=2)

            # Texto (primera letra del nombre)
            text = icon_name[0].upper()
            try:
                font = ImageFont.truetype("arial.ttf", 32)
            except:
                font = ImageFont.load_default()

            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            x = (64 - text_width) / 2
            y = (64 - text_height) / 2

            draw.text((x, y), text, fill=(255, 255, 255), font=font)

            icon_img.save(icon_path, 'PNG')

        print(f"\n✅ Carpeta de iconos creada en: {icons_path}")
        icons_created = True

    print(f"\n{'='*60}")
    print(f"✅ Proceso completado!")
    print(f"📊 Total de proyectos procesados: {total_projects}")
    print(f"{'='*60}")
    print("\n⚠️  IMPORTANTE:")
    print("   - Se han creado imágenes 1.jpg, 2.jpg, 3.jpg en cada proyecto")
    print("   - Se han ampliado todos los info.json con Links y Descripción")
    print("   - Se han creado iconos de ejemplo en images/icons/")
    print("   - Ahora ejecuta generate_portfolio.py para actualizar el JSON")

if __name__ == "__main__":
    print("Verificando dependencias...\n")
    try:
        from PIL import Image, ImageDraw, ImageFont
        generate_test_content()
    except ImportError:
        print("❌ Error: Necesitas instalar Pillow")
        print("\nEjecuta en terminal:")
        print("   pip install Pillow")
        print("\nLuego vuelve a ejecutar este script.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

    input("\n✅ Presiona ENTER para cerrar...")
