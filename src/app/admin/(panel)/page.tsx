"use client";

import Link from "next/link";
import { CircleCheck, Clock, Package, Plus, Sparkles, Tags } from "lucide-react";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";

import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";
import { EmptyState } from "@/components/admin/EmptyState";
import { AppImage } from "@/components/AppImage";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";

export default function AdminDashboardPage() {
  const categoriesQuery = useApiData<Category[]>(() => adminApi.getCategories(), []);
  const productsQuery = useApiData<ProductWithCategory[]>(
    () => adminApi.getProducts(),
    []
  );

  const loading = categoriesQuery.loading || productsQuery.loading;
  const error = categoriesQuery.error ?? productsQuery.error;
  const refetch = () => {
    categoriesQuery.refetch();
    productsQuery.refetch();
  };

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const activeProducts = products.filter((product) => product.is_active).length;
  const activeCategories = categories.filter((category) => category.is_active).length;

  // El endpoint GET /api/products ya devuelve los más recientes primero.
  const recentProducts = products.slice(0, 5);

  const recentColumns: DataTableColumn<ProductWithCategory>[] = [
    {
      key: "image",
      header: "Imagen",
      render: (row) => (
        <AppImage
          src={row.image_url}
          alt={row.name}
          className="size-11 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "name",
      header: "Producto",
      render: (row) => <p className="font-medium text-text">{row.name}</p>,
    },
    {
      key: "category",
      header: "Categoría",
      render: (row) => (
        <p className="text-text/70">{row.category?.name ?? "—"}</p>
      ),
    },
    {
      key: "price",
      header: "Precio",
      render: (row) => <p className="font-medium text-secondary">{formatPrice(row.price)}</p>,
    },
    {
      key: "status",
      header: "Estado",
      render: (row) => <StatusBadge active={row.is_active} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen general de tu tienda Surprises."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-secondary"
          >
            <Plus className="size-4" />
            Nuevo producto
          </Link>
        }
      />

      {loading ? (
        <LoadingState label="Cargando datos del panel..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <div className="space-y-6">
          {/* Cards de resumen */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminCard
              title="Total de productos"
              value={totalProducts}
              icon={Package}
              tone="primary"
            />
            <AdminCard
              title="Total de categorías"
              value={totalCategories}
              icon={Tags}
              tone="secondary"
            />
            <AdminCard
              title="Productos activos"
              value={activeProducts}
              icon={CircleCheck}
              tone="accent"
            />
            <AdminCard
              title="Categorías activas"
              value={activeCategories}
              icon={Sparkles}
              tone="cream"
            />
          </div>

          {/* Productos recientes */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-text">
                Productos recientes
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text/50">
                <Clock className="size-3.5" />
                Últimos {recentProducts.length}
              </span>
            </div>

            {recentProducts.length > 0 ? (
              <DataTable
                columns={recentColumns}
                rows={recentProducts}
                rowKey={(row) => row.id}
              />
            ) : (
              <EmptyState
                icon={Package}
                title="Aún no hay productos"
                description="Crea tu primer producto para verlo aquí."
                action={
                  <Link
                    href="/admin/products/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
                  >
                    <Plus className="size-4" />
                    Crear producto
                  </Link>
                }
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}
