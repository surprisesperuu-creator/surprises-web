"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";

import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";
import { createProductSchema } from "@/lib/validations/product.schema";
import { adminApi } from "@/lib/admin/api-client";
import { useToast } from "@/lib/admin/toast";

import { SelectField, TextAreaField, TextField } from "@/components/admin/forms/FormControls";
import { ImageField } from "@/components/admin/forms/ImageField";
import { GalleryField } from "@/components/admin/forms/GalleryField";

interface ProductFormProps {
  mode: "create" | "edit";
  initial?: ProductWithCategory;
  categories: Category[];
}

interface FormValues {
  category_id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  images: string[];
}

/**
 * Formulario de producto (nuevo/editar). Valida en cliente con el mismo
 * esquema Zod que usa el backend y consume POST/PUT /api/products.
 * Los productos tienen: nombre, descripción, precio, categoría, imagen
 * principal y fotos adicionales.
 */
export function ProductForm({ mode, initial, categories }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = mode === "edit";

  const [values, setValues] = useState<FormValues>({
    category_id: initial?.category_id ?? "",
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial ? String(initial.price) : "",
    image_url: initial?.image_url ?? "",
    images: initial?.images ?? [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const setField =
    (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const payload = {
      category_id: values.category_id,
      name: values.name,
      description: values.description || null,
      price: Number(values.price),
      image_url: values.image_url || null,
      images: values.images,
    };

    const parsed = createProductSchema.safeParse(payload);
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
        await adminApi.updateProduct(initial.id, parsed.data);
        showToast("Producto actualizado correctamente");
      } else {
        await adminApi.createProduct(parsed.data);
        showToast("Producto creado correctamente");
      }
      router.push("/admin/products");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Error al guardar el producto"
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
      <SelectField
        label="Categoría"
        name="category_id"
        value={values.category_id}
        onChange={setField("category_id")}
        error={errors.category_id}
        required
      >
        <option value="">Selecciona una categoría</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </SelectField>

      <TextField
        label="Nombre"
        name="name"
        value={values.name}
        onChange={setField("name")}
        error={errors.name}
        placeholder="P. ej. Caja de Rosas Especial"
        required
      />

      <TextAreaField
        label="Descripción"
        name="description"
        value={values.description}
        onChange={setField("description")}
        error={errors.description}
        rows={5}
        placeholder="Qué incluye, medidas, personalización… (opcional)"
      />

      <div className="max-w-xs">
        <TextField
          label="Precio (S/)"
          name="price"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={values.price}
          onChange={setField("price")}
          error={errors.price}
          placeholder="0.00"
          required
        />
      </div>

      <ImageField
        folder="products"
        label="Imagen principal"
        value={values.image_url}
        onChange={(image_url) => {
          setValues((prev) => ({ ...prev, image_url: image_url ?? "" }));
          setErrors((prev) => ({ ...prev, image_url: undefined }));
        }}
        error={errors.image_url}
      />

      <GalleryField
        value={values.images}
        onChange={(images) => {
          setValues((prev) => ({ ...prev, images }));
          setErrors((prev) => ({ ...prev, images: undefined }));
        }}
        error={errors.images}
      />

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-primary/10 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
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
          {isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

