import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { ApiErrors } from "@/lib/api/errors";
import type { AdminSession } from "@/lib/admin/auth";

export const ADMIN_SESSION_COOKIE = "surprises_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw ApiErrors.server(
      "ADMIN_SESSION_SECRET debe tener al menos 32 caracteres"
    );
  }
  return secret;
}

function getAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) {
    throw ApiErrors.server("Falta configurar ADMIN_EMAIL");
  }
  return email;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function createSessionToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
    })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parseSessionToken(token: string | undefined): AdminSession | null {
  if (!token) {
    return null;
  }

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) {
    return null;
  }

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const data: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    if (
      typeof data !== "object" ||
      data === null ||
      !("email" in data) ||
      typeof data.email !== "string" ||
      !("expiresAt" in data) ||
      typeof data.expiresAt !== "number" ||
      data.expiresAt <= Date.now() ||
      data.email !== getAdminEmail()
    ) {
      return null;
    }

    const name = data.email.split("@")[0] || "Administrador";
    return {
      email: data.email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return parseSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw ApiErrors.unauthorized();
  }
  return session;
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const configuredEmail = getAdminEmail();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) {
    throw ApiErrors.server("Falta configurar ADMIN_PASSWORD");
  }

  const submitted = createHmac("sha256", getSessionSecret())
    .update(`${email.trim().toLowerCase()}\0${password}`)
    .digest();
  const configured = createHmac("sha256", getSessionSecret())
    .update(`${configuredEmail}\0${configuredPassword}`)
    .digest();
  return timingSafeEqual(submitted, configured);
}

export function createAdminSessionCookie(email: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=${createSessionToken(email)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}${secure}`;
}

export function clearAdminSessionCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}
