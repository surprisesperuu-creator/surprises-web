"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Check, CloudUpload, ImageOff, Link as LinkIcon, LoaderCircle, Upload } from "lucide-react";

import { FormField, inputBaseClass } from "@/components/admin/forms/FormControls";

interface ImageFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string;
  hint?: string;
  /** Carpeta de Cloudinary destino: "products" | "categories" | "hero". */
  folder?: "products" | "categories" | "hero";
}

interface UploadSignatureResponse {
  data: {
    cloudName: string;
    apiKey: string;
    folder: string;
    timestamp: number;
    signature: string;
  };
  error: null;
}

type UploadMessage =
  | { type: "success" | "error"; text: string }
  | null;

/**
 * Campo de imagen del Admin con CARGA DIRECTA a Cloudinary (signed upload).
 *
 * Flujo:
 * 1. El usuario elige un archivo.
 * 2. Se pide una firma firmada al endpoint seguro `POST /api/upload`
 *    (el API_SECRET jamás sale del servidor).
 * 3. Con esa firma, el navegador sube el archivo directamente a Cloudinary.
 * 4. Se obtiene la `secure_url` y se pasa al formulario para persistirla.
 */
export function ImageField({ value, onChange, error, hint, folder = "products" }: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<UploadMessage>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      void handleFilePicked(file);
    }
  };

  const handleFilePicked = async (file: File) => {
    setUploading(true);
    setMessage(null);

    try {
      // 1. Firma firmada desde el servidor.
      const response = await fetch(`/api/upload?folder=${encodeURIComponent(folder)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const body = (await response.json()) as
        | UploadSignatureResponse
        | { data: null; error: { message: string } };

      if (!response.ok || body.error !== null || !body.data) {
        const reason =
          typeof body.error === "object" && body.error && body.error.message
            ? body.error.message
            : "No se pudo iniciar la subida";
        throw new Error(reason);
      }

      const { cloudName, apiKey, folder: folderName, timestamp, signature } = body.data;

      // 2. Subida directa a Cloudinary con la firma.
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folderName);
      formData.append("timestamp", String(timestamp));
      formData.append("api_key", apiKey);
      formData.append("signature", signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploadBody = (await uploadResponse.json()) as {
        secure_url?: string;
        error?: { message?: string };
      };

      if (!uploadResponse.ok || !uploadBody.secure_url) {
        throw new Error(
          uploadBody.error?.message ?? "No se pudo subir la imagen a Cloudinary"
        );
      }

      onChange(uploadBody.secure_url);
      setMessage({ type: "success", text: "Imagen subida correctamente." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "No se pudo subir la imagen",
      });
    } finally {
      setUploading(false);
    }
  };

  const buttonLabel = uploading ? "Subiendo..." : value ? "Reemplazar" : "Subir";
return (
    <FormField label="Imagen" htmlFor="image-url" error={error} hint={hint}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative size-28 shrink-0 overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-background/60 transition-colors hover:border-primary/60"
          aria-label={buttonLabel}
          title={buttonLabel}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Vista previa de la imagen"
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full flex-col items-center justify-center gap-1 text-primary/60">
              <ImageOff className="size-7" />
              <span className="text-[11px] font-medium">Sin imagen</span>
            </span>
          )}
          <span className="absolute inset-0 flex items-end justify-center bg-black/55 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
            {buttonLabel}
          </span>
        </button>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-white px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <CloudUpload className="size-5 shrink-0 text-primary/60" />
              <div>
                <p className="text-sm font-medium text-text/80">
                  Carga directa a Cloudinary
                </p>
                <p className="text-xs leading-relaxed text-text/45">
                  La imagen se sube de forma dinámica y queda lista para guardarse con el formulario.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/25 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {buttonLabel}
            </button>
          </div>

          {message && (
            <p
              className={`flex items-start gap-1.5 text-xs ${
                message.type === "success" ? "text-green-700" : "text-red-600"
              }`}
            >
              {message.type === "success" ? (
                <Check className="mt-0.5 size-3.5 shrink-0" />
              ) : (
                <LinkIcon className="mt-0.5 size-3.5 shrink-0" />
              )}
              {message.text}
            </p>
          )}
        </div>
      </div>

      {/* Campo URL editable como alternativa / para editar imágenes previas */}
      <input
        id="image-url"
        type="url"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value.trim() || null)}
        placeholder="https://res.cloudinary.com/..."
        className={inputBaseClass}
      />
    </FormField>
  );
}
