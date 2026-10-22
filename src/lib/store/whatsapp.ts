import type { CartItem } from "@/store/cart.store";

/**
 * Número de WhatsApp del negocio.
 * Fuente única de configuración: NEXT_PUBLIC_WHATSAPP_NUMBER (ver .env.example).
 * No debe hardcodearse en los componentes.
 */
export const WHATSAPP_NUMBER: string =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/**
 * Construye el mensaje del pedido para WhatsApp a partir del carrito.
 * Solo se envía el nombre de cada producto y su cantidad total.
 *
 * Ejemplo:
 *   ¡Hola! Quiero realizar este pedido:
 *
 *   - 2 × Oso de peluche
 *   - 1 × Caja sorpresa
 *
 *   Total de productos: 3
 */
export function buildWhatsAppMessage(items: CartItem[]): string {
  const totalUnits = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const lines = items.map(
    (item) => `- ${item.quantity} × ${item.name}`
  );

  return [
    "¡Hola! Quiero realizar este pedido:",
    "",
    ...lines,
    "",
    `Total de productos: ${totalUnits}`,
  ].join("\n");
}

/**
 * Devuelve la URL de WhatsApp con el mensaje listo para enviar,
 * o `null` si no hay número configurado (NEXT_PUBLIC_WHATSAPP_NUMBER).
 */
export function buildWhatsAppUrl(message: string): string | null {
  if (!WHATSAPP_NUMBER) {
    return null;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
