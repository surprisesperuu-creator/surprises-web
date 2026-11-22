"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";

import { AppImage } from "@/components/AppImage";
import { formatPrice } from "@/lib/format";
import { miniatura } from "@/lib/store/home-content";
import { fotosDeProducto } from "@/lib/store/product-extras";
import { useCartStore } from "@/store/cart.store";
import type { ProductWithCategory } from "@/types/product";

interface ProductCardProps {
  product: ProductWithCategory;
  /** Retraso de la animación de entrada en ms. */
  delay?: number;
}

/**
 * Tarjeta de producto de la tienda pública: foto, nombre, precio, cantidad,
 * "Comprar ahora" (agrega y abre el carrito) y "Añadir al carrito".
 * Enlaza al detalle `/tienda/[id]`.
 */
export function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const segundaFoto = fotosDeProducto(product.id)[0];

  const addToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
  };

  const handleAdd = () => {
    addToCart();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = () => {
    addToCart();
    openCart();
  };

  return (
    <div
      data-scroll-animate="fade-in-up"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <Link href={`/tienda/${product.id}`} className="block overflow-hidden bg-rose-50">
        <div className="relative aspect-square w-full overflow-hidden">
          <AppImage
            src={product.image_url ? miniatura(product.image_url, 600, 600) : null}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {segundaFoto && (
            <AppImage
              src={miniatura(segundaFoto, 600, 600)}
              alt={`${product.name} (otra foto)`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#A01C46] shadow-sm">
            Personalizado
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col items-center gap-3 px-3 pb-4 pt-3 text-center sm:px-4">
        <Link
          href={`/tienda/${product.id}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-stone-900 transition-colors hover:text-[#C1375D] sm:text-[15px]"
        >
          {product.name}
        </Link>

        <span className="text-lg font-bold text-[#C1375D]">{formatPrice(product.price)}</span>

        <div className="flex items-center gap-3" aria-label="Cantidad">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-colors hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-4 text-sm font-semibold text-stone-900">{quantity}</span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            disabled={quantity >= 9}
            onClick={() => setQuantity((value) => Math.min(9, value + 1))}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-colors hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <div className="mt-auto flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full cursor-pointer rounded-full bg-[#C1375D] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C1375D]/20 transition-all hover:bg-[#7A1734] active:scale-[0.97]"
          >
            Comprar ahora
          </button>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Añadir ${product.name} al carrito`}
            className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-[0.97] ${
              added
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-[#C1375D] text-[#C1375D] hover:bg-rose-50"
            }`}
          >
            {added && <Check className="size-4" />}
            {added ? "¡Agregado!" : "Añadir al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
