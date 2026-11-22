/**
 * Contenido editorial del Home: ocasiones, vitrinas y valor agregado.
 * Las fotos son reales (Cloudinary de Surprises). Cada ocasión o vitrina
 * lleva a la tienda filtrada si hay productos que coinciden con sus
 * `claves`; si todavía no hay, abre WhatsApp con un mensaje listo.
 */

const CLOUDINARY_UPLOAD = "https://res.cloudinary.com/lnofvbec/image/upload";

/** Miniatura recortada y optimizada de una imagen de Cloudinary. */
export function miniatura(url: string, ancho: number, alto: number): string {
  if (!url.startsWith(`${CLOUDINARY_UPLOAD}/`)) {
    return url;
  }
  return url.replace(
    `${CLOUDINARY_UPLOAD}/`,
    `${CLOUDINARY_UPLOAD}/c_fill,g_auto,w_${ancho},h_${alto},q_auto,f_auto/`
  );
}

const FOTOS = {
  navidad: `${CLOUDINARY_UPLOAD}/v1795315356/surprises/products/wf1ptmdr4x7oszurfssm.jpg`,
  navidadLazo: `${CLOUDINARY_UPLOAD}/v1795314887/surprises/products/qbgjmvxg8flxkyk88vml.jpg`,
  calendario: `${CLOUDINARY_UPLOAD}/v1795315349/surprises/products/kjgm1bqyai7v6tsh3eyu.jpg`,
  cumpleanos: `${CLOUDINARY_UPLOAD}/v1795314890/surprises/products/coarslpfztaucfam1ezj.jpg`,
  graduacion: `${CLOUDINARY_UPLOAD}/v1795369447/surprises/categories/ge2xjitwbwb9k1rk9lpy.jpg`,
  paraElla: `${CLOUDINARY_UPLOAD}/v1795369448/surprises/categories/lppjekraaictcvjrcfur.jpg`,
  paraEl: `${CLOUDINARY_UPLOAD}/v1795369449/surprises/categories/e1t5ifxug63d8ci3yvsm.jpg`,
} as const;

/** Frases cortas de la barra superior (rotan). */
export const PROPUESTAS = [
  "Personalizado con SUS fotos 📸",
  "Hecho a mano, detalle por detalle 🤍",
  "Envíos a todo Lima 🚚",
  "Te asesoramos por WhatsApp 💬",
] as const;

export interface EnlaceEditorial {
  nombre: string;
  imagen: string;
  /** Palabras (sin tildes) que buscan productos en la tienda. */
  claves: string[];
  /** Mensaje de WhatsApp para pedirlo personalizado. */
  mensaje: string;
}

export interface Ocasion extends EnlaceEditorial {
  slug: string;
  titulo: string;
  texto: string;
  /** Fotos reales de regalos de esta ocasión ("hecho a pedido"). */
  galeria: string[];
}

export const OCASIONES: Ocasion[] = [
  {
    slug: "navidad",
    nombre: "Navidad",
    titulo: "Regalos de Navidad 🎄",
    texto: "Cuadros 3D con luces, calendarios 2027 y cajas con SUS fotos para que esta Navidad sea inolvidable.",
    imagen: FOTOS.navidad,
    claves: ["navide", "navidad", "calendario"],
    mensaje: "¡Hola! Busco un regalo de Navidad personalizado 🎄",
    galeria: [
      `${CLOUDINARY_UPLOAD}/v1795315356/surprises/products/wf1ptmdr4x7oszurfssm.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795314888/surprises/products/v7frmbxucsglwq3vvb7j.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315359/surprises/products/pcz3pcp0wioc6vznrh5e.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795314888/surprises/products/q3yffvtzzh7uz6zknwql.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315357/surprises/products/bxa1akje8wqz96mfvlsu.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315358/surprises/products/dcgdxvi3chn8kt43zjwq.jpg`,
    ],
  },
  {
    slug: "amor",
    nombre: "Amor",
    titulo: "Regalos para tu pareja 💕",
    texto: "Calendarios con sus fotos, cuadros y cajas con su historia juntos: el regalo que le dice cuánto la conoces.",
    imagen: FOTOS.calendario,
    claves: ["calendario", "aniversario", "amor", "pareja"],
    mensaje: "¡Hola! Busco un regalo para mi pareja 💕",
    galeria: [
      `${CLOUDINARY_UPLOAD}/v1795315349/surprises/products/kjgm1bqyai7v6tsh3eyu.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315350/surprises/products/xno6exifu7rvsllvpku7.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315352/surprises/products/kbc9kugekvb80im7h2wp.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315353/surprises/products/krqezdskp7q6hqbnnkq3.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315353/surprises/products/yuzawd3k33drdr18jncy.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315354/surprises/products/hd1gb36vcvxnlbtfmdpk.jpg`,
    ],
  },
  {
    slug: "cumpleanos",
    nombre: "Cumpleaños",
    titulo: "Regalos de cumpleaños 🎂",
    texto: "Cuadros 3D con su edad, sus fotos y lucecitas que brillan, hechos a mano para su día.",
    imagen: FOTOS.cumpleanos,
    claves: ["cumplea"],
    mensaje: "¡Hola! Busco un regalo de cumpleaños personalizado 🎂",
    galeria: [
      `${CLOUDINARY_UPLOAD}/v1795314890/surprises/products/coarslpfztaucfam1ezj.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795314891/surprises/products/yigzlya1v7zw76bjzpwm.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795314892/surprises/products/vrwas5klsh2yvpq7suik.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315360/surprises/products/tdtztstshzqm12wi0fnz.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795315361/surprises/products/xwj3dptytf5axkyzvovg.jpg`,
    ],
  },
  {
    slug: "graduacion",
    nombre: "Graduación",
    titulo: "Regalos de graduación 🎓",
    texto: "Cuadros con sus fotos de la promo, su año y un mensaje para celebrar su meta cumplida.",
    imagen: FOTOS.graduacion,
    claves: ["gradua"],
    mensaje: "¡Hola! Busco un regalo de graduación 🎓",
    galeria: [
      `${CLOUDINARY_UPLOAD}/v1795369447/surprises/categories/ge2xjitwbwb9k1rk9lpy.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375145/surprises/categories/zzm5cd9qkyq6wwktrkop.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375146/surprises/categories/g7lcnvq2r9wzgpwtodb5.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375147/surprises/categories/hl3q7wofqm49z3zfm9dm.jpg`,
    ],
  },
  {
    slug: "para-ella",
    nombre: "Para ella",
    titulo: "Cajas sorpresa para ella 🌻",
    texto: "Cajas con peluche, girasol, cartas y detalles pensados solo para ella.",
    imagen: FOTOS.paraElla,
    claves: ["girasol", "peluche", "para ella"],
    mensaje: "¡Hola! Busco una caja sorpresa para ella 🌻",
    galeria: [
      `${CLOUDINARY_UPLOAD}/v1795369448/surprises/categories/lppjekraaictcvjrcfur.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375148/surprises/categories/leheesskzpn3fts08ovg.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375149/surprises/categories/b0ne8txbobjrd9jsxkor.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375150/surprises/categories/s4s38tspfr8q1z99bt2i.jpg`,
    ],
  },
  {
    slug: "para-el",
    nombre: "Para él",
    titulo: "Cajas sorpresa para él 🏎️",
    texto: "Cajas con su carrito Hot Wheels, snacks, llavero con sus fotos y una tarjeta para su niño interior.",
    imagen: FOTOS.paraEl,
    claves: ["hot wheels", "para el"],
    mensaje: "¡Hola! Busco una caja sorpresa para él 🏎️",
    galeria: [
      `${CLOUDINARY_UPLOAD}/v1795369449/surprises/categories/e1t5ifxug63d8ci3yvsm.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375150/surprises/categories/q1jjitxtqjnyqyjcjqkz.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375151/surprises/categories/tacfd0epvskbx3avui4r.jpg`,
      `${CLOUDINARY_UPLOAD}/v1795375152/surprises/categories/cc5iuhrjceo2o3rozj0h.jpg`,
    ],
  },
];

