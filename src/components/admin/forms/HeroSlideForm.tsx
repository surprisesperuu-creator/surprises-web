"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";

import type { HeroSlide } from "@/types/hero-slide";
import { createHeroSlideSchema } from "@/lib/validations/hero-slide.schema";
import { adminApi } from "@/lib/admin/api-client";
import { useToast } from "@/lib/admin/toast";

import { TextField } from "@/components/admin/forms/FormControls";
import { ImageField } from "@/components/admin/forms/ImageField";

interface HeroSlideFormProps {
  mode: "create" | "edit";
  initial?: HeroSlide;
}

interface FormValues {
  title: string;
  image_url: string;
  sort_order: string;
}

/**
 * Formulario de imagen del Hero (nueva/editar). Valida en cliente con el
 * mismo esquema Zod que usa el backend y consume POST/PUT /api/hero-slides.
 * La imagen se sube a Cloudinary (carpeta "hero") con ImageField.
 */
export function HeroSlideForm({ mode, initial }: HeroSlideFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = mode === "edit";

  const [values, setValues] = useState<FormValues>({
    title: initial?.title ?? "",
    image_url: initial?.image_url ?? "",
    sort_order: initial ? String(initial.sort_order) : "0",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const setField =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const payload = {
      title: values.title,
      image_url: values.image_url || null,
      sort_order: values.sort_order === "" ? undefined : Number(values.sort_order),
    };

    const parsed = createHeroSlideSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof FormValues | undefined;
        if (path) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && initial) {
        await adminApi.updateHeroSlide(initial.id, parsed.data);
        showToast("Imagen del Hero actualizada correctamente");
      } else {
        await adminApi.createHeroSlide(parsed.data);
        showToast("Imagen del Hero creada correctamente");
      }
      router.push("/admin/hero");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Error al guardar la imagen"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl space-y-5 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm"
    >
      <TextField
        label="Título"
        name="title"
        value={values.title}
        onChange={setField("title")}
        error={errors.title}
        placeholder="P. ej. Hero San Valentín"
        hint="Nombre de referencia en el Admin; también se usa como texto alternativo de la imagen."
        required
      />

      <div className="max-w-xs">
        <TextField
          label="Orden"
          name="sort_order"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={values.sort_order}
          onChange={setField("sort_order")}
          error={errors.sort_order}
          hint="Menor número aparece primero en el carrusel."
          placeholder="0"
        />
      </div>

      <ImageField
        folder="hero"
        value={values.image_url}
        onChange={(image_url) => {
          setValues((prev) => ({ ...prev, image_url: image_url ?? "" }));
          setErrors((prev) => ({ ...prev, image_url: undefined }));
        }}
        error={errors.image_url}
        hint="Se recomienda una imagen horizontal (p. ej. 1920×1080). Se sube a Cloudinary y queda lista para guardarse con el formulario."
      />

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-primary/10 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/hero")}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 px-5 py-3 text-base font-medium text-text transition-colors hover:bg-background disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isEdit ? "Guardar cambios" : "Crear imagen"}
        </button>
      </div>
    </form>
  );
}
