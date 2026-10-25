import { clearAdminSessionCookie } from "@/lib/admin/session";

export async function POST() {
  return Response.json(
    { data: null, error: null },
    {
      headers: {
        "Cache-Control": "no-store",
        "Set-Cookie": clearAdminSessionCookie(),
      },
    }
  );
}
