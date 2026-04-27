import { getEnabledAssets } from "@/lib/config/assets";
import { createClient } from "@/lib/supabase/server";

function isEnabledSymbol(symbol: string) {
  return getEnabledAssets().some((asset) => asset.symbol === symbol);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      {
        error: "Debes iniciar sesión para modificar tu watchlist.",
      },
      {
        status: 401,
      },
    );
  }

  let symbol = "";

  try {
    const formData = await request.formData();
    symbol = String(formData.get("symbol") ?? "").toUpperCase();
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

  if (!isEnabledSymbol(symbol)) {
    return Response.json(
      {
        error: "Activo no soportado.",
      },
      {
        status: 400,
      },
    );
  }

  const { data: existing, error: readError } = await supabase
    .from("user_watchlist")
    .select("symbol")
    .eq("user_id", user.id)
    .eq("symbol", symbol)
    .maybeSingle();

  if (readError) {
    return Response.json(
      {
        error: "No se pudo leer tu watchlist.",
      },
      {
        status: 500,
      },
    );
  }

  if (existing) {
    const { error } = await supabase
      .from("user_watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("symbol", symbol);

    if (error) {
      return Response.json(
        {
          error: "No se pudo quitar el activo.",
        },
        {
          status: 500,
        },
      );
    }

    return Response.redirect(new URL("/watchlist", request.url), 303);
  }

  const { error } = await supabase.from("user_watchlist").insert({
    user_id: user.id,
    symbol,
  });

  if (error) {
    return Response.json(
      {
        error: "No se pudo añadir el activo.",
      },
      {
        status: 500,
      },
    );
  }

  return Response.redirect(new URL("/watchlist", request.url), 303);
}
