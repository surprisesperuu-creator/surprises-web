import Link from "next/link";
import { PackageSearch, RefreshCw, TriangleAlert } from "lucide-react";

/**
 * Estado vacío de la tienda pública.
 */
export function StoreEmpty({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-[#C1375D]">
        <PackageSearch className="size-7" />
      </span>
      <h2 className="font-display text-lg font-semibold text-stone-900">{title}</h2>
      {description && <p className="max-w-sm text-sm text-stone-600">{description}</p>}
    </div>
  );
}

/**
 * Estado de error de la tienda pública, con opción de reintentar.
 */
export function StoreError({
  message,
  retryHref,
}: {
  message?: string;
  retryHref: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-red-200 bg-red-50/60 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
        <TriangleAlert className="size-7" />
      </span>
      <h2 className="font-display text-lg font-semibold text-stone-900">
        No pudimos cargar los productos
      </h2>
      {message && <p className="max-w-md text-sm text-stone-600">{message}</p>}
      <Link
        href={retryHref}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#C1375D] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C1375D]/25 transition-colors hover:bg-[#7A1734]"
      >
        <RefreshCw className="size-4" />
        Reintentar
      </Link>
    </div>
  );
}
