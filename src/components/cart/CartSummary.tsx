"use client";

import { Trash2 } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { selectSubtotal, useCartStore } from "@/store/cart.store";
import { WhatsAppOrderButton } from "@/components/cart/WhatsAppOrderButton";

/**
 * Resumen del carrito: subtotal, total y botón "Pedir por WhatsApp"
 * (más la opción de vaciar el carrito).
 */
export function CartSummary() {
  const subtotal = useCartStore(selectSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-stone-600">
          <span>Subtotal</span>
          <span className="font-medium text-stone-900">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-stone-600">
          <span>Envío</span>
          <span className="text-xs text-stone-500">Coordinado por WhatsApp</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-stone-200 pt-2">
          <span className="font-display text-base font-semibold text-stone-900">
            Total
          </span>
          <span className="font-display text-2xl font-semibold text-[#A01C46]">
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <WhatsAppOrderButton />

      <button
        type="button"
        onClick={clearCart}
        className="mx-auto flex items-center gap-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-red-600"
      >
        <Trash2 className="size-3.5" />
        Vaciar carrito
      </button>
    </div>
  );
}
