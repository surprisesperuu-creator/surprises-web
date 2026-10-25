import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminPanelShell } from "@/components/admin/AdminPanelShell";
import { getAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: {
    default: "Administración | Surprises",
    template: "%s | Surprises Admin",
  },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <AdminPanelShell>{children}</AdminPanelShell>;
}
