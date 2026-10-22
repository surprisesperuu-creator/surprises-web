import { apiHandler } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { ApiErrors } from "@/lib/api/errors";
import { generateUploadSignature } from "@/lib/cloudinary/server";

/**
 * POST /api/upload?folder=products|categories|hero
 *
 * Devuelve una FIRMA de subida firmada para que el navegador cargue la
 * imagen DIRECTAMENTE a Cloudinary (signed upload). El `API_SECRET`
 * jamás abandona el servidor: aquí solo se genera la firma con él.
 *
 * 200 → { cloudName, apiKey, folder, timestamp, signature }
 * 400 → si `folder` no está permitido
 * 500 → si faltan las variables de entorno de Cloudinary
 */
export async function POST(request: Request) {
  return apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") ?? "products";

    // Solo permitimos carpetas conocidas para evitar abusos de la firma.
    if (folder !== "products" && folder !== "categories" && folder !== "hero") {
      throw ApiErrors.validation(
        "folder debe ser 'products', 'categories' o 'hero'"
      );
    }

    const signature = generateUploadSignature(`surprises/${folder}`);
    return success(signature);
  });
}