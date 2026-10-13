# WhoLivesHere? 0.1 — especificación de diseño

**Estado:** propuesta para aprobación humana. **Proceso:** ADEL 001, SPECIFY, con `superpowers:brainstorming`. **Fecha:** 2026-10-13.

## 1. Propósito y límites

El prototipo debe comprobar si observar un hogar ficticio, deducir actividades de quien vive allí y descubrir su perfil genera curiosidad, sorpresa y ganas de jugar otra ronda. La claridad y consistencia de preguntas y puntos es obligatoria; una demostración para terceros es secundaria. Público editorial: 13+; no es una clasificación oficial ni implica recopilar datos de menores.

Una partida contiene cinco hogares en orden fijo. Cada hogar tiene una ilustración local y tres preguntas sucesivas con tres opciones cada una: una concreta, una interpretativa y una de sorpresa. La duración **estimada** es de 45 a 60 segundos por hogar, a validar con jugadores; no hay temporizador ni límite. Las preguntas tratan actividades, gustos y planes ficticios autodeclarados. No se infieren atributos sensibles ni verdades psicológicas.

Quedan fuera del MVP: cuentas, perfiles de jugadores, persistencia de partidas, backend, base de datos, fotos reales, servicios externos obligatorios, IA en ejecución, selector de hogares, navegación libre, tablas de posiciones, analítica automática y contenido adicional al ciclo de cinco rondas.

## 2. Decisiones y alternativas técnicas

**Opción seleccionada:** React + TypeScript + Vite para la interfaz, datos locales y Vitest para pruebas. React separa pregunta, revelación y resultado sin mezclar el cálculo de puntos con la representación. Un motor puro y un reductor de estados permiten probar las transiciones y los clics repetidos sin depender de imágenes o servicios. TypeScript expresa las restricciones de los datos; Vite sirve y empaqueta la aplicación; Vitest ejecuta las pruebas.

Se consideró TypeScript + Vite sin framework: reduce dependencias de interfaz, pero exige administrar manualmente las transiciones y actualizaciones del DOM. También se consideró Svelte + TypeScript + Vite: ofrece componentes compactos, pero añade una elección de framework sin una ventaja suficiente para estas cinco rondas. La selección de React queda aprobada para este MVP; las versiones concretas se resolverán al iniciar implementación, tras aprobación de esta especificación.

Las cinco ilustraciones serán activos locales originales, no fotos. El formato de archivo puede decidirse durante la implementación siempre que conserve las pistas, el rendimiento móvil y la descripción accesible. No se generan activos en SPECIFY.

## 3. Requisitos funcionales

| ID | Requisito verificable |
| --- | --- |
| RF-01 | Una partida nueva comienza en el hogar 1 de 5, pregunta 1 de 3, sin respuestas previas ni puntos. |
| RF-02 | Los hogares aparecen en el orden H01 a H05, sin selector ni salto entre ellos. |
| RF-03 | La misma ilustración del hogar permanece visible durante las tres preguntas y la revelación; cada pregunta presenta exactamente tres opciones y admite una sola selección. |
| RF-04 | Se muestran `Hogar X de 5` y, durante preguntas, `Pregunta Y de 3`. |
| RF-05 | Una selección válida registra una respuesta una sola vez y avanza a la siguiente pregunta. No se muestran corrección ni puntos antes de contestar las tres. |
| RF-06 | Al contestar la tercera pregunta, se muestra la revelación del perfil ficticio, las tres elecciones, los puntos de cada una, su explicación y el subtotal sobre 6. |
| RF-07 | `Siguiente hogar` aparece únicamente tras revelar H01–H04. Tras revelar H05 aparece `Ver resultado final`. |
| RF-08 | El resultado final muestra la suma sobre 30 y `Nueva partida`, que reinicia por completo el estado. |
| RF-09 | La puntuación usa exclusivamente los valores 2/1/0 predefinidos para cada opción; no hay modificación dinámica de respuestas ni criterios. |
| RF-10 | El orden visual de opciones puede permanecer fijo o variar; sus identificadores, valores y explicaciones no cambian. |

## 4. Requisitos no funcionales y editoriales

