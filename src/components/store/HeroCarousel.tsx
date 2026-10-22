"use client";

import { useEffect, useState } from "react";

import { AppImage } from "@/components/AppImage";
import type { HeroSlide } from "@/types/hero-slide";

export const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1920&q=80";

interface HeroCarouselProps {
  slides: HeroSlide[];
  loading?: boolean;
}

const AUTOPLAY_MS = 5000;

/**
 * Fondo del Hero del Home principal como carrusel automático.
 * - Si hay 0-1 imágenes activas: muestra una sola imagen (sin animación).
 * - Con 2+: rota entre las imágenes con fundido + dots y flechas.
 * - Mientras carga o si no hay slides: usa la imagen por defecto histórica.
 */
export function HeroCarousel({ slides, loading }: HeroCarouselProps) {
  const images =
    slides.length > 0
      ? slides
      : [{ id: "default", title: "Hero Regalos Premium", image_url: DEFAULT_HERO_IMAGE }];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Índice seguro: si la lista de slides cambia (p. ej. se agregan o
  // quitan imágenes), el índice nunca queda fuera de rango y no se
  // necesita ningún setState dentro de un efecto.
  const safeIndex = images.length > 0 ? index % images.length : 0;

  useEffect(() => {
    if (paused || images.length < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((prev) => prev + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, images.length]);

  const goTo = (next: number) => {
    setIndex(((next % images.length) + images.length) % images.length);
  };

  return (
    <div
      className="absolute inset-0 h-full w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((image, position) => (
        <div
          key={image.id}
          aria-hidden={position !== safeIndex}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
            position === safeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <AppImage
            src={image.image_url}
            alt={image.title || "Hero Regalos Premium"}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {loading ? null : images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(safeIndex - 1)}
            aria-label="Imagen anterior del Hero"
            className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-stone-700 shadow-md backdrop-blur transition hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(safeIndex + 1)}
            aria-label="Siguiente imagen del Hero"
            className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-stone-700 shadow-md backdrop-blur transition hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
            {images.map((image, position) => (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(position)}
                aria-label={`Ir a la imagen ${position + 1}`}
                className={`h-2 cursor-pointer rounded-full transition-all ${
                  position === safeIndex
                    ? "w-8 bg-pink-800"
                    : "w-2 bg-stone-400/70 hover:bg-stone-500"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
