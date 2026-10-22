"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { AppImage } from "@/components/AppImage";
import { InfiniteCarousel } from "@/app/scripts/infiniteCarousel";
import type { Category } from "@/types/category";

interface CategoryCarouselProps {
  categories: Category[];
}

/**
 * Carrusel de categorías del Home.
 * Conserva el diseño y la animación infinita existentes, pero las tarjetas
 * se construyen dinámicamente desde GET /api/categories (solo activas).
 * Cada categoría enlaza a /tienda?category=<slug>.
 */
export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }
    // Evita re-inicializar si el arreglo vuelve a la misma longitud.
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    const carousel = new InfiniteCarousel({
      containerId: "carousel-container",
      trackId: "carousel-track",
      prevBtnId: "carousel-prev",
      nextBtnId: "carousel-next",
      speed: 1,
    });

    return () => {
      carousel.destroy();
      initializedRef.current = false;
    };
  }, [categories]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-start justify-start gap-12 overflow-hidden bg-rose-50 py-28">
      <div className="mx-auto flex w-full max-w-[1280px] items-end justify-between px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col items-start justify-start gap-2">
          <h2 className="text-3xl font-medium leading-10 text-stone-900">
            Explora por Categoría
          </h2>
          <p className="text-base font-normal leading-6 text-stone-600">
            Encuentra el detalle perfecto
          </p>
        </div>
        <div className="flex items-start justify-start gap-2">
          <button
            type="button"
            id="carousel-prev"
            aria-label="Anterior categoría"
            className="flex h-12 w-12 items-center justify-center rounded-full outline outline-1 outline-stone-300 transition-colors hover:bg-white"
          >
            <ArrowLeft size={16} className="text-stone-800" />
          </button>
          <button
            type="button"
            id="carousel-next"
            aria-label="Siguiente categoría"
            className="flex h-12 w-12 items-center justify-center rounded-full outline outline-1 outline-stone-300 transition-colors hover:bg-white"
          >
            <ArrowRight size={16} className="text-stone-800" />
          </button>
        </div>
      </div>

      <div id="carousel-container" className="w-full overflow-hidden">
        <div
          id="carousel-track"
          className="flex w-max items-start justify-start gap-6 px-6 sm:px-10 lg:px-16"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/tienda?category=${category.slug}`}
              className="relative h-80 w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-[32px] group"
            >
              <AppImage
                src={category.image_url}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              <span className="absolute bottom-6 left-6 text-2xl font-medium text-white">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
