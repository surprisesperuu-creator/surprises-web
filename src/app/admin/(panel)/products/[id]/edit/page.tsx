"use client";

import { useParams } from "next/navigation";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";

import { ProductForm } from "@/components/admin/forms/ProductForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const productQuery = useApiData<ProductWithCategory>(
    () => adminApi.getProduct(productId),
    [productId]
  );
  const categoriesQuery = useApiData<Category[]>(
    () => adminApi.getCategories(),
    []
  );

  const loading = productQuery.loading || categoriesQuery.loading;
  const error = productQuery.error ?? categoriesQuery.error;
  const refetch = () => {
    productQuery.refetch();
    categoriesQuery.refetch();
  };

  return (
    <>
      <PageHeader
        title="Editar producto"
        description={
          productQuery.data ? `Actualizando "${productQuery.data.name}"` : "Actualizando producto"
        }
      />

      {loading ? (
        <LoadingState label="Cargando producto..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : productQuery.data ? (
        <ProductForm
          mode="edit"
          initial={productQuery.data}
          categories={categoriesQuery.data ?? []}
        />
      ) : null}
    </>
  );
}
