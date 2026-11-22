"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, LoaderCircle, X } from "lucide-react";

import { FormField } from "@/components/admin/forms/FormControls";
import { uploadToCloudinary, type UploadFolder } from "@/lib/admin/cloudinary-upload";

interface GalleryFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  /** Máximo de fotos adicionales. */
  max?: number;
  folder?: UploadFolder;
}

/**
 * Fotos adicionales del producto: se eligen varias a la vez, se suben a
 * Cloudinary y se pueden quitar o reordenar. Se guardan con el formulario.
 */
export function GalleryField({ value, onChange, error, max = 12, folder = "products" }: GalleryFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const remaining = max - value.length;

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, Math.max(remaining, 0));
    event.target.value = "";
    if (!files.length) return;

    setMessage(null);
    setUploading(files.length);
    const subidas: string[] = [];
    const fallidas: string[] = [];
    for (const file of files) {
      try {
        subidas.push(await uploadToCloudinary(file, folder));
      } catch {
        fallidas.push(file.name);
      }
      setUploading((n) => n - 1);
    }
    if (subidas.length) onChange([...value, ...subidas]);
    if (fallidas.length) setMessage(`No se pudieron subir: ${fallidas.join(", ")}`);
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <FormField
      label="Más fotos"
      htmlFor="gallery-upload"
      error={error}
      hint={`Puedes elegir varias a la vez (hasta ${max}). Se muestran en la ficha del producto, después de la imagen principal.`}
    >
      <input
        id="gallery-upload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <div className="flex flex-wrap gap-3">
        {value.map((src, index) => (
          <div
            key={src}
            className="group relative size-28 overflow-hidden rounded-2xl border border-primary/20 bg-background"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Foto ${index + 1}`} className="size-full object-cover" />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Quitar foto ${index + 1}`}
              className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-600"
            >
              <X className="size-4" />
            </button>
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Mover foto ${index + 1} a la izquierda`}
                className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-0"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                aria-label={`Mover foto ${index + 1} a la derecha`}
                className="flex size-7 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-0"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading > 0}
            className="flex size-28 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-primary/40 bg-background/60 text-primary transition-colors hover:border-primary hover:bg-white disabled:cursor-wait disabled:opacity-70"
          >
            {uploading > 0 ? (
              <>
                <LoaderCircle className="size-6 animate-spin" />
                <span className="text-[11px] font-medium">Subiendo {uploading}…</span>
              </>
            ) : (
              <>
                <ImagePlus className="size-6" />
                <span className="text-[11px] font-medium">Agregar fotos</span>
              </>
            )}
          </button>
        )}
      </div>

      {message && <p className="mt-2 text-xs text-red-600">{message}</p>}
    </FormField>
  );
}
