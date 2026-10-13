# WhoLivesHere? 0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar un prototipo web local y jugable de cinco hogares ficticios, con deducciones entretenidas, puntuación determinista 2/1/0 y revelación explicada tras cada ronda.

**Architecture:** React representa tres estados de juego; un reductor puro controla las transiciones y un módulo puro calcula los puntos desde datos locales inmutables. Las cinco ilustraciones originales son activos locales; ninguna decisión del juego depende de red, backend o IA.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library con entorno DOM, SVG locales, pnpm. Entorno observado al redactar el plan: Node v24.19.0 y pnpm 11.9.0; el archivo de bloqueo fijará las versiones elegidas al ejecutar.

**Spec:** `docs/superpowers/specs/2026-10-13-wholiveshere-mvp-design.md` (aprobada en ADEL 001). Leerla completa antes de ejecutar este plan; sus textos y claves prevalecen sobre resúmenes aquí.

## Global Constraints

- Cinco hogares H01–H05 en orden fijo; tres preguntas por hogar (concreta, interpretativa, sorpresa), tres opciones por pregunta: 15 preguntas y 45 opciones.
- Una opción de 2, una de 1 y una de 0 puntos por pregunta; máximo 6 por hogar y 30 por partida. Los IDs y puntos son inmutables; orden visual fijo en 0.1 para reducir alcance.
- Una imagen original local por hogar, siempre presente durante sus preguntas y revelación. Perfil y puntos aparecen solo después de la tercera respuesta.
- Sin temporizador obligatorio. 45–60 segundos por hogar es hipótesis editorial para pruebas con jugadores, no límite de software.
- Público editorial 13+; lenguaje claro, sin inferencias sensibles o psicológicas. Las cinco escenas deben contener las pistas exactas y parciales descritas en la spec.
- Acceso por teclado, foco visible, progreso textual, texto alternativo neutral con pistas y sin respuestas, interfaz móvil sin desplazamiento horizontal.
- Sin cuentas, persistencia, backend, fotos reales, red necesaria para jugar, servicios externos obligatorios o IA en ejecución.
- Hasta la aprobación expresa de este plan: no instalar dependencias, generar imágenes, crear código ni iniciar RED. Durante ejecución, no hacer commits ni pushes salvo nueva autorización; cualquier instrucción de commit de una skill queda desplazada por este guardrail.
- No modificar la spec aprobada sin informar y justificar previamente. Escalar solo cambios de alcance, arquitectura, permisos o riesgo; resolver decisiones de implementación ordinarias dentro de estos contratos.

## Review Focus

Estos cinco fallos merecen pruebas explícitas en las tareas indicadas, además de los casos principales:

1. Un segundo clic de una opción de la pregunta anterior llega después de avanzar: `machine.test.ts` debe confirmar estado y puntos intactos.
2. Una opción válida de otro hogar o pregunta se envía como respuesta actual: `machine.test.ts` y `scoring.test.ts` deben rechazarla.
3. Un mapa de respuestas manipulado contiene una opción ajena o una pregunta desconocida: `scoring.test.ts` debe impedir que aumente el total.
4. La app se monta de nuevo tras una partida parcial: `App.test.tsx` debe comenzar de H01-Q1, sin datos guardados.
5. Cambio de pregunta, revelación y resultado retira el botón enfocado: `App.test.tsx` debe situar el foco en el nuevo encabezado o control pertinente.

---

## Mapa de archivos

