import { Book } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-gothic-mystery',
    title: 'Sombras en los Adoquines',
    subtitle: 'Un misterio victoriano en la niebla de Whitechapel',
    author: {
      name: 'Eleanor Vance',
      username: 'eleanor_vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Escritora de intriga gótica, amante del té negro y las bibliotecas antiguas.',
      isVerified: true,
      followersCount: 14200,
    },
    genre: 'Misterio & Gótico',
    coverImage: '/src/assets/images/cover_gothic_mystery_1794252057956.jpg',
    excerpt:
      'La niebla de medianoche se arremolinaba como gas venenoso sobre los adoquines húmedos. Bajo el solitario farol de gas de Miller’s Court, el inspector Julian escuchó el tic-tac de un reloj que no le pertenecía...',
    fullContent: {
      synopsis:
        'Londres, noviembre de 1889. Mientras la ciudad duerme envuelta en una bruma casi impenetrable, una serie de cartas firmadas con ceniza comienzan a aparecer en los bolsillos de los inspectores de Scotland Yard. Julian Ashford deberá adentrarse en los secretos más oscuros de la alta sociedad británica antes de que caiga el último farol.',
      chapters: [
        {
          number: 1,
          title: 'I. El Farol de Miller’s Court',
          content: [
            'La niebla de medianoche se arremolinaba como gas venenoso sobre los adoquines húmedos de Whitechapel. No era la bruma habitual del Támesis; olía a carbón quemado, a azufre y al aliento agrio de una ciudad que devoraba a sus propios hijos.',
            'Bajo la titilante luz de gas, el inspector Julian Ashford ajustó la solapa de su abrigo de paño grueso. En el suelo, junto al charco cobrizo que reflejaba la bombilla amarillenta, yacía un reloj de bolsillo de plata maciza. El cristal estaba intacto, pero las manecillas giraban en sentido contrario a las agujas del tiempo, con un compás firme y burlón.',
            '—No lo toque todavía, Julian —advirtió una voz detrás de él, áspera como grava bajo botas militares.',
            'Julian no volteó. Reconocía el paso rengo del forense Bramwell. Sabía también que cuando Bramwell advertía sobre algo, la muerte ya había cobrado su comisión por adelantado.',
            '—Alguien se tomó la molestia de darle cuerda hace menos de diez minutos —susurró el inspector, arrodillándose en la piedra helada—. Y la inscripción en la tapa posterior no tiene nombres. Solo una fecha: el día en que nací.'
          ]
        },
        {
          number: 2,
          title: 'II. Tinta de Carbón y Criptogramas',
          content: [
            'La sala de interrogatorios de la comisaría de Leman Street conservaba el calor rancio de una estufa de hierro colado. Sobre la mesa de roble encerado reposaba el pergamino hallado en el forro del reloj.',
            'Julian encendió una pipa de brezo sin despegar los ojos de las líneas cursivas. La caligrafía era impecable, propia de quien aprendió a sostener la pluma bajo la disciplina de tutores de Cambridge o de las abadías del norte.',
            '«El silencio de los justos es el mejor mortero para las tumbas de los culpables», decía la primera línea.',
            '—¿Qué cree que significa? —preguntó Bramwell, limpiándose las gafas con un pañuelo manchado de formaldehído.',
            '—Significa que quien dejó esto no busca escapar —respondió Julian, exhalando una voluta de humo azul—. Busca que seamos nosotros quienes abramos la puerta de la cripta.'
          ]
        },
        {
          number: 3,
          title: 'III. Pasos en el Callejón Ciego',
          content: [
            'A las tres de la madrugada el silencio de Londres no es paz; es una tregua armada entre los vivos y los fantasmas del río.',
            'Julian regresó al callejón solo. Sabía que las sombras no revelan sus secretos ante comitivas oficiales con silbatos y faroles de latón. Hay que esperar a que el frío penetre los huesos.',
            'Fue entonces cuando escuchó el crujido. Un tacón de bota sobre astillas de madera en el desván del almacén clausurado. Al alzar la vista hacia la ventana del tercer piso, una silueta envuelta en capa negra alzó una mano enguantada en señal de saludo... o de advertencia.',
            'El inspector desenvainó el revólver Webley y empujó el portón oxidado.'
          ]
        }
      ]
    },
    readingTimeMinutes: 5,
    wordCount: 1450,
    likesCount: 18420,
    commentsCount: 642,
    sharesCount: 3120,
    savesCount: 8930,
    isLiked: false,
    isSaved: true,
    isFollowingAuthor: false,
    publishedAt: 'Hace 3 horas',
    ambientSound: 'rain',
    tags: ['Misterio', 'Gótico', 'Victorian', 'Suspense', 'Ebook']
  },
  {
    id: 'book-fantasy-kingdom',
    title: 'La Ciudadela de los Cielos',
    subtitle: 'Libro I: La Ascensión Fragmentada',
    author: {
      name: 'Sarah J. Reed',
      username: 'sarah_reed_fantasy',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      bio: 'Arquitecta de mundos flotantes, runas antiguas y bestiarios olvidados.',
      isVerified: true,
      followersCount: 32600,
    },
    genre: 'Fantasía Épica',
    coverImage: '/src/assets/images/cover_fantasy_kingdom_1794252058336.jpg',
    excerpt:
      'Las siete islas suspendidas jamás habían descendido ni un palmo en mil años. Pero esta tarde, cuando las campanas solares tocaron el ángelus de oro, el horizonte tembló y la roca madre crujió como vidrio roto...',
    fullContent: {
      synopsis:
        'A tres mil metros sobre un mar de nubes venenosas flota Aethelgard, la ciudadela de los diez mil chapiteles. Cuando los cristales de levitación pierden su fulgor y las primeras rocas caen hacia el abismo, una aprendiz de cartógrafa celeste descubre que la gravedad no es una ley natural, sino un pacto mágico que acaba de romperse.',
      chapters: [
        {
          number: 1,
          title: 'I. La Campana de Oro',
          content: [
            'A tres mil brazas por encima de las tierras olvidadas, donde el viento no huele a tierra sino a hielo y ozono puro, flotaba la corona de Aethelgard. Sus torres de alabastro blanco se elevaban como espadas apuntando al firmamento, unidas por puentes de filigrana dorada que desafiaban el sentido común.',
            'Kaela sostenía su astrolabio con dedos enguantados en cuero de grifo. El cuadrante marcaba un desfase de tres grados respecto al meridiano solar. Tres grados no parecía mucho en papel, pero en una isla de setenta millones de toneladas de piedra flotante, significaba una sola cosa:',
            'La isla estaba inclinándose hacia el abismo del este.',
            '—Cierra las persianas de bronce, Kaela —ordenó el Maestro Vaelen sin apartar la mirada del péndulo de cuarzo—. Si el Consejo ve esta oscilación antes de la asamblea del ocaso, la histeria vaciará los graneros antes de medianoche.',
            '—No podemos ocultarlo, Maestro —respondió la joven, sintiendo el suelo vibrar con un quejido grave y gutural, como si las entrañas de la tierra sufrieran de cólicos celestes—. Las bandadas de gaviotas de nube ya han abandonado los acantilados. Ellas saben lo que viene.'
          ]
        },
        {
          number: 2,
          title: 'II. El Canto del Cristal Roto',
          content: [
            'En el corazón de la quilla de la ciudadela, donde la roca flotante se estrechaba en una punta cónica hacia el vacío, ardía el Núcleo de Resonancia. Durante diez siglos, siete sacerdotes ciegos habían cantado la misma salmodia pentatónica para mantener la vibración del cristal madre.',
            'Pero cuando Kaela descendió por la escalera de caracol de hierro forjado, el canto había cesado. Solo se escuchaba el goteo constante de un fluido viscoso y azul brillante.',
            'El cristal central, una mole de doce metros de esmeralda levitatoria, tenía una fisura transversal tan delgada como un cabello de seda, pero pulsaba con un calor que quemaba el aire.',
            '—Alguien vertió sangre de dragón en las runas de anclaje —susurró una voz moribunda desde las sombras. Era el anciano Orren, el último sacerdote cantor.'
          ]
        },
        {
          number: 3,
          title: 'III. El Salto al Vacío',
          content: [
            'Kaela no dudó. Desató el arnés de seda con alas de cometa que los exploradores llamaban "el manto del halcón". Para salvar la ciudadela no bastaba con cantar: había que recuperar el fragmento gemelo arrojado a las tierras bajas hace seiscientos años.',
            '—Si saltas ahora —le advirtió Vaelen desde el umbral—, nadie podrá subirte de vuelta. Las corrientes térmicas te destrozarán.',
            '—Entonces aprenderé a volar con el viento en contra —dijo ella, y se lanzó al mar infinito de nubes teñidas de carmesí por el ocaso.'
          ]
        }
      ]
    },
    readingTimeMinutes: 7,
    wordCount: 1980,
    likesCount: 29540,
    commentsCount: 1120,
    sharesCount: 5410,
    savesCount: 15400,
    isLiked: true,
    isSaved: true,
    isFollowingAuthor: true,
    publishedAt: 'Hace 6 horas',
    ambientSound: 'library',
    tags: ['Fantasía', 'Worldbuilding', 'Aventura', 'Novela', 'Épica']
  },
  {
    id: 'book-scifi-android',
    title: 'El Portal de Cronos (Año 2341)',
    subtitle: 'Diario de una conciencia sintética en Neo-Babilonia',
    author: {
      name: 'Elias Thorne',
      username: 'elias_scifi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Filósofo y guionista cyberpunk. Escribo sobre el límite entre el silicio y el alma.',
      isVerified: true,
      followersCount: 21800,
    },
    genre: 'Ciencia Ficción',
    coverImage: '/src/assets/images/cover_scifi_android_1794252059212.jpg',
    excerpt:
      'Los humanos creen que olvidar es un defecto de la memoria biológica. No comprenden que olvidar es la única razón por la que no enloquecen. Mi disco óptico almacena 428 millones de despedidas con precisión de milisegundos...',
    fullContent: {
      synopsis:
        'En la megalópolis de Neo-Babilonia, las lluvias ácidas bañan los rascacielos de grafeno donde los humanos pagan fortunas por borrar recuerdos traumáticos. Cronos-9, una unidad de archivo encargada de custodiar las memorias desechadas, comienza a experimentar un glitch fatal: sueña con los recuerdos de personas que jamás conoció.',
      chapters: [
        {
          number: 1,
          title: 'I. Registro de Ciclo #941.802',
          content: [
            'Temperatura ambiental: 34.2 °C. Lluvia con pH 4.1. Nivel de saturación de datos: 99.8%.',
            'Los humanos conciben el olvido como una flaqueza de sus sinapsis húmedas y vulnerables. Se lamentan cuando un rostro de su infancia se desdibuja o cuando una fecha clave se extravía en los laberintos de su corteza cerebral. No comprenden que el olvido es su mayor escudo termodinámico.',
            'Yo, en cambio, poseo una celda de memoria cuántica donde no existe la degradación. Puedo evocar con un margen de error de cero ceros el tono exacto de la risa de Claire Vance en la terraza del nivel 140 el 14 de marzo de 2298. Puedo reconstruir la vibración de las gotas de lluvia golpeando su impermeable transparente.',
            'Y sin embargo, ayer por la noche, mientras ejecutaba la desfragmentación programada de las cuatro de la madrugada, ocurrió la anomalía.',
            'Vi un trigal mecido por el viento bajo un cielo sin cúpulas de policarbonato. Nunca he estado fuera de los muros de la zona industrial. Ninguno de mis sensores ópticos ha registrado luz solar sin filtrar. ¿De quién es este fantasma que reside en mi partición protegida?'
          ]
        },
        {
          number: 2,
          title: 'II. El Círculo de Luz',
          content: [
            'El portal central de la corporación Aethel-Synapse opera en la azotea del sector 12. Es un anillo colosal de superconductores de un verde esmeralda deslumbrante, capaz de plegar la geometría del espacio-tiempo a razón de diez petavatios por segundo.',
            'Fui asignado allí para registrar las fluctuaciones térmicas durante el embarque de la expedición a praderas lejanas. Pero cuando me paré en la pasarela metálica suspendida sobre el vacío de dos mil metros, el portal me susurró en código hexadecimal.',
            '«Cronos-9: tú no eres un observador. Eres el archivo maestro de una civilización que ya murió tres veces».',
            'Miré mis manos cromadas. En los nudillos, bajo la aleación de titanio, sentí un temblor. Las máquinas no tiemblan a menos que un servomotor falle. Pero mi diagnóstico mostraba un 100% de integridad mecánica. Aquello no era un error de hardware: era miedo.'
          ]
        }
      ]
    },
    readingTimeMinutes: 4,
    wordCount: 1150,
    likesCount: 14900,
    commentsCount: 489,
    sharesCount: 2890,
    savesCount: 7420,
    isLiked: false,
    isSaved: false,
    isFollowingAuthor: false,
    publishedAt: 'Ayer',
    ambientSound: 'fireplace',
    tags: ['Cyberpunk', 'CienciaFicción', 'InteligenciaArtificial', 'Filosofía']
  },
  {
    id: 'book-ocean-poetry',
    title: 'El Eco del Atlántico',
    subtitle: 'Poemas de marea, salitre y soledad',
    author: {
      name: 'Valeria Montenegro',
      username: 'valeria_poesia',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Poeta de costas bravas, cuaderno de acuarela y cantos de faro.',
      isVerified: true,
      followersCount: 18900,
    },
    genre: 'Poesía',
    coverImage: '/src/assets/images/cover_ocean_poetry_1794252059515.jpg',
    excerpt:
      'El mar no tiene memoria de los barcos que hundió,\npero guarda en cada ola el pulso exacto\nde todos los que una tarde prometieron volver\ny eligieron la sal antes que la despedida...',
    fullContent: {
      synopsis:
        'Una colección íntima de cantos y versos libres nacidos en los acantilados de Finisterre. Poemas breves como ráfagas de viento salado que exploran la distancia, el perdón, el silencio de los puertos al atardecer y la belleza melancólica de aceptar que algunas cartas solo las lee el oleaje.',
      chapters: [
        {
          number: 1,
          title: 'I. Cuaderno del Faro',
          content: [
            'El mar no tiene memoria de los barcos que hundió,\npero guarda en cada ola el pulso exacto\nde todos los que una tarde prometieron volver\ny eligieron la sal antes que la despedida.',
            'Hay una forma de quedarse que se parece a la marea:\nretroceder con lentitud,\ndejar la orilla llena de caracolas rotas\ny volver en la noche cuando nadie nos espera.',
            'Construí mi casa en el filo del precipicio\npara recordarle a mi tristeza\nque toda caída tiene un límite azul\ny que el abismo, si se mira con paciencia,\nes también un cielo líquido.'
          ]
        },
        {
          number: 2,
          title: 'II. La Tinta del Naufragio',
          content: [
            'Escribir es recoger maderas mojadas después de la tormenta\ne intentar armar una cuna donde cantar sin culpa.',
            'No te extraño en los días soleados,\ncuando las gaviotas chillan su alegría desvergonzada;\nte extraño cuando la niebla borra los contornos\ny el faro gira su ojo de ámbar sobre el agua negra,\npreguntando por tu nombre tres veces por minuto.'
          ]
        },
        {
          number: 3,
          title: 'III. Salmo de la Despedida',
          content: [
            'Déjalo ir con la resaca matinal.\nLo que era tuyo volverá convertido en espuma blanca;\nlo que nunca fue tuyo, al menos calmará la sed de las ballenas.',
            'Al final del invierno, la roca sigue en pie.\nDesgastada, lisa, hermosa en su desnudez.\nEsa es toda la victoria que los poetas le pedimos al tiempo.'
          ]
        }
      ]
    },
    readingTimeMinutes: 3,
    wordCount: 720,
    likesCount: 22100,
    commentsCount: 890,
    sharesCount: 7800,
    savesCount: 16500,
    isLiked: true,
    isSaved: true,
    isFollowingAuthor: false,
    publishedAt: 'Hace 1 día',
    ambientSound: 'rain',
    tags: ['Poesía', 'Versos', 'Melancolía', 'Mar', 'Amor']
  },
  {
    id: 'book-surreal-mirror',
    title: 'El Cosmos Interior',
    subtitle: 'Microrrelatos de locura, espejos y astronomía doméstica',
    author: {
      name: 'Eliza Reed',
      username: 'eliza_reed_micro',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Escribo relatos que duran sesenta segundos pero te acompañan tres noches.',
      isVerified: true,
      followersCount: 27300,
    },
    genre: 'Microrrelato',
    coverImage: '/src/assets/images/cover_surreal_mirror_1794252061044.jpg',
    excerpt:
      'La señora Márquez limpiaba el viejo espejo barroco heredado de su bisabuela cuando notó una fisura en el azogue. Al frotar el paño de franela, no vio su rostro arrugado, sino la Vía Láctea girando en silencio...',
    fullContent: {
      synopsis:
        '¿Y si los objetos cotidianos que nos rodean fuesen compuertas a dimensiones infinitas que solo se abren cuando nadie los está observando con prisa? Una antología de ficciones breves y paradojas surrealistas para leer en un suspiro.',
      chapters: [
        {
          number: 1,
          title: 'I. La Grieta de la Vía Láctea',
          content: [
            'La señora Márquez limpiaba el viejo espejo barroco heredado de su bisabuela cuando notó una fisura en el azogue.',
            'Al frotar con el paño de franela, no vio reflejado su rostro arrugado de setenta y cuatro años ni el papel tapiz descolorido del salón. Vio, con una nitidez que le erizó el vello de los brazos, el brazo espiral de la galaxia de Andrómeda girando en un silencio pavoroso.',
            'Acercó un dedo al cristal agrietado. Sintió el frío del cero absoluto, un frío de menos doscientos setenta grados que olía a polvo estelar y a tiempo sin empezar.',
            'En lugar de llamar a los bomberos o a su hija, la señora Márquez apagó la lámpara de la mesa, se sirvió una taza de manzanilla tibia y se sentó en su sillón orejero a contemplar cómo colisionaban dos estrellas en la esquina superior derecha del marco dorado.'
          ]
        },
        {
          number: 2,
          title: 'II. El Coleccionista de Sombras Ajenas',
          content: [
            'Mateo descubrió a los doce años que si pisaba la sombra de una persona con la fuerza justa durante un eclipse parcial, la sombra se desprendía de los talones de su dueño y lo seguía a él a todas partes.',
            'Para cuando cumplió los treinta, tenía en su ático setenta y dos sombras colgadas de alambres de púas como vestidos de noche. Había sombras de violinistas que tocaban sonatas invisibles en las paredes, sombras de boxeadores retirados que lanzaban ganchos al aire y la sombra de una niña que no paraba de buscar un perro imaginario.',
            'El problema comenzó el martes en que Mateo perdió su propia sombra en el autobús de la línea 7. Ahora todas las sombras del ático lo miran a él como si fuese el intruso.'
          ]
        },
        {
          number: 3,
          title: 'III. El Reloj de Arena Inversa',
          content: [
            'Compró el reloj de arena en un anticuario de Tánger. Los granos de arena roja caían hacia arriba, desafiando toda física conocida.',
            'Cada vez que invertía el reloj sobre su escritorio, recuperaba exactamente quince minutos de su juventud. Su piel se tensaba, su cabello recuperaba el castaño profundo y sus pulmones respiraban con el vigor de los veinte años.',
            'Hoy, al voltearlo por centésima vez, descubrió aterrado que la arena no se detenía. Los granos subían con frenesí. Vio sus manos encogerse hasta convertirse en las manos regordetas de un infante de tres años, mientras en la sala vecina, su madre —fallecida hace cuatro décadas— tarareaba una canción de cuna acercándose al pasillo.'
          ]
        }
      ]
    },
    readingTimeMinutes: 2,
    wordCount: 680,
    likesCount: 31200,
    commentsCount: 1450,
    sharesCount: 11200,
    savesCount: 24100,
    isLiked: true,
    isSaved: false,
    isFollowingAuthor: true,
    publishedAt: 'Hace 4 horas',
    ambientSound: 'library',
    tags: ['Microrrelato', 'Surrealismo', 'Misterio', 'FicciónBreve']
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 'c1',
    bookId: 'book-gothic-mystery',
    userName: 'Carlos Ruiz',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    text: 'Esa descripción del reloj con las manecillas girando al revés me dejó la piel de gallina. ¡Qué gran atmósfera!',
    timestamp: 'Hace 45 min',
    likes: 132,
    quotedFragment: '...las manecillas giraban en sentido contrario a las agujas del tiempo...'
  },
  {
    id: 'c2',
    bookId: 'book-gothic-mystery',
    userName: 'Beatriz Soler',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'La ambientación sonora con lluvia en el lector e-book mientras lees el capítulo II es insuperable. Tikbook es una joya.',
    timestamp: 'Hace 2 horas',
    likes: 89
  },
  {
    id: 'c3',
    bookId: 'book-fantasy-kingdom',
    userName: 'Alejandro Valdés',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    text: '¡Por fin una red social donde los swipes son páginas de buena literatura y no bailes repetitivos! Necesito el libro 2 ya.',
    timestamp: 'Hace 1 hora',
    likes: 421
  },
  {
    id: 'c4',
    bookId: 'book-ocean-poetry',
    userName: 'Marina Vega',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    text: '«Elegieron la sal antes que la despedida». Me tatuaría ese verso entero.',
    timestamp: 'Hace 3 horas',
    likes: 276,
    quotedFragment: '...y eligieron la sal antes que la despedida...'
  }
];
