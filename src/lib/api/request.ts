import { z } from "zod";
import { ApiErrors } from "./errors";

/**
 * Lee y parsea el cuerpo JSON de una petición.
 * Lanza 400 si el cuerpo no es JSON válido.
 */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw ApiErrors.validation("El cuerpo de la petición debe ser JSON válido");
  }
}

/**
 * Valida un payload desconocido contra un esquema Zod.
 * Lanza 400 con los detalles de validación si no cumple el esquema.
 */
export function parseWithSchema<S extends z.ZodType>(schema: S, body: unknown): z.output<S> {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw ApiErrors.validation("Datos inválidos", result.error.issues);
  }

  return result.data as z.output<S>;
}

/**
 * Valida el parámetro dinámico `[id]` (debe ser un UUID).
 * Lanza 400 si el formato no es válido.
 */
export function parseUuidId(rawId: string): string {
  const result = z.uuid("El id debe ser un UUID válido").safeParse(rawId);

  if (!result.success) {
    throw ApiErrors.validation("El id debe ser un UUID válido");
  }

  return result.data;
}
