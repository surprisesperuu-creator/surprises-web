"use client";

import { useCartStore } from "@/store/cart.store";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/store/whatsapp";
import { WhatsAppIcon } from "@/components/cart/WhatsAppIcon";

/**
 * Botón "Pedir por WhatsApp".
 * Genera el mensaje con los productos reales del carrito y abre WhatsApp.
 * Si no hay número configurado (NEXT_PUBLIC_WHATSAPP_NUMBER), se muestra
 * deshabilitado para no generar enlaces rotos.
 */
export function WhatsAppOrderButton() {
  const items = useCartStore((state) => state.items);
  const url = buildWhatsAppUrl(buildWhatsAppMessage(items));

  const classes =
    "flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 transition-all hover:bg-[#1fb457] active:scale-[0.99]";

  if (!url) {
    return (
      <button
        type="button"
        disabled
        title="Configura la variable WHATSAPP_NUMBER"
        className={`${classes} cursor-not-allowed opacity-50`}
      >
        <WhatsAppIcon />
        Pedir por WhatsApp
      </button>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={classes}>
      <WhatsAppIcon />
      Pedir por WhatsApp
    </a>
  );
}
