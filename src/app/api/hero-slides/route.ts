import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { parseWithSchema, readJsonBody } from "@/lib/api/request";
import { heroSlideService } from "@/services/hero-slide.service";
import { createHeroSlideSchema } from "@/lib/validations/hero-slide.schema";

/**
 * GET /api/hero-slides → lista las imágenes del Hero (orden del carrusel:
 * sort_order asc, created_at desc).
 */
export async function GET() {
  return apiHandler(async () => {
    const slides = await heroSlideService.getAll();
    return success(slides);
  });
}

/**
 * POST /api/hero-slides → crea una imagen del Hero.
 * 201 → creada | 400 → datos inválidos
 */
export async function POST(request: Request) {
  return apiHandler(async () => {
    const body = await readJsonBody(request);
    const input = parseWithSchema(createHeroSlideSchema, body);
    const slide = await heroSlideService.create(input);
    return success(slide, 201);
  });
}
