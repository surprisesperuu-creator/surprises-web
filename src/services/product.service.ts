import { Prisma, type Product as PrismaProduct } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { handleDatabaseError } from "@/lib/database-errors";
import { ApiErrors } from "@/lib/api/errors";
import type { Product, ProductWithCategory } from "@/types/product";
import type { CategorySummary } from "@/types/product";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/product.schema";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  image_url: true,
} as const;

type ProductWithCategoryRow = Prisma.ProductGetPayload<{
  include: { category: { select: typeof categorySelect } };
}>;

function mapProductRow(row: PrismaProduct): Product {
  return {
    ...row,
    price: Number(row.price),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

function mapProductWithCategoryRow(row: ProductWithCategoryRow): ProductWithCategory {
  return {
    ...mapProductRow(row),
    category: row.category,
  };
}

/**
 * Lógica de negocio de productos. Se ejecuta siempre en el servidor
 * usando la conexión PostgreSQL del servidor.
 */
export const productService = {
  /**
   * Lista productos con la categoría asociada.
   * Filtro opcional por categoría (`category_id`).
   */
  async getAll(categoryId?: string): Promise<ProductWithCategory[]> {
    const data = await prisma.product.findMany({
      where: categoryId ? { category_id: categoryId } : undefined,
      include: { category: { select: categorySelect } },
      orderBy: { created_at: "desc" },
    });

    return data.map(mapProductWithCategoryRow);
  },

  /** Obtiene un producto con su categoría (404 si no existe). */
  async getById(id: string): Promise<ProductWithCategory> {
    const data = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: categorySelect } },
    });
    if (!data) {
      throw ApiErrors.notFound("Producto");
    }

    return mapProductWithCategoryRow(data);
  },

  /** Crea un producto (400 si la categoría indicada no existe). */
  async create(input: CreateProductInput): Promise<Product> {
    await assertCategoryExists(input.category_id);

    try {
      const data = await prisma.product.create({ data: input });
      return mapProductRow(data);
    } catch (error) {
      handleDatabaseError(error, { resource: "Producto" });
    }
  },

  /** Actualiza un producto (404 si no existe; 400 si la categoría no existe). */
  async update(id: string, input: UpdateProductInput): Promise<Product> {
    if (input.category_id !== undefined) {
      await assertCategoryExists(input.category_id);
    }

    try {
      const data = await prisma.product.update({
        where: { id },
        data: input,
      });
      return mapProductRow(data);
    } catch (error) {
      handleDatabaseError(error, { resource: "Producto" });
    }
  },

  /** Elimina un producto (404 si no existe). */
  async remove(id: string): Promise<void> {
    try {
      await prisma.product.delete({ where: { id } });
    } catch (error) {
      handleDatabaseError(error, { resource: "Producto" });
    }
  },
};

/**
 * Verifica que `category_id` exista en `categories`.
 * Lanza 400 VALIDATION_ERROR si no existe.
 */
async function assertCategoryExists(categoryId: string): Promise<void> {
  const data = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!data) {
    throw ApiErrors.validation("La categoría indicada no existe");
  }
}
