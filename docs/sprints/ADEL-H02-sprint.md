# ADEL — SPRINT H02: assets + integración con costo controlado

## Objetivo
Completar H02 sin alterar la lógica, puntajes ni los restantes hogares. Aplicar el lenguaje visual de H01 (hogar fotográfico; personaje coleccionable 3D, exclusivamente después de completar las tres preguntas).

## Estado de entrada
- `public/assets/h02/home-candidate.jpg`: la fotografía subida por el fundador. Es **candidata**, no la versión retocada final.
- Falta comprobar que las tres preguntas originales estén respaldadas por pistas reconocibles, especialmente la tercera. La evaluación debe hacerse **sin mostrar spoilers al fundador**.
- Falta arte del personaje H02 (`character-reveal.png`), producido mediante una herramienta real de generación de imágenes, no mediante un LLM de texto. No sustituirlo por emoji, SVG genérico ni arte ficticio no aprobado.
- H01 aprobado: conservar 46 tests PASS, TypeScript PASS y build PASS como línea base.
- Preservar las 20 viviendas y todos los cambios locales sin commit.

## Secuencia y responsabilidades
1. **Ollama local** (`qwen2.5-coder:7b`): revisar código y proponer el parche mínimo para H02, sin alterar archivos. No puede juzgar píxeles ni generar imágenes.
2. **Curaduría visual**: aprobar o retocar la fotografía con herramienta de edición de imágenes y producir PNG de personaje H02. La imagen no se considera lista hasta verificar cobertura de pistas Q1/Q2/Q3 sin mostrar detalles/soluciones.
3. **Codex** (solo tras gate de arte): integrar `public/assets/h02/home.jpg` durante preguntas y `public/assets/h02/character-reveal.png` únicamente en revelación; mantener H01 y H03–H20 sin cambios. Añadir tests basados en `home.id`, no en nombres de personajes ni soluciones. Ejecutar tests, typecheck, build. Revisar aspecto 390 × 844 y escritorio.

## Guardrails Codex
- Primero ejecutar **un único comando de lectura** de la carpeta. Si aparece `helper_unknown_error: setup refresh had errors`, **detener**, sin reintentos.
- Máximo **un intento de implementación**. No loops de lectura, no investigaciones amplias del repo ni superpowers redundantes.
- Razonamiento bajo, salida estructurada con estados únicamente.
- Sin `reset`, `stash`, `clean`, `git add`, commit, push, deploy.
- No cambiar preguntas, opciones, perfiles, respuestas ni puntuaciones.
- No imprimir al usuario contenido de preguntas, respuestas, perfiles, escenas ocultas ni diffs.
- Si falta arte aprobado, retornar `BLOCKED_ASSETS`, no generar contenido reemplazante.

## Gate de promoción
- Assets verdaderos y aprobados (fotografía + personaje); no un collage.
- Revelación únicamente luego de 3 respuestas; ninguna aparición previa de personaje.
- Todos los tests PASS, tsc PASS, build PASS.
- Visual 390 × 844 y escritorio revisado; sin cortes de pistas ni botones inaccesibles.
- Ningún despliegue sin autorización del fundador.
