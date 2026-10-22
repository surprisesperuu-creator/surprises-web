import { getSupabaseServerClient } from "@/lib/supabase/server";
import { handleDatabaseError } from "@/lib/supabase/errors";
import { ApiErrors } from "@/lib/api/errors";
import type { Category } from "@/types/category";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/validations/category.schema";

/**
 * Lógica de negocio de categorías. Se ejecuta siempre en el servidor
 * usando la service role key (operaciones administrativas).
 */
export const categoryService = {
  /** Lista todas las categorías (incluye inactivas, útil para el Admin). */
  async getAll(): Promise<Category[]> {
    const { data, error } = await getSupabaseServerClient()
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      // PGRST205 = la tabla aún no existe en Supabase (proyecto vacío).
      // En vez de un 500 confuso, se muestra el catálogo vacío.
      if (error.code === "PGRST205") {
        return [];
      }
      handleDatabaseError(error, { resource: "Categoría" });
    }

    return (data ?? []) as Category[];
  },

  /** Obtiene una categoría por id (404 si no existe). */
  async getById(id: string): Promise<Category> {
    const { data, error } = await getSupabaseServerClient()
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, { resource: "Categoría" });
    }
    if (!data) {
      throw ApiErrors.notFound("Categoría");
    }

    return data as Category;
  },

  /** Crea una categoría (409 si el slug ya existe). */
  async create(input: CreateCategoryInput): Promise<Category> {
    const { data, error } = await getSupabaseServerClient()
      .from("categories")
      .insert(input)
      .select("*")
      .single();

    if (error) {
      handleDatabaseError(error, {
        resource: "Categoría",
        conflictMessage: "Ya existe una categoría con ese slug",
      });
    }

    return data as Category;
  },

  /** Actualiza una categoría (404 si no existe; 409 si el slug ya existe). */
  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const { data, error } = await getSupabaseServerClient()
      .from("categories")
      .update(input)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, {
        resource: "Categoría",
        conflictMessage: "Ya existe una categoría con ese slug",
      });
    }
    if (!data) {
      throw ApiErrors.notFound("Categoría");
    }

    return data as Category;
  },

  /**
   * Elimina una categoría (404 si no existe).
   * 409 si tiene productos asociados (FK on delete restrict).
   */
  async remove(id: string): Promise<void> {
    const { data, error } = await getSupabaseServerClient()
      .from("categories")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, {
        resource: "Categoría",
        inUseMessage:
          "No se puede eliminar la categoría porque tiene productos asociados",
      });
    }
    if (!data) {
      throw ApiErrors.notFound("Categoría");
    }
  },
};
