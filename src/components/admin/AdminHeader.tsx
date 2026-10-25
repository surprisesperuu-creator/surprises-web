"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, LogOut, Menu } from "lucide-react";

import { useAdminAuth } from "@/lib/admin/auth";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { session, signOut } = useAdminAuth();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState(false);

  const handleLogout = async () => {
    setLogoutError(false);
    try {
      await signOut();
      router.replace("/admin/login");
    } catch {
      setLogoutError(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-primary/10 bg-white/85 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="rounded-lg p-2 text-text transition-colors hover:bg-primary/10 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {logoutError && (
        <p role="alert" className="text-xs text-red-700">
          No se pudo cerrar sesión. Inténtalo nuevamente.
        </p>
      )}

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text/70 transition-colors hover:bg-primary/10 hover:text-primary sm:inline-flex"
        >
          <ExternalLink className="size-4" />
          Ver tienda
        </Link>

        <div className="hidden items-center gap-2.5 border-l border-primary/10 pl-3 sm:flex">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {session ? session.name.charAt(0).toUpperCase() : "A"}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-text">
              {session?.name ?? "Administrador"}
            </p>
            <p className="text-xs text-text/50">{session?.email ?? ""}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text/70 transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
