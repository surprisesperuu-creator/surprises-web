import { Suspense } from "react";

import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { TiendaView } from "@/components/store/TiendaView";
import { TiendaSkeleton } from "@/components/store/TiendaSkeleton";
import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";

export const dynamic = "force-dynamic";

interface TiendaPageProps {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[] }>;
}

/**
 * Tienda pública: Server Component que consume GET /api/categories y
 * GET /api/products (solo elementos activos). El filtro se lee de la URL
 * `?category=<slug>` y se traduce a `category_id` para el endpoint.
 * La búsqueda `?q=<texto>` filtra por nombre en el servidor.
 */
export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const params = await searchParams;
  const categorySlug = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ? rawQuery.trim() : undefined;

  return (
    <Suspense fallback={<TiendaSkeleton />}>
      <TiendaCatalog categorySlug={categorySlug} query={query} />
    </Suspense>
  );
}

async function TiendaCatalog({
  categorySlug,
  query,
}: {
  categorySlug?: string;
  query?: string;
}) {
  let categories: Category[] = [];
  let products: ProductWithCategory[] = [];
  let activeCategory: Category | null = null;
  let error: string | null = null;

  try {
    // Lecturas públicas desde el servidor: se consulta Supabase
    // directamente (los servicios) y se filtran solo los ACTIVOS.
    // (No se usa fetch HTTP aqui porque las URLs relativas fallan en
    // server components.)
    categories = (await categoryService.getAll()).filter(
      (category) => category.is_active
    );
    // El slug de la URL se resuelve a la categoría activa; la relación
    // principal con productos es siempre por category_id.
    activeCategory =
      categories.find((category) => category.slug === categorySlug) ?? null;
    products = (await productService.getAll(activeCategory?.id)).filter(
      (product) => product.is_active
    );
    // Búsqueda por nombre (`?q=`): insensible a mayúsculas y tildes, igual
    // que las sugerencias del Header.
    const term = query
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (term) {
      products = products.filter((product) =>
        product.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(term)
      );
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "No pudimos cargar los productos.";
  }

  return (
    <TiendaView
      categories={categories}
      products={products}
      activeCategorySlug={activeCategory?.slug ?? null}
      searchQuery={query ?? null}
      error={error}
    />
  );
}
