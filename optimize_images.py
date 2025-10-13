import os
from PIL import Image

def optimize_images():
    """
    Optimiza todas las imágenes portada.png en la carpeta proyectos/
    - Redimensiona a 600px de ancho (mantiene ratio)
    - Comprime a calidad 85%
    - Convierte a JPG para menor peso
    """

    base_path = "proyectos"
    optimized_count = 0
    error_count = 0
    total_saved = 0

    print("🖼️  Optimizando imágenes del portfolio...\n")

    # Recorrer todas las carpetas
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.lower() == "portada.png" or file.lower() == "portada.jpg":
                file_path = os.path.join(root, file)

                try:
                    # Obtener tamaño original
                    original_size = os.path.getsize(file_path) / 1024  # KB

                    # Abrir imagen
                    img = Image.open(file_path)

                    # Convertir a RGB si es PNG con transparencia
                    if img.mode in ('RGBA', 'LA', 'P'):
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        if img.mode == 'P':
                            img = img.convert('RGBA')
                        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                        img = background

                    # Calcular nuevo tamaño manteniendo aspect ratio
                    target_width = 600
                    aspect_ratio = img.height / img.width
                    target_height = int(target_width * aspect_ratio)

                    # Solo redimensionar si es más grande
                    if img.width > target_width:
                        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
                        print(f"  📐 Redimensionado: {img.width}x{img.height}px")
                    else:
                        print(f"  ℹ️  Ya tiene buen tamaño: {img.width}x{img.height}px")

                    # Guardar como JPG optimizado
                    output_path = file_path.replace('.png', '.jpg').replace('.PNG', '.jpg')
                    img.save(output_path, 'JPEG', quality=85, optimize=True)

                    # Obtener nuevo tamaño
                    new_size = os.path.getsize(output_path) / 1024  # KB
                    saved = original_size - new_size
                    total_saved += saved

                    # Si era PNG, eliminar el original
                    if file_path.lower().endswith('.png') and output_path != file_path:
                        os.remove(file_path)

                    print(f"✅ {file_path}")
                    print(f"   {original_size:.1f}KB → {new_size:.1f}KB (ahorro: {saved:.1f}KB)")
                    print()

                    optimized_count += 1

                except Exception as e:
                    print(f"❌ Error en {file_path}: {e}\n")
                    error_count += 1

    # Resumen
    print("=" * 60)
    print(f"✅ Imágenes optimizadas: {optimized_count}")
    print(f"❌ Errores: {error_count}")
    print(f"💾 Espacio ahorrado total: {total_saved/1024:.2f} MB")
    print("=" * 60)

    if optimized_count > 0:
        print("\n⚠️  IMPORTANTE: Ahora ejecuta generate_portfolio.py")
        print("   para actualizar las rutas de .png a .jpg en el JSON")

if __name__ == "__main__":
    try:
        # Verificar que Pillow está instalado
        print("Verificando dependencias...\n")
        optimize_images()
    except ImportError:
        print("❌ Error: Necesitas instalar Pillow")
        print("\nEjecuta en terminal:")
        print("   pip install Pillow")
        print("\nLuego vuelve a ejecutar este script.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

    input("\n✓ Presiona ENTER para cerrar...")
