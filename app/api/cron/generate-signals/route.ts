import { generateSignals } from "@/lib/signals/generate";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request, secret: string) {
  const authorization = request.headers.get("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  return scheme === "Bearer" && token === secret;
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return Response.json(
      {
        error: "Falta configuración segura para ejecutar el cron.",
      },
      {
        status: 500,
      },
    );
  }

  if (!isAuthorized(request, cronSecret)) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const result = await generateSignals();

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
