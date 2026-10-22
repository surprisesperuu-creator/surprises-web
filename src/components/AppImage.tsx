"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface AppImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

/**
 * Imagen con fallback, compartida entre Admin y tienda.
 *
 * Usa <img> (en lugar de next/image) porque se muestran URLs remotas
 * arbitrarias (Cloudinary u otras) que no están en `remotePatterns`,
 * evitando errores 400 del optimizador de imágenes.
 */
export function AppImage({ src, alt, className = "" }: AppImageProps) {
  const [failed, setFailed] = useState(false);
  const hasSrc = typeof src === "string" && src.length > 0;

  if (!hasSrc || failed) {
    return (
      <span
        className={`flex items-center justify-center bg-background text-primary/40 ${className}`}
      >
        <ImageOff className="size-6" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
