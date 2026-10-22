"use client";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import type { Category } from "@/types/category";

import { ProductForm } from "@/components/admin/forms/ProductForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";

export default function NewProductPage() {
  const { data, loading, error, refetch } = useApiData<Category[]>(
    () => adminApi.getCategories(),
    []
  );

  return (
    <>
      <PageHeader
        title="Nuevo producto"
        description="Crea un producto. Los productos solo tienen nombre, precio, categoría e imagen."
      />

      {loading ? (
        <LoadingState label="Cargando categorías..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <ProductForm mode="create" categories={data ?? []} />
      )}
    </>
  );
}
