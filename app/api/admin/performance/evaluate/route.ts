import { getAdminSession } from "@/lib/auth/admin";
import { evaluateExpiredSignals } from "@/lib/signals/performance";

export async function POST() {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    return Response.json(
      { error: "Debes iniciar sesion para evaluar señales." },
      { status: 401 },
    );
  }

  if (!isAdmin) {
    return Response.json(
      { error: "No tienes permisos para evaluar señales." },
      { status: 403 },
    );
  }

  try {
    const result = await evaluateExpiredSignals();

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al evaluar señales.",
      },
      { status: 500 },
    );
  }
}
