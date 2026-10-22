import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import { StoreLayout } from "@/components/StoreLayout";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
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
      className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
    >
      <body>
        <StoreLayout>{children}</StoreLayout>
      </body>
    </html>
  );
}
