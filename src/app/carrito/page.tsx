"use client";

import { useHasMounted } from "@/hooks/useHasMounted";
import { selectTotalItems, useCartStore } from "@/store/cart.store";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartSummary } from "@/components/cart/CartSummary";

/**
 * Página completa del carrito (/carrito).
 * Inicia vacía para usuarios nuevos y persiste con Zustand.
 */
export default function CarritoPage() {
  const mounted = useHasMounted();
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);

  // Evita discrepancias de hidratación con los datos persistidos:
  // durante SSR/hidratación se muestra un skeleton.
  if (!mounted) {
    return (
      <div className="w-full bg-background">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6">
          <div className="h-9 w-48 animate-pulse rounded bg-stone-200" />
          <div className="mt-8 h-64 animate-pulse rounded-3xl bg-stone-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-stone-900">
          Tu carrito
        </h1>
        {totalItems > 0 && (
          <p className="mt-1 text-sm text-stone-600">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu
            pedido
          </p>
        )}

        {items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white">
            <CartEmptyState />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Productos */}
            <div className="divide-y divide-stone-100 rounded-3xl border border-stone-200/80 bg-white px-6 lg:col-span-2">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Resumen */}
            <div className="h-fit rounded-3xl border border-stone-200/80 bg-white p-6 lg:sticky lg:top-24">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
