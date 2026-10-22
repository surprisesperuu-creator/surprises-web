import { ApiErrors } from "@/lib/api/errors";

/**
 * Opciones para traducir un error de Supabase/PostgREST a un ApiError
 * con el código HTTP correcto.
 */
export interface HandleDatabaseErrorOptions {
  /** Nombre del recurso para los mensajes de "no encontrado". */
  resource?: string;
  /** Mensaje para la violación de UNIQUE (23505). */
  conflictMessage?: string;
  /** Mensaje para la violación de FK (23503). */
  inUseMessage?: string;
}

/**
 * Traduce errores de Supabase/PostgREST a `ApiError` (siempre lanza).
 *
 * Códigos Postgres manejados:
 * - 23505 → UNIQUE violation       → 409 CONFLICT (p. ej. slug duplicado)
 * - 23503 → FK violation           → 409 CONFLICT (p. ej. categoría en uso)
 * - 23502 → NOT NULL violation     → 400 VALIDATION_ERROR
 * - 22P02 → invalid text/uuid      → 404 NOT_FOUND
 * - PGRST116 → 0 filas             → 404 NOT_FOUND
 */
export function handleDatabaseError(
  error: unknown,
  options: HandleDatabaseErrorOptions = {}
): never {
  const dbError = error as { code?: string; message?: string } | null;
  const { resource = "Recurso", conflictMessage, inUseMessage } = options;

  switch (dbError?.code) {
    case "23505":
      throw ApiErrors.conflict(
        conflictMessage ?? "Ya existe un registro con el mismo valor único"
      );
    case "23503":
      throw ApiErrors.conflict(
        inUseMessage ?? "No se puede eliminar el registro porque está en uso"
      );
    case "23502":
      throw ApiErrors.validation("Falta un campo obligatorio");
    case "22P02":
    case "PGRST116":
      throw ApiErrors.notFound(resource);
    case "42501":
      throw ApiErrors.server(
        `Error de permisos (RLS). Verifica que SUPABASE_SERVICE_ROLE_KEY sea la clave "service_role" (rol: service_role) y no la clave anon. Cámbiala en el panel: Project Settings → API → service_role secret.`
      );
    case "PGRST205":
      throw ApiErrors.server(
        `No existe la tabla "${resource.toLowerCase()}" en Supabase. Ejecuta las migraciones de la carpeta supabase/migrations.`
      );
    default:
      // Error no reconocido: se propaga para que `apiHandler` lo convierta en 500.
      throw error;
  }
}
