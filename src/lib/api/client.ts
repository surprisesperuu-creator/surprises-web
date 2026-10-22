import type { ApiResponse } from "@/types/api";

/**
 * Error del cliente de API.
 * La API responde siempre con el envolvente `{ data, error: { code, message } }`;
 * aquí se traduce a un Error que la UI puede mostrar directamente.
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Realiza una petición a un endpoint de la API y devuelve `data`
 * del envolvente `{ data, error }`. Lanza `ApiClientError` ante
 * errores de red, respuestas inválidas o errores del servidor.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      cache: "no-store",
    });
  } catch {
    throw new ApiClientError(0, "NETWORK_ERROR", "No se pudo conectar con el servidor");
  }

  let body: ApiResponse<T> | null = null;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    // Cuerpo vacío o no JSON: se maneja abajo como respuesta inválida.
  }

  if (!response.ok || !body || body.error) {
    const error = body?.error;
    throw new ApiClientError(
      response.status,
      error?.code ?? "REQUEST_FAILED",
      error?.message ?? "Error al procesar la solicitud",
      error?.details
    );
  }

  return body.data;
}
