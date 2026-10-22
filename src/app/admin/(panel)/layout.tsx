import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminPanelShell } from "@/components/admin/AdminPanelShell";

export const metadata: Metadata = {
  title: {
    default: "Administración | Surprises",
    template: "%s | Surprises Admin",
  },
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return <AdminPanelShell>{children}</AdminPanelShell>;
}
