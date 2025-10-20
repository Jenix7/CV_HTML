import subprocess
import pyperclip
import os

def tree_to_clipboard():
    """
    Ejecuta el comando 'tree /f /a' en el directorio actual
    y copia el resultado al portapapeles.
    """
    try:
        # Obtener el directorio actual
        current_dir = os.getcwd()
        print(f"Ejecutando tree en: {current_dir}")

        # Ejecutar el comando tree a través de cmd
        result = subprocess.run(
            ['cmd', '/c', 'tree', '/f', '/a'],
            capture_output=True,
            text=True,
            encoding='cp850',  # Codificación para Windows
            cwd=current_dir,
            shell=False
        )

        # Obtener la salida del comando
        tree_output = result.stdout

        if result.returncode == 0:
            # Copiar al portapapeles
            pyperclip.copy(tree_output)
            print("\n✓ Árbol de directorios copiado al portapapeles!")
            print("\nVista previa:")
            print("-" * 50)
            print(tree_output[:500])  # Mostrar primeros 500 caracteres
            if len(tree_output) > 500:
                print("...")
        else:
            print(f"Error al ejecutar tree: {result.stderr}")

    except FileNotFoundError:
        print("Error: El comando 'tree' no está disponible en tu sistema.")
        print("Asegúrate de estar en Windows o tener tree instalado.")
    except Exception as e:
        print(f"Error inesperado: {e}")

if __name__ == "__main__":
    tree_to_clipboard()
