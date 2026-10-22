import { ApiClientError, apiRequest } from "@/lib/api/client";
import type { Category } from "@/types/category";
import type { ProductWithCategory } from "@/types/product";
import type { HeroSlide } from "@/types/hero-slide";

export { ApiClientError };

/**
 * Cliente de la TIENDA PÚBLICA.
 *
 * Consume los endpoints existentes del backend y aplica el filtro de
 * "activo": solo los productos/categorías con `is_active === true`
 * aparecen públicamente. No crea endpoints nuevos.
 */
export const storeApi = {
  /** Categorías activas (GET /api/categories). */
  async getCategories(): Promise<Category[]> {
    const categories = await apiRequest<Category[]>("/api/categories");
    return categories.filter((category) => category.is_active);
  },

  /** Productos activos, opcionalmente filtrados por categoría (GET /api/products). */
  async getProducts(categoryId?: string): Promise<ProductWithCategory[]> {
    const url = categoryId
      ? `/api/products?category_id=${categoryId}`
      : "/api/products";
    const products = await apiRequest<ProductWithCategory[]>(url);
    return products.filter((product) => product.is_active);
  },

  /** Producto activo por id (GET /api/products/[id]). Lanza 404 si está inactivo. */
  async getProduct(id: string): Promise<ProductWithCategory> {
    const product = await apiRequest<ProductWithCategory>(`/api/products/${id}`);
    if (!product.is_active) {
      throw new ApiClientError(404, "NOT_FOUND", "Producto no encontrado");
    }
    return product;
  },

  /**
   * Imágenes activas del Hero del Home (GET /api/hero-slides).
   * Ya vienen en orden del carrusel (sort_order asc, created_at desc).
   * Si la tabla aún no existe (migración pendiente), devuelve lista vacía
   * para que el Home use la imagen por defecto.
   */
  async getHeroSlides(): Promise<HeroSlide[]> {
    try {
      const slides = await apiRequest<HeroSlide[]>("/api/hero-slides");
      return slides.filter((slide) => slide.is_active);
    } catch (error) {
      // Tabla aún no creada / error de servidor al listar: el Home usa
      // la imagen por defecto en lugar de romper.
      if (error instanceof ApiClientError && error.status === 500) {
        return [];
      }
      throw error;
    }
  },
};
