import type { ReactNode } from "react";

import { AdminAuthProvider } from "@/lib/admin/auth";
import { getAdminSession } from "@/lib/admin/session";
import { ToastProvider } from "@/lib/admin/toast";

/**
 * Layout raíz del Admin: provee sesión y notificaciones.
 * El panel (sidebar + header) vive en el grupo (panel).
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <AdminAuthProvider initialSession={session}>
      <ToastProvider>{children}</ToastProvider>
    </AdminAuthProvider>
  );
}
