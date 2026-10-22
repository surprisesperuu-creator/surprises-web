import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ApiErrors } from "@/lib/api/errors";

let cachedClient: SupabaseClient | null = null;

/**
 * Cliente de Supabase para operaciones administrativas (SOLO SERVIDOR).
 *
 * Usa la `SUPABASE_SERVICE_ROLE_KEY`, que bypassa RLS y permite crear,
 * editar y eliminar categorías/productos.
 *
 * ⚠️ ADVERTENCIA DE SEGURIDAD:
 * - Nunca importes este módulo desde un componente 'use client'.
 * - Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` al navegador.
 * - Cuando se implemente autenticación, este cliente solo debe usarse
 *   tras verificar la sesión/rol del Admin.
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw ApiErrors.server(
      "Configuración de Supabase incompleta en el servidor"
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedClient;
}
