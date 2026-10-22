"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAdminAuth } from "@/lib/admin/auth";
import { useHasMounted } from "@/hooks/useHasMounted";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LoadingState } from "@/components/admin/LoadingState";

/**
 * Estructura del panel: sidebar + header + contenido.
 * También actúa como guard de rutas: sin sesión redirige al login.
 *
 * ⚠️ Este guard es SOLO de UX (modo demostración). La protección real debe
 * implementarse en el servidor con Supabase Auth (middleware/cookies).
 */
export function AdminPanelShell({ children }: { children: React.ReactNode }) {
  const { session } = useAdminAuth();
  const router = useRouter();
  // Guard de hidratación SSR: `mounted` solo es true en el cliente tras
  // hidratar. La sesión se lee de localStorage (null en SSR), así que sin este
  // guard el servidor y el cliente renderizarían ramas distintas (hydration
  // mismatch). Con él, ambos dibujan el mismo placeholder y solo después de
  // montar se lee la sesión persistida.
  const mounted = useHasMounted();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (mounted && !session) {
      router.replace("/admin/login");
    }
  }, [mounted, session, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Cargando panel..." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Verificando sesión..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={() => setSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
