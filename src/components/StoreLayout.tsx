"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarritoSidebar from "@/components/CarritoSidebar";
import { ScrollAnimationInitializer } from "@/components/ScrollAnimationInitializer";

/**
 * Decide qué "chrome" global renderizar según la ruta:
 * - Rutas públicas (/) → chrome de la tienda (Header, Footer, carrito...).
 * - Rutas /admin/* → sin chrome de la tienda: el Admin tiene su propio layout.
 *
 * El carrito usa Zustand (store global), por lo que no requiere Provider.
 */
export function StoreLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollAnimationInitializer />
      <Header />
      <main>{children}</main>
      <Footer />
      <CarritoSidebar />
    </>
  );
}

