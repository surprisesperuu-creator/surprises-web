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
  // Cuadro 3D Navideño con luces
  "c978682a-3049-4769-9fca-c96f0c16dac3": [
    "Su cuadro 3D navideño con SUS fotos, arbolito y luces, en una caja lista para regalar 🎄🎁",
    "",
    "✔️ Personalizado con sus fotos",
    "✔️ Hecho a mano, detalle por detalle",
    "✔️ Se ilumina con lucecitas ✨",
    "🎁 Si lo separas ahora, la carta de Navidad y el mini calendario 2027 van de regalo 💌",
    "",
    "Escríbenos al WhatsApp y separa el tuyo: los pedidos de Navidad se están llenando 📲",
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
  // Cuadro 3D Navideño con luces: de cerca, con lazo y carta de Navidad
  "c978682a-3049-4769-9fca-c96f0c16dac3": [
    `${CLOUDINARY}/v1795314888/surprises/products/v7frmbxucsglwq3vvb7j.jpg`,
    `${CLOUDINARY}/v1795314888/surprises/products/q3yffvtzzh7uz6zknwql.jpg`,
    `${CLOUDINARY}/v1795314889/surprises/products/idcqvfuk1pxfco1qs18w.jpg`,
  ],
};

export function descripcionDeProducto(id: string): string | null {
  return DESCRIPCIONES[id] ?? null;
}

/** Fotos adicionales del producto (sin la imagen principal). */
export function fotosDeProducto(id: string): string[] {
  return FOTOS[id] ?? [];
}
