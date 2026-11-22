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
    "El regalo para empezar el año juntos: un cuadro calendario 2027 con SUS fotos, una por cada mes 📸",
    "",
    "🎁 Qué incluye:",
    "• Cuadro \"2027 Juntos\" con marco negro y lazo, armado con las 12 fotos que nos mandes",
    "• Caja de regalo \"Por otros 365 días juntos\" con lazo rojo",
    "• Tarjeta \"¿Quieres empezar el 2027 conmigo?\" con tu mensaje adentro 💌",
    "• Mini calendario de bolsillo",
    "",
    "✔️ Personalizado y hecho a mano",
    "✔️ Ideal para Navidad, aniversario o para empezar el año juntos",
    "🎁 Si lo separas en noviembre, la carta va GRATIS",
    "",
    "Escríbenos al WhatsApp, mándanos sus fotos y lo armamos 📲",
  ].join("\n"),
  // Cuadro 3D Navideño con luces
  "c978682a-3049-4769-9fca-c96f0c16dac3": [
    "Su cuadro 3D navideño con SUS fotos, un arbolito hecho a mano y lucecitas que se encienden ✨🎄",
    "",
    "🎁 Qué incluye:",
    "• Cuadro 3D con tira de fotos personalizadas, arbolito, corona y casitas navideñas",
    "• Luces LED que lo iluminan",
    "• Caja de regalo \"Con mucho amor para ti\" con cinta \"Love is eternal\"",
    "• Tarjeta \"Merry Christmas\" con un mensaje navideño 💌",
    "",
    "✔️ Personalizado con sus fotos",
    "✔️ Hecho a mano, detalle por detalle",
    "🎁 Si lo separas ahora, la carta de Navidad y el mini calendario 2027 van de regalo",
    "",
    "Escríbenos al WhatsApp y separa el tuyo: los pedidos de Navidad se están llenando 📲",
  ].join("\n"),
};


const CLOUDINARY = "https://res.cloudinary.com/lnofvbec/image/upload";

const FOTOS: Record<string, string[]> = {
  // Pack Cuadro Calendario 2027: fotos reales del producto (cuadro, caja, carta y mini calendario)
  "38b15ddb-a6d3-4a78-a4eb-9cadfbcdf471": [
    `${CLOUDINARY}/v1795315350/surprises/products/xno6exifu7rvsllvpku7.jpg`,
    `${CLOUDINARY}/v1795315351/surprises/products/yjdgjwbntt2sxwpgoblz.jpg`,
    `${CLOUDINARY}/v1795315352/surprises/products/kbc9kugekvb80im7h2wp.jpg`,
    `${CLOUDINARY}/v1795315353/surprises/products/krqezdskp7q6hqbnnkq3.jpg`,
    `${CLOUDINARY}/v1795315353/surprises/products/yuzawd3k33drdr18jncy.jpg`,
    `${CLOUDINARY}/v1795315354/surprises/products/hd1gb36vcvxnlbtfmdpk.jpg`,
    `${CLOUDINARY}/v1795315355/surprises/products/wqezmamxyk56yvwfeclu.jpg`,
    `${CLOUDINARY}/v1795315356/surprises/products/afut13bhr7zhvhd6tnsj.jpg`,
  ],
  // Cuadro 3D Navideño con luces: encendido, de cerca, con lazo, caja y cartas
  "c978682a-3049-4769-9fca-c96f0c16dac3": [
    `${CLOUDINARY}/v1795315356/surprises/products/wf1ptmdr4x7oszurfssm.jpg`,
    `${CLOUDINARY}/v1795314888/surprises/products/v7frmbxucsglwq3vvb7j.jpg`,
    `${CLOUDINARY}/v1795315359/surprises/products/pcz3pcp0wioc6vznrh5e.jpg`,
    `${CLOUDINARY}/v1795314888/surprises/products/q3yffvtzzh7uz6zknwql.jpg`,
    `${CLOUDINARY}/v1795315357/surprises/products/bxa1akje8wqz96mfvlsu.jpg`,
    `${CLOUDINARY}/v1795315358/surprises/products/dcgdxvi3chn8kt43zjwq.jpg`,
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
