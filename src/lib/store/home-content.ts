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
  /** Palabras (sin tildes) que buscan productos de esta ocasión en la tienda. */
  claves: string[];
  /** Mensaje de WhatsApp si todavía no hay productos de la ocasión. */
  mensaje: string;
}

export const OCASIONES: EnlaceEditorial[] = [
  {
    nombre: "Navidad",
    imagen: FOTOS.navidad,
    claves: ["navide", "navidad"],
    mensaje: "¡Hola! Busco un regalo de Navidad personalizado 🎄",
  },
  {
    nombre: "Amor",
    imagen: FOTOS.calendario,
    claves: ["calendario", "aniversario", "amor"],
    mensaje: "¡Hola! Busco un regalo para mi pareja 💕",
  },
  {
    nombre: "Cumpleaños",
    imagen: FOTOS.cumpleanos,
    claves: ["cumplea"],
    mensaje: "¡Hola! Busco un regalo de cumpleaños personalizado 🎂",
  },
  {
    nombre: "Graduación",
    imagen: FOTOS.graduacion,
    claves: ["gradua"],
    mensaje: "¡Hola! Busco un regalo de graduación 🎓",
  },
  {
    nombre: "Para ella",
    imagen: FOTOS.paraElla,
    claves: ["girasol", "peluche", "para ella"],
    mensaje: "¡Hola! Busco una caja sorpresa para ella 🌻",
  },
  {
    nombre: "Para él",
    imagen: FOTOS.paraEl,
    claves: ["hot wheels", "para el"],
    mensaje: "¡Hola! Busco una caja sorpresa para él 🏎️",
  },
];

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