| Archivo futuro | Responsabilidad |
| --- | --- |
| `package.json`, `pnpm-lock.yaml`, `index.html`, `tsconfig.json`, `vite.config.ts` | Scripts, versiones bloqueadas, entrada HTML, TypeScript y configuración de Vite/Vitest. |
| `src/main.tsx` | Montar React. |
| `src/game/types.ts` | Tipos `Home`, `Question`, `Option`, `AnswerMap`, estado y eventos. |
| `src/game/content.ts` | Cinco hogares y quince preguntas exactas de la spec; IDs estables, perfiles, pistas y textos alternativos. |
| `src/game/content.test.ts` | Invariantes 5/15/45, 2/1/0, IDs, tipos, copy y rutas de imágenes. |
| `src/game/scoring.ts`, `src/game/scoring.test.ts` | Calificación y totales derivados; entradas inválidas y estabilidad de orden. |
| `src/game/machine.ts`, `src/game/machine.test.ts` | Estado inicial y transición pura, eventos válidos e inválidos. |
| `src/App.tsx`, `src/App.test.tsx` | Composición, estado React y pruebas integradas del recorrido, teclado y foco. |
| `src/ui/QuestionView.tsx`, `src/ui/RevealView.tsx`, `src/ui/ResultView.tsx`, `src/ui/Scene.tsx` | Vistas pequeñas sin lógica de puntuación propia. |
| `src/styles.css` | Estilo responsive, foco y disposición de ilustración, pregunta y revelación. |
| `public/homes/h01.svg` … `h05.svg` | Cinco escenas ilustradas originales según la spec. |
| `README.md` | Ejecución local, verificación y limitaciones del prototipo. |

No introducir enrutador, gestor global de estado, biblioteca de estilos, base de datos, telemetría ni herramienta de generación de imágenes en runtime. `@testing-library/react`, `@testing-library/user-event` y un entorno DOM para Vitest se justifican por las pruebas de interacción y teclado; evitar dependencias adicionales salvo necesidad demostrada.

## Convenciones de interfaces

La implementación respetará estas firmas para mantener coherencia entre tareas. `Option.points` es `0 | 1 | 2`; `AnswerMap` es `Readonly<Record<string, string>>`, de `questionId` a `optionId`; `ScoreResult` es `{ points: 0 | 1 | 2; explanation: string }`. Los IDs de opciones son globalmente únicos y no contienen su puntuación ni posición visual. Cada `Home` expone `id`, `title`, `imageSrc`, `imageAlt`, `profile`, `reveal`, `questions`; cada `Question`, `id`, `kind`, `prompt`, `options`; cada `Option`, `id`, `label`, `points`, `explanation`. `kind` es `'concreta' | 'interpretativa' | 'sorpresa'`.

`gradeAnswer(homes: readonly Home[], questionId: string, optionId: string): ScoreResult | null` devuelve `null` si los IDs no forman una pareja válida. `scoreHome(homes: readonly Home[], answers: AnswerMap, homeId: string): number` y `scoreGame(homes: readonly Home[], answers: AnswerMap): number` suman solo parejas válidas pertenecientes al hogar o partida; entradas ajenas no suman y un hogar desconocido suma cero. `createInitialState(): GameState` y `transition(state: GameState, action: GameAction, homes: readonly Home[]): GameState` son puros. `GameState` contiene `phase: 'pregunta' | 'revelacion' | 'resultado'`, `homeIndex`, `questionIndex` y `answers`; las puntuaciones se derivan, nunca se almacenan en el estado. `GameAction` es una unión discriminada de `{ type: 'RESPONDER'; optionId: string }`, `{ type: 'SIGUIENTE' }`, `{ type: 'VER_RESULTADO' }` y `{ type: 'NUEVA_PARTIDA' }`.

## Task 1: Base ejecutable y contratos de contenido

**Files:** Create `package.json`, `pnpm-lock.yaml`, `index.html`, `tsconfig.json`, `vite.config.ts`, `src/main.tsx`, `src/game/types.ts`, `src/game/content.ts`, `src/game/content.test.ts`. No crear aún ilustraciones; `imageSrc` será `/homes/h01.svg` … `/homes/h05.svg`.

**Interfaces:** Produce `homes: readonly Home[]` y los tipos descritos arriba. Task 2–6 consumen estas interfaces. `content.ts` transcribe literalmente las cinco rondas aprobadas, incluidos 45 textos de opciones, perfil, revelación y explicación individual por opción. Para las opciones 0, usar la explicación de ausencia de pista de la spec; para las de 1, citar la pista parcial concreta.

