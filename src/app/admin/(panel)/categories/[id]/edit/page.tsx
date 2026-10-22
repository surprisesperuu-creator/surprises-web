"use client";

import { useParams } from "next/navigation";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import type { Category } from "@/types/category";

import { CategoryForm } from "@/components/admin/forms/CategoryForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const categoryId = params.id;

  const { data, loading, error, refetch } = useApiData<Category>(
    () => adminApi.getCategory(categoryId),
    [categoryId]
  );

  return (
    <>
      <PageHeader
        title="Editar categoría"
        description={data ? `Actualizando "${data.name}"` : "Actualizando categoría"}
      />

      {loading ? (
        <LoadingState label="Cargando categoría..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data ? (
        <CategoryForm mode="edit" initial={data} />
      ) : null}
    </>
  );
}
