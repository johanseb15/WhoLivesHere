# Visual P1 — criterios de aceptación de activos finales

**Estado:** criterios preparados; ningún PNG de `candidates/` está aprobado como activo final. La dirección editorial fotorrealista ficticia y el canon de Vera están aprobados. La integración al juego espera aprobación explícita de los archivos finales.

## Entrega para revisión

- Hoja maestra limpia de Vera con vistas frontal, tres cuartos, perfil y espalda, más expresiones neutral, sorpresa y celebración; pose de revelación derivada de esa misma hoja.
- Escena H01 «El taller azul» original y ficticia, maestro vertical 4:5; versión desktop de la misma escena con extensión lateral o encuadre equivalente.
- Derivados WebP optimizados para móvil y desktop, nombres y dimensiones declarados, origen documentado y SHA256 de cada archivo final. No usar fotos de hogares ni personas reales, marcas o contenido de terceros no autorizado.
- Registro de revisión que identifique cada archivo y su hash, resultado de los controles siguientes y aprobación o rechazo explícitos. Un candidato no se vuelve final por estar presente en el repositorio.

## Vera: canon ADN v1.1

- [ ] Proporción de **2,5 cabezas** y silueta coherente en todas las vistas y en la pose de revelación.
- [ ] Moño alto de rulos negro azulados, scrunchie amarillo abullonado con pictograma de bicicleta, mancha celeste en la nariz, delantal azul cobalto con abanico de muestras y zapatillas blancas salpicadas de pintura.
- [ ] Sin aros ni anteojos; colores, ropa y cinco rasgos de identidad consistentes entre vistas y expresiones.
- [ ] Rasgos y silueta reconocibles a 96 px de alto; fondo limpio y sin texto, etiquetas, logos ni marcas de agua.

## H01: pistas y calidad de deducción

| Pregunta | Pista fuerte de 2 puntos | Apoyo visible para 1 punto | Evitar pista para 0 puntos |
|---|---|---|---|
| P1 | Bicicleta en caballete con rueda desmontada y **bomba visible** | Banquito con tornillos flojos junto a herramientas | Lámpara intervenida, cables o repuestos eléctricos |
| P2 | Bicicleta, mapa con ruta y postales de murales | Bicicleta y mapa también permiten pensar en un paseo por el barrio | Utensilios o libros de recetas |
| P3 | Muestras de color pegadas junto al mapa y postales | Pequeña prueba de pintura en otra zona de la pared, de color distinto | Piezas de bicicleta clasificadas |

- [ ] Las pistas de 2 puntos tienen apoyo claro sin convertir las tres respuestas en obvias a primera vista; las de 1 punto son realmente plausibles y secundarias.
- [ ] La bomba es reconocible a escala móvil. La escena no contiene rótulos, flechas, brillos, textos legibles ni marcas que delaten respuestas.
- [ ] Los objetos tienen forma y relación espacial creíbles; la escena mantiene el carácter de vivienda taller ficticia y no incorpora personas.

## Encuadre y archivo final

- [ ] Todas las pistas obligatorias están en el **maestro 4:5 completo** y son distinguibles al visualizarlo a 390 px de ancho. No dependen de un recorte o de la extensión desktop.
- [ ] El encuadre desktop conserva la misma disposición y todas las pistas; no introduce información exclusiva ni contradice el maestro.
- [ ] Revisar ambos encuadres a tamaño de uso y al 200 % para detectar deformaciones, texto accidental y pistas perdidas. Confirmar legibilidad sin depender solo del color.
- [ ] Derivados finales en WebP local, sin recursos remotos obligatorios. Objetivos de peso de la Art Bible: móvil ≤ 150 KB y desktop ≤ 250 KB; registrar dimensiones, peso y SHA256 medidos.
- [ ] Preparar texto alternativo descriptivo de la escena, incluida la bomba, sin revelar respuestas. La interfaz deberá conservar foco visible, navegación por teclado y progreso legible al integrar los activos.

## Gate

La revisión visual puede rechazar cualquier activo que incumpla estos criterios. Registrar aprobación explícita de la hoja y pose de Vera, del maestro H01 y del derivado desktop antes de iniciar su integración. El [plan técnico existente](../../superpowers/plans/2026-10-13-wholiveshere-visual-p1.md) sigue vigente; `public/homes/h01.svg` permanece en uso hasta completar el gate y la implementación posterior.
