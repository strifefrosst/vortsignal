import { getAdminSession } from "@/lib/auth/admin";
import { generateSignals } from "@/lib/signals/generate";

export async function POST() {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    return Response.json(
      {
        error: "Debes iniciar sesion para generar señales.",
      },
      {
        status: 401,
      },
    );
  }

  if (!isAdmin) {
    return Response.json(
      {
        error: "No tienes permisos para generar señales.",
      },
      {
        status: 403,
      },
    );
  }

  if (!process.env.SUPABASE_SECRET_KEY) {
    return Response.json(
      {
        error: "Falta configuracion segura de Supabase para generar señales.",
      },
      {
        status: 500,
      },
    );
  }

  try {
    const result = await generateSignals("admin");

    return Response.json(result);
  } catch {
    return Response.json(
      {
        error: "No se pudieron generar las señales de mercado.",
      },
      {
        status: 502,
      },
    );
  }
}
