import type { Category } from "./category";

/**
 * Entidad Producto tal como se almacena en Supabase.
 *
 * Nota: la columna `price` es `numeric` en Postgres y Supabase la devuelve
 * como string; los servicios la convierten a número antes de responder.
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
