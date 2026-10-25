"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SESSION_API = "/api/admin/auth";

export interface AdminSession {
  email: string;
  name: string;
}

interface AdminAuthContextValue {
  session: AdminSession | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

export function AdminAuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: AdminSession | null;
}) {
  const [session, setSession] = useState<AdminSession | null>(initialSession);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${SESSION_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("No se pudo iniciar sesión");
    }

    const body: { data: AdminSession; error: null } = await response.json();
    setSession(body.data);
  }, []);

  const signOut = useCallback(async () => {
    const response = await fetch(`${SESSION_API}/logout`, { method: "POST" });
    if (!response.ok) {
      throw new Error("No se pudo cerrar sesión");
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