- [ ] **Preparación del harness, tras aprobar el plan:** crear configuración mínima y entrada vacía para que Vitest pueda correr; instalar únicamente React, React DOM, Vite, TypeScript, plugin React para Vite, Vitest, Testing Library, user-event y entorno DOM; generar `pnpm-lock.yaml` y scripts `dev`, `build`, `typecheck`, `test:run`. Esta preparación no implementa comportamiento del producto.
- [ ] **RED — escribir `content.test.ts`:** `homes.length === 5`; IDs H01–H05 en orden; 3 preguntas y tipos exactos por hogar; 3 opciones con puntos `[0,1,2]` por pregunta; 45 IDs de opción únicos; textos, explicaciones, rutas y alt no vacíos. Afirmar una clave de cada hogar frente a la spec y que el alt no contenga el nombre del personaje ni frases que declaren la respuesta.
- [ ] **RED — ejecutar:** `pnpm.cmd exec vitest run src/game/content.test.ts`; debe fallar por `content.ts` ausente o por contratos no satisfechos. Si el fallo es de configuración, corregir el entorno y repetir hasta obtener un fallo de contrato real.
- [ ] **GREEN — crear tipos y datos:** implementar `types.ts` y `homes` en `content.ts`. No inventar perfiles, claves o puntuaciones distintos de la spec.
- [ ] **GREEN — ejecutar:** `pnpm.cmd exec vitest run src/game/content.test.ts`; deben pasar las aserciones del contrato.
- [ ] **REFACTOR — revisar:** eliminar duplicación accidental en datos o validación sin ocultar el contenido editorial; repetir el test y `pnpm.cmd run typecheck`.
- [ ] **Gate de revisión:** comparar las 15 filas, 45 opciones y justificaciones con la spec. Si una copia difiere, corregir en `content.ts`; no alterar la spec en silencio.

## Task 2: Motor puro de puntuación

**Files:** Create `src/game/scoring.ts`, `src/game/scoring.test.ts`. Consume `types.ts` y `content.ts` de Task 1.

**Interfaces:** Produce `gradeAnswer`, `scoreHome`, `scoreGame` con las firmas de Convenciones. La explicación devuelta es la de la opción seleccionada y no se recalcula con IA ni heurísticas.

- [ ] **RED — escribir `scoring.test.ts`:** para H01-Q1, elegir cada una de las tres opciones de la spec y esperar 2/1/0 y explicaciones no vacías; repetir al menos una pregunta sorpresa. Verificar `null` para opción desconocida y opción de otra pregunta; 6 para tres exactas de un hogar; 30 para quince exactas; 0 para quince opciones de 0; mismo resultado al permutar visualmente opciones; un `AnswerMap` con pregunta desconocida u opción ajena no eleva el total.
- [ ] **RED — ejecutar:** `pnpm.cmd exec vitest run src/game/scoring.test.ts`; fallo esperado por exportaciones ausentes o aserciones de valores, nunca por infraestructura.
- [ ] **GREEN — implementar:** las tres funciones puras en `scoring.ts`; búsqueda por ID y suma desde las opciones del contenido. Ningún estado de puntuación mutable o consulta de red.
- [ ] **GREEN — ejecutar:** `pnpm.cmd exec vitest run src/game/scoring.test.ts`; todas pasan.
- [ ] **REFACTOR — revisar:** centralizar la validación de pareja pregunta/opción si evita duplicación; repetir `pnpm.cmd exec vitest run src/game/scoring.test.ts src/game/content.test.ts` y `pnpm.cmd run typecheck`.

## Task 3: Máquina de estados y protección contra eventos duplicados

**Files:** Create `src/game/machine.ts`, `src/game/machine.test.ts`. Consume tipos y contenido de Task 1; la puntuación no controla transiciones.

**Interfaces:** Produce `createInitialState()` y `transition(state, action, homes)` con las firmas de Convenciones. Toda transición inválida devuelve el estado sin cambios; `RESPONDER` solo acepta una opción de la pregunta actual aún sin respuesta.

