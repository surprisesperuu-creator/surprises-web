/**
 * Descripción y fotos adicionales de productos mientras la base de datos no
 * tiene las columnas `products.description` y `products.images`
 * (ver la rama feat/descripcion-productos). Clave: id del producto.
 * Cuando la migración esté aplicada, esto se carga desde el admin y este
 * archivo se elimina.
 */
const DESCRIPCIONES: Record<string, string> = {
  // Pack Cuadro Calendario 2027
  "38b15ddb-a6d3-4a78-a4eb-9cadfbcdf471": [
    "Un calendario 2027 con SUS fotos, una por cada mes del año 📸",
    "",
    "Llega en su caja \"por otros 365 días juntos\", con tarjeta y la carta \"¿Quieres empezar el 2027 conmigo?\" 💌",
    "",
    "✔️ Lo armamos con las fotos que nos mandes",
    "✔️ Listo para regalar en Navidad, aniversario o para empezar el año juntos",
    "🎁 Si lo separas en noviembre, la carta va GRATIS",
    "",
    "Escríbenos al WhatsApp para separarlo 📲",
  ].join("\n"),
};

const CLOUDINARY = "https://res.cloudinary.com/lnofvbec/image/upload";

const FOTOS: Record<string, string[]> = {
  // Pack Cuadro Calendario 2027: caja, carta y mini calendario
  "38b15ddb-a6d3-4a78-a4eb-9cadfbcdf471": [
    `${CLOUDINARY}/v1795314884/surprises/products/geqwg6tjdhsjxb09trgs.jpg`,
    `${CLOUDINARY}/v1795314885/surprises/products/el89r7urt4lawxmlon9t.jpg`,
    `${CLOUDINARY}/v1795314886/surprises/products/z0xhwiu41llzmspv5mvh.jpg`,
  ],
};

export function descripcionDeProducto(id: string): string | null {
  return DESCRIPCIONES[id] ?? null;
}

/** Fotos adicionales del producto (sin la imagen principal). */
export function fotosDeProducto(id: string): string[] {
  return FOTOS[id] ?? [];
}
