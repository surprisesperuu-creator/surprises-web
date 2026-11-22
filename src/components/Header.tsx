'use client';
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Menu, X, House, Gift, ChevronRight, Sparkles, CalendarHeart, TreePine, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCartStore } from "@/store/cart.store";
import { CartCountBadge } from "@/components/CartCountBadge";
import { AppImage } from "@/components/AppImage";
import { buildWhatsAppUrl } from "@/lib/store/whatsapp";
import { storeApi } from "@/lib/store/api";
import { formatPrice } from "@/lib/format";
import { PROPUESTAS } from "@/lib/store/home-content";
import type { ProductWithCategory } from "@/types/product";

function normalizeText(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export default function Header() {
    const openCart = useCartStore((state) => state.openCart);
    const router = useRouter();
    const whatsappUrl = buildWhatsAppUrl(
        "Hola, me gustaría recibir más información sobre sus regalos."
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ---- Buscador funcional ----
    const [query, setQuery] = useState("");
    const [focusedBox, setFocusedBox] = useState<"mobile" | "desktop" | null>(null);
    const [catalog, setCatalog] = useState<ProductWithCategory[] | null>(null);
    const closeTimer = useRef<number | null>(null);

    const suggestions = useMemo(() => {
        const term = normalizeText(query);
        if (term.length < 2 || !catalog) {
            return [];
        }
        return catalog
            .filter((product) => normalizeText(product.name).includes(term))
            .slice(0, 6);
    }, [query, catalog]);

    const showSuggestions = focusedBox !== null && normalizeText(query).length >= 2;

    const ensureCatalog = () => {
        if (catalog !== null) {
            return;
        }
        void storeApi
            .getProducts()
            .then((products) => setCatalog(products))
            .catch(() => setCatalog([]));
    };

    const handleFocus = (box: "mobile" | "desktop") => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setFocusedBox(box);
        ensureCatalog();
    };

    const handleBlur = () => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
        }
        closeTimer.current = window.setTimeout(() => setFocusedBox(null), 140);
    };

    const goToSearch = (term: string) => {
        const clean = term.trim();
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setFocusedBox(null);
        router.push(clean ? `/tienda?q=${encodeURIComponent(clean)}` : "/tienda");
    };

    const suggestionDropdown = (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
            {suggestions.length > 0 ? (
                <>
                    {suggestions.map((product) => (
                        <Link
                            key={product.id}
                            href={`/tienda/${product.id}`}
                            onClick={() => setFocusedBox(null)}
                            className="flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-rose-50"
                        >
                            <AppImage
                                src={product.image_url}
                                alt={product.name}
                                className="size-10 shrink-0 rounded-xl object-cover"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-stone-900">
                                    {product.name}
                                </span>
                                <span className="block text-xs font-semibold text-[#A01C46]">
                                    {formatPrice(product.price)}
                                </span>
                            </span>
                        </Link>
                    ))}
                    <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => goToSearch(query)}
                        className="w-full cursor-pointer border-t border-stone-100 px-3 py-2.5 text-center text-xs font-semibold text-[#A01C46] transition-colors hover:bg-rose-50"
                    >
                        Ver todos los resultados
                    </button>
                </>
            ) : (
                <p className="px-4 py-3 text-xs text-stone-500">
                    Sin coincidencias para “{query.trim()}”. Presiona Enter para buscar igual.
                </p>
            )}
        </div>
    );

    // Guard de hidratación SSR: `mounted` solo es true en el cliente,
    // lo que permite renderizar el portal a document.body sin errores.
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const menuItems = [
        { href: "/", label: "Inicio", icon: House },
        { href: "/tienda", label: "Todos los regalos", icon: Gift },
        { href: "/tienda?q=navide", label: "Navidad", icon: TreePine },
        { href: "/tienda?q=cuadro", label: "Cuadros 3D", icon: Sparkles },
        { href: "/tienda?q=calendario", label: "Calendarios", icon: CalendarHeart },
    ];

    // Barra superior: en el celular rota una frase; en escritorio se ven todas.
    const [propuesta, setPropuesta] = useState(0);
    useEffect(() => {
        const timer = window.setInterval(() => setPropuesta((i) => (i + 1) % PROPUESTAS.length), 3500);
        return () => window.clearInterval(timer);
    }, []);

    const searchInput = (box: "mobile" | "desktop") => (
        <form
            className="relative w-full"
            role="search"
            onSubmit={(event) => {
                event.preventDefault();
                goToSearch(query);
            }}
        >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A01C46]" />
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => handleFocus(box)}
                onBlur={handleBlur}
                placeholder="Buscar regalo..."
                aria-label="Buscar regalos"
                className="h-10 w-full rounded-full border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 transition-all focus:border-[#A01C46] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A01C46]/15"
            />
            {showSuggestions && focusedBox === box && suggestionDropdown}
        </form>
    );

    return (
        <header className="sticky top-0 z-40 w-full bg-white shadow-[0px_1px_10px_0px_rgba(160,28,70,0.08)]">
            {/* Barra superior: nuestro valor agregado */}
            <div className="w-full bg-[#A01C46] text-white">
                <div className="mx-auto flex h-8 w-full max-w-[1280px] items-center justify-center px-4 text-[12px] font-medium tracking-wide sm:text-[13px]">
                    <span key={propuesta} className="animate-[fadeIn_0.5s_ease] md:hidden">
                        {PROPUESTAS[propuesta]}
                    </span>
                    <span className="hidden items-center gap-5 md:flex">
                        {PROPUESTAS.map((texto, i) => (
                            <span key={texto} className="flex items-center gap-5">
                                {i > 0 && <span className="text-white/40">•</span>}
                                {texto}
                            </span>
                        ))}
                    </span>
                </div>
            </div>

            <div className="mx-auto w-full max-w-[1280px] px-3 sm:px-6">
                {/* Fila principal: menú / buscador · logo al centro · WhatsApp y carrito */}
                <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 md:h-20">
                    <div className="flex items-center gap-3">
                        <button
                            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="flex h-10 items-center gap-1.5 rounded-full border-2 border-[#C1375D] px-3 text-[#C1375D] transition-colors hover:bg-rose-50 active:scale-95 md:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden w-full max-w-[340px] md:block">{searchInput("desktop")}</div>
                    </div>

                    <Link href="/" aria-label="Ir a inicio" className="justify-self-center">
                        <Image
                            src="/head.png"
                            alt="Surprises Perú, tienda de regalos"
                            width={150}
                            height={150}
                            className="h-14 w-14 object-contain md:h-[76px] md:w-[76px]"
                            priority
                        />
                    </Link>

                    <div className="flex items-center justify-end gap-2 sm:gap-4">
                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1fb457] lg:flex"
                            >
                                <MessageCircle size={17} className="fill-white" />
                                Pedir por WhatsApp
                            </a>
                        )}
                        <button
                            onClick={openCart}
                            aria-label="Abrir el carrito de compras"
                            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#41373A] transition-colors hover:bg-rose-50 hover:text-[#C1375D]"
                        >
                            <ShoppingCart size={24} />
                            <CartCountBadge />
                        </button>
                    </div>
                </div>

                {/* Buscador en el celular */}
                <div className="pb-3 md:hidden">{searchInput("mobile")}</div>
            </div>

            {/* Menú de escritorio */}
            <nav className="hidden border-t border-stone-100 md:block" aria-label="Categorías">
                <div className="mx-auto flex h-12 w-full max-w-[1280px] items-center justify-between px-6">
                    <div className="flex items-center gap-8">
                        {menuItems.map(({ href, label }) => (
                            <Link
                                key={label}
                                href={href}
                                className="text-sm font-medium text-stone-700 transition-colors hover:text-[#C1375D]"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                    {whatsappUrl && (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border-2 border-[#C1375D] px-4 py-1 text-sm font-semibold text-[#C1375D] transition-colors hover:bg-[#C1375D] hover:text-white"
                        >
                            Personaliza tu regalo
                        </a>
                    )}
                </div>
            </nav>

            {/* FULLSCREEN MOBILE OVERLAY (PORTAL) */}
            {isMenuOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[999999] h-screen w-screen bg-[#180912] md:hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(225,29,72,0.2),_transparent_60%)] pointer-events-none" />
                    
                    <div className="relative flex h-full w-full flex-col overflow-y-auto px-6 pt-5 pb-8">
                        {/* Header del Menú */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <Link href="/" aria-label="Ir a inicio" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                                <Image
                                    src="/surprises.png"
                                    alt="Surprises"
                                    width={44}
                                    height={44}
                                    className="rounded-full bg-white object-contain p-1"
                                />
                                <span className="text-xl font-serif text-white font-medium tracking-wide">Surprises</span>
                            </Link>

                            <button
                                aria-label="Cerrar menú"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-transform active:scale-95 hover:bg-white/20"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Opciones de Navegación */}
                        <nav className="mt-8 flex flex-col gap-3">
                            {menuItems.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white transition-all hover:bg-white/15 active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
                                            <Icon size={20} />
                                        </div>
                                        <span className="text-base font-medium tracking-wide">{label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-white/40 transition-transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </nav>

                        {/* Acciones Rápidas */}
                        <div className="mt-6 space-y-3">
                            <button
                                onClick={() => {
                                    openCart();
                                    setIsMenuOpen(false);
                                }}
                                className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-pink-800 to-pink-700 p-4 text-left text-white shadow-lg shadow-pink-950/50 active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                                        <ShoppingCart size={20} />
                                    </div>
                                    <span className="text-base font-semibold">Ver mi Carrito</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>

                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-[#25D366]/40 bg-[#25D366]/15 p-4 text-left text-white active:scale-[0.98] transition-transform"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white">
                                            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                            </svg>
                                        </div>
                                        <span className="text-base font-semibold">Atención por WhatsApp</span>
                                    </div>
                                    <ChevronRight size={18} />
                                </a>
                            )}
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}