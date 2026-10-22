import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { parseUuidId, parseWithSchema, readJsonBody } from "@/lib/api/request";
import { heroSlideService } from "@/services/hero-slide.service";
import { updateHeroSlideSchema } from "@/lib/validations/hero-slide.schema";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/hero-slides/[id] → obtiene una imagen del Hero.
 * 200 → imagen | 400 → id inválido | 404 → no existe
 */
export async function GET(_request: Request, context: RouteContext) {
  return apiHandler(async () => {
    const { id } = await context.params;
    const slide = await heroSlideService.getById(parseUuidId(id));
    return success(slide);
  });
}

/**
 * PUT /api/hero-slides/[id] → actualiza una imagen del Hero.
 * 200 → actualizada | 400 → datos/id inválidos | 404 → no existe
 */
export async function PUT(request: Request, context: RouteContext) {
  return apiHandler(async () => {
    const { id } = await context.params;
    const body = await readJsonBody(request);
    const input = parseWithSchema(updateHeroSlideSchema, body);
    const slide = await heroSlideService.update(parseUuidId(id), input);
    return success(slide);
  });
}

/**
 * DELETE /api/hero-slides/[id] → elimina una imagen del Hero.
 * 200 → eliminada | 400 → id inválido | 404 → no existe
 */
export async function DELETE(_request: Request, context: RouteContext) {
  return apiHandler(async () => {
    const { id } = await context.params;
    const parsedId = parseUuidId(id);
    await heroSlideService.remove(parsedId);
    return success({ id: parsedId });
  });
}
