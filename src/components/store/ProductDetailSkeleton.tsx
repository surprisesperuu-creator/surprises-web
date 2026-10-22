/**
 * Skeleton del detalle de producto: se muestra mientras el servidor carga
 * el producto (Suspense del Server Component).
 */
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-stone-200" />
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <div className="flex min-h-[280px] animate-pulse items-center justify-center rounded-[28px] bg-stone-200 sm:min-h-[320px]" />
        <div className="flex flex-col gap-5 rounded-[28px] border border-stone-200/60 bg-white p-5 sm:p-7">
          <div className="h-6 w-28 animate-pulse rounded-full bg-stone-200" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-stone-200" />
          <div className="h-9 w-40 animate-pulse rounded bg-stone-200" />
          <div className="h-12 w-full animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
