/**
 * Descripciones de productos mientras la base de datos no tiene la columna
 * `products.description` (ver la rama feat/descripcion-productos).
 * Clave: id del producto. Cuando la migración esté aplicada, estas
 * descripciones se cargan desde el admin y este archivo se elimina.
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

export function descripcionDeProducto(id: string): string | null {
  return DESCRIPCIONES[id] ?? null;
}
