/**
 * Error tipado que lanzan los servicios y que `apiHandler` convierte en una
 * respuesta HTTP con el formato consistente de la API.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** Fábricas de ApiError con los códigos/estados que usa la API. */
export const ApiErrors = {
  /** 400 → datos inválidos. */
  validation: (message: string, details?: unknown) =>
    new ApiError(400, "VALIDATION_ERROR", message, details),

  /** 404 → recurso inexistente. */
  notFound: (resource = "Recurso") =>
    new ApiError(404, "NOT_FOUND", `${resource} no encontrado`),

  /** 401 → sesión administrativa ausente o credenciales inválidas. */
  unauthorized: (message = "No autorizado") =>
    new ApiError(401, "UNAUTHORIZED", message),

  /** 409 → conflicto (p. ej. slug duplicado o registro en uso). */
  conflict: (message: string) => new ApiError(409, "CONFLICT", message),

  /** 500 → error interno o configuración de servidor incompleta. */
  server: (message = "Error interno del servidor") =>
    new ApiError(500, "INTERNAL_ERROR", message),
};
