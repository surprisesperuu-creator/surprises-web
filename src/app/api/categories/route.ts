import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { parseWithSchema, readJsonBody } from "@/lib/api/request";
import { categoryService } from "@/services/category.service";
import { createCategorySchema } from "@/lib/validations/category.schema";
import { requireAdminSession } from "@/lib/admin/session";

/**
 * GET /api/categories → lista todas las categorías.
 */
export async function GET() {
  return apiHandler(async () => {
    const categories = await categoryService.getAll();
    return success(categories);
  });
}

/**
 * POST /api/categories → crea una categoría.
 * 201 → creada | 400 → datos inválidos | 409 → slug duplicado
 */
export async function POST(request: Request) {
  return apiHandler(async () => {
    await requireAdminSession();
    const body = await readJsonBody(request);
    const input = parseWithSchema(createCategorySchema, body);
    const category = await categoryService.create(input);
    return success(category, 201);
  });
}
