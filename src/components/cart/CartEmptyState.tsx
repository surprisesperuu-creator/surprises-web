"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

/**
 * Estado vacío del carrito: "Tu carrito está vacío" + acción "Explorar tienda".
 */
export function CartEmptyState({ onExplore }: { onExplore?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-[#A01C46]">
        <ShoppingBag className="size-8" />
      </span>
      <div>
        <h3 className="font-display text-xl font-semibold text-stone-900">
          Tu carrito está vacío
        </h3>
        <p className="mt-1 text-sm text-stone-600">
          Agrega algunos productos para comenzar tu pedido.
        </p>
      </div>
      <Link
        href="/tienda"
        onClick={onExplore}
        className="mt-2 rounded-full bg-[#C1375D] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C1375D]/25 transition-colors hover:bg-[#7A1734]"
      >
        Explorar tienda
      </Link>
    </div>
  );
}
