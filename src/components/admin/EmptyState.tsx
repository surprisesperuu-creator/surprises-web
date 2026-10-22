import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Estado vacío: se muestra cuando un listado no tiene registros. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-white px-6 py-14 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-background text-primary">
        <Icon className="size-7" />
      </span>
      <h3 className="font-display text-lg font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text/60">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
