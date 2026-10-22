'use client';
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Menu, X, House, Gift, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useCartStore } from "@/store/cart.store";
import { CartCountBadge } from "@/components/CartCountBadge";
import { AppImage } from "@/components/AppImage";
import { buildWhatsAppUrl } from "@/lib/store/whatsapp";
import { storeApi } from "@/lib/store/api";
import { formatPrice } from "@/lib/format";
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
        { href: "/tienda", label: "Tienda", icon: Gift },
    ];

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-[0px_1px_8px_0px_rgba(160,28,70,0.05)] flex justify-center">
            <div className="w-full max-w-[1280px] px-3 py-3 sm:px-6">
                
                {/* Header Mobile: Logo - Buscador (Centro) - Menú Hamburger */}
                <div className="flex items-center justify-between gap-3 md:hidden">
                    {/* Logo (Izquierda) */}
                    <Link href="/" aria-label="Ir a inicio" className="flex-shrink-0">
                        <Image
                            src="/head.png"
                            alt="Surprises Logo"
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                            priority
                        />
                    </Link>

                    {/* Buscador (Centro) */}
                    <form
                        className="relative flex-1"
                        role="search"
                        onSubmit={(event) => {
                            event.preventDefault();
                            goToSearch(query);
                        }}
                    >
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A01C46] pointer-events-none" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onFocus={() => handleFocus("mobile")}
                                onBlur={handleBlur}
                                placeholder="Buscar regalo..."
                                aria-label="Buscar regalos"
                                className="w-full h-10 rounded-full border border-[#A01C46]/20 bg-white pl-9 pr-3 text-xs text-stone-900 placeholder:text-[#A01C46]/50 shadow-sm transition-all focus:border-[#A01C46] focus:outline-none focus:ring-1 focus:ring-[#A01C46]/20"
                            />
                        </div>
                        {showSuggestions && focusedBox === "mobile" && suggestionDropdown}
                    </form>

                    {/* Botón Hamburger (Derecha) */}
                    <button
                        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#A01C46]/15 bg-white text-[#1F1A1C] shadow-sm transition-transform active:scale-95"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* Header Desktop */}
                <div className="hidden md:flex md:items-center md:justify-between md:gap-6">
                    <Link href="/" aria-label="Ir a inicio" className="flex-shrink-0">
                        <Image
                            src="/head.png"
                            alt="Surprises Logo"
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                            priority
                        />
                    </Link>

                    <form
                        className="relative flex-1 max-w-[500px] ml-4"
                        role="search"
                        onSubmit={(event) => {
                            event.preventDefault();
                            goToSearch(query);
                        }}
                    >
                        <div className="relative flex items-center w-full">
                            <Search className="absolute left-4 w-4 h-4 text-[#A01C46] pointer-events-none" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onFocus={() => handleFocus("desktop")}
                                onBlur={handleBlur}
                                placeholder="Encuentra el regalo perfecto..."
                                aria-label="Buscar regalos"
                                className="w-full h-11 pl-11 pr-4 bg-white rounded-full border-2 border-[#A01C46]/20 text-sm text-stone-900 placeholder:text-[#A01C46]/50 focus:outline-none focus:border-[#A01C46] focus:ring-2 focus:ring-[#A01C46]/20 transition-all shadow-sm hover:border-[#A01C46]/30"
                            />
                        </div>
                        {showSuggestions && focusedBox === "desktop" && suggestionDropdown}
                    </form>

                    <div className="flex items-center gap-6 flex-shrink-0">
                        <Link href="/tienda" aria-label="Ir a la tienda">
                            <div className="flex items-center gap-2 rounded-full bg-pink-800 px-5 py-2.5 text-white transition-colors hover:bg-pink-900">
                                <ShoppingCart size={18} />
                                <span className="text-sm font-semibold tracking-wide">Tienda</span>
                            </div>
                        </Link>

                        <button
                            onClick={openCart}
                            aria-label="Ir al carrito de compras"
                            className="relative p-2 text-[#584144] transition-colors hover:text-pink-800"
                        >
                            <ShoppingCart size={26} />
                            <CartCountBadge />
                        </button>

                        <div className="relative flex-shrink-0">
                            <Image
                                src="/surprises.png"
                                alt="Avatar de usuario"
                                width={40}
                                height={40}
                                className="rounded-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN MOBILE OVERLAY (PORTAL) */}
            {isMenuOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[999999] h-screen w-screen bg-[#180912] md:hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(225,29,72,0.2),_transparent_60%)] pointer-events-none" />
                    
                    <div className="relative flex h-full w-full flex-col overflow-y-auto px-6 pt-5 pb-8">
                        {/* Header del Menú */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <Link href="/" aria-label="Ir a inicio" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                                <Image
                                    src="/head.png"
                                    alt="Surprises Logo"
                                    width={44}
                                    height={44}
                                    className="rounded-full object-cover ring-2 ring-pink-500/30"
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

                        {/* Pie de menú (Perfil) */}
                        <div className="mt-auto pt-6 border-t border-white/10 flex justify-center">
                            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-white/90 shadow-inner">
                                <Image
                                    src="/surprises.png"
                                    alt="Avatar de usuario"
                                    width={32}
                                    height={32}
                                    className="rounded-full object-contain ring-1 ring-white/30"
                                />
                                <span className="text-sm font-medium">Hola, Surprises</span>
                            </div>
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}