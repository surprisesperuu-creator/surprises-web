"use client";

import { useState } from "react";
import Link from "next/link";
import { Images, Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";

import { useApiData } from "@/lib/api/use-api-data";
import { adminApi } from "@/lib/admin/api-client";
import { useToast } from "@/lib/admin/toast";
import type { HeroSlide } from "@/types/hero-slide";

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

export default function AdminHeroPage() {
  const { data, loading, error, refetch } = useApiData<HeroSlide[]>(
    () => adminApi.getHeroSlides(),
    []
  );
  const { showToast } = useToast();

  const [pendingDelete, setPendingDelete] = useState<HeroSlide | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (slide: HeroSlide) => {
    setTogglingId(slide.id);
    try {
      await adminApi.updateHeroSlide(slide.id, {
        is_active: !slide.is_active,
      });
      showToast(
        slide.is_active ? "Imagen desactivada" : "Imagen activada"
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
      await adminApi.deleteHeroSlide(pendingDelete.id);
      showToast("Imagen eliminada correctamente");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "No se pudo eliminar la imagen",
        "error"
      );
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<HeroSlide>[] = [
    {
      key: "image",
      header: "Imagen",
      render: (row) => (
        <AppImage
          src={row.image_url}
          alt={row.title}
          className="h-11 w-20 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "title",
      header: "Título",
      render: (row) => <p className="font-medium text-text">{row.title}</p>,
    },
    {
      key: "sort_order",
      header: "Orden",
      render: (row) => <p className="text-text/70">{row.sort_order}</p>,
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
            href={`/admin/hero/${row.id}/edit`}
            className="rounded-lg p-2 text-text/50 transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Editar ${row.title}`}
            title="Editar"
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleToggle(row)}
            disabled={togglingId === row.id}
            className="rounded-lg p-2 text-text/50 transition-colors hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40"
            aria-label={row.is_active ? "Desactivar imagen" : "Activar imagen"}
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
            aria-label={`Eliminar ${row.title}`}
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
        title="Hero del Home"
        description="Administra las imágenes del carrusel principal. Menor orden aparece primero."
        actions={
          <Link href="/admin/hero/new" className={primaryButtonClass}>
            <Plus className="size-4" />
            Nueva imagen
          </Link>
        }
      />

      {loading ? (
        <LoadingState label="Cargando imágenes del Hero..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data && data.length > 0 ? (
        <DataTable columns={columns} rows={data} rowKey={(row) => row.id} />
      ) : (
        <EmptyState
          icon={Images}
          title="No hay imágenes del Hero"
          description="Agrega la primera imagen del carrusel. Mientras no haya imágenes activas, el Home muestra la imagen por defecto."
          action={
            <Link href="/admin/hero/new" className={primaryButtonClass}>
              <Plus className="size-4" />
              Agregar imagen
            </Link>
          }
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar imagen"
        message={`¿Seguro que deseas eliminar "${pendingDelete?.title}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
