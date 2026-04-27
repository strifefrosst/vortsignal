import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      {
        error: "Debes iniciar sesión para modificar tus notificaciones.",
      },
      {
        status: 401,
      },
    );
  }

  let notificationId = "";

  try {
    const formData = await request.formData();
    notificationId = String(formData.get("notification_id") ?? "");
  } catch {
    return Response.json(
      {
        error: "Solicitud inválida.",
      },
      {
        status: 400,
      },
    );
  }

  if (!notificationId) {
    return Response.json(
      {
        error: "Notificación no válida.",
      },
      {
        status: 400,
      },
    );
  }

  const { error } = await supabase
    .from("user_notifications")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    return Response.json(
      {
        error: "No se pudo marcar la notificación como leída.",
      },
      {
        status: 500,
      },
    );
  }

  return Response.redirect(new URL("/alerts", request.url), 303);
}
