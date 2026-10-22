import { getSupabaseServerClient } from "@/lib/supabase/server";
import { handleDatabaseError } from "@/lib/supabase/errors";
import { ApiErrors } from "@/lib/api/errors";
import type { Product, ProductWithCategory } from "@/types/product";
import type { CategorySummary } from "@/types/product";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product.schema";

/**
 * Fila de producto tal como la devuelve Supabase: `price` (numeric) es string.
 */
type ProductRow = Omit<Product, "price"> & { price: string };

/**
 * Fila de producto con la categoría embebida (join).
 */
type ProductWithCategoryRow = Omit<ProductWithCategory, "price" | "category"> & {
  price: string;
  category: CategorySummary | null;
};

function mapProductRow(row: ProductRow): Product {
  return { ...row, price: Number(row.price) };
}

function mapProductWithCategoryRow(row: ProductWithCategoryRow): ProductWithCategory {
  return { ...row, price: Number(row.price) };
}

/**
 * Lógica de negocio de productos. Se ejecuta siempre en el servidor
 * usando la service role key (operaciones administrativas).
 */
export const productService = {
  /**
   * Lista productos con la categoría asociada.
   * Filtro opcional por categoría (`category_id`).
   */
  async getAll(categoryId?: string): Promise<ProductWithCategory[]> {
    let query = getSupabaseServerClient()
      .from("products")
      .select("*, category:categories(id, name, slug, image_url)");

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      // PGRST205 = las tablas aún no existen en Supabase (proyecto vacío).
      // Se devuelve lista vacía para mostrar el estado "sin productos".
      if (error.code === "PGRST205") {
        return [];
      }
      handleDatabaseError(error, { resource: "Producto" });
    }

    return (data ?? []).map(mapProductWithCategoryRow);
  },

  /** Obtiene un producto con su categoría (404 si no existe). */
  async getById(id: string): Promise<ProductWithCategory> {
    const { data, error } = await getSupabaseServerClient()
      .from("products")
      .select("*, category:categories(id, name, slug, image_url)")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, { resource: "Producto" });
    }
    if (!data) {
      throw ApiErrors.notFound("Producto");
    }

    return mapProductWithCategoryRow(data);
  },

  /** Crea un producto (400 si la categoría indicada no existe). */
  async create(input: CreateProductInput): Promise<Product> {
    await assertCategoryExists(input.category_id);

    const { data, error } = await getSupabaseServerClient()
      .from("products")
      .insert(input)
      .select("*")
      .single();

    if (error) {
      handleDatabaseError(error, { resource: "Producto" });
    }

    return mapProductRow(data);
  },

  /** Actualiza un producto (404 si no existe; 400 si la categoría no existe). */
  async update(id: string, input: UpdateProductInput): Promise<Product> {
    if (input.category_id !== undefined) {
      await assertCategoryExists(input.category_id);
    }

    const { data, error } = await getSupabaseServerClient()
      .from("products")
      .update(input)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, { resource: "Producto" });
    }
    if (!data) {
      throw ApiErrors.notFound("Producto");
    }

    return mapProductRow(data);
  },

  /** Elimina un producto (404 si no existe). */
  async remove(id: string): Promise<void> {
    const { data, error } = await getSupabaseServerClient()
      .from("products")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, { resource: "Producto" });
    }
    if (!data) {
      throw ApiErrors.notFound("Producto");
    }
  },
};

/**
 * Verifica que `category_id` exista en `categories`.
 * Lanza 400 VALIDATION_ERROR si no existe.
 */
async function assertCategoryExists(categoryId: string): Promise<void> {
  const { data, error } = await getSupabaseServerClient()
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    handleDatabaseError(error, { resource: "Categoría" });
  }
  if (!data) {
    throw ApiErrors.validation("La categoría indicada no existe");
  }
}