- [ ] **RED — escribir `machine.test.ts`:** estado inicial H01-Q1; responder una vez avanza a Q2 sin exponer puntos en el estado; responder Q3 entra en `revelacion`; `SIGUIENTE` avanza solo desde H01–H04 revelados; H05 lleva a `resultado` únicamente tras `VER_RESULTADO`; `NUEVA_PARTIDA` borra las quince respuestas. Un segundo `RESPONDER` con el mismo ID anterior, un ID de otra pregunta u hogar, y `SIGUIENTE` fuera de revelación deben conservar el mismo estado por identidad o igualdad profunda.
- [ ] **RED — ejecutar:** `pnpm.cmd exec vitest run src/game/machine.test.ts`; falla por interfaces o transiciones ausentes.
- [ ] **GREEN — implementar:** reductor puro con índices 0–4 y 0–2, `AnswerMap` copiado solo para selección válida y ninguna transición implícita. Validar pertenencia del `optionId` a la pregunta corriente antes de escribirlo; esta comprobación, más IDs globales, bloquea el doble clic tardío.
- [ ] **GREEN — ejecutar:** `pnpm.cmd exec vitest run src/game/machine.test.ts`; pasa.
- [ ] **REFACTOR — revisar:** simplificar ramas sin relajar guardas; repetir los tres archivos `*.test.ts` y `pnpm.cmd run typecheck`.

## Task 4: Recorrido jugable completo sin arte final

**Files:** Create `src/App.tsx`, `src/App.test.tsx`, `src/ui/QuestionView.tsx`, `src/ui/RevealView.tsx`, `src/ui/ResultView.tsx`, `src/ui/Scene.tsx`, `src/styles.css`; complete `src/main.tsx`. Consume contenido, motor y máquina ya probados. Puede usar inicialmente el cuadro de imagen con `imageSrc` pendiente; Task 6 incorpora los SVG.

**Interfaces:** `App` usa `useReducer` con `transition`; `QuestionView` recibe pregunta/progreso y callback `onAnswer(optionId)`; `RevealView` recibe hogar, respuestas y puntos derivados, y callback de avance; `ResultView` recibe total y callback de reinicio; `Scene` recibe `src` y `alt`. Las vistas no adjudican puntos.

- [ ] **RED — escribir `App.test.tsx`:** render inicial muestra `Hogar 1 de 5`, `Pregunta 1 de 3`, tres opciones y ninguna puntuación; tres selecciones muestran la revelación con perfil, puntuación por pregunta y subtotal; `Siguiente hogar` solo tras la revelación; recorrer H01–H05 termina en `30` tras quince elecciones exactas y `Ver resultado final`; una segunda partida con mezcla conocida de 2/1/0 confirma cada subtotal y el total derivado; `Nueva partida` reinicia a H01-Q1 con cero respuestas. Montar de nuevo tras una partida parcial también reinicia, sin almacenamiento.
- [ ] **RED — ejecutar:** `pnpm.cmd exec vitest run src/App.test.tsx`; falla por vistas ausentes o flujo incompleto.
- [ ] **GREEN — implementar:** vistas semánticas y `App`; nombres de personas solo en revelación; `Hogar X de 5` y `Pregunta Y de 3` visibles; no renderizar puntos ni correcciones durante preguntas. En revelación mostrar cada respuesta elegida, su explicación y puntos 0/1/2; mantener `Scene` visible.
- [ ] **GREEN — ejecutar:** `pnpm.cmd exec vitest run src/App.test.tsx`; pasa.
- [ ] **REFACTOR — revisar:** mantener `App` como composición y las vistas como presentación; repetir `pnpm.cmd run test:run`, `pnpm.cmd run typecheck` y `pnpm.cmd run build`.

## Task 5: Accesibilidad e interacción móvil

**Files:** Modify `src/App.tsx`, `src/App.test.tsx`, `src/ui/QuestionView.tsx`, `src/ui/RevealView.tsx`, `src/ui/ResultView.tsx`, `src/ui/Scene.tsx`, `src/styles.css`.

