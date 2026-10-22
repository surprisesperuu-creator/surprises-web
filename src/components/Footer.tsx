import Link from "next/link";
import Image from "next/image";
import {
    Clock,
    CreditCard,
    Gift,
    Landmark,
    Mail,
    MapPin,
    MessageCircle,
    QrCode,
    ShoppingBag,
    Store,
} from "lucide-react";

const QUICK_LINKS = [
    { href: "/", label: "Inicio", icon: Store },
    { href: "/tienda", label: "Tienda", icon: ShoppingBag },
    { href: "/carrito", label: "Mi carrito", icon: Gift },
];

const SOCIALS = [
    {
        label: "Instagram",
        href: "https://www.instagram.com/surprises_peru?rpxt=Y3A5a2h5ajlqZGd4",
        path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
        label: "Facebook",
        href: "https://www.facebook.com/surprisesperu?locale=es_LA",
        path: "M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z",
    },
    {
        label: "TikTok",
        href: "https://www.tiktok.com/@surprises_peru?_r=1&_t=ZS-9Al5iQQaWRy",
        path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    },
];

export default function Footer() {
    const year = new Date().getFullYear();
    const whatsappNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999999999";

    return (
        <footer className="relative w-full overflow-hidden bg-[#2B0A1A] text-stone-50">
            {/* Línea superior y efecto de luz */}
            <div className="h-1 w-full bg-gradient-to-r from-[#A01C46] via-pink-400 to-[#A01C46]" />
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[#A01C46]/30 blur-3xl"
            />

            {/* Contenido Principal */}
            <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">

                {/* Columna 1: Marca & Descripción */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex w-fit items-center gap-3">
                        <Image
                            src="/head.png"
                            alt="Surprises"
                            width={44}
                            height={44}
                            className="rounded-full object-cover ring-2 ring-white/20"
                        />
                        <span className="font-display text-2xl font-semibold tracking-wide">
                            Surprises
                        </span>
                    </Link>

                    <p className="text-stone-200/80 text-sm leading-relaxed">
                        Creando detalles únicos y momentos inolvidables. Regalos boutique con
                        auténtica esencia peruana, pensados para sorprender.
                    </p>

                    <div className="flex items-center gap-2.5 pt-2">
                        {SOCIALS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="size-9 bg-white/10 hover:bg-pink-600/40 hover:text-pink-200 rounded-full flex justify-center items-center transition-all fill-stone-50"
                            >
                                <svg className="size-4" viewBox="0 0 24 24">
                                    <path d={social.path} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Columna 2: Navegación Rápida */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200/60 font-serif">
                        Navegación
                    </h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        {QUICK_LINKS.map((link) => {
                            const Icon = link.icon;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-2.5 text-stone-200/80 hover:text-pink-300 transition-colors w-fit"
                                    >
                                        <Icon size={16} className="text-pink-300/80 shrink-0" />
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Columna 3: Información de Contacto */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200/60 font-serif">
                        Contacto
                    </h3>
                    <ul className="flex flex-col gap-3 text-sm">
                        <li>
                            <a
                                href="mailto:hola@surprises.pe"
                                className="flex items-center gap-2.5 text-stone-200/80 hover:text-pink-300 transition-colors w-fit"
                            >
                                <Mail size={16} className="text-pink-300 shrink-0" />
                                <span>hola@surprises.pe</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-stone-200/80 hover:text-pink-300 transition-colors w-fit"
                            >
                                <MessageCircle size={16} className="text-pink-300 shrink-0" />
                                <span>+51 999 999 999</span>
                            </a>
                        </li>
                        <li className="flex items-start gap-2.5 text-stone-200/80">
                            <MapPin size={16} className="text-pink-300 shrink-0 mt-0.5" />
                            <span>
                                Av. Principal 123, Miraflores<br />
                                Lima, Perú
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Columna 4: Horario de Atención */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200/60 font-serif">
                        Horario de Atención
                    </h3>
                    <div className="flex items-start gap-2.5 text-sm text-stone-200/80">
                        <Clock size={16} className="text-pink-300 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-medium text-stone-100">Lunes a Sábado:</p>
                            <p className="text-xs text-stone-200/70">9:00 AM - 8:00 PM</p>
                            <p className="font-medium text-stone-100 pt-1">Domingos:</p>
                            <p className="text-xs text-stone-200/70">10:00 AM - 4:00 PM</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Barra Inferior */}
            <div className="w-full bg-black/20 border-t border-white/10">
                <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col items-center justify-between gap-4 text-center text-xs text-stone-200/60 md:flex-row md:text-left">
                    <div>
                        © {year} Surprises. Todos los derechos reservados.
                    </div>

                    <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-stone-200/80" />
                        <Landmark size={18} className="text-stone-200/80" />
                        <QrCode size={18} className="text-stone-200/80" />
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        <span>Hecho con</span>
                        <span className="text-red-400">❤️</span>
                        <span>en Perú</span>
                    </div>
                </div>
            </div>

            {/* Botón Flotante de WhatsApp */}
            <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chatear por WhatsApp"
                className="fixed bottom-5 right-5 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group sm:bottom-6 sm:right-10"
            >
                <span className="absolute right-full mr-3 bg-stone-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    ¡Hablemos por WhatsApp!
                </span>

                <svg
                    className="w-7 h-7 fill-white"
                    viewBox="0 0 24 24"
                >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
            </a>
        </footer>
    );
}