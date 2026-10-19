# Vera Master v0.2 — revisión artística

Iteración procedural independiente creada con Blender 5.2.2 y EEVEE. No usa recursos externos. El script y la escena v0.1 se conservaron sin editar.

## Archivos

- `Vera_Master_v02.blend`: escena editable de revisión.
- `generate_vera_master_v02.py`: generador reproducible con Blender integrado.
- `vera_v02_bust_review.png`: busto RGBA, 900 × 900.
- `vera_v02_full_review.png`: cuerpo entero RGBA, 900 × 1200.
- `render_report_v02.json`: tiempos y datos de render.

Reproducir desde la raíz del repositorio:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python 'docs/art-direction/P1/vera_master_v02/generate_vera_master_v02.py'
```

## Comparación artística

La forma loft del rostro, las cuencas y párpados, y el panel drapeado del delantal mejoran la integración frente a las piezas de v0.1. Los rasgos identificatorios principales están presentes: scrunchie amarillo con pictograma, ojos grandes, marca cian en la nariz, delantal cobalto, abanico de muestras y zapatillas blancas con manchas.

**Resultado: NO-GO para integración y para considerar el modelo una mejora artística suficiente.** La silueta de cabello continúa leyéndose como una capucha lisa con tubos de pelo; los rizos de la lámina original no están resueltos. Hombros, manos y zapatillas aún se leen como piezas apiladas. La figura completa mide aproximadamente 2,94 unidades de alto por unidad de cráneo, por encima del objetivo cercano a 2,5. El busto tampoco reproduce la expresividad y acabado de la referencia aprobada.

Se detiene aquí la vía de añadir más geometría procedural. La siguiente iteración debería esculpirse manualmente en Blender, partiendo de una malla base editable: bloquear silueta y proporciones con sculpting, construir mechones grandes como masas continuas, retopologizar lo necesario, y luego añadir accesorios. Revisar silueta en plano y expresión antes de detalles finos. Esta ruta es gratuita y mantiene el proyecto editable; no requiere modelos de terceros.

Los renders son material de revisión, no activos aprobados. No se integraron en el juego.
