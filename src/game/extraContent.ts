import type { Home, Question } from './types'

type ClueQuestion = readonly [prompt: string, exact: string, plausible: string, unsupported: string, exactClue: string, plausibleClue: string]
type NewHome = readonly [title: string, name: string, alt: string, profile: string, reveal: string, questions: readonly [ClueQuestion, ClueQuestion, ClueQuestion]]

// Cada respuesta parcial señala un objeto visible. Las escenas SVG mantienen esas pistas sin escribir la solución.
const stories: readonly NewHome[] = [
  ['El observatorio de ventana', 'Alma',
    'Junto a una ventana hay un telescopio, dibujos de la Luna, un calendario con fases, una cámara, un cuaderno de nubes y una pequeña lámpara roja.',
    'Fotografío la Luna desde mi ventana y comparo sus fases en un cuaderno. Uso una luz roja para no deslumbrarme durante las observaciones.',
    'Telescopio, cámara y dibujos lunares explican las fotos. El calendario permite comparar fases; la lámpara roja conserva la visión nocturna.', [
      ['¿Qué observa desde la ventana?', 'La Luna', 'Las nubes', 'Los trenes', 'El telescopio apunta al cielo y el cuaderno repite dibujos lunares.', 'El cuaderno también contiene formas de nubes.'],
      ['¿Para qué marca el calendario?', 'Para comparar las fases de la Luna', 'Para anotar el tiempo atmosférico', 'Para contar cumpleaños', 'Las fechas acompañan dibujos de distintas fases lunares.', 'Hay bocetos de nubes junto a las fechas.'],
      ['¿Por qué usa una lámpara roja?', 'Para conservar la visión nocturna', 'Para iluminar las fotos', 'Para calentar el telescopio', 'La luz roja junto al telescopio evita un destello blanco al observar.', 'La lámpara está cerca de la cámara y podría iluminar una toma.'],
    ]],
  ['La mesa de las cartas', 'Bruno',
    'Una mesa contiene sellos, sobres, un mapa con rutas, tarjetas con dibujos de aves, una lupa, plumas y una caja con postales antiguas.',
    'Intercambio cartas ilustradas sobre las aves que veo en mis paseos. Guardo postales antiguas para comparar cómo cambiaron los lugares.',
    'Los dibujos de aves y los sobres preparados indican el intercambio. El mapa y las postales antiguas permiten comparar paisajes a través del tiempo.', [
      ['¿Qué dibuja en sus cartas?', 'Aves de sus paseos', 'Mapas de caminos', 'Retratos de familia', 'Las tarjetas muestran distintas aves junto a una pluma.', 'El mapa abierto también podría servir de modelo para dibujar rutas.'],
      ['¿Qué hace con los sobres preparados?', 'Intercambia cartas ilustradas', 'Envía postales de viaje', 'Guarda facturas', 'Sellos y tarjetas con aves están listos para enviarse.', 'La caja de postales antiguas hace plausible enviar postales.'],
      ['¿Por qué conserva postales antiguas?', 'Para comparar cómo cambiaron los lugares', 'Para estudiar sellos antiguos', 'Para hacer una baraja', 'Las postales y el mapa muestran vistas del mismo recorrido en épocas distintas.', 'Hay sellos visibles en los sobres y en algunas postales.'],
    ]],
  ['El rincón de las mareas', 'Cora',
    'En una mesa costera hay conchas, una regla, un cuaderno de mareas, un reloj, dibujos de charcos de roca, un pincel y una pequeña pecera vacía.',
    'Visito los charcos de roca cuando baja la marea. Mido las conchas que encuentro y dibujo los pequeños seres que observo antes de dejarlos allí.',
    'El cuaderno con horas de marea y los bocetos de charcos explican las visitas. Regla y conchas muestran las medidas; el pincel sirve para dibujar.', [
      ['¿Qué recoge para observar?', 'Conchas', 'Piedras lisas', 'Monedas', 'Las conchas están ordenadas junto a la regla.', 'El dibujo del charco incluye piedras redondeadas.'],
      ['¿Cuándo visita los charcos de roca?', 'Cuando baja la marea', 'Cuando llueve', 'Al anochecer', 'El cuaderno combina horas con marcas de marea baja.', 'El reloj y algunas gotas dibujadas permiten pensar en otro momento del día.'],
      ['¿Por qué tiene una pecera vacía?', 'Para observar sin llevarse animales a casa', 'Para montar un acuario en casa', 'Para guardar monedas', 'Los dibujos muestran seres en los charcos y la pecera está vacía tras la visita.', 'Una pecera también sugiere un acuario doméstico.'],
    ]],
  ['El laboratorio de sabores', 'Dani',
    'Sobre una encimera hay frascos de especias, cítricos, una balanza, etiquetas con números, un cuaderno de mezclas, cucharas y moldes de galletas.',
    'Pruebo mezclas de especias para hornear galletas. Numero cada receta y comparto las favoritas con mis vecinos.',
    'La balanza, los moldes y el cuaderno explican las pruebas de galletas. Las etiquetas numeradas conectan cada mezcla con su receta.', [
      ['¿Qué está preparando?', 'Galletas con especias', 'Bebidas con cítricos', 'Sopa de verduras', 'Los moldes y la bandeja apuntan a galletas; hay especias medidas.', 'Los cítricos y las cucharas también podrían acompañar una bebida.'],
      ['¿Para qué usa la balanza?', 'Para comparar mezclas de ingredientes', 'Para pesar los paquetes que envía', 'Para reparar el horno', 'Las cantidades del cuaderno corresponden a frascos junto a la balanza.', 'Hay paquetes de papel cerca de las mezclas.'],
      ['¿Por qué numera los frascos?', 'Para relacionarlos con sus recetas de prueba', 'Para ordenarlos por antigüedad', 'Para ponerles precio', 'Los números reaparecen en las páginas del cuaderno de mezclas.', 'Los frascos tienen tamaños distintos y podrían ordenarse en una estantería.'],
    ]],
  ['La estación de hilos', 'Elena',
    'En una mesa hay hilos de colores, agujas, retazos de ropa, un calcetín remendado, un bastidor con flores, un cartel de intercambio y botones.',
    'Remiendo ropa de mis amistades y enseño a reparar prendas en reuniones de intercambio. Los bordados de flores señalan mis arreglos.',
    'El calcetín remendado y los botones muestran reparaciones. El cartel invita al intercambio y las flores del bastidor reaparecen en las prendas.', [
      ['¿Qué hace con la ropa sobre la mesa?', 'La remienda', 'La tiñe', 'La vende nueva', 'Las agujas y el calcetín con puntadas muestran un arreglo.', 'Los hilos de colores podrían sugerir teñir o cambiar el color.'],
      ['¿Qué ocurre en sus reuniones?', 'Enseña a reparar prendas', 'Organiza un desfile', 'Colecciona etiquetas', 'El cartel de intercambio está junto a agujas y prendas reparadas.', 'Los retazos de colores también podrían formar parte de una muestra de ropa.'],
      ['¿Para qué borda flores en las prendas?', 'Para señalar sus arreglos', 'Para copiar un mantel antiguo', 'Para ocultar precios', 'Las flores del bastidor se repiten sobre zonas remendadas.', 'Un mantel con flores cuelga al fondo y podría servir de modelo.'],
    ]],
  ['La biblioteca diminuta', 'Fede',
    'Un estante contiene libros pequeños, una maqueta de puerta, tarjetas de préstamo, lápices, un mapa del barrio, una caja de madera y una linterna.',
    'Construí una pequeña biblioteca para dejar libros en la plaza. Uso tarjetas para que quienes los lleven recomienden otra lectura.',
    'La caja con puerta y los libros pequeños forman la biblioteca. El mapa señala la plaza; las tarjetas permiten compartir recomendaciones.', [
      ['¿Qué guarda en la caja de madera?', 'Libros para compartir', 'Herramientas de carpintería', 'Semillas para plantar', 'La caja tiene una puerta y está llena de libros pequeños.', 'La maqueta y los lápices sugieren que construye objetos de madera.'],
      ['¿Dónde piensa colocarla?', 'En la plaza del barrio', 'En su dormitorio', 'En una estación de tren', 'La plaza está marcada en el mapa junto a la maqueta.', 'La caja está ahora dentro de su habitación.'],
      ['¿Para qué son las tarjetas de préstamo?', 'Para recomendar otras lecturas', 'Para cobrar multas', 'Para marcar páginas', 'Las tarjetas tienen espacios para escribir títulos sugeridos.', 'Por su tamaño también podrían servir de señaladores.'],
    ]],
  ['El estudio de las sombras', 'Gina',
    'Hay hojas grandes con siluetas de plantas, una lámpara, macetas, papeles transparentes, una prensa de flores, un reloj y marcos vacíos.',
    'Calco las sombras de mis plantas a distintas horas y hago láminas para regalar. Prenso algunas flores para recordar de qué planta salió cada forma.',
    'La lámpara, las macetas y los papeles muestran el calco de sombras. El reloj explica la comparación horaria; la prensa conserva flores.', [
      ['¿Qué copia sobre el papel?', 'Sombras de plantas', 'Letras de libros', 'Mapas de ciudades', 'Las siluetas del papel coinciden con las hojas de las macetas.', 'Hay hojas prensadas que también podrían copiarse directamente.'],
      ['¿Por qué tiene un reloj junto a los dibujos?', 'Para comparar sombras a distintas horas', 'Para medir el secado de pintura', 'Para salir a caminar puntual', 'Las hojas dibujadas cambian de dirección junto a distintas horas anotadas.', 'Los papeles húmedos podrían hacer pensar en tiempos de secado.'],
      ['¿Qué hace con las flores prensadas?', 'Recuerda qué planta produjo cada dibujo', 'Prepara infusiones', 'Decora velas', 'Las flores prensadas están al lado de dibujos de la misma planta.', 'Las macetas y flores también podrían usarse en una infusión.'],
    ]],
  ['El taller de juguetes', 'Hugo',
    'Hay ruedas de madera, un tren de juguete, tornillos, una caja de donaciones, pinceles, piezas de rompecabezas y un álbum de fotos.',
    'Reparo juguetes para donarlos. Antes de entregarlos fotografío cada arreglo para recordar cómo volver a hacerlo.',
    'El tren sin una rueda y las herramientas muestran reparaciones. La caja de donaciones señala el destino; el álbum documenta arreglos.', [
      ['¿Qué arregla en su mesa?', 'Juguetes', 'Bicicletas', 'Lámparas', 'El tren de juguete y sus ruedas están junto a tornillos.', 'Las ruedas sueltas podrían recordar piezas de una bicicleta.'],
      ['¿Qué hace al terminar cada arreglo?', 'Lo dona', 'Lo guarda en una vitrina', 'Lo vende en una tienda', 'La caja marcada para donaciones espera los juguetes reparados.', 'El álbum y las piezas ordenadas sugieren una colección.'],
      ['¿Para qué fotografía los arreglos?', 'Para recordar cómo repararlos otra vez', 'Para hacer un catálogo de ventas', 'Para decorar las cajas', 'El álbum muestra pasos del mismo tren antes y después.', 'Las fotos en serie también podrían parecer un catálogo.'],
    ]],
  ['El jardín de papel', 'Iris',
    'Una mesa muestra flores de papel, tijeras, una guía de plantas, semillas, una regadera, un calendario de lluvia y una guirnalda a medio hacer.',
    'Hago flores de papel inspiradas en las plantas que cultivo. Cuando llueve, preparo guirnaldas para decorar la sala comunitaria.',
    'La guía y las macetas conectan plantas reales con flores de papel. El calendario de lluvia y la guirnalda explican cuándo y para qué trabaja.', [
      ['¿De qué material son las flores de la mesa?', 'De papel', 'De tela', 'De vidrio', 'Los pliegues y las tijeras junto a las flores muestran papel.', 'Un retazo de tela junto a la guirnalda permite otra lectura.'],
      ['¿En qué se inspira para hacerlas?', 'En las plantas que cultiva', 'En cuadros antiguos', 'En revistas de moda', 'La guía abierta y las macetas tienen formas parecidas a las flores plegadas.', 'Un cuadro floral cuelga detrás de la mesa.'],
      ['¿Qué hace los días de lluvia?', 'Prepara guirnaldas para la sala comunitaria', 'Riega las plantas del patio', 'Sale a vender semillas', 'El calendario de lluvia está junto a una guirnalda y un plano de la sala.', 'La regadera y las semillas podrían sugerir tareas de jardín.'],
    ]],
  ['El mapa del aroma', 'Juli',
    'Sobre una mesa hay granos de café, frascos de hierbas, un mapa con puntos, tazas, una libreta de aromas, una bicicleta y etiquetas de colores.',
    'Recorro el barrio en bicicleta para probar cafés. Anoto sus aromas en un mapa y comparo cada taza con las hierbas que cultivo.',
    'La bicicleta y el mapa muestran el recorrido. Tazas, granos y libreta conectan cada sitio con aromas; los frascos aportan comparaciones.', [
      ['¿Qué prueba durante sus recorridos?', 'Cafés', 'Tés', 'Helados', 'Las tazas y los granos de café ocupan el centro de la mesa.', 'Los frascos de hierbas podrían usarse para preparar té.'],
      ['¿Cómo visita los lugares del mapa?', 'En bicicleta', 'A pie', 'En tren', 'La bicicleta está junto al mapa de paradas.', 'Las paradas aparecen cercanas y podrían recorrerse a pie.'],
      ['¿Para qué coloca etiquetas de colores en el mapa?', 'Para comparar aromas de distintas tazas', 'Para marcar jardines con hierbas', 'Para señalar casas en venta', 'Los colores reaparecen junto a notas de aroma y tazas dibujadas.', 'Algunos frascos de hierbas tienen etiquetas parecidas.'],
    ]],
  ['El cuarto de los ritmos', 'Kira',
    'Hay tambores de distintos tamaños, una grabadora, cucharas de madera, una tabla de ritmos, ollas, auriculares y una invitación para una reunión.',
    'Compongo ritmos con objetos de cocina y los enseño en reuniones del barrio. Grabo cada patrón para poder repetirlo.',
    'Ollas, cucharas y tambores explican la música. La grabadora guarda patrones; la invitación y la tabla señalan la reunión.', [
      ['¿Con qué objetos crea ritmos?', 'Con ollas y cucharas', 'Con vasos de cristal', 'Con piedras del jardín', 'Las ollas y cucharas están junto a la tabla de golpes.', 'Los tambores también se usan para crear ritmos.'],
      ['¿Por qué tiene una grabadora?', 'Para repetir sus patrones musicales', 'Para registrar conversaciones', 'Para escuchar noticias', 'La grabadora está al lado de secuencias de golpes escritas.', 'La invitación a una reunión hace plausible grabar voces.'],
      ['¿Para qué prepara la tabla de ritmos?', 'Para enseñar a tocar en una reunión', 'Para contar utensilios de cocina', 'Para organizar tareas domésticas', 'La tabla está junto a una invitación y dibujos de golpes.', 'Los dibujos incluyen cucharas y ollas que podrían ser un inventario.'],
    ]],
  ['El archivo de hojas', 'Lara',
    'En un escritorio hay hojas prensadas, una lupa, un mapa de árboles, lápices de colores, una libreta de estaciones, una cámara y una carpeta.',
    'Registro cómo cambian los árboles del barrio en cada estación. Prenso una hoja caída de cada visita y dibujo sus colores.',
    'El mapa de árboles y la libreta de estaciones muestran visitas repetidas. Hojas prensadas y lápices permiten comparar formas y colores.', [
      ['¿Qué conserva en su carpeta?', 'Hojas caídas', 'Recetas de cocina', 'Fotografías de edificios', 'Las hojas prensadas están dentro de la carpeta.', 'La cámara cercana podría sugerir un archivo fotográfico.'],
      ['¿Qué estudia a lo largo del año?', 'Cambios de los árboles', 'El tránsito del barrio', 'Horarios de trenes', 'El mapa marca árboles y la libreta separa estaciones.', 'El mapa urbano podría usarse para observar el tránsito.'],
      ['¿Por qué dibuja cada hoja?', 'Para comparar sus colores entre estaciones', 'Para diseñar ropa', 'Para imprimir etiquetas', 'Los dibujos de una misma forma muestran colores distintos según el mes.', 'Hay lápices y una tela estampada cerca del escritorio.'],
    ]],
  ['La mesa de los acertijos', 'Milo',
    'Una mesa contiene piezas de rompecabezas, sobres numerados, un mapa del barrio, una llave de cartón, dibujos de puertas, una libreta y pegatinas.',
    'Creo búsquedas de pistas para mis amistades. Cada sobre lleva a un lugar del barrio y la llave de cartón marca la última pista.',
    'Sobres numerados y mapa forman una ruta de acertijos. La llave de cartón y la puerta dibujada anuncian la pista final.', [
      ['¿Qué está preparando en la mesa?', 'Una búsqueda de pistas', 'Un álbum de viajes', 'Una receta de cocina', 'Los sobres numerados y las piezas forman una secuencia de acertijos.', 'El mapa y las pegatinas podrían parecer recuerdos de viaje.'],
      ['¿Dónde están las pistas?', 'En lugares del barrio', 'Solo dentro de su casa', 'En páginas de un libro', 'Los números de los sobres corresponden a puntos del mapa.', 'Los sobres aún están sobre la mesa de casa.'],
      ['¿Qué representa la llave de cartón?', 'La última pista', 'Una copia de la llave de casa', 'Un premio metálico', 'La llave de cartón aparece al final de la secuencia de sobres.', 'Los dibujos de puertas hacen pensar en una llave de verdad.'],
    ]],
  ['La esquina de las nubes', 'Nina',
    'Una ventana da al cielo; junto a ella hay una cámara, dibujos de nubes, una cometa pequeña, un pluviómetro, un calendario y tarjetas de formas.',
    'Fotografío nubes desde mi ventana y dibujo las formas que imagino en ellas. Uso el pluviómetro para comparar mis dibujos con los días de lluvia.',
    'La cámara y las tarjetas de nubes muestran observaciones. El pluviómetro y el calendario relacionan formas con lluvia.', [
      ['¿Qué fotografía desde la ventana?', 'Nubes', 'Aves', 'Autos', 'Las fotos y dibujos sobre la mesa repiten formas de nubes.', 'Una silueta de ave aparece en una tarjeta.'],
      ['¿Qué añade a sus fotografías?', 'Dibujos de formas imaginadas', 'Números de matrículas', 'Precios de venta', 'Las tarjetas superponen trazos sobre contornos de nubes.', 'Las fechas del calendario hacen plausible añadir números.'],
      ['¿Para qué usa el pluviómetro?', 'Para comparar sus dibujos con días de lluvia', 'Para regar plantas', 'Para medir la altura de su cometa', 'El recipiente medidor aparece junto a fechas lluviosas y tarjetas de nubes.', 'La cometa está al lado de la ventana y podría medirse el viento.'],
    ]],
  ['El rincón de los faros', 'Omar',
    'Hay maquetas de faros, una lámpara, mapas de costa, piezas de cartón, fotografías, un cuaderno de luces y un barco de papel.',
    'Construyo maquetas de faros que visité. Pruebo distintas luces en ellas para mostrar cómo guían a los barcos.',
    'Fotografías y mapas explican los faros visitados. Las maquetas, la lámpara y el barco de papel muestran pruebas de señales luminosas.', [
      ['¿Qué construye con cartón?', 'Maquetas de faros', 'Castillos', 'Casas para pájaros', 'Las piezas de cartón tienen forma de torre y coinciden con las fotos de faros.', 'Una estructura con techo podría parecer una casa pequeña.'],
      ['¿Por qué guarda mapas de costa?', 'Para recordar faros que visitó', 'Para planear un viaje en barco', 'Para buscar tesoros', 'Los faros fotografiados están marcados sobre la costa.', 'El barco de papel sugiere un viaje marítimo.'],
      ['¿Para qué prueba luces en las maquetas?', 'Para mostrar cómo guían barcos', 'Para decorar una fiesta', 'Para secar pintura', 'El cuaderno dibuja haces de luz hacia un barco.', 'Las luces pequeñas también podrían ser adornos.'],
    ]],
]

const kinds = ['concreta', 'interpretativa', 'sorpresa'] as const

export const extraHomes: readonly Home[] = stories.map(([title, profileName, imageAlt, profile, reveal, clues], index) => {
  const id = `H${String(index + 6).padStart(2, '0')}`
  const questions: Question[] = clues.map(([prompt, exact, plausible, unsupported, exactClue, plausibleClue], questionIndex) => {
    const questionId = `${id}-Q${questionIndex + 1}`
    const options = [
      { id: `${questionId}-a`, label: exact, points: 2 as const, explanation: exactClue },
      { id: `${questionId}-b`, label: plausible, points: 1 as const, explanation: plausibleClue },
      { id: `${questionId}-c`, label: unsupported, points: 0 as const, explanation: 'No hay pistas que apoyen esa respuesta.' },
    ]
    const shift = (index + questionIndex) % 3
    return {
      id: questionId, kind: kinds[questionIndex], prompt,
      options: [...options.slice(shift), ...options.slice(0, shift)],
    }
  })
  return { id, title, imageSrc: `/homes/${id.toLowerCase()}.svg`, imageAlt, profileName, profile, reveal, questions }
})
