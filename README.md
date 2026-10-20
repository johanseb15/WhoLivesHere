# WhoLivesHere? — 20 niveles

Juego web local de deducción. Observá veinte hogares ilustrados, respondé tres preguntas por hogar y descubrí el perfil ficticio después de cada ronda. La puntuación es fija: 2 puntos por la respuesta del perfil, 1 por una alternativa plausible respaldada por una pista y 0 por una opción sin apoyo suficiente.

## Requisitos y ejecución

Verificado en Windows con Node.js 24.19.0 y pnpm 11.9.0. Desde la raíz del repositorio:

    pnpm.cmd install --frozen-lockfile
    pnpm.cmd run dev

Abrí la dirección local que muestre Vite, normalmente http://127.0.0.1:5173/. Para servir la compilación de producción localmente:

    pnpm.cmd run build
    pnpm.cmd run preview

La dirección de preview suele ser http://127.0.0.1:4173/WhoLivesHere/. La instalación necesita acceso al registro de paquetes; el juego ya cargado usa solo archivos locales. El servidor de desarrollo conserva la ruta raíz; el build y el preview usan `/WhoLivesHere/` para GitHub Pages.

## Publicación en GitHub Pages

El workflow `.github/workflows/deploy.yml` se ejecuta al subir cambios a `main` o manualmente desde Actions. Instala pnpm 11.9.0 y las dependencias fijadas en `pnpm-lock.yaml`, ejecuta tests, typecheck y build, y publica `dist` solo si esos pasos terminan correctamente. El job de construcción tiene permisos de lectura; el de despliegue obtiene únicamente `pages: write` e `id-token: write`.

Para activarlo, en GitHub abrí **Settings → Pages → Build and deployment → Source** y elegí **GitHub Actions**. Después de que este cambio se incorpore a `main`, comprobá que el workflow termine correctamente y abrí la URL de Pages indicada por el job de despliegue. Este documento no implica que el sitio ya esté publicado.

## Cómo jugar

Cada hogar muestra una ilustración que permanece visible mientras se responde. Elegí una de las tres opciones de cada pregunta; la selección avanza a la siguiente sin mostrar puntos. Después de la tercera, la revelación explica el perfil y la puntuación sobre 6. Seguí hasta el resultado sobre 120 y usá **Nueva partida** para empezar otra vez. No hay cronómetro, cuentas ni guardado de partidas.

Los botones admiten teclado: Tab para desplazarse y Enter o Espacio para activar. Tras cada cambio de pregunta o pantalla, el foco se mueve al encabezado nuevo. Las escenas tienen texto alternativo descriptivo.

## Verificación reproducible

    pnpm.cmd run test:run
    pnpm.cmd run typecheck
    pnpm.cmd run build

Los tests comprueban 20 hogares, 60 preguntas, 180 opciones, distribución 2/1/0, máximos de 6 y 120 puntos, entradas inválidas, clics duplicados, recorrido completo, reinicio y teclado. También verifican que las veinte rutas de ilustración apuntan a SVG locales sin referencias remotas.

Para una revisión manual, completá los veinte hogares en la vista local, confirmá que cada revelación aparece antes de avanzar y que el resultado final coincide con las respuestas. En una ventana móvil, comprobá que no haya desbordamiento horizontal y que la ilustración siga visible mientras se desplazan las opciones y las explicaciones. Las ilustraciones de H06 a H20 se regeneran con `node scripts/generate-extra-scenes.mjs`.

## Alcance de la versión

Las veinte escenas y perfiles son ficticios. Las pistas interpretativas no pretenden describir rasgos psicológicos reales. Los niveles H06 a H20 usan pictogramas tipográficos que pueden variar ligeramente según el sistema. No hay backend, base de datos, fotos reales, servicios externos durante el juego ni IA en ejecución.
