import { z } from "zod";

import { apiHandler } from "@/lib/api/handler";
import { ApiErrors } from "@/lib/api/errors";
import {
  createAdminSessionCookie,
  verifyAdminCredentials,
} from "@/lib/admin/session";

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(1024),
});

export async function POST(request: Request) {
  return apiHandler(async () => {
    let input: unknown;
    try {
      input = await request.json();
    } catch {
      throw ApiErrors.validation("El cuerpo de la solicitud no es válido");
    }

    const credentials = credentialsSchema.safeParse(input);
    if (!credentials.success) {
      throw ApiErrors.validation("Ingresa un email y una contraseña válidos");
    }
    if (!verifyAdminCredentials(credentials.data.email, credentials.data.password)) {
      throw ApiErrors.unauthorized("Email o contraseña incorrectos");
    }

    const email = credentials.data.email.trim().toLowerCase();
    const name = email.split("@")[0] || "Administrador";
    return Response.json(
      { data: { email, name: name.charAt(0).toUpperCase() + name.slice(1) }, error: null },
      {
        headers: {
          "Cache-Control": "no-store",
          "Set-Cookie": createAdminSessionCookie(email),
        },
      }
    );
  });
}
