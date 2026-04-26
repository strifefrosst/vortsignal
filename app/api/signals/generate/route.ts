import { generateSignals } from "@/lib/signals/generate";

function isAuthorized(request: Request, secret: string) {
  const authorization = request.headers.get("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  return scheme === "Bearer" && token === secret;
}

export async function POST(request: Request) {
  const generateSecret = process.env.SIGNALS_GENERATE_SECRET;

  if (!generateSecret) {
    return Response.json(
      {
        error: "Falta configuracion segura para generar señales.",
      },
      {
        status: 500,
      },
    );
  }

  if (!isAuthorized(request, generateSecret)) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
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
    const result = await generateSignals("external");

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
