"use client";

import { useState } from "react";

import { AppImage } from "@/components/AppImage";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  /** Etiqueta sobre la foto principal (p. ej. la categoría). */
  badge?: string | null;
}

/**
 * Galería del detalle de producto: foto principal grande y miniaturas
 * para cambiarla. Con una sola foto se ve igual que antes.
 */
export function ProductGallery({ images, alt, badge }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0] ?? null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-white shadow-sm">
        <div className="flex min-h-[280px] items-center justify-center bg-stone-100 p-4 sm:min-h-[320px] sm:p-6">
          <AppImage
            key={current ?? "sin-imagen"}
            src={current}
            alt={alt}
            className="max-h-[300px] w-auto max-w-full rounded-2xl object-contain sm:max-h-[380px]"
          />
        </div>
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#A01C46] shadow-sm backdrop-blur">
            {badge}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1} de ${images.length}`}
              aria-current={index === active}
              className={`size-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-stone-100 transition-all sm:size-20 ${
                index === active
                  ? "border-[#C1375D] shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <AppImage src={src} alt={`${alt} (foto ${index + 1})`} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
