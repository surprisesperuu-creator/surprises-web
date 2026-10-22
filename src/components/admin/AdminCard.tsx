import type { LucideIcon } from "lucide-react";

type AdminCardTone = "primary" | "secondary" | "accent" | "cream";

const toneStyles: Record<AdminCardTone, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/40 text-secondary",
  cream: "bg-cream text-secondary ring-1 ring-primary/10",
};

interface AdminCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone?: AdminCardTone;
}

/** Tarjeta de estadística del Dashboard. */
export function AdminCard({
  title,
  value,
  icon: Icon,
  tone = "primary",
}: AdminCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${toneStyles[tone]}`}
      >
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text/60">{title}</p>
        <p className="font-display text-2xl font-semibold text-text">{value}</p>
      </div>
    </div>
  );
}
