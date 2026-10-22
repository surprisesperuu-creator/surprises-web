/** Indicador de estado activo/inactivo con la identidad visual de Surprises. */
export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-stone-100 text-stone-500 ring-1 ring-stone-200"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-stone-400"}`}
      />
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}