| ID | Requisito verificable |
| --- | --- |
| RNF-01 | La aplicación funciona sin red después de cargar sus archivos locales; no llama a servicios externos para jugar o puntuar. |
| RNF-02 | La interfaz es adaptable a móvil; la ilustración sigue presente y las opciones, el progreso y la pregunta conservan legibilidad. No se depende solo del color para expresar progreso o puntos. |
| RNF-03 | Preguntas, opciones y botones se recorren y activan con teclado. El foco es visible. Al avanzar de pregunta o pantalla, el foco se dirige al encabezado o primer control pertinente sin quedar en un elemento retirado. |
| RNF-04 | Cada ilustración tiene texto alternativo descriptivo y neutral que comunica las pistas útiles sin afirmar la respuesta del perfil. Los detalles relevantes no dependen exclusivamente de información cromática. |
| RNF-05 | El lenguaje es cotidiano para un público 13+. Las opciones de 1 punto se apoyan en una pista concreta descrita abajo y la revelación explica por qué parecían posibles. |
| RNF-06 | Las imágenes y perfiles son originales y ficticios. Las revelaciones atribuyen gustos y actividades al personaje ficticio; no convierten observaciones del hogar en diagnósticos o rasgos personales. |
| RNF-07 | La partida no requiere cuenta, guarda de datos personales, temporizador ni conexión a un servicio remoto. |

## 5. Contenido cerrado de las cinco rondas

En todas las preguntas, `2` es la respuesta exacta del perfil, `1` una alternativa respaldada por una pista específica y `0` una opción sin apoyo suficiente. La revelación explica tanto la respuesta exacta como la alternativa parcial. El arte debe mostrar los objetos indicados sin rótulos que revelen directamente el perfil. El texto alternativo enumera objetos y relaciones espaciales; evita frases como «esta persona hace X».

### H01 — El taller azul / Vera

**Escena:** rincón turquesa de una vivienda. Bicicleta a medio reparar, bomba y herramientas en primer plano; un banquito con tornillos flojos a un lado; mapa con recorridos, postales de murales y muestras de color pegadas cerca de una pequeña prueba de pintura en la pared. Las postales y las muestras son detalles que se descubren al mirar un poco más.

**Perfil autodeclarado:** «Me gusta recuperar bicicletas y salir a buscar murales. Anoto sus colores en un mapa para recordar cada paseo».

| ID y tipo | Pregunta | 2 puntos | 1 punto | 0 puntos | Pista que respalda el punto parcial |
| --- | --- | --- | --- | --- | --- |
| H01-Q1 concreta | ¿Qué suele reparar quien vive aquí? | Bicicletas | Muebles | Lámparas | El banquito con tornillos y las herramientas también permiten pensar en muebles. |
| H01-Q2 interpretativa | ¿Qué plan reúne mejor las pistas? | Recorrer murales en bicicleta | Pasear en bicicleta por el barrio | Probar recetas nuevas | Bicicleta y mapa sustentan el paseo; las postales especifican los murales. |
| H01-Q3 sorpresa | ¿Para qué guarda muestras de color junto al mapa? | Para recordar los colores de los murales visitados | Para elegir pintura para su casa | Para clasificar piezas de bicicleta | La muestra de pintura en la pared hace plausible una reforma. |

**Revelación:** la bicicleta y las herramientas explican la reparación; mapa y postales conectan el paseo con los murales. Las muestras forman un diario de color. El banquito y la prueba de pintura justifican por qué otras hipótesis merecen un punto, sin cambiar lo que Vera declara.

**Opciones de 0 puntos:** no se ven lámparas para reparar, pistas de cocina para el plan dominical ni un uso mecánico de las muestras de color.

### H02 — La cocina verde / Gael

**Escena:** cocina pequeña verde y naranja. Macetas de hierbas, una con flores; hojas secándose, tetera y frascos de condimentos; sobres ilustrados, uno entreabierto con unas semillas apenas visibles, al lado de bolsitas de infusión y un plano sencillo de la plaza.

**Perfil autodeclarado:** «Cultivo hierbas para preparar infusiones. También intercambio semillas en la plaza para probar plantas nuevas».

| ID y tipo | Pregunta | 2 puntos | 1 punto | 0 puntos | Pista que respalda el punto parcial |
| --- | --- | --- | --- | --- | --- |
| H02-Q1 concreta | ¿Qué cultiva principalmente? | Hierbas aromáticas | Flores | Árboles frutales | Una maceta está en flor. |
| H02-Q2 interpretativa | ¿Para qué seca las hojas? | Para preparar infusiones | Para usarlas como condimento | Para hacer adornos de pared | Hay frascos de condimentos junto a las hojas. |
| H02-Q3 sorpresa | ¿Qué hace con los sobres ilustrados? | Intercambia semillas | Regala mezclas de té | Guarda recibos | Las bolsitas de infusión están junto a los sobres. |

