"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";

import { ProductCard } from "@/components/store/ProductCard";
import { StoreEmpty, StoreError } from "@/components/store/StoreStates";
import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";

type SortOption = "relevancia" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
];

interface TiendaViewProps {
  categories: Category[];
  products: ProductWithCategory[];
  activeCategorySlug: string | null;
  searchQuery: string | null;
  error: string | null;
}

/**
 * Vista interactiva de la tienda: filtros de categoría (dinámicos),
 * ordenamiento y grid de ProductCard. Soporta búsqueda `?q=` con aviso
 * de resultados y botón para limpiarla sin perder la categoría.
 */
export function TiendaView({
  categories,
  products,
  activeCategorySlug,
  searchQuery,
  error,
}: TiendaViewProps) {
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [sortOpen, setSortOpen] = useState(false);

  const sortedProducts = [...products];
  if (sort === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "Relevancia";

  const filterClass = (active: boolean) =>
    `whitespace-nowrap px-5 py-2 rounded-full text-xs font-medium transition-colors ${
      active
        ? "bg-pink-700 text-white shadow-sm"
        : "bg-stone-100 hover:bg-stone-200 text-stone-600"
    }`;

  const retryHref = activeCategorySlug
    ? `/tienda?category=${activeCategorySlug}`
    : "/tienda";

  const clearSearchHref = activeCategorySlug
    ? `/tienda?category=${activeCategorySlug}`
    : "/tienda";

  const categoryHref = (slug: string) =>
    searchQuery
      ? `/tienda?category=${slug}&q=${encodeURIComponent(searchQuery)}`
      : `/tienda?category=${slug}`;

  const allHref = searchQuery ? `/tienda?q=${encodeURIComponent(searchQuery)}` : "/tienda";

  return (
    <>
      {/* Barra de filtros */}
      <div className="flex w-full justify-center border-y border-stone-200/80 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Link href={allHref} className={filterClass(!activeCategorySlug)}>
              Todos
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={categoryHref(category.slug)}
                className={filterClass(activeCategorySlug === category.slug)}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {/* Ordenar */}
            <div className="relative flex items-center gap-2">
              <span className="text-xs font-medium text-stone-600">Ordenar:</span>
              <button
                type="button"
                onClick={() => setSortOpen((value) => !value)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5 transition-colors hover:bg-stone-200"
              >
                <span className="text-xs font-medium text-stone-900">{sortLabel}</span>
                <ChevronDown size={14} className="text-[#8B7074]" />
              </button>

              {sortOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-10 z-20 w-52 rounded-2xl border border-stone-200 bg-white p-1 shadow-lg"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={sort === option.value}
                      onClick={() => {
                        setSort(option.value);
                        setSortOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-stone-700 transition-colors hover:bg-rose-50"
                    >
                      {option.label}
                      {sort === option.value && (
                        <Check size={14} className="text-[#C1375D]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8">
        {searchQuery && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">
            <p className="text-sm text-stone-700">
              Resultados para{" "}
              <span className="font-semibold text-rose-900">“{searchQuery}”</span>
              {" "}({sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "producto" : "productos"})
            </p>
            <Link
              href={clearSearchHref}
              className="ml-auto rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#C1375D] shadow-sm transition-colors hover:bg-rose-100"
            >
              Limpiar búsqueda
            </Link>
          </div>
        )}
        {error ? (
          <StoreError message={error} retryHref={retryHref} />
        ) : sortedProducts.length === 0 ? (
          <StoreEmpty
            title={
              searchQuery
                ? `Sin resultados para “${searchQuery}”`
                : activeCategorySlug
                  ? "No hay productos en esta categoría"
                  : "No hay productos disponibles"
            }
            description={
              searchQuery
                ? "Prueba con otra palabra o revisa la ortografía."
                : activeCategorySlug
                  ? "Prueba con otra categoría o vuelve a intentarlo más tarde."
                  : "Vuelve pronto: estamos preparando nuevas sorpresas."
            }
          />
        ) : (
          <>
            <div className="text-base text-stone-600">
              Mostrando{" "}
              <span className="font-semibold text-rose-900">
                {sortedProducts.length}
              </span>{" "}
              {sortedProducts.length === 1 ? "producto" : "productos"}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={(index % 4) * 100}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