export function ocasionPorSlug(slug: string): Ocasion | undefined {
  return OCASIONES.find((ocasion) => ocasion.slug === slug);
}

/** Productos cuyo nombre coincide con alguna clave de la ocasión. */
export function productosDeOcasion<T extends { name: string }>(ocasion: EnlaceEditorial, productos: T[]): T[] {
  return productos.filter((producto) => {
    const nombre = normalizar(producto.name);
    return ocasion.claves.some((clave) => nombre.includes(clave));
  });
}

export interface Vitrina extends EnlaceEditorial {
  linea1: string;
  linea2: string;
}

export const VITRINAS: Vitrina[] = [
  {
    nombre: "Cuadros 3D con luces",
    linea1: "Cuadros 3D",
    linea2: "con luces",
    imagen: FOTOS.navidadLazo,
    claves: ["cuadro"],
    mensaje: "¡Hola! Quiero un cuadro 3D personalizado ✨",
  },
  {
    nombre: "Calendarios con sus fotos",
    linea1: "Calendarios",
    linea2: "con sus fotos",
    imagen: FOTOS.calendario,
    claves: ["calendario"],
    mensaje: "¡Hola! Quiero un calendario 2027 con nuestras fotos 📸",
  },
  {
    nombre: "Cajas sorpresa",
    linea1: "Cajas",
    linea2: "sorpresa",
    imagen: FOTOS.paraElla,
    claves: ["caja"],
    mensaje: "¡Hola! Quiero una caja sorpresa personalizada 🎁",
  },
];

/** Lo que nos diferencia (se muestra con íconos en el Home). */
export const VALORES = [
  {
    clave: "fotos",
    titulo: "Con SUS fotos",
    texto: "Cada regalo lleva las fotos, nombres y fechas que nos mandes.",
  },
  {
    clave: "mano",
    titulo: "Hecho a mano",
    texto: "Lo armamos detalle por detalle: ninguno sale igual a otro.",
  },
  {
    clave: "mensaje",
    titulo: "Con tu mensaje",
    texto: "Una tarjeta con lo que le quieras decir, lista para emocionar.",
  },
  {
    clave: "envio",
    titulo: "Envíos a todo Lima",
    texto: "Coordinamos contigo la entrega por WhatsApp.",
  },
] as const;

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Destino de una ocasión o vitrina: la tienda filtrada si hay productos que
 * coinciden con alguna clave; si no, WhatsApp con el mensaje (o la tienda).
 */
export function destinoEditorial(
  item: EnlaceEditorial,
  nombresDeProductos: string[],
  whatsapp: (mensaje: string) => string | null
): { href: string; externo: boolean } {
  const nombres = nombresDeProductos.map(normalizar);
  const clave = item.claves.find((c) => nombres.some((n) => n.includes(c)));
  if (clave) {
    return { href: `/tienda?q=${encodeURIComponent(clave)}`, externo: false };
  }
  const url = whatsapp(item.mensaje);
  return url ? { href: url, externo: true } : { href: "/tienda", externo: false };
}
