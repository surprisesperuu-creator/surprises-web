"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Package, Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import { useToast } from "@/lib/admin/toast";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";

import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorState } from "@/components/admin/ErrorState";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AppImage } from "@/components/AppImage";

const primaryButtonClass =
  "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-secondary";

const selectClass =
  "rounded-xl border border-primary/20 bg-white px-3 py-2 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function AdminProductsPage() {
  const { showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState("");
  const { data: categories } = useApiData<Category[]>(
    () => adminApi.getCategories(),
    []
  );
  const { data, loading, error, refetch } = useApiData<ProductWithCategory[]>(
    () => adminApi.getProducts(categoryFilter || undefined),
    [categoryFilter]
  );

  const [pendingDelete, setPendingDelete] = useState<ProductWithCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (product: ProductWithCategory) => {
    setTogglingId(product.id);
    try {
      await adminApi.updateProduct(product.id, {
        is_active: !product.is_active,
      });
      showToast(
        product.is_active ? "Producto desactivado" : "Producto activado"
      );
      refetch();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "No se pudo actualizar el estado",
        "error"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }
    setDeleting(true);
    try {
      await adminApi.deleteProduct(pendingDelete.id);
      showToast("Producto eliminado correctamente");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "No se pudo eliminar el producto",
        "error"
      );
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<ProductWithCategory>[] = [
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
      render: (row) => (
        <p className="font-medium text-secondary">{formatPrice(row.price)}</p>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (row) => <StatusBadge active={row.is_active} />,
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Link
            href={`/admin/products/${row.id}/edit`}
            className="rounded-lg p-2 text-text/50 transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.name}`}
            title="Editar"
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleToggle(row)}
            disabled={togglingId === row.id}
            className="rounded-lg p-2 text-text/50 transition-colors hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40"
            aria-label={row.is_active ? "Desactivar producto" : "Activar producto"}
            title={row.is_active ? "Desactivar" : "Activar"}
          >
            {row.is_active ? (
              <Power className="size-4" />
            ) : (
              <PowerOff className="size-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setPendingDelete(row)}
            className="rounded-lg p-2 text-text/50 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Eliminar ${row.name}`}
            title="Eliminar"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Productos"
        description="Administra el catálogo de productos de la tienda."
        actions={
          <Link href="/admin/products/new" className={primaryButtonClass}>
            <Plus className="size-4" />
            Nuevo producto
          </Link>
        }
      />

      {/* Filtro por categoría (usa el query param existente del endpoint) */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="category-filter"
          className="flex items-center gap-1.5 text-sm font-medium text-text/70"
        >
          <Filter className="size-4 text-primary/50" />
          Categoría:
        </label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className={selectClass}
        >
          <option value="">Todas</option>
          {(categories ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingState label="Cargando productos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.length > 0 ? (
        <DataTable columns={columns} rows={data} rowKey={(row) => row.id} />
      ) : (
        <EmptyState
          icon={Package}
          title="No hay productos"
          description={
            categoryFilter
              ? "Esta categoría no tiene productos todavía."
              : "Crea tu primer producto para comenzar."
          }
          action={
            !categoryFilter ? (
              <Link href="/admin/products/new" className={primaryButtonClass}>
                <Plus className="size-4" />
                Crear producto
              </Link>
            ) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar producto"
        message={`¿Seguro que deseas eliminar "${pendingDelete?.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

