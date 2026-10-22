import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { parseUuidId, parseWithSchema, readJsonBody } from "@/lib/api/request";
import { categoryService } from "@/services/category.service";
import { updateCategorySchema } from "@/lib/validations/category.schema";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/categories/[id] → obtiene una categoría.
 * 200 → categoría | 400 → id inválido | 404 → no existe
 */
export async function GET(_request: Request, context: RouteContext) {
  return apiHandler(async () => {
    const { id } = await context.params;
    const category = await categoryService.getById(parseUuidId(id));
    return success(category);
  });
}

/**
 * PUT /api/categories/[id] → actualiza una categoría.
 * 200 → actualizada | 400 → datos/id inválidos | 404 → no existe | 409 → slug duplicado
 */
export async function PUT(request: Request, context: RouteContext) {
  return apiHandler(async () => {
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const input = parseWithSchema(updateCategorySchema, body);
    const category = await categoryService.update(parseUuidId(id), input);
    return success(category);
  });
}

/**
 * DELETE /api/categories/[id] → elimina una categoría.
 * 200 → eliminada | 400 → id inválido | 404 → no existe | 409 → tiene productos
 */
export async function DELETE(_request: Request, context: RouteContext) {
  return apiHandler(async () => {
    const { id } = await context.params;
    const parsedId = parseUuidId(id);
    await categoryService.remove(parsedId);
    return success({ id: parsedId });
  });
}
