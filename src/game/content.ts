import type { Home, Option, Points, Question } from './types'

type OptionInput = readonly [key: string, label: string, points: Points, explanation: string]

function question(id: string, kind: Question['kind'], prompt: string, inputs: readonly OptionInput[]): Question {
  const options: Option[] = inputs.map(([key, label, points, explanation]) => ({
    id: id + '-' + key, label, points, explanation,
  }))
  return { id, kind, prompt, options }
}

export const homes: readonly Home[] = [
  {
    id: 'H01', title: 'El taller azul', imageSrc: '/homes/h01.svg',
    revealPortrait: {
      src: '/characters/vera-reveal.webp',
      alt: 'Retrato ilustrado de Vera con pañuelo amarillo y delantal azul',
    },
    profileName: 'Vera',
    imageAlt: 'En un rincón azul hay una bicicleta a medio reparar, herramientas, un banquito con tornillos, un mapa marcado, postales de murales y muestras de color cerca de una pared pintada.',
    profile: 'Me gusta recuperar bicicletas y salir a buscar murales. Anoto sus colores en un mapa para recordar cada paseo.',
    reveal: 'La bicicleta y las herramientas explican las reparaciones. El mapa y las postales conectan los paseos con los murales; las muestras forman un diario de color.',
    questions: [
      question('H01-Q1', 'concreta', '¿Qué suele reparar quien vive aquí?', [
        ['bicicletas', 'Bicicletas', 2, 'La bicicleta a medio reparar y la bomba señalan la actividad de Vera.'],
        ['muebles', 'Muebles', 1, 'El banquito con tornillos y las herramientas hacen plausible reparar muebles.'],
        ['lamparas', 'Lámparas', 0, 'No se ve ninguna lámpara que necesite reparación.'],
      ]),
      question('H01-Q2', 'interpretativa', '¿Qué plan reúne mejor las pistas?', [
        ['murales', 'Recorrer murales en bicicleta', 2, 'La bicicleta, el mapa y las postales de murales reúnen los dos intereses de Vera.'],
        ['paseo', 'Pasear en bicicleta por el barrio', 1, 'La bicicleta y el mapa sostienen un paseo, aunque faltan los murales.'],
        ['recetas', 'Probar recetas nuevas', 0, 'La escena no muestra pistas de cocina o recetas.'],
      ]),
      question('H01-Q3', 'sorpresa', '¿Para qué guarda muestras de color junto al mapa?', [
        ['diario', 'Para recordar los colores de los murales visitados', 2, 'Las muestras junto al mapa y las postales forman un diario de murales.'],
        ['pintura', 'Para elegir pintura para su casa', 1, 'La prueba de pintura en la pared permite pensar en una reforma.'],
        ['piezas', 'Para clasificar piezas de bicicleta', 0, 'No hay un uso mecánico visible para esas muestras de color.'],
      ]),
    ],
  },
  {
    id: 'H02', title: 'La cocina verde', imageSrc: '/homes/h02.svg', profileName: 'Gael',
    imageAlt: 'En una cocina verde hay macetas de hierbas, una en flor, hojas secándose, tetera, frascos de condimentos, sobres ilustrados, semillas, bolsitas de infusión y un plano de una plaza.',
    profile: 'Cultivo hierbas para preparar infusiones. También intercambio semillas en la plaza para probar plantas nuevas.',
    reveal: 'La tetera y las hojas secas apuntan a las infusiones. Unas semillas en un sobre y el plano de la plaza revelan el intercambio.',
    questions: [
      question('H02-Q1', 'concreta', '¿Qué cultiva principalmente?', [
        ['hierbas', 'Hierbas aromáticas', 2, 'Las macetas y hojas secándose muestran el cultivo principal de Gael.'],
        ['flores', 'Flores', 1, 'Una de las macetas está en flor.'],
        ['arboles', 'Árboles frutales', 0, 'No se ven árboles frutales en la cocina.'],
      ]),
      question('H02-Q2', 'interpretativa', '¿Para qué seca las hojas?', [
        ['infusiones', 'Para preparar infusiones', 2, 'La tetera y las bolsitas junto a las hojas indican infusiones.'],
        ['condimento', 'Para usarlas como condimento', 1, 'Los frascos de condimentos también apoyan un uso culinario.'],
        ['adornos', 'Para hacer adornos de pared', 0, 'No hay marcos ni materiales para transformar las hojas en adornos.'],
      ]),
      question('H02-Q3', 'sorpresa', '¿Qué hace con los sobres ilustrados?', [
        ['semillas', 'Intercambia semillas', 2, 'Las semillas que asoman y el plano de la plaza anticipan el intercambio.'],
        ['te', 'Regala mezclas de té', 1, 'Las bolsitas de infusión al lado de los sobres hacen plausible ese regalo.'],
        ['recibos', 'Guarda recibos', 0, 'No se ven recibos o papeles de compras en los sobres.'],
      ]),
    ],
  },
  {
    id: 'H03', title: 'El escenario de papel', imageSrc: '/homes/h03.svg', profileName: 'Leo',
    imageAlt: 'En un estudio violeta una lámpara ilumina un escenario de cartón con figuras de peces, olas y un bote. Hay recortes en la pared, boletos hechos a mano y un calendario con un patio dibujado.',
    profile: 'Invento historias de sombras con papel. Estoy preparando una aventura submarina para mostrarla en el patio.',
    reveal: 'La lámpara y el escenario muestran un teatro de sombras. Los peces sitúan la aventura bajo el mar; boletos y calendario revelan una función en el patio.',
    questions: [
      question('H03-Q1', 'concreta', '¿Qué está preparando?', [
        ['teatro', 'Una función de teatro de sombras', 2, 'La lámpara detrás del escenario y las siluetas de papel indican teatro de sombras.'],
        ['adornos', 'Adornos para una habitación', 1, 'Algunos recortes están sujetos a la pared como adornos.'],
        ['album', 'Un álbum de fotos', 0, 'No aparecen fotografías o un álbum en el estudio.'],
      ]),
      question('H03-Q2', 'interpretativa', '¿Qué historia sugieren las figuras?', [
        ['mar', 'Una aventura bajo el mar', 2, 'Los peces y las olas sitúan la historia bajo el mar.'],
        ['rio', 'Un viaje por un río', 1, 'El bote y las olas también permiten imaginar un viaje fluvial.'],
        ['autos', 'Una carrera de autos', 0, 'No hay figuras de autos o pistas de carreras.'],
      ]),
      question('H03-Q3', 'sorpresa', '¿Para qué hizo los boletos de cartón?', [
        ['patio', 'Para invitar a una función en el patio', 2, 'Los boletos y el patio marcado en el calendario anticipan la función compartida.'],
        ['casa', 'Para invitar a una función dentro de casa', 1, 'El escenario está dentro del estudio y podría usarse allí.'],
        ['senaladores', 'Para usarlos como señaladores', 0, 'No hay libros junto a los boletos que sugieran ese uso.'],
      ]),
    ],
  },
  {
    id: 'H04', title: 'Las postales sonoras', imageSrc: '/homes/h04.svg', profileName: 'Noa',
    imageAlt: 'Junto a una ventana urbana hay una grabadora, auriculares, un teclado pequeño, un mapa de paseos, cuaderno con notas y dibujos de ondas, y un sobre entreabierto con hojas de notas junto a otro ilustrado.',
    profile: 'Salgo a escuchar y registrar sonidos cotidianos. Después dibujo postales inspiradas en ellos y las envío a mis amistades.',
    reveal: 'Grabadora, mapa y notas de lugares muestran paseos sonoros. Los dibujos de ondas pasan a los sobres: Noa envía postales ilustradas a sus amistades.',
    questions: [
      question('H04-Q1', 'concreta', '¿Qué suele grabar?', [
        ['lugares', 'Sonidos de distintos lugares', 2, 'La grabadora y el mapa de paseos vinculan los sonidos con lugares.'],
        ['melodias', 'Melodías que compone', 1, 'El teclado y los auriculares sugieren que también podría grabar música.'],
        ['videos', 'Vídeos de edificios', 0, 'No hay cámara o pantalla de vídeo.'],
      ]),
      question('H04-Q2', 'interpretativa', '¿Qué hace al volver a casa?', [
        ['dibuja', 'Dibuja lo que le sugieren esos sonidos', 2, 'El cuaderno reúne bocetos de ondas, lluvia y calles tras los paseos.'],
        ['notas', 'Escribe notas sobre el paseo', 1, 'El cuaderno contiene notas escritas además de dibujos.'],
        ['compras', 'Organiza compras para la semana', 0, 'No aparece una lista de compras ni alimentos.'],
      ]),
      question('H04-Q3', 'sorpresa', '¿Para qué prepara sobres con dibujos de ondas?', [
        ['postales', 'Para enviar postales inspiradas en sonidos', 2, 'Los dibujos se repiten en los sobres preparados para enviar.'],
        ['archivo', 'Para archivar notas de sus paseos', 1, 'Algunos sobres contienen hojas de notas.'],
        ['entradas', 'Para vender entradas a conciertos', 0, 'No se ven entradas ni anuncios de concierto.'],
      ]),
    ],
  },
  {
    id: 'H05', title: 'La azotea del viento', imageSrc: '/homes/h05.svg', profileName: 'Teo',
    imageAlt: 'En una azotea hay un paraguas roto, retazos y bolsa de tela, cometas numeradas de distintas formas, telas colgadas con pinzas, flechas de viento y una libreta con marcas de pruebas y estrellas junto a algunos diseños.',
    profile: 'Convierto paraguas rotos en cometas. Numero mis diseños para comparar cómo vuela cada forma.',
    reveal: 'El paraguas y los retazos muestran el material reutilizado. Los números, las flechas de viento y las marcas de la libreta revelan las pruebas de vuelo.',
    questions: [
      question('H05-Q1', 'concreta', '¿Qué material reutiliza para construir cometas?', [
        ['paraguas', 'Tela de paraguas', 2, 'El paraguas roto está junto a retazos y cometas hechas de tela similar.'],
        ['bolsas', 'Bolsas de tela', 1, 'Una bolsa y un retazo parecido están cerca de las cometas.'],
        ['papel', 'Papel de regalo', 0, 'No se ve papel de regalo entre los materiales.'],
      ]),
      question('H05-Q2', 'interpretativa', '¿Qué actividad sugieren la azotea y las flechas de viento?', [
        ['pruebas', 'Probar cometas', 2, 'Las cometas de distintas formas y las flechas de viento indican pruebas de vuelo.'],
        ['secar', 'Secar telas al aire', 1, 'Hay telas colgadas con pinzas en la azotea.'],
        ['verduras', 'Cultivar verduras', 0, 'No se aprecia ningún cultivo de verduras.'],
      ]),
      question('H05-Q3', 'sorpresa', '¿Por qué tienen números las cometas?', [
        ['comparar', 'Para comparar cómo vuela cada diseño', 2, 'Los números corresponden a marcas de prueba en la libreta.'],
        ['favoritos', 'Para ordenar sus diseños favoritos', 1, 'La libreta también incluye una lista de favoritos.'],
        ['precios', 'Para indicar sus precios', 0, 'No hay etiquetas de precio ni señales de venta.'],
      ]),
    ],
  },
]
