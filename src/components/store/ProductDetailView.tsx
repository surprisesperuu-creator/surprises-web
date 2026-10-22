"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingCart, Truck, ShieldCheck, MessageCircle } from "lucide-react";

import { AppImage } from "@/components/AppImage";
import { ProductCard } from "@/components/store/ProductCard";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/store/whatsapp";
import type { ProductWithCategory } from "@/types/product";

interface ProductDetailViewProps {
  product: ProductWithCategory;
  related: ProductWithCategory[];
}

/**
 * Detalle de producto de la tienda pública.
 * Muestra únicamente datos reales del backend: imagen, nombre, precio y
 * categoría. El botón agrega al carrito (Zustand), abre el sidebar y
 * muestra feedback visual.
 */
export function ProductDetailView({ product, related }: ProductDetailViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const whatsappUrl = buildWhatsAppUrl(
    `Hola, me interesa el producto "${product.name}" (${formatPrice(product.price)}). ¿Sigue disponible?`
  );

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="w-full bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Ruta de navegación"
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-stone-500"
        >
          <Link href="/" className="transition-colors hover:text-[#C1375D]">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/tienda" className="transition-colors hover:text-[#C1375D]">
            Tienda
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/tienda?category=${product.category.slug}`}
                className="transition-colors hover:text-[#C1375D]"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="font-medium text-stone-800">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-10">
          {/* Imagen (compacta, producto completo sin recorte gigante) */}
          <div className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-sm">
              <div className="flex min-h-[280px] items-center justify-center bg-stone-100 p-4 sm:min-h-[320px] sm:p-6">
                <AppImage
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-[300px] w-auto max-w-full rounded-2xl object-contain sm:max-h-[380px]"
                />
              </div>
              {product.category && (
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#A01C46] shadow-sm backdrop-blur">
                  {product.category.name}
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white px-3 py-2.5">
                <Truck className="size-4 shrink-0 text-[#C1375D]" />
                Envío coordinado por WhatsApp
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white px-3 py-2.5">
                <ShieldCheck className="size-4 shrink-0 text-[#C1375D]" />
                Compra protegida y verificada
              </div>
            </div>
          </div>

          {/* Información */}
          <div className="flex min-w-0 flex-col gap-5 rounded-[28px] border border-stone-200/80 bg-white p-5 shadow-sm sm:p-7">
            {product.category && (
              <Link
                href={`/tienda?category=${product.category.slug}`}
                className="self-start rounded-full bg-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary transition-colors hover:bg-accent"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-display text-2xl font-semibold leading-tight text-stone-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2 border-b border-stone-200 pb-4">
              <span className="font-display text-2xl font-semibold text-[#C1375D] sm:text-3xl">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-stone-500">Precio unitario</span>
            </div>

            {/* Cantidad + agregar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center justify-between gap-1 rounded-full border border-stone-200 bg-stone-50 p-1 sm:w-36">
                <button
                  type="button"
                  aria-label="Disminuir cantidad"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar cantidad"
                  disabled={quantity >= 9}
                  onClick={() => setQuantity((value) => Math.min(9, value + 1))}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 ${
                  added
                    ? "bg-emerald-600 shadow-emerald-600/25"
                    : "bg-[#C1375D] shadow-[#C1375D]/25 hover:bg-[#7A1734]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="size-4" />
                    Agregado al carrito
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-4" />
                    Agregar al carrito
                  </>
                )}
              </button>
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-7 py-3 text-sm font-semibold text-emerald-900 transition-all hover:bg-[#25D366]/20 active:scale-95"
              >
                <MessageCircle className="size-4" />
                Consultar por WhatsApp
              </a>
            )}

            <p className="text-xs leading-relaxed text-stone-500">
              Tu carrito guarda los productos y al final podrás pedirlos por
              WhatsApp. Se actualiza automáticamente en el contador del header.
            </p>
          </div>
        </div>

        {/* Relacionados (misma categoría) */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-semibold text-stone-900 sm:text-3xl">
              También te podría gustar
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
