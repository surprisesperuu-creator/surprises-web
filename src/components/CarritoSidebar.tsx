"use client";

import { X } from "lucide-react";

import { useCartStore, selectTotalItems } from "@/store/cart.store";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartSummary } from "@/components/cart/CartSummary";

/**
 * Sidebar del carrito: se abre al hacer clic en el icono del Header.
 * Usa el store global de Zustand (inicia vacío y persiste en localStorage).
 */
export default function CarritoSidebar() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore(selectTotalItems);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Encabezado */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-stone-900">
              Tu carrito
            </h2>
            {totalItems > 0 && (
              <span className="rounded-full bg-[#A01C46] px-2.5 py-0.5 text-xs font-semibold text-white">
                {totalItems}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center">
            <CartEmptyState onExplore={closeCart} />
          </div>
        ) : (
          <>
            {/* Productos */}
            <div className="flex-1 divide-y divide-stone-100 overflow-y-auto px-6">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Resumen */}
            <div className="shrink-0 border-t border-stone-200 px-6 py-5 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
              <CartSummary />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
