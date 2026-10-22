"use client";

import { useHasMounted } from "@/hooks/useHasMounted";
import { selectTotalItems, useCartStore } from "@/store/cart.store";

/**
 * Contador del carrito en el Header: muestra las unidades totales
 * (suma de cantidades). Solo se renderiza tras la hidratación para
 * evitar discrepancias con los datos persistidos.
 */
export function CartCountBadge() {
  const mounted = useHasMounted();
  const count = useCartStore(selectTotalItems);

  if (!mounted) {
    return null;
  }

  return (
    <span
      aria-label={`${count} ${count === 1 ? "producto" : "productos"} en el carrito`}
      className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#A01C46] text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
    >
      {count}
    </span>
  );
}
