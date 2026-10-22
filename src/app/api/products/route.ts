import { z } from "zod";
import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { ApiErrors } from "@/lib/api/errors";
import { parseWithSchema, readJsonBody } from "@/lib/api/request";
import { productService } from "@/services/product.service";
import { createProductSchema } from "@/lib/validations/product.schema";

/**
 * GET /api/products → lista productos con su categoría.
 * Filtro opcional: ?category_id=<uuid> → 400 si el formato es inválido.
 */
export async function GET(request: Request) {
  return apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const rawCategoryId = searchParams.get("category_id");

    let categoryId: string | undefined;
    if (rawCategoryId !== null) {
      const parsed = z
        .uuid("category_id debe ser un UUID válido")
        .safeParse(rawCategoryId);
      if (!parsed.success) {
        throw ApiErrors.validation("category_id debe ser un UUID válido");
      }
      categoryId = parsed.data;
    }

    const products = await productService.getAll(categoryId);
    return success(products);
  });
}

/**
 * POST /api/products → crea un producto.
 * 201 → creado | 400 → datos inválidos o categoría inexistente
 */
export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = await readJsonBody(request);
    const input = parseWithSchema(createProductSchema, body);
    const product = await productService.create(input);
    return success(product, 201);
  });
}
