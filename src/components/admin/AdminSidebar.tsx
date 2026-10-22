"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Gift,
  Images,
  LayoutDashboard,
  LogOut,
  Package,
  Tags,
  X,
} from "lucide-react";

import { useAdminAuth } from "@/lib/admin/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "Hero del Home", icon: Images, exact: false },
  { href: "/admin/products", label: "Productos", icon: Package, exact: false },
  { href: "/admin/categories", label: "Categorías", icon: Tags, exact: false },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

export function AdminSidebar({ open, onClose, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut } = useAdminAuth();

  const handleLogout = () => {
    signOut();
    router.replace("/admin/login");
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Overlay (solo móvil) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-secondary text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Marca */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Gift className="size-5 text-accent" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold leading-tight">
                Surprises
              </span>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-white/60">
                Admin
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                {label}
                {active && (
                  <span className="ml-auto size-1.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Usuario + cerrar sesión */}
        <div className="border-t border-white/10 px-4 py-4">
          {session && (
            <div className="mb-3 flex items-center gap-3 px-1">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {session.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {session.name}
                </p>
                <p className="truncate text-xs text-white/50">{session.email}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
