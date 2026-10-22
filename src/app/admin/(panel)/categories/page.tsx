"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Power, PowerOff, Tags, Trash2 } from "lucide-react";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import { useToast } from "@/lib/admin/toast";
import type { Category } from "@/types/category";

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

export default function AdminCategoriesPage() {
  const { data, loading, error, refetch } = useApiData<Category[]>(
    () => adminApi.getCategories(),
    []
  );
  const { showToast } = useToast();

  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (category: Category) => {
    setTogglingId(category.id);
    try {
      await adminApi.updateCategory(category.id, {
        is_active: !category.is_active,
      });
      showToast(
        category.is_active ? "Categoría desactivada" : "Categoría activada"
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
      await adminApi.deleteCategory(pendingDelete.id);
      showToast("Categoría eliminada correctamente");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "No se pudo eliminar la categoría",
        "error"
      );
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<Category>[] = [
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
      header: "Nombre",
      render: (row) => <p className="font-medium text-text">{row.name}</p>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => (
        <code className="rounded bg-background px-2 py-0.5 text-xs text-secondary">
          {row.slug}
        </code>
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
            href={`/admin/categories/${row.id}/edit`}
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
            aria-label={row.is_active ? "Desactivar categoría" : "Activar categoría"}
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
        title="Categorías"
        description="Administra las categorías de la tienda."
        actions={
          <Link href="/admin/categories/new" className={primaryButtonClass}>
            <Plus className="size-4" />
            Nueva categoría
          </Link>
        }
      />

      {loading ? (
        <LoadingState label="Cargando categorías..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.length > 0 ? (
        <DataTable columns={columns} rows={data} rowKey={(row) => row.id} />
      ) : (
        <EmptyState
          icon={Tags}
          title="No hay categorías"
          description="Crea tu primera categoría para comenzar."
          action={
            <Link href="/admin/categories/new" className={primaryButtonClass}>
              <Plus className="size-4" />
              Crear categoría
            </Link>
          }
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar categoría"
        message={`¿Seguro que deseas eliminar "${pendingDelete?.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
