"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Gift,
  LoaderCircle,
  Lock,
  Mail,
} from "lucide-react";

import { useAdminAuth } from "@/lib/admin/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const next: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      next.email = "El email es obligatorio";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      next.email = "Ingresa un email válido";
    }

    if (!password) {
      next.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      next.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/admin");
    } catch {
      setFormError("No se pudo iniciar sesión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text/35 transition-colors focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
        : "border-primary/20 focus:border-primary focus:ring-primary/20"
    }`;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Decoración de fondo con la identidad de Surprises */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-primary/10 bg-white p-8 shadow-xl shadow-primary/5 sm:p-10">
          {/* Marca */}
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/30">
              <Gift className="size-8" />
            </span>
            <h1 className="font-display text-3xl font-semibold text-text">
              Surprises
            </h1>
            <p className="mt-1 text-sm font-medium tracking-wide text-text/50">
              Panel de Administración
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary/50" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="admin@surprises.com"
                  className={inputClass(Boolean(errors.email))}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary/50" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="••••••••"
                  className={`${inputClass(Boolean(errors.password))} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 transition-colors hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderCircle className="size-4 animate-spin" />}
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-text/45">
          © {new Date().getFullYear()} Surprises · Regalos con esencia peruana
        </p>
      </div>
    </div>
  );
}
