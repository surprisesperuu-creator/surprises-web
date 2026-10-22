/**
 * Envolvente consistente para todas las respuestas de la API.
 *
 * Éxito:    { "data": <resultado>, "error": null }
 * Error:    { "data": null, "error": { "code", "message", "details"? } }
 */

export interface ApiSuccess<T> {
  data: T;
  error: null;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiFailure {
  data: null;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
