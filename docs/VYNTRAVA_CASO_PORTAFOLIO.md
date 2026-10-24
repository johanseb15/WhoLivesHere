# Vyntrava Technologies | Caso WhoLivesHere?

**Tipo:** prototipo de juego web de deducción visual.  
**Estado:** MVP de demostración; no consta aquí un despliegue público validado en navegador.

## Qué resuelve y qué permite evaluar

Explorar una experiencia breve de observación, interpretación y revelación sin cuentas ni recolección de datos de usuarios. Cada ronda presenta pistas visuales y tres opciones, con puntuación y explicación.

## Alcance reproducible

- 5 hogares y perfiles ficticios.
- 3 preguntas por hogar: 15 en total.
- 3 opciones por pregunta: 45 alternativas.
- Puntuación máxima: 6 por hogar y 30 por partida.
- Navegación con teclado, foco y texto alternativo, según implementación y tests existentes.
- Código React + TypeScript + Vite; Vitest y Playwright para pruebas, con instrucciones en el README.

Estas cantidades describen el alcance del prototipo, no usuarios reales ni tasas de conversión.

## Cómo verificar

```powershell
pnpm.cmd install --frozen-lockfile
pnpm.cmd run test:run
pnpm.cmd run typecheck
pnpm.cmd run build
```

Para comprobar la dirección visual deben revisarse capturas, pantallas móviles y el recorrido completo en navegador. La existencia de un workflow de GitHub Pages no acredita un despliegue correcto. Se reportaron previamente fallas de despliegue; verificar Actions antes de enlazar la demo como operativa.

## Métricas propuestas para una prueba con usuarios

Tasa de finalización de las 15 preguntas; duración mediana por partida; abandono por ronda; uso en móvil; errores de navegación con teclado; comprensión de las revelaciones. **Aún no hay medición de usuarios reportada para estas métricas.**

## Valor como caso de Vyntrava

Muestra la capacidad de entregar una interfaz interactiva con estados, reglas de juego, recursos visuales y pruebas. No se presenta como producto contratado ni caso de éxito comercial.

[Repositorio](https://github.com/johanseb15/WhoLivesHere)
