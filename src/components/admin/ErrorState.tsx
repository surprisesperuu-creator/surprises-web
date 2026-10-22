import { RefreshCw, TriangleAlert } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Estado de error con opción de reintentar. */
export function ErrorState({
  title = "No se pudieron cargar los datos",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/60 px-6 py-14 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
        <TriangleAlert className="size-7" />
      </span>
      <h3 className="font-display text-lg font-semibold text-text">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-text/60">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </button>
      )}
    </div>
  );
}
