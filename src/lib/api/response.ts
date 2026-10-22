import type { ApiErrorBody, ApiSuccess } from "@/types/api";

/**
 * Respuesta exitosa con el envolvente estándar:
 * `{ data, error: null }`.
 */
export function success<T>(data: T, status = 200): Response {
  return Response.json({ data, error: null } satisfies ApiSuccess<T>, { status });
}

/**
 * Respuesta de error con el envolvente estándar:
 * `{ data: null, error: { code, message, details? } }`.
 */
export function failure(
  status: number,
  code: string,
  message: string,
  details?: unknown
): Response {
  const body: ApiErrorBody = { code, message };

  if (details !== undefined) {
    body.details = details;
  }

  return Response.json({ data: null, error: body }, { status });
}
