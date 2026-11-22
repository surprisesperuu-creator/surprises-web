import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Camera, HandHeart, MessageCircle, Truck } from "lucide-react";

import { productService } from "@/services/product.service";
import { buildWhatsAppUrl } from "@/lib/store/whatsapp";
import { OCASIONES, miniatura, ocasionPorSlug, productosDeOcasion } from "@/lib/store/home-content";
import type { ProductWithCategory } from "@/types/product";
import { AppImage } from "@/components/AppImage";
import { ProductCard } from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

interface OcasionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: OcasionPageProps): Promise<Metadata> {
  const ocasion = ocasionPorSlug((await params).slug);
  if (!ocasion) {
    return { title: "Ocasión no encontrada" };
  }
  return { title: ocasion.titulo.replace(/\s*\p{Extended_Pictographic}.*$/u, ""), description: ocasion.texto };
}

/**
 * Sección de una ocasión (Navidad, Amor, Cumpleaños…): banner, accesos a las
 * demás ocasiones, productos de la tienda que le corresponden y una galería
 * de regalos reales "hechos a pedido" con botón a WhatsApp.
 */
export default async function OcasionPage({ params }: OcasionPageProps) {
  const ocasion = ocasionPorSlug((await params).slug);
  if (!ocasion) {
    notFound();
  }

  let productos: ProductWithCategory[] = [];
  try {
    const activos = (await productService.getAll()).filter((producto) => producto.is_active);
    productos = productosDeOcasion(ocasion, activos);
  } catch {
    // Sin conexión a la base: la sección se muestra igual con la galería y WhatsApp.
    productos = [];
  }

  const whatsappUrl = buildWhatsAppUrl(ocasion.mensaje);
  // El emoji final queda pegado a la última palabra (no salta solo a otra línea).
  const titulo = ocasion.titulo.replace(/ (\S+)$/, "\u00a0$1");
  // Galería pareja: con 5 fotos, una grande y cuatro chicas; si no, cuadrícula simple.
  const n = ocasion.galeria.length;
  const destacada = n === 5;
  const columnas = destacada ? "md:grid-cols-3" : n === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  const hayProductos = productos.length > 0;

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-4 sm:px-6 lg:pt-6">
        {/* Ruta */}
        <nav aria-label="Ruta de navegación" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
          <Link href="/" className="transition-colors hover:text-[#C1375D]">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/#ocasiones" className="transition-colors hover:text-[#C1375D]">
            Ocasiones
          </Link>
          <span>/</span>
          <span className="font-medium text-stone-800">{ocasion.nombre}</span>
        </nav>

        {/* Banner */}
        <section className="relative h-60 overflow-hidden rounded-[28px] bg-rose-100 sm:h-72">
          <AppImage
            src={miniatura(ocasion.imagen, 1400, 600)}
            alt={ocasion.nombre}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#5c0f2a]/90 via-[#7A1734]/60 to-transparent" />
          <div className="relative z-10 flex h-full max-w-[620px] flex-col justify-center gap-3 p-6 text-white sm:p-10">
            <h1 className="font-display text-[32px] font-semibold leading-tight sm:text-5xl">{titulo}</h1>
            <p className="text-sm leading-relaxed text-white/90 sm:text-base">{ocasion.texto}</p>
          </div>
        </section>

        {/* Otras ocasiones */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {OCASIONES.map((otra) => {
            const activa = otra.slug === ocasion.slug;
            return (
              <Link
                key={otra.slug}
                href={`/ocasion/${otra.slug}`}
                aria-current={activa ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-medium transition-colors ${
                  activa
                    ? "border-[#C1375D] bg-[#C1375D] text-white"
                    : "border-stone-200 bg-white text-stone-700 hover:border-[#C1375D] hover:text-[#C1375D]"
                }`}
              >
                <AppImage
                  src={miniatura(otra.imagen, 80, 80)}
                  alt=""
                  className="size-7 rounded-full object-cover"
                />
                {otra.nombre}
              </Link>
            );
          })}
        </div>

        {/* Productos de la tienda */}
        {hayProductos && (
          <section className="pt-12">
            <h2 className="text-center font-display text-[28px] font-semibold text-stone-900 sm:text-4xl">
              Disponibles en la tienda
            </h2>
            <p className="mx-auto mt-2 max-w-[560px] text-center text-sm text-stone-500 sm:text-base">
              Elige tu modelo y nosotros lo armamos con sus fotos.
            </p>
            <div className="mt-8 grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
              {productos.map((producto, index) => (
                <ProductCard key={producto.id} product={producto} delay={index * 80} />
              ))}
            </div>
          </section>
        )}

        {/* Hecho a pedido */}
        <section className="pt-12 sm:pt-16">
          <h2 className="text-center font-display text-[28px] font-semibold text-stone-900 sm:text-4xl">
            {hayProductos ? "¿Quieres otro diseño?" : "Hecho a pedido para ti"}
          </h2>
          <p className="mx-auto mt-2 max-w-[620px] text-center text-sm text-stone-500 sm:text-base">
            Estos son regalos reales que hemos armado. Cuéntanos para quién es, mándanos sus fotos y lo
            personalizamos contigo.
          </p>

          <div className={`mt-8 grid grid-cols-2 gap-3 sm:gap-4 ${columnas}`}>
            {ocasion.galeria.map((foto, index) => (
              <div
                key={foto}
                className={`overflow-hidden rounded-[20px] bg-rose-50 ${destacada && index === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : "aspect-[4/5]"}`}
              >
                <AppImage
                  src={miniatura(foto, destacada && index === 0 ? 900 : 600, destacada && index === 0 ? 1125 : 750)}
                  alt={`${ocasion.nombre}: regalo personalizado ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>

          {whatsappUrl && (
            <div className="mt-8 flex justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:scale-[1.03] active:scale-95"
              >
                <MessageCircle size={18} className="fill-white" />
                Pedir el mío por WhatsApp
              </a>
            </div>
          )}
        </section>

        {/* Valor agregado */}
        <section className="grid gap-3 py-12 sm:grid-cols-3 sm:py-16">
          {[
            { Icono: Camera, titulo: "Con SUS fotos", texto: "Lo armamos con las fotos que nos mandes." },
            { Icono: HandHeart, titulo: "Hecho a mano", texto: "Detalle por detalle, ninguno sale igual." },
            { Icono: Truck, titulo: "Envíos a todo Lima", texto: "Coordinamos la entrega por WhatsApp." },
          ].map(({ Icono, titulo, texto }) => (
            <div key={titulo} className="flex items-center gap-4 rounded-[20px] bg-[#FFF2F5] p-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-[#C1375D]">
                <Icono size={22} />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-stone-900">{titulo}</h3>
                <p className="text-xs text-stone-600 sm:text-sm">{texto}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-center pb-14">
          <Link
            href="/tienda"
            className="flex items-center gap-2 rounded-full border-2 border-[#C1375D] px-8 py-2.5 text-sm font-semibold text-[#C1375D] transition-colors hover:bg-[#C1375D] hover:text-white"
          >
            Ver todos los regalos
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
