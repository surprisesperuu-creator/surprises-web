"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Package,
  PenLine,
} from "lucide-react";

import { useApiData } from "@/lib/api/use-api-data";
import { storeApi } from "@/lib/store/api";
import type { Category } from "@/types/category";
import type { HeroSlide } from "@/types/hero-slide";
import type { ProductWithCategory } from "@/types/product";
import { CategoryCarousel } from "@/components/store/CategoryCarousel";
import { HeroCarousel } from "@/components/store/HeroCarousel";
import { ProductCard } from "@/components/store/ProductCard";
import { StoreEmpty, StoreError } from "@/components/store/StoreStates";

export default function Home() {
  const heroQuery = useApiData<HeroSlide[]>(() => storeApi.getHeroSlides(), []);
  const categoriesQuery = useApiData<Category[]>(() => storeApi.getCategories(), []);
  const productsQuery = useApiData<ProductWithCategory[]>(() => storeApi.getProducts(), []);

  // Sin concepto de "destacados" en el backend: se muestran los productos
  // activos más recientes (GET /api/products devuelve los más recientes primero).
  const featuredProducts = (productsQuery.data ?? []).slice(0, 3);

  return (
    <div className="w-full bg-white flex flex-col justify-start items-center overflow-x-hidden min-h-screen">
      <section className="w-full flex flex-col justify-start items-center">
        {/* HERO (carrusel administrable: GET /api/hero-slides) */}
        <div className="w-full min-h-[calc(100vh-80px)] py-12 relative flex justify-center items-center overflow-hidden">
          <HeroCarousel slides={heroQuery.data ?? []} loading={heroQuery.loading} />

          <div className="w-full max-w-[1280px] px-6 sm:px-12 lg:px-16 relative z-10 flex flex-col justify-center items-center text-center">
            <div className="pb-6">
              <div className="px-4 py-1.5 bg-red-50/90 rounded-full shadow-sm outline outline-1 outline-stone-200/80 backdrop-blur-md">
                <span className="text-stone-600 text-xs font-semibold uppercase tracking-widest">
                  COLECCIÓN EXCLUSIVA
                </span>
              </div>
            </div>

            <div className="max-w-[900px] pb-6">
              <h1 className="text-stone-900 text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                Regalos que convierten <br className="hidden sm:inline" />
                <span className="text-pink-800">momentos en recuerdos</span>
              </h1>
            </div>

            <div className="max-w-[600px] pb-10">
              <p className="text-stone-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                Descubre nuestra cuidada selección de detalles premium. Cada pieza está pensada para sorprender y emocionar a esa persona especial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
              <Link
                href="/tienda"
                className="w-full sm:w-auto px-8 py-4 bg-pink-800 hover:bg-pink-900 transition-all duration-200 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 active:scale-95"
              >
                <span className="text-white text-sm font-semibold tracking-wide">
                  Explorar regalos
                </span>
                <ArrowRight size={18} className="text-white" />
              </Link>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white/90 hover:bg-stone-50 transition-all duration-200 rounded-full shadow-sm outline outline-2 -outline-offset-2 outline-pink-800 flex items-center justify-center gap-2 active:scale-95"
              >
                <MessageCircle size={18} className="text-pink-800 fill-pink-800" />
                <span className="text-pink-800 text-sm font-semibold tracking-wide">
                  Pedir por WhatsApp
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* CARRUSEL DE CATEGORÍAS (dinámico: GET /api/categories) */}
        {categoriesQuery.loading ? (
          <div className="w-full bg-rose-50 py-28">
            <div className="w-full max-w-[1280px] px-6 sm:px-10 lg:px-16">
              <div className="h-10 w-72 animate-pulse rounded bg-stone-200" />
            </div>
            <div className="mt-10 flex gap-6 overflow-hidden px-6 sm:px-10 lg:px-16">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-80 w-64 flex-shrink-0 animate-pulse rounded-[32px] bg-stone-200"
                />
              ))}
            </div>
          </div>
        ) : categoriesQuery.error ? (
          <div className="w-full bg-rose-50 px-6 py-20">
            <StoreError message={categoriesQuery.error} retryHref="/" />
          </div>
        ) : (
          <CategoryCarousel categories={categoriesQuery.data ?? []} />
        )}

        {/* PRODUCTOS FAVORITOS (dinámicos: GET /api/products) */}
        <div className="w-full bg-stone-50 py-16 flex flex-col justify-start items-center">
          <div className="w-full max-w-[1280px] px-6 sm:px-10 lg:px-16 flex flex-col justify-start items-center gap-12">
            <div className="flex flex-col justify-start items-center gap-4 text-center">
              <h2 className="text-stone-900 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Los favoritos de Surprises
              </h2>
              <p className="max-w-[672px] text-stone-600 text-base sm:text-lg font-normal leading-7">
                Nuestra selección más exclusiva, elegida por nuestros clientes para celebrar los momentos más importantes.
              </p>
            </div>

            {productsQuery.loading ? (
              <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white"
                  >
                    <div className="aspect-square animate-pulse bg-stone-200" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                      <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : productsQuery.error ? (
              <div className="w-full">
                <StoreError message={productsQuery.error} retryHref="/" />
              </div>
            ) : featuredProducts.length === 0 ? (
              <StoreEmpty
                title="Aún no hay productos"
                description="Vuelve pronto: estamos preparando nuevas sorpresas."
              />
            ) : (
              <div className="grid w-full grid-cols-1 items-stretch gap-8 md:grid-cols-3">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} delay={index * 100} />
                ))}
              </div>
            )}

            <Link href="/tienda" className="mt-4">
              <div className="px-8 py-3 rounded-full outline outline-1 outline-stone-300 hover:bg-white transition-colors flex justify-center items-center">
                <span className="text-pink-800 text-sm font-semibold leading-5 tracking-wide">
                  Ver toda la colección
                </span>
              </div>
            </Link>
          </div>
        </div>


        {/* 3 PASOS */}
        <div className="w-full py-16 bg-stone-50 flex flex-col justify-start items-center">
          <div className="w-full max-w-[1280px] px-6 sm:px-10 flex flex-col justify-start items-center gap-12">
            <h2 className="text-center text-stone-900 text-3xl font-semibold leading-10">
              Regalar nunca fue tan fácil
            </h2>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              <div className="w-full p-8 bg-white rounded-3xl shadow-sm flex flex-col items-center gap-4 text-center" data-scroll-animate="fade-in-up" style={{ animationDelay: "0ms" }}>
                <div className="w-20 h-20 bg-red-100 rounded-full flex justify-center items-center shadow-inner">
                  <Heart size={28} className="text-[#3F0015] fill-[#3F0015]" />
                </div>
                <h3 className="text-stone-900 text-2xl font-medium">1. Elige</h3>
                <p className="text-stone-600 text-base font-normal leading-6">
                  Selecciona el regalo perfecto de nuestro catálogo exclusivo.
                </p>
              </div>

              <div className="w-full p-8 bg-white rounded-3xl shadow-sm flex flex-col items-center gap-4 text-center" data-scroll-animate="fade-in-up" style={{ animationDelay: "100ms" }}>
                <div className="w-20 h-20 bg-red-100 rounded-full flex justify-center items-center shadow-inner">
                  <PenLine size={26} className="text-[#31111C]" />
                </div>
                <h3 className="text-stone-900 text-2xl font-medium">2. Personaliza</h3>
                <p className="text-stone-600 text-base font-normal leading-6">
                  Añade un mensaje especial o extras para hacerlo único.
                </p>
              </div>

              <div className="w-full p-8 bg-white rounded-3xl shadow-sm flex flex-col items-center gap-4 text-center" data-scroll-animate="fade-in-up" style={{ animationDelay: "200ms" }}>
                <div className="w-20 h-20 bg-red-100 rounded-full flex justify-center items-center shadow-inner">
                  <Package size={30} className="text-[#400014]" />
                </div>
                <h3 className="text-stone-900 text-2xl font-medium">3. Sorprende</h3>
                <p className="text-stone-600 text-base font-normal leading-6">
                  Nos encargamos de entregarlo con cariño en la fecha elegida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