**Interfaces:** Conserva las interfaces de Task 4. El encabezado activo puede recibir foco programático (`tabIndex=-1`) después de cada transición; los controles son `<button>` nativos. El atributo `alt` de `Scene` proviene de `Home.imageAlt`.

- [ ] **RED — ampliar `App.test.tsx`:** completar una partida y reiniciar usando teclado con user-event; comprobar `document.activeElement` tras Q1→Q2, Q3→revelación, H05→resultado y reinicio; doble activación de la misma opción no salta Q2; cada imagen usa `alt` no vacío; progreso textual permanece como texto del DOM. Verificar el aspecto del foco manualmente, ya que el DOM de prueba no renderiza CSS.
- [ ] **RED — ejecutar:** `pnpm.cmd exec vitest run src/App.test.tsx`; las aserciones nuevas deben fallar por foco/interacción/estilo ausentes.
- [ ] **GREEN — implementar:** botones nativos, deshabilitación durante activación, gestión de foco al cambiar fase o índice, `:focus-visible` evidente, espacios y tamaños táctiles cómodos, disposición de imagen y texto que se adapta a pantalla estrecha sin retirar la ilustración. Evitar que el color sea la única señal.
- [ ] **GREEN — ejecutar:** `pnpm.cmd exec vitest run src/App.test.tsx`; pasa.
- [ ] **REFACTOR — revisar:** eliminar controladores de teclado innecesarios si el botón nativo ya resuelve la interacción; repetir `pnpm.cmd run test:run`, `pnpm.cmd run typecheck` y `pnpm.cmd run build`.
- [ ] **Gate visual manual:** a anchos de 320 px, 390 px y escritorio, confirmar ausencia de scroll horizontal, ilustración presente, lectura de tres opciones, foco distinguible y revelación completa. Registrar observaciones; no declarar accesibilidad visual solo por tests DOM.

## Task 6: Cinco ilustraciones originales y revisión de pistas

**Files:** Create `public/homes/h01.svg` … `public/homes/h05.svg`; modify `src/game/content.test.ts` solo para comprobar disponibilidad y neutralidad textual de activos. No cambiar claves o perfiles de la spec.

**Interfaces:** Las rutas públicas son las ya declaradas en `Home.imageSrc`. Cada SVG muestra los objetos de su escena, incluyendo pistas que justifican las opciones de 1 punto, con composición y paleta distintas. No incluye textos que declaren soluciones ni elementos remotos.

- [ ] **RED — ampliar `content.test.ts`:** para cada `imageSrc`, el archivo existe en `public`, es SVG local no vacío y carece de referencias `http:`, `https:` o imágenes externas. La prueba debe fallar por los cinco archivos faltantes.
- [ ] **RED — ejecutar:** `pnpm.cmd exec vitest run src/game/content.test.ts`; falla por activos ausentes.
- [ ] **GREEN — crear los cinco SVG:** dibujar con SVG estático las escenas de la spec, sin fotos ni generación por IA en runtime. Mantener pista dominante fácil de identificar, pista interpretativa legible y detalle de sorpresa secundario; incorporar las pistas parciales específicas de las quince filas. No usar texto dentro del arte como solución directa.
- [ ] **GREEN — ejecutar:** `pnpm.cmd exec vitest run src/game/content.test.ts` y `pnpm.cmd run build`; pasan y los cinco SVG están en `dist/homes/`.
- [ ] **REFACTOR — revisar:** reducir peso o simplificar trazos si mejora lectura; repetir prueba, build y revisión manual de cada imagen a tamaño móvil. Confrontar una por una las 15 pistas exactas y 15 parciales con la spec. Ajustar arte o texto alternativo si un detalle no se distingue; cualquier cambio de claves o perfil requiere escalamiento.

## Task 7: Verificación final, demostración y entrega

**Files:** Create `README.md`; modify únicamente código o arte de tareas previas si una verificación encuentra un defecto. No ampliar funcionalidades.

**Interfaces:** README documenta requisitos locales, `pnpm.cmd install --frozen-lockfile`, `pnpm.cmd run dev`, `pnpm.cmd run test:run`, `pnpm.cmd run typecheck`, `pnpm.cmd run build` y `pnpm.cmd exec vite preview --host 127.0.0.1`.

