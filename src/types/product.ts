import type { Category } from "./category";

/**
 * Entidad Producto tal como se expone en las respuestas de la API.
 * `price` se devuelve como número y los timestamps como cadenas ISO.
 */
export interface Product {
  id: string;
  category_id: string;
  name: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Información resumida de la categoría embebida en las respuestas de productos.
 */
export type CategorySummary = Pick<Category, "id" | "name" | "slug" | "image_url">;

/**
 * Producto con la categoría asociada (GET /api/products).
 */
export interface ProductWithCategory extends Product {
  category: CategorySummary | null;
}