**Revelación:** la tetera apoya las infusiones y las semillas del sobre, junto con el plano de la plaza, anticipan el intercambio. Flores, condimentos y bolsitas de té explican las alternativas parciales.

**Opciones de 0 puntos:** no aparecen árboles frutales, materiales para convertir las hojas en adornos ni recibos en los sobres.

### H03 — El escenario de papel / Leo

**Escena:** estudio violeta y dorado. Lámpara detrás de un pequeño escenario de cartón; siluetas de peces, olas y un bote; otros recortes decorativos sujetos a la pared; boletos de cartón hechos a mano y un calendario con un dibujo del patio del edificio.

**Perfil autodeclarado:** «Invento historias de sombras con papel. Estoy preparando una aventura submarina para mostrarla en el patio».

| ID y tipo | Pregunta | 2 puntos | 1 punto | 0 puntos | Pista que respalda el punto parcial |
| --- | --- | --- | --- | --- | --- |
| H03-Q1 concreta | ¿Qué está preparando? | Una función de teatro de sombras | Adornos para una habitación | Un álbum de fotos | Algunos recortes están sujetos a la pared como adornos. |
| H03-Q2 interpretativa | ¿Qué historia sugieren las figuras? | Una aventura bajo el mar | Un viaje por un río | Una carrera de autos | El bote y las olas también podrían contar un viaje fluvial. |
| H03-Q3 sorpresa | ¿Para qué hizo los boletos de cartón? | Para invitar a una función en el patio | Para invitar a una función dentro de casa | Para usarlos como señaladores | El escenario dentro del estudio permite pensar que la función será allí. |

**Revelación:** lámpara, escenario y siluetas indican teatro de sombras; los peces sitúan la historia bajo el mar. Los boletos hechos a mano y el patio del calendario revelan que habrá una función compartida. Los recortes de pared, el bote y el escenario interior sostienen las alternativas parciales.

**Opciones de 0 puntos:** no hay fotos para un álbum, figuras de autos ni libros junto a los boletos que sugieran señaladores.

### H04 — Las postales sonoras / Noa

**Escena:** rincón azul junto a una ventana urbana. Grabadora, auriculares y teclado musical pequeño; mapa de paseos; cuaderno con notas escritas y bocetos de ondas, lluvia y calles; sobres ilustrados, algunos con hojas de notas dentro y otros preparados como postales. Ningún sobre indica su destino.

**Perfil autodeclarado:** «Salgo a escuchar y registrar sonidos cotidianos. Después dibujo postales inspiradas en ellos y las envío a mis amistades».

| ID y tipo | Pregunta | 2 puntos | 1 punto | 0 puntos | Pista que respalda el punto parcial |
| --- | --- | --- | --- | --- | --- |
| H04-Q1 concreta | ¿Qué suele grabar? | Sonidos de distintos lugares | Melodías que compone | Vídeos de edificios | El teclado y los auriculares sugieren que también podría grabar música. |
| H04-Q2 interpretativa | ¿Qué hace al volver a casa? | Dibuja lo que le sugieren esos sonidos | Escribe notas sobre el paseo | Organiza compras para la semana | El cuaderno contiene notas escritas además de bocetos. |
| H04-Q3 sorpresa | ¿Para qué prepara sobres con dibujos de ondas? | Para enviar postales inspiradas en sonidos | Para archivar notas de sus paseos | Para vender entradas a conciertos | Algunos sobres contienen hojas de notas. |

**Revelación:** grabadora, mapa y nombres de lugares en el cuaderno sostienen los paseos sonoros. Los bocetos pasan a postales para sus amistades. Teclado, notas y sobres usados para guardar papeles justifican las hipótesis parciales.

**Opciones de 0 puntos:** no hay cámara o pantalla de vídeo, lista de compras ni pistas de entradas para un concierto.

### H05 — La azotea del viento / Teo

**Escena:** azotea de tonos coral y cielo abierto. Paraguas roto, retazos de tela, bolsa de tela con un retazo similar, cometas de formas y números distintos, cuerda con pinzas y telas colgadas, flechas de viento y libreta con pequeñas marcas de pruebas y una lista de diseños favoritos.

