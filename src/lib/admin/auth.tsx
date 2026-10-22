"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * ============================================================
 * AUTENTICACIÓN DEL ADMIN — PENDIENTE DE SUPABASE AUTH
 * ============================================================
 * El backend todavía NO tiene autenticación real: los endpoints
 * /api/categories y /api/products son públicos en esta fase.
 *
 * Para NO inventar un sistema de autenticación inseguro, este provider
 * NO valida credenciales contra ningún servidor. Guarda una sesión local
 * etiquetada como `isDemo: true` únicamente para poder navegar y probar
 * la interfaz del panel.
 *
 * Cuando se implemente Supabase Auth, reemplazar:
 *   - signIn  → supabase.auth.signInWithPassword({ email, password })
 *   - signOut → supabase.auth.signOut()
 *   - session → sesión verificada en servidor (middleware / cookies HttpOnly)
 *   - el guard de rutas debe validar la sesión en el servidor, no en cliente.
 * ============================================================
 */

const STORAGE_KEY = "surprises_admin_session";

export interface AdminSession {
  email: string;
  name: string;
  isDemo: boolean;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

function readStoredSession(): AdminSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed && typeof parsed.email === "string" && parsed.isDemo) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(readStoredSession);

  const signIn = useCallback(async (email: string, password: string) => {
    // El modo demo NO valida la contraseña en un servidor; solo exige que esté
    // presente como salvaguarda (la validación fuerte llegará con Supabase Auth).
    if (!password) {
      throw new Error("La contraseña es obligatoria");
    }

    // @TODO(Supabase Auth): reemplazar por supabase.auth.signInWithPassword({ email, password })
    // y persistir la sesión real (JWT) en cookies HttpOnly desde el servidor.
    //
    // Mientras tanto, un pequeño retraso simula la llamada de red para que
    // la UI muestre el estado de loading de forma realista.
    await new Promise((resolve) => setTimeout(resolve, 600));

    const localPart = email.split("@")[0] || "Administrador";
    const demoSession: AdminSession = {
      email,
      name: localPart.charAt(0).toUpperCase() + localPart.slice(1),
      isDemo: true,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoSession));
    } catch {
      // localStorage no disponible: la sesión se mantiene en memoria.
    }
    setSession(demoSession);
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, signIn, signOut }),
    [session, signIn, signOut]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth debe usarse dentro de <AdminAuthProvider>");
  }
  return context;
}
