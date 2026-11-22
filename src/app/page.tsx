"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  HandHeart,
  Mail,
  MessageCircle,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { useApiData } from "@/lib/api/use-api-data";
import { storeApi } from "@/lib/store/api";
import { buildWhatsAppUrl } from "@/lib/store/whatsapp";
import {
  OCASIONES,
  VALORES,
  VITRINAS,
  destinoEditorial,
  miniatura,
  type EnlaceEditorial,
} from "@/lib/store/home-content";
import type { HeroSlide } from "@/types/hero-slide";
import type { ProductWithCategory } from "@/types/product";
import { AppImage } from "@/components/AppImage";
import { HeroCarousel } from "@/components/store/HeroCarousel";
import { ProductCard } from "@/components/store/ProductCard";
import { StoreEmpty, StoreError } from "@/components/store/StoreStates";

const ICONOS_VALOR: Record<(typeof VALORES)[number]["clave"], LucideIcon> = {
  fotos: Camera,
  mano: HandHeart,
  mensaje: Mail,
  envio: Truck,
};

/** Enlace interno (tienda) o externo (WhatsApp) según el destino. */
function EnlaceDestino({
  destino,
  className,
  children,
  label,
}: {
  destino: { href: string; externo: boolean };
  className?: string;
  children: React.ReactNode;
  label?: string;
}) {
  if (destino.externo) {
    return (
      <a href={destino.href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <Link href={destino.href} className={className} aria-label={label}>
      {children}
    </Link>
  );
}

export default function Home() {
  const heroQuery = useApiData<HeroSlide[]>(() => storeApi.getHeroSlides(), []);
  const productsQuery = useApiData<ProductWithCategory[]>(() => storeApi.getProducts(), []);

  // GET /api/products devuelve los activos más recientes primero.
  const products = productsQuery.data ?? [];
  const featuredProducts = products.slice(0, 8);
  const nombres = products.map((product) => product.name);
  const destino = (item: EnlaceEditorial) => destinoEditorial(item, nombres, buildWhatsAppUrl);

  const whatsappUrl = buildWhatsAppUrl("¡Hola! Quiero personalizar un regalo 🎁");
  const navidad = OCASIONES[0];

  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* HERO: banner principal + banner de Navidad */}
      <section className="mx-auto grid w-full max-w-[1280px] gap-4 px-4 pt-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:pt-6">
        <div className="relative h-[480px] overflow-hidden rounded-[28px] bg-rose-50 sm:h-[440px]">
          <HeroCarousel slides={heroQuery.data ?? []} loading={heroQuery.loading} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/75 to-transparent sm:bg-gradient-to-r sm:from-white/95 sm:via-white/70 sm:to-transparent" />

          <div className="relative z-10 flex h-full max-w-[560px] flex-col justify-end gap-4 p-6 sm:justify-center sm:p-10">
            <span className="w-fit rounded-full bg-[#A01C46] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
              Regalos personalizados · Lima
            </span>
            <h1 className="font-display text-[34px] font-bold leading-[1.1] text-stone-900 sm:text-5xl">
              Regalos con <span className="text-[#C1375D]">SUS fotos</span>, hechos a mano
            </h1>
            <p className="max-w-[440px] text-[15px] leading-relaxed text-stone-700 sm:text-base">
              Cuadros 3D con luces, calendarios y cajas sorpresa que no va a encontrar en ninguna otra tienda.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tienda"
                className="flex items-center justify-center gap-2 rounded-full bg-[#C1375D] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#C1375D]/25 transition-all hover:bg-[#7A1734] active:scale-95"
              >
                Ver regalos
                <ArrowRight size={17} />
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-[#C1375D] bg-white px-7 py-3 text-sm font-semibold text-[#C1375D] transition-all hover:bg-rose-50 active:scale-95"
                >
                  <MessageCircle size={17} />
                  Personalízalo por WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Banner lateral de Navidad */}
        <EnlaceDestino
          destino={destino(navidad)}
          label="Ver regalos de Navidad"
          className="group relative block h-48 overflow-hidden rounded-[28px] bg-rose-100 sm:h-56 lg:h-auto"
        >
          <AppImage
            src={miniatura(navidad.imagen, 700, 900)}
            alt="Cuadro 3D navideño con luces"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5c0f2a]/85 via-[#5c0f2a]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 text-white sm:p-6">
            <span className="font-display text-3xl font-semibold leading-tight sm:text-4xl">Navidad 2026 🎄</span>
            <span className="text-sm text-white/90">Regalos con sus fotos y lucecitas</span>
            <span className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#A01C46]">
              Ver regalos de Navidad
              <ArrowRight size={14} />
            </span>
          </div>
        </EnlaceDestino>
      </section>

      {/* OCASIONES */}
      <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 sm:px-6 sm:pt-16">
        <h2 className="text-center text-2xl font-semibold text-stone-900 sm:text-3xl">
          Regalos para cada ocasión
        </h2>
        <div className="mt-8 grid grid-cols-3 justify-items-center gap-x-3 gap-y-6 sm:flex sm:justify-center sm:gap-8">
          {OCASIONES.map((ocasion) => (
            <EnlaceDestino
              key={ocasion.nombre}
              destino={destino(ocasion)}
              className="group flex w-[96px] flex-col items-center gap-2.5 sm:w-[118px]"
            >
              <span className="block size-[88px] overflow-hidden rounded-full bg-rose-100 ring-4 ring-rose-100 transition-all group-hover:ring-[#F5BECC] sm:size-[118px]">
                <AppImage
                  src={miniatura(ocasion.imagen, 300, 300)}
                  alt={ocasion.nombre}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </span>
              <span className="font-display text-[15px] font-semibold text-[#C1375D] sm:text-base">
                {ocasion.nombre}
              </span>
            </EnlaceDestino>
          ))}
        </div>
      </section>

      {/* FAVORITOS */}
      <section className="mx-auto w-full max-w-[1280px] px-4 pt-14 sm:px-6 sm:pt-16">
        <h2 className="text-center text-2xl font-semibold text-stone-900 sm:text-3xl">
          Los favoritos de Surprises
        </h2>
        <p className="mx-auto mt-2 max-w-[560px] text-center text-sm text-stone-500 sm:text-base">
          Elige tu regalo y nosotros lo armamos con sus fotos.
        </p>

        <div className="mt-8">
          {productsQuery.loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="overflow-hidden rounded-[20px] border border-stone-200/80 bg-white">
                  <div className="aspect-square animate-pulse bg-stone-200" />
                  <div className="space-y-2 p-4">
                    <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                    <div className="mx-auto h-4 w-1/3 animate-pulse rounded bg-stone-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsQuery.error ? (
            <StoreError message={productsQuery.error} retryHref="/" />
          ) : featuredProducts.length === 0 ? (
            <StoreEmpty
              title="Aún no hay productos"
              description="Vuelve pronto: estamos preparando nuevas sorpresas."
            />
          ) : (
            <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-4">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} delay={index * 80} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/tienda"
            className="rounded-full border-2 border-[#C1375D] px-8 py-2.5 text-sm font-semibold text-[#C1375D] transition-colors hover:bg-[#C1375D] hover:text-white"
          >
            Ver toda la colección
          </Link>
        </div>
      </section>

      {/* VITRINAS */}
      <section className="mx-auto grid w-full max-w-[1280px] gap-4 px-4 pt-14 sm:px-6 sm:pt-16 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {VITRINAS.map((vitrina, index) => (
          <EnlaceDestino
            key={vitrina.nombre}
            destino={destino(vitrina)}
            label={vitrina.nombre}
            className="group relative block h-44 overflow-hidden rounded-[24px] bg-rose-100 sm:h-64"
          >
            <AppImage
              src={miniatura(vitrina.imagen, index === 0 ? 900 : 500, 520)}
              alt={vitrina.nombre}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#C1375D]/80 via-[#C1375D]/35 to-transparent" />
            <div className="absolute inset-y-0 right-0 flex flex-col items-end justify-center gap-0 p-6 text-right text-white">
              <span className="font-display text-2xl font-medium italic leading-none sm:text-3xl">{vitrina.linea1}</span>
              <span className="font-display text-3xl font-bold leading-tight sm:text-4xl">{vitrina.linea2}</span>
            </div>
          </EnlaceDestino>
        ))}
      </section>

      {/* VALOR AGREGADO */}
      <section className="mt-16 w-full bg-gradient-to-b from-white to-[#FFF2F5] py-14 sm:mt-20 sm:py-16">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-stone-900 sm:text-3xl">
            Lo que nos hace diferentes
          </h2>
          <p className="mx-auto mt-2 max-w-[600px] text-center text-sm text-stone-500 sm:text-base">
            No vendemos regalos de catálogo: cada uno se arma para una sola persona.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {VALORES.map((valor) => {
              const Icono = ICONOS_VALOR[valor.clave];
              return (
                <div
                  key={valor.clave}
                  className="flex flex-col items-center gap-3 rounded-[24px] border border-rose-100 bg-white p-5 text-center shadow-sm sm:p-7"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-rose-100 text-[#C1375D]">
                    <Icono size={26} />
                  </span>
                  <h3 className="text-base font-semibold text-stone-900 sm:text-lg">{valor.titulo}</h3>
                  <p className="text-xs leading-relaxed text-stone-600 sm:text-sm">{valor.texto}</p>
                </div>
              );
            })}
          </div>

          {/* Así de fácil */}
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Elige tu regalo", "Mira los modelos y agrégalo al carrito."],
              ["2", "Mándanos sus fotos", "Por WhatsApp nos pasas las fotos, nombres y tu mensaje."],
              ["3", "Lo armamos y lo enviamos", "Lo hacemos a mano y coordinamos la entrega en Lima."],
            ].map(([numero, titulo, texto]) => (
              <div key={numero} className="flex items-center gap-4 rounded-[20px] bg-white/70 p-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#C1375D] font-display text-xl font-bold text-white">
                  {numero}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 sm:text-base">{titulo}</h3>
                  <p className="text-xs text-stone-600 sm:text-sm">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANDA WHATSAPP */}
      {whatsappUrl && (
        <section className="w-full bg-[#FFF2F5] px-4 pb-14 sm:px-6">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-5 rounded-[28px] bg-[#C1375D] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">¿Tienes una idea en mente?</h2>
              <p className="mt-1 text-sm text-white/85 sm:text-base">
                Cuéntanos qué quieres regalar y lo personalizamos contigo.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#C1375D] shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
            >
              <MessageCircle size={18} />
              Escríbenos por WhatsApp
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
