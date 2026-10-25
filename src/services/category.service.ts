import type { Category as PrismaCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { handleDatabaseError } from "@/lib/database-errors";
import { ApiErrors } from "@/lib/api/errors";
import type { Category } from "@/types/category";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/validations/category.schema";

/**
 * Lógica de negocio de categorías. Se ejecuta siempre en el servidor
 * usando la conexión PostgreSQL del servidor.
 */
export const categoryService = {
  /** Lista todas las categorías (incluye inactivas, útil para el Admin). */
  async getAll(): Promise<Category[]> {
    const data = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return data.map(mapCategoryRow);
  },

  /** Obtiene una categoría por id (404 si no existe). */
  async getById(id: string): Promise<Category> {
    const data = await prisma.category.findUnique({ where: { id } });
    if (!data) {
      throw ApiErrors.notFound("Categoría");
    }

    return mapCategoryRow(data);
  },

  /** Crea una categoría (409 si el slug ya existe). */
  async create(input: CreateCategoryInput): Promise<Category> {
    try {
      const data = await prisma.category.create({ data: input });
      return mapCategoryRow(data);
    } catch (error) {
      handleDatabaseError(error, {
        resource: "Categoría",
        conflictMessage: "Ya existe una categoría con ese slug",
      });
    }
  },

  /** Actualiza una categoría (404 si no existe; 409 si el slug ya existe). */
  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    try {
      const data = await prisma.category.update({
        where: { id },
        data: input,
      });
      return mapCategoryRow(data);
    } catch (error) {
      handleDatabaseError(error, {
        resource: "Categoría",
        conflictMessage: "Ya existe una categoría con ese slug",
      });
    }
  },

  /**
   * Elimina una categoría (404 si no existe).
   * 409 si tiene productos asociados (FK on delete restrict).
   */
  async remove(id: string): Promise<void> {
    try {
      await prisma.category.delete({ where: { id } });
    } catch (error) {
      handleDatabaseError(error, {
        resource: "Categoría",
        inUseMessage:
          "No se puede eliminar la categoría porque tiene productos asociados",
      });
    }
  },
};

function mapCategoryRow(row: PrismaCategory): Category {
  return {
    ...row,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}
