import { ApiError } from "./errors";
import { failure } from "./response";

/**
 * Envuelve la lógica de un Route Handler:
 * - `ApiError` → respuesta con su status/código.
 * - Error desconocido → 500 genérico (sin exponer detalles internos).
 */
export async function apiHandler(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      return failure(error.status, error.code, error.message, error.details);
    }

    // Se loguea únicamente en el servidor; nunca se envía al cliente.
    console.error("[api] error no controlado:", error);
    return failure(500, "INTERNAL_ERROR", "Error interno del servidor");
  }
}