- [ ] **Revisión integrada:** comprobar que `App.test.tsx` recorre quince preguntas, cinco revelaciones y el resultado, tanto con quince aciertos como con mezcla conocida de 2/1/0. Si aparece un defecto, volver a la tarea propietaria, añadir allí primero un test que falle y repetir RED → GREEN → REFACTOR.
- [ ] **Documentación:** escribir README con comandos y límites; contrastarlo con una ejecución real, sin agregar funcionalidades.
- [ ] **Gates automáticos finales:** desde una instalación bloqueada ejecutar `pnpm.cmd install --frozen-lockfile`, `pnpm.cmd run test:run`, `pnpm.cmd run typecheck`, `pnpm.cmd run build`. Registrar comando, fecha, resultado y cualquier límite de entorno.
- [ ] **Demostración local:** iniciar `pnpm.cmd exec vite preview --host 127.0.0.1`, abrir la URL local y completar manualmente H01–H05 con teclado y ratón, comprobando progreso, cinco revelaciones, subtotal sobre 6, total sobre 30, reinicio y ausencia de solicitudes remotas de datos del juego. En móvil o emulación móvil repetir una ronda de cada hogar para comprobar que las pistas y el texto alternativo son suficientes. Documentar evidencia y hallazgos en la entrega, sin agregar infraestructura de seguimiento.
- [ ] **Gate de aceptación:** contrastar RF-01–RF-10, RNF-01–RNF-07 y los once casos límite de la spec con pruebas y revisión manual. La entrega se considera lista solo si todos pasan o si una limitación concreta se informa para decisión humana; no cambiar silenciosamente la spec.

## Dependencias, riesgos y decisiones de ejecución

| Tema | Decisión o respuesta prevista |
| --- | --- |
| Dependencias | Usar pnpm y archivo de bloqueo; instalar paquetes solo después de aprobar el plan. Mantener dependencias de ejecución en React/React DOM y herramientas de desarrollo/test mínimas. |
| Arte y pistas | SVG local original permite inspección y entrega reproducible. Riesgo: detalles secundarios ilegibles en móvil. Gate visual en Task 6; mejorar composición antes de tocar claves. |
| Deducción injusta | Las alternativas de 1 punto exigen pistas visibles; revisar cada una contra arte y explicación. Si una respuesta exacta parece arbitraria, ajustar la pista visual dentro del contrato aprobado o escalar un cambio de contenido. |
| Doble clic y estado obsoleto | IDs globales + validación del estado actual en reductor; tests de eventos repetidos, ajenos y fuera de fase. No confiar solo en deshabilitar botones. |
| Versiones de herramientas | El entorno local usa Node 24.19.0/pnpm 11.9.0. Elegir paquetes compatibles al ejecutar, bloquear versiones y comprobar instalación limpia. Si una incompatibilidad obliga a cambiar la arquitectura o permisos, escalar; un ajuste de versión compatible es ordinario. |
| Browser y accesibilidad | Tests DOM prueban estructura y foco; revisión manual comprueba visual móvil y pistas. No afirmar cumplimiento completo de un estándar sin auditoría específica. |
| Permisos y red | La instalación puede requerir acceso a registro y aprobación de sandbox; solicitarla mediante el mecanismo de herramientas si aparece el bloqueo. Ninguna red es necesaria para jugar después de cargar la app. |

## Handoff y gates ADEL

Este plan queda para revisión humana. La aprobación del plan autoriza comenzar RED solo si el usuario lo expresa; después el implementador puede completar las siete tareas y verificaciones sin preguntas de preferencia menores. Cada tarea tiene un ciclo RED → GREEN → REFACTOR y gate de evidencia antes de la siguiente. Si un gate falla, corregir el defecto dentro del alcance y repetirlo; escalar únicamente cambios de alcance, arquitectura, permisos o riesgo. No hacer commits ni pushes bajo el guardrail actual.
