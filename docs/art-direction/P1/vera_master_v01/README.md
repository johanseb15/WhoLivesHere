# Vera Master v0.1

Primera iteración procedural de un personaje 3D chibi editable. Se generó con Blender 5.2.2 LTS y EEVEE. El `.blend` contiene geometría, materiales, cámaras e iluminación creados por el script; no usa modelos, texturas ni dependencias externas.

## Archivos

- `Vera_Master_v01.blend`: escena editable, organizada en colecciones de cuerpo/rostro, cabello, vestuario y detalles.
- `generate_vera_master_v01.py`: fuente reproducible. Ejecutar desde el repositorio con:

  ```powershell
  & 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python 'docs/art-direction/P1/vera_master_v01/generate_vera_master_v01.py'
  ```

- `vera_front_transparent.png`: render frontal de cuerpo entero con alfa real.
- `vera_side_transparent.png`, `vera_back_transparent.png`: vistas lateral y posterior, también con alfa.
- `render_report.json`: medidas, motor, resolución, muestras y tiempos de la última generación.

## Medidas y render

- Resolución de salida: 900×1200 px, PNG RGBA, 24 muestras EEVEE.
- Límites de la figura con accesorios: ancho 1,803 u, profundidad 0,949 u, altura 3,210 u.
- Unidad de cabeza: cráneo de coronilla a mentón, sin contar el peinado: 1,280 u. Proporción resultante: **2,508 cabezas** (objetivo 2,5; diferencia 0,3%).
- Última ejecución medida: frontal 19,13 s; lateral 1,95 s; posterior 2,04 s. El frontal incluye la compilación inicial de sombreadores; los tiempos dependen del equipo.
- El PNG frontal comprobó alfa 0 en la esquina y alfa 255 en el centro del personaje. No es un cuadriculado simulado.

## Revisión artística

Vera incluye rulos negro azulados, scrunchie amarillo con pictograma de bicicleta, marca celeste en la nariz, ojos grandes, delantal cobalto con textura procedural y muestras, cinturón de herramientas, pantalón oliva, guantes y zapatillas blancas salpicadas.

Este archivo es una **primera iteración para aprobación visual**, no un activo final aprobado. La geometría es deliberadamente editable y estilizada; el delantal, los rizos, la unión de extremidades y la pose pueden requerir refinamiento antes de producir una pose final de revelación o integrarla en el juego.
