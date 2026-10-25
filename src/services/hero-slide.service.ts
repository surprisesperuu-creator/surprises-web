import type { HeroSlide as PrismaHeroSlide } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { handleDatabaseError } from "@/lib/database-errors";
import { ApiErrors } from "@/lib/api/errors";
import type { HeroSlide } from "@/types/hero-slide";
import type {
  CreateHeroSlideInput,
  UpdateHeroSlideInput,
} from "@/lib/validations/hero-slide.schema";

/**
 * Lógica de negocio de las imágenes del Hero del Home.
 * Se ejecuta siempre en el servidor usando la conexión PostgreSQL.
 *
 * Orden del carrusel: sort_order asc, created_at desc.
 */
export const heroSlideService = {
  /** Lista todas las imágenes del Hero (incluye inactivas, útil para el Admin). */
  async getAll(): Promise<HeroSlide[]> {
    const data = await prisma.heroSlide.findMany({
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
    return data.map(mapHeroSlideRow);
  },

  /** Obtiene una imagen del Hero por id (404 si no existe). */
  async getById(id: string): Promise<HeroSlide> {
    const data = await prisma.heroSlide.findUnique({ where: { id } });
    if (!data) {
      throw ApiErrors.notFound("Imagen del Hero");
    }

    return mapHeroSlideRow(data);
  },

  /** Crea una imagen del Hero. */
  async create(input: CreateHeroSlideInput): Promise<HeroSlide> {
    try {
      const data = await prisma.heroSlide.create({ data: input });
      return mapHeroSlideRow(data);
    } catch (error) {
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }
  },

  /** Actualiza una imagen del Hero (404 si no existe). */
  async update(id: string, input: UpdateHeroSlideInput): Promise<HeroSlide> {
    try {
      const data = await prisma.heroSlide.update({
        where: { id },
        data: input,
      });
      return mapHeroSlideRow(data);
    } catch (error) {
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }
  },

  /** Elimina una imagen del Hero (404 si no existe). */
  async remove(id: string): Promise<void> {
    try {
      await prisma.heroSlide.delete({ where: { id } });
    } catch (error) {
      handleDatabaseError(error, { resource: "Imagen del Hero" });
    }
  },
};

function mapHeroSlideRow(row: PrismaHeroSlide): HeroSlide {
  return {
    ...row,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}
