import { LoaderCircle } from "lucide-react";

/** Estado de carga: evita pantallas en blanco mientras se consultan APIs. */
export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-primary/10 bg-white p-8 text-center">
      <LoaderCircle className="size-7 animate-spin text-primary" />
      <p className="text-sm font-medium text-text/60">{label}</p>
    </div>
  );
}
