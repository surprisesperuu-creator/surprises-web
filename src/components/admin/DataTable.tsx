import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}

/**
 * Tabla genérica del Admin. Responsive: el contenedor permite scroll
 * horizontal en pantallas pequeñas.
 */
export function DataTable<T>({ columns, rows, rowKey }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-primary/10 bg-background/60">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text/50 ${column.className ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-background/60">
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 ${column.className ?? ""}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
