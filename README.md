# WhoLivesHere? 0.1

Prototipo web local de deducción. Observá cinco hogares ilustrados, respondé tres preguntas por hogar y descubrí el perfil ficticio después de cada ronda. La puntuación es fija: 2 puntos por la respuesta del perfil, 1 por una alternativa plausible respaldada por una pista y 0 por una opción sin apoyo suficiente.

## Requisitos y ejecución

Verificado en Windows con Node.js 24.19.0 y pnpm 11.9.0. Desde la raíz del repositorio:

    pnpm.cmd install --frozen-lockfile
    pnpm.cmd run dev

Abrí la dirección local que muestre Vite, normalmente http://127.0.0.1:5173/. Para servir la compilación de producción localmente:

    pnpm.cmd run build
    pnpm.cmd run preview

La dirección de preview suele ser http://127.0.0.1:4173/. La instalación necesita acceso al registro de paquetes; el juego ya cargado usa solo archivos locales.

## Cómo jugar

Cada hogar muestra una ilustración que permanece visible mientras se responde. Elegí una de las tres opciones de cada pregunta; la selección avanza a la siguiente sin mostrar puntos. Después de la tercera, la revelación explica el perfil y la puntuación sobre 6. Seguí hasta el resultado sobre 30 y usá **Nueva partida** para empezar otra vez. No hay cronómetro, cuentas ni guardado de partidas.

Los botones admiten teclado: Tab para desplazarse y Enter o Espacio para activar. Tras cada cambio de pregunta o pantalla, el foco se mueve al encabezado nuevo. Las escenas tienen texto alternativo descriptivo.

## Verificación reproducible

    pnpm.cmd run test:run
    pnpm.cmd run typecheck
    pnpm.cmd run build

Los tests comprueban 5 hogares, 15 preguntas, 45 opciones, distribución 2/1/0, máximos de 6 y 30 puntos, entradas inválidas, clics duplicados, recorrido completo, reinicio y teclado. También verifican que las cinco rutas de ilustración apuntan a SVG locales sin referencias remotas.

Para una revisión manual, completá los cinco hogares en la vista local, confirmá que cada revelación aparece antes de avanzar y que el resultado final coincide con las respuestas. En una ventana móvil, comprobá que no haya desbordamiento horizontal y que la ilustración siga visible mientras se desplazan las opciones y las explicaciones.

## Alcance de la versión

Las cinco escenas y perfiles son ficticios. Las pistas interpretativas no pretenden describir rasgos psicológicos reales. La estimación editorial de 45–60 segundos por hogar requiere validación con jugadores; el prototipo no la impone. No hay backend, base de datos, fotos reales, servicios externos durante el juego ni IA en ejecución.
