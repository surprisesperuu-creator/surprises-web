"use client";

import { LoaderCircle, TriangleAlert, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Diálogo de confirmación antes de ejecutar una acción destructiva (DELETE). */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
            <TriangleAlert className="size-6" />
          </span>
          <div className="flex-1">
            <h2
              id="confirm-dialog-title"
              className="font-display text-lg font-semibold text-text"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-text/60">{message}</p>
          </div>
          <button
            type="button"
            onClick={loading ? undefined : onCancel}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-text/40 transition-colors hover:bg-stone-100 hover:text-text"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-primary/20 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-background disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <LoaderCircle className="size-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
