import Link from "next/link";
import { PackageX } from "lucide-react";

/** Estado "Producto no encontrado" para el detalle público. */
export function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent/40 text-secondary">
        <PackageX className="size-8" />
      </span>
      <h1 className="font-display text-2xl font-semibold text-stone-900">
        Producto no encontrado
      </h1>
      <p className="max-w-md text-sm text-stone-600">
        El producto que buscas no existe o ya no está disponible.
      </p>
      <Link
        href="/tienda"
        className="mt-2 rounded-full bg-[#C1375D] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C1375D]/25 transition-colors hover:bg-[#7A1734]"
      >
        Ver todos los productos
      </Link>
    </div>
  );
}
