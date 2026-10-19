# VISUAL-QA-001: pruebas visuales locales

## Ejecución

En Windows, desde la raíz del proyecto:

```powershell
pnpm.cmd install --frozen-lockfile
node node_modules/@playwright/test/cli.js install chromium
pnpm.cmd run test:visual
pnpm.cmd run test:run
pnpm.cmd run typecheck
pnpm.cmd run build
```

`test:visual` inicia Vite en `127.0.0.1:5173`, ejecuta Chromium sin interfaz y detiene el servidor al terminar. El puerto debe estar libre. La configuración está en `playwright.config.ts`; las pruebas están en `e2e/visual.spec.ts`. Las 16 referencias PNG se encuentran en `e2e/__screenshots__/` y deben versionarse junto con las pruebas.

Ejecutar la suite visual y Vitest en serie en esta PC: al correrlas simultáneamente se observó un timeout de la prueba larga de teclado y una carga transitoria fallida de una imagen; ambas suites pasaron al repetirlas por separado.

## Qué se comprueba

En 320, 390, 768 y 1440 px, la prueba captura inicio, primera pregunta, primera revelación y resultado final. Además, recorre los cinco hogares con sus 15 preguntas, comprueba selección bloqueada, progreso de preguntas y hogares, puntuación, navegación y reinicio. En cada pantalla capturada y cada revelación comprueba el ancho del documento y los contenedores visibles con texto que recortan contenido. Las imágenes deben terminar de cargar antes de comparar.

Las capturas usan altura de viewport de 900 px, página completa, escala de dispositivo 1, idioma `es-AR`, zona horaria `America/Argentina/Buenos_Aires`, tema oscuro y movimiento reducido. Se bloquean las fuentes remotas de Google para que la red y la caché no alteren el renderizado: Chromium usa las fuentes alternativas declaradas en CSS. Las referencias actuales se generaron en Windows con Playwright 1.64.0 y su Chromium descargado; otra plataforma o versión de navegador puede rasterizar distinto.

## Regresión frente a cambio artístico

`pnpm.cmd run test:visual` **compara** con las referencias y no las actualiza. Una diferencia visual produce un fallo; la captura actual, la diferencia y la traza quedan en `test-results/`, que está ignorado por Git. Revisar esos artefactos junto con el cambio de código antes de decidir si hay regresión. Las capturas manuales históricas de `docs/design/reviews/` son evidencia editorial separada y nunca se usan como baseline automática.

Si un cambio artístico fue aprobado, revisar las 16 pantallas y recién entonces actualizar referencias de forma explícita con `pnpm.cmd run test:visual --update-snapshots=changed`. Revisar el diff de los PNG antes de incorporarlos. Para crear una referencia que aún falta, usar `--update-snapshots=missing`; ese modo no reemplaza archivos existentes. No actualizar capturas para hacer pasar una falla funcional o de recorte.

## Recuperación en otra PC

El repositorio recupera automáticamente código, contenido, arte local, configuración de Playwright, pruebas, referencias y las versiones de paquetes fijadas en `pnpm-lock.yaml`. `pnpm.cmd install --frozen-lockfile` reconstruye `node_modules`. La instalación de dependencias necesita acceso al registro de paquetes.

Chromium **no** está dentro del repositorio ni del lockfile como ejecutable. En la PC nueva hay que ejecutar `node node_modules/@playwright/test/cli.js install chromium` una vez; Playwright descarga su revisión compatible al caché del usuario (normalmente `%LOCALAPPDATA%\ms-playwright` en Windows). Esa descarga necesita red y puede requerir certificados/proxy de la PC. La primera ejecución de `test:visual` comprueba que el navegador pueda arrancar. Las referencias versionadas son para Windows; en otro sistema operativo corresponde generar y revisar un conjunto propio con aprobación, no sobrescribirlas automáticamente.

## Límites

La detección de texto recortado usa medidas del DOM (`scrollWidth`/`clientWidth` y sus equivalentes verticales) para contenedores visibles; no hace OCR de texto dibujado dentro de SVG o WebP. Las capturas representan el primer hogar y una partida de puntuación máxima; los otros cuatro hogares se verifican funcionalmente y por desbordamiento en cada revelación. Las comparaciones de píxeles siguen siendo sensibles a cambios de Chromium, sistema operativo o fuentes instaladas.
