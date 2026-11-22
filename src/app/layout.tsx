import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { StoreLayout } from "@/components/StoreLayout";

import "./globals.css";

// Tipografías de Surprises:
// - Plus Jakarta Sans (texto): letras abiertas y altas, se leen bien en el celular.
// - Fraunces (títulos): serif cálida con remates suaves (eje SOFT), en armonía
//   con las curvas redondeadas del logo.
const cuerpo = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cuerpo",
  display: "swap",
});

const titulos = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["SOFT", "opsz"],
  variable: "--font-titulos",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Surprises | Regalos boutique con esencia peruana",
    template: "%s | Surprises",
  },
  description:
    "Regalos boutique con auténtica esencia peruana. Detalles únicos y momentos inolvidables para sorprender a quien más quieres.",
  icons: {
    icon: "/Icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cuerpo.variable} ${titulos.variable} antialiased`}
    >
      <body>
        <StoreLayout>{children}</StoreLayout>
      </body>
    </html>
  );
}