**Perfil autodeclarado:** «Convierto paraguas rotos en cometas. Numero mis diseños para comparar cómo vuela cada forma».

| ID y tipo | Pregunta | 2 puntos | 1 punto | 0 puntos | Pista que respalda el punto parcial |
| --- | --- | --- | --- | --- | --- |
| H05-Q1 concreta | ¿Qué material reutiliza para construir cometas? | Tela de paraguas | Bolsas de tela | Papel de regalo | Una bolsa de tela y un retazo parecido están cerca de las cometas. |
| H05-Q2 interpretativa | ¿Qué actividad sugieren la azotea y las flechas de viento? | Probar cometas | Secar telas al aire | Cultivar verduras | Hay telas colgadas con pinzas. |
| H05-Q3 sorpresa | ¿Por qué tienen números las cometas? | Para comparar cómo vuela cada diseño | Para ordenar sus diseños favoritos | Para indicar sus precios | La libreta incluye una lista de favoritos, además de marcas de prueba. |

**Revelación:** el paraguas y los retazos muestran de dónde salen las cometas. Números, flechas y marcas de la libreta explican la comparación de vuelos. Bolsa, telas tendidas y lista de favoritos respaldan las alternativas parciales.

**Opciones de 0 puntos:** no aparece papel de regalo, cultivo de verduras ni etiquetas de precio o venta.

**Control editorial de deducción:** en cada hogar la primera respuesta tiene una pista dominante para dar confianza; la segunda requiere conectar al menos dos elementos; la tercera depende de un detalle secundario más el perfil revelado. El arte no debe convertir los detalles secundarios en rótulos o respuestas literales. Una revisión de las ilustraciones y pruebas con jugadores comprobarán si alguna pregunta resulta inmediata o injustificadamente opaca; cualquier cambio de pistas o claves requerirá actualizar el conjunto estático antes de publicar la versión, nunca durante una partida.

## 6. Modelo de datos y contratos

El contenido local es un conjunto inmutable de cinco `Home` ordenados. Cada `Home` incluye `id`, título, referencia a ilustración local, texto alternativo neutral, perfil ficticio, tres `Question` y explicación general de revelación. Cada `Question` incluye `id`, tipo (`concreta`, `interpretativa`, `sorpresa`), texto y exactamente tres `Option`. Cada `Option` incluye `id` globalmente único, texto, `points` (2, 1 o 0), y explicación de su puntuación ligada a una pista de la escena. El orden de representación es independiente de esos identificadores y valores.

**Invariantes de contenido:** cinco hogares; tres preguntas por hogar en el orden de tipos indicado; tres opciones por pregunta; exactamente una opción con 2, una con 1 y una con 0 puntos por pregunta; IDs únicos y estables; texto y explicación no vacíos; ilustración y texto alternativo presentes. Las quince preguntas anteriores constituyen el contenido inicial aprobado, sujeto a esta revisión humana. Las tablas contienen el contrato de puntuación; el arte final debe incluir las pistas detalladas para que ese contrato sea justo.

**Contrato del motor:** una función pura recibe el conjunto de contenido, un `questionId` y un `optionId`, y devuelve el valor predefinido junto con su explicación. Una opción ajena a la pregunta o un ID desconocido se rechaza como entrada inválida, sin adjudicar puntos ni avanzar. El total de hogar y el total de partida se derivan de las respuestas válidas registradas; no se mantienen como valores editables separados. El resultado de una misma secuencia de elecciones es siempre el mismo, con independencia del orden visual de las opciones. No hay red, azar en el cálculo ni IA. Cada respuesta válida queda congelada hasta `Nueva partida`.

## 7. Máquina de estados del juego

| Estado | Datos relevantes | Evento admitido | Resultado |
| --- | --- | --- | --- |
| `pregunta` | índice de hogar 0–4, índice de pregunta 0–2, respuestas anteriores | `RESPONDER(optionId)` válido y aún no contestado | Registra la opción. Si no era la tercera, muestra la siguiente pregunta; si era la tercera, entra en `revelacion`. |
| `revelacion` | hogar 0–4, tres respuestas de ese hogar | `SIGUIENTE` en H01–H04 | Entra en `pregunta` del siguiente hogar. |
| `revelacion` | H05, tres respuestas | `VER_RESULTADO` | Entra en `resultado`. |
| `resultado` | quince respuestas | `NUEVA_PARTIDA` | Reinicia a H01, pregunta 1, sin respuestas. |

