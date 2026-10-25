import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { parseUuidId, parseWithSchema, readJsonBody } from "@/lib/api/request";
import { productService } from "@/services/product.service";
import { updateProductSchema } from "@/lib/validations/product.schema";
import { requireAdminSession } from "@/lib/admin/session";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id] → obtiene un producto con su categoría.
 * 200 → producto | 400 → id inválido | 404 → no existe
 */
export async function GET(_request: Request, context: RouteContext) {
  return apiHandler(async () => {
    const { id } = await context.params;
    const product = await productService.getById(parseUuidId(id));
    return success(product);
  });
}

/**
 * PUT /api/products/[id] → actualiza un producto.
 * 200 → actualizado | 400 → datos/id/categoría inválidos | 404 → no existe
 */
export async function PUT(request: Request, context: RouteContext) {
  return apiHandler(async () => {
    await requireAdminSession();
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const input = parseWithSchema(updateProductSchema, body);
    const product = await productService.update(parseUuidId(id), input);
    return success(product);
  });
}

/**
 * DELETE /api/products/[id] → elimina un producto.
 * 200 → eliminado | 400 → id inválido | 404 → no existe
 */
export async function DELETE(_request: Request, context: RouteContext) {
  return apiHandler(async () => {
    await requireAdminSession();
    const { id } = await context.params;
    const parsedId = parseUuidId(id);
    await productService.remove(parsedId);
    return success({ id: parsedId });
  });
}
