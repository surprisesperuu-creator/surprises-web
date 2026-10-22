/**
 * Skeleton de la tienda: se muestra mientras se cargan los productos
 * (Suspense del Server Component).
 */
export function TiendaSkeleton() {
  return (
    <>
      {/* Barra de filtros */}
      <div className="w-full border-y border-stone-200/80 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="h-8 w-24 animate-pulse rounded-full bg-stone-200"
              />
            ))}
          </div>
          <div className="h-8 w-32 animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>

      {/* Grid de productos */}
      <section className="mx-auto w-full max-w-[1280px] px-6 py-8">
        <div className="mb-6 h-4 w-48 animate-pulse rounded bg-stone-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white"
            >
              <div className="aspect-square animate-pulse bg-stone-200" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
