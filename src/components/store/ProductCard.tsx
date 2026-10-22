"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";

import { AppImage } from "@/components/AppImage";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart.store";
import type { ProductWithCategory } from "@/types/product";

interface ProductCardProps {
  product: ProductWithCategory;
  /** Retraso de la animación de entrada en ms. */
  delay?: number;
}

/**
 * Tarjeta de producto de la tienda pública.
 * Usa datos reales (image_url, name, price) y enlaza al detalle
 * `/tienda/[id]`. Incluye botón "Agregar al carrito" (estado global Zustand).
 */
export function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      data-scroll-animate="fade-in-up"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Imagen → detalle */}
      <Link href={`/tienda/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden">
          <AppImage
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        </div>
      </Link>

      {/* Información + botón */}
      <div className="flex flex-col gap-2.5 p-4">
        <Link
          href={`/tienda/${product.id}`}
          className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug text-stone-900 transition-colors group-hover:text-[#C1375D] sm:text-base"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-1 border-t border-stone-100 pt-2">
          <span className="text-[10px] uppercase tracking-wide text-stone-400">
            Desde
          </span>
          <span className="text-lg font-extrabold text-[#C1375D]">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Botón agregar al carrito (visible) */}
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Agregar ${product.name} al carrito`}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.97] ${
            added
              ? "bg-emerald-600 shadow-emerald-600/25"
              : "bg-[#C1375D] shadow-[#C1375D]/25 hover:bg-[#7A1734]"
          }`}
        >
          {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
          {added ? "¡Agregado!" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}

