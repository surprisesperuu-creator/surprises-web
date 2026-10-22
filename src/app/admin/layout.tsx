import type { ReactNode } from "react";

import { AdminAuthProvider } from "@/lib/admin/auth";
import { ToastProvider } from "@/lib/admin/toast";

/**
 * Layout raíz del Admin: provee sesión (placeholder de Supabase Auth) y
 * notificaciones. El panel real (sidebar + header) vive en el grupo (panel).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AdminAuthProvider>
  );
}
