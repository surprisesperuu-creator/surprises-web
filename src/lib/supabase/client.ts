import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

/**
 * Cliente de Supabase para el NAVEGADOR (anon key pública).
 *
 * Sirve para lecturas públicas desde el frontend (storefront).
 * NO importes este módulo desde código de servidor para operaciones de
 * escritura: para eso usa `@/lib/supabase/server` (service role key).
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  cachedClient = createClient(url, anonKey);
  return cachedClient;
}
