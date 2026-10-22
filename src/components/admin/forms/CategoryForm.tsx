"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save, Wand2 } from "lucide-react";

import type { Category } from "@/types/category";
import { createCategorySchema } from "@/lib/validations/category.schema";
import { adminApi } from "@/lib/admin/api-client";
import { useToast } from "@/lib/admin/toast";
import { slugify } from "@/lib/format";

import {
  TextAreaField,
  TextField,
} from "@/components/admin/forms/FormControls";
import { ImageField } from "@/components/admin/forms/ImageField";

interface CategoryFormProps {
  mode: "create" | "edit";
  initial?: Category;
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

/**
 * Formulario de categoría (nuevo/editar). Valida en cliente con el mismo
 * esquema Zod que usa el backend y consume POST/PUT /api/categories.
 */
export function CategoryForm({ mode, initial }: CategoryFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = mode === "edit";

  const [values, setValues] = useState<FormValues>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    image_url: initial?.image_url ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const setField =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleGenerateSlug = () => {
    setValues((prev) => ({ ...prev, slug: slugify(prev.name) }));
    setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const payload = {
      name: values.name,
      slug: values.slug || slugify(values.name),
      description: values.description || null,
      image_url: values.image_url || null,
    };

    const parsed = createCategorySchema.safeParse(payload);
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
        await adminApi.updateCategory(initial.id, parsed.data);
        showToast("Categoría actualizada correctamente");
      } else {
        await adminApi.createCategory(parsed.data);
        showToast("Categoría creada correctamente");
      }
      router.push("/admin/categories");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Error al guardar la categoría"
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
        label="Nombre"
        name="name"
        value={values.name}
        onChange={setField("name")}
        error={errors.name}
        placeholder="P. ej. Para Ella"
        required
      />

      <TextField
        label="Slug"
        name="slug"
        value={values.slug}
        onChange={setField("slug")}
        error={errors.slug}
        hint="Identificador único para la URL. Solo minúsculas, números y guiones."
        placeholder="para-ella"
        required
        action={
          <button
            type="button"
            onClick={handleGenerateSlug}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/25 bg-background px-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            title="Generar slug a partir del nombre"
          >
            <Wand2 className="size-4" />
            Generar
          </button>
        }
      />

      <TextAreaField
        label="Descripción"
        name="description"
        value={values.description}
        onChange={setField("description")}
        error={errors.description}
        placeholder="Breve descripción de la categoría (opcional)"
      />

      <ImageField
        folder="categories"
        value={values.image_url}
        onChange={(image_url) => {
          setValues((prev) => ({ ...prev, image_url: image_url ?? "" }));
          setErrors((prev) => ({ ...prev, image_url: undefined }));
        }}
        error={errors.image_url}
      />

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-primary/10 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
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
          {isEdit ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}

