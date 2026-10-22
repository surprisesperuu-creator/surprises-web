import { getSupabaseServerClient } from "@/lib/supabase/server";
import { handleDatabaseError } from "@/lib/supabase/errors";
import { ApiErrors } from "@/lib/api/errors";
import type { HeroSlide } from "@/types/hero-slide";
import type {
  CreateHeroSlideInput,
  UpdateHeroSlideInput,
} from "@/lib/validations/hero-slide.schema";

/**
 * Lógica de negocio de las imágenes del Hero del Home.
 * Se ejecuta siempre en el servidor usando la service role key
 * (operaciones administrativas).
 *
 * Orden del carrusel: sort_order asc, created_at desc.
 */
export const heroSlideService = {
  /** Lista todas las imágenes del Hero (incluye inactivas, útil para el Admin). */
  async getAll(): Promise<HeroSlide[]> {
    const { data, error } = await getSupabaseServerClient()
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      // PGRST205 = la tabla aún no existe en Supabase (migración pendiente).
      // En vez de un 500 confuso, se muestra el carrusel vacío.
      if (error.code === "PGRST205") {
        return [];
      }
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }

    return (data ?? []) as HeroSlide[];
  },

  /** Obtiene una imagen del Hero por id (404 si no existe). */
  async getById(id: string): Promise<HeroSlide> {
    const { data, error } = await getSupabaseServerClient()
      .from("hero_slides")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }
    if (!data) {
      throw ApiErrors.notFound("Imagen del Hero");
    }

    return data as HeroSlide;
  },

  /** Crea una imagen del Hero. */
  async create(input: CreateHeroSlideInput): Promise<HeroSlide> {
    const { data, error } = await getSupabaseServerClient()
      .from("hero_slides")
      .insert(input)
      .select("*")
      .single();

    if (error) {
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }

    return data as HeroSlide;
  },

  /** Actualiza una imagen del Hero (404 si no existe). */
  async update(id: string, input: UpdateHeroSlideInput): Promise<HeroSlide> {
    const { data, error } = await getSupabaseServerClient()
      .from("hero_slides")
      .update(input)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }
    if (!data) {
      throw ApiErrors.notFound("Imagen del Hero");
    }

    return data as HeroSlide;
  },

  /** Elimina una imagen del Hero (404 si no existe). */
  async remove(id: string): Promise<void> {
    const { data, error } = await getSupabaseServerClient()
      .from("hero_slides")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }
    if (!data) {
      throw ApiErrors.notFound("Imagen del Hero");
    }
  },
};
