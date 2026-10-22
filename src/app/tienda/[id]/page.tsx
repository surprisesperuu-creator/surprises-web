import { Suspense } from "react";

import { ApiError } from "@/lib/api/errors";
import { productService } from "@/services/product.service";
import { ProductDetailView } from "@/components/store/ProductDetailView";
import { ProductDetailSkeleton } from "@/components/store/ProductDetailSkeleton";
import { ProductNotFound } from "@/components/store/ProductNotFound";
import { StoreError } from "@/components/store/StoreStates";
import type { ProductWithCategory } from "@/types/product";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Detalle de producto: Server Component que consume GET /api/products/[id].
 * Solo se muestra si el producto existe y está activo; en caso contrario,
 * se muestra "Producto no encontrado".
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailFetcher id={id} />
    </Suspense>
  );
}

async function ProductDetailFetcher({ id }: { id: string }) {
  let product: ProductWithCategory | null = null;
  let related: ProductWithCategory[] = [];
  let notFound = false;
  let error: string | null = null;

  try {
    const loadedProduct = await productService.getById(id);

    if (!loadedProduct.is_active) {
      // Existe pero está desactivado: se muestra como no encontrado.
      notFound = true;
    } else {
      product = loadedProduct;

      // Relacionados: productos ACTIVOS de la misma categoría.
      try {
        related = (await productService.getAll(loadedProduct.category_id))
          .filter((item) => item.id !== loadedProduct.id && item.is_active)
          .slice(0, 4);
      } catch {
        related = [];
      }
    }
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound = true;
    } else {
      error =
        err instanceof Error ? err.message : "No pudimos cargar el producto.";
    }
  }

  if (notFound) {
    return <ProductNotFound />;
  }
  if (error) {
    return <StoreError message={error} retryHref={`/tienda/${id}`} />;
  }
  if (product) {
    return <ProductDetailView product={product} related={related} />;
  }
  return null;
}
