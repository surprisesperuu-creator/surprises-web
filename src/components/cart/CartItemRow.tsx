"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { AppImage } from "@/components/AppImage";
import { formatPrice } from "@/lib/format";
import { useCartStore, type CartItem } from "@/store/cart.store";

const controlClass =
  "flex size-8 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-rose-50 hover:text-[#A01C46] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

/**
 * Fila de producto dentro del carrito: imagen, nombre, precio unitario,
 * selector de cantidad (mínimo 1), subtotal y eliminar.
 */
export function CartItemRow({ item }: { item: CartItem }) {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 py-5">
      <div className="size-20 shrink-0 overflow-hidden rounded-2xl border border-stone-200/80 bg-white sm:size-24">
        <AppImage
          src={item.image_url}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium text-stone-900">
            {item.name}
          </h3>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Eliminar ${item.name}`}
            className="shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <p className="text-sm font-medium text-[#A01C46]">
          {formatPrice(item.price)}
          <span className="ml-1 text-xs font-normal text-stone-400">c/u</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-1.5 py-1">
            <button
              type="button"
              onClick={() => decreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
              className={controlClass}
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-stone-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => increaseQuantity(item.id)}
              aria-label="Aumentar cantidad"
              className={controlClass}
            >
              <Plus className="size-4" />
            </button>
          </div>

          <p className="text-sm font-semibold text-stone-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
