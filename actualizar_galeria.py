import os
import json

# Ruta a tu carpeta de imágenes
carpeta_galeria = 'images/galeria'

# Lee todos los archivos en la carpeta que sean imágenes
fotos = [f for f in os.listdir(carpeta_galeria) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif'))]

# Escribe la lista en un archivo JSON
with open('lista-fotos.json', 'w') as f:
    json.dump(fotos, f)

print(f"¡Listo! Se encontraron {len(fotos)} fotos y se guardaron en lista-fotos.json.")