Estado inicial: `pregunta` en H01-Q1. Cualquier evento fuera de su estado, opción desconocida, opción perteneciente a otra pregunta o respuesta duplicada no modifica el estado. Los IDs de opciones globalmente únicos evitan que un segundo clic sobre la opción anterior conteste la pregunta siguiente. El controlador de interfaz también deshabilita la opción activada durante la transición. La revelación de H05 no puede saltarse y la siguiente ronda nunca comienza antes de su revelación correspondiente.

## 8. Casos límite y criterios de aceptación

| Caso | Criterio de aceptación |
| --- | --- |
| Doble clic o activación repetida | Solo se guarda una respuesta; no se salta ninguna pregunta ni revelación. |
| Opción fuera de la pregunta actual | Se rechaza; estado y puntuación permanecen iguales. |
| Intento de avanzar antes de la tercera respuesta | No aparece ni funciona la acción de avance. |
| Intento de volver a puntuar tras responder | La respuesta previa permanece; solo `Nueva partida` restablece elecciones. |
| H05 completado | Aparece su revelación; luego el resultado sobre 30, nunca H06. |
| Inicio de nueva partida | Vuelve a H01-Q1 con total cero y sin respuestas anteriores. |
| Orden visual diferente | Los mismos IDs seleccionados producen idénticos puntos y explicaciones. |
| Uso solo con teclado | Se puede completar la partida, ver revelaciones y reiniciar; el foco es visible y lógico en cada transición. |
| Ilustración en móvil | Permanece presente en pregunta y revelación; texto y controles siguen legibles sin desplazamiento horizontal. |
| Texto alternativo | Describe las pistas necesarias de cada escena sin declarar perfil, solución ni puntos. |
| Conteo de contenido | Existen exactamente 5 hogares, 15 preguntas y 45 opciones; cada hogar suma como máximo 6 y la partida 30. |

## 9. Estrategia TDD RED → GREEN → REFACTOR

Esta sección define la estrategia; **no autoriza iniciar RED**. Tras aprobar la especificación y el plan de implementación, se implementará en ciclos pequeños:

1. **RED — contratos de contenido y puntuación:** pruebas que fallen para invariantes de 5/15/45, IDs únicos, distribución 2/1/0, rechazo de IDs inválidos, máximos 6/30 y estabilidad ante cambios del orden visual.
2. **GREEN:** datos locales y función pura mínimos para satisfacer esos contratos.
3. **REFACTOR:** separar contenido, puntuación y presentación sin alterar resultados; repetir pruebas.
4. **RED — flujo:** pruebas para H01-Q1 inicial, avance de una pregunta, revelación tras la tercera, cinco hogares en orden, resultado y reinicio; incluir doble clic, evento fuera de estado y opción de otra pregunta.
5. **GREEN / REFACTOR:** reductor y componentes mínimos; comprobar navegación por teclado, foco y progreso mediante pruebas de interfaz donde aporten cobertura real.
6. **Revisión editorial:** inspección de las cinco imágenes y sus textos alternativos frente a las pistas prometidas; sesión breve con jugadores para observar comprensión, sorpresa, duración aproximada y deseo de continuar. Se documentarán hallazgos antes de cambiar contenido estático.

## 10. Guardrails, verificación y entrega

En SPECIFY solo se autoriza este documento. No se crean imágenes, archivos de aplicación ni dependencias; no se ejecutan RED/GREEN/REFACTOR. Tampoco se hace commit ni push, conforme al guardrail vigente. La aprobación de este documento es una puerta independiente: después se prepara y revisa el plan de implementación con `superpowers:writing-plans`; empezar RED requiere autorización expresa del usuario.

Cuando se autorice implementación, la verificación incluirá pruebas automatizadas del motor y del flujo, revisión de compilación y tipado, comprobación manual con teclado y móvil, auditoría editorial de pistas frente a las quince claves, y una partida completa que confirme cada subtotal y el total. La entrega del MVP incluirá instrucciones locales de ejecución y un resumen de pruebas y limitaciones observadas. La evaluación con jugadores medirá entretenimiento y aclarará si el objetivo de 45–60 segundos por hogar es realista; no hay requisito de bloquear sesiones más largas.
