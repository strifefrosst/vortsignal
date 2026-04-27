import { createClient } from "@/lib/supabase/server";

const validScores = [60, 70, 80];
const validSignalTypes = ["LONG", "SHORT", "WAIT"];
const validRiskLevels = ["LOW", "MEDIUM", "HIGH"];

const defaultSettings = {
  enabled: true,
  watchlist_only: true,
  min_score: 70,
  signal_types: ["LONG", "SHORT"],
  risk_levels: ["LOW", "MEDIUM"],
};

function filterValues(values: FormDataEntryValue[], allowedValues: string[]) {
  return values
    .map((value) => String(value).toUpperCase())
    .filter((value) => allowedValues.includes(value));
}

function parseSettings(formData: FormData) {
  const requestedScore = Number(formData.get("min_score"));
  const signalTypes = filterValues(
    formData.getAll("signal_types"),
    validSignalTypes,
  );
  const riskLevels = filterValues(formData.getAll("risk_levels"), validRiskLevels);

  return {
    enabled: formData.get("enabled") === "true",
    watchlist_only: formData.get("watchlist_only") === "true",
    min_score: validScores.includes(requestedScore) ? requestedScore : 70,
    signal_types: signalTypes.length > 0 ? signalTypes : defaultSettings.signal_types,
    risk_levels: riskLevels.length > 0 ? riskLevels : defaultSettings.risk_levels,
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      {
        error: "Debes iniciar sesión para consultar tus alertas.",
      },
      {
        status: 401,
      },
    );
  }

  const { data, error } = await supabase
    .from("user_alert_settings")
    .select("enabled, watchlist_only, min_score, signal_types, risk_levels")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return Response.json(
      {
        error: "No se pudo leer la configuración de alertas.",
      },
      {
        status: 500,
      },
    );
  }

  return Response.json({
    settings: data ?? defaultSettings,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      {
        error: "Debes iniciar sesión para modificar tus alertas.",
      },
      {
        status: 401,
      },
    );
  }

  let settings;

  try {
    settings = parseSettings(await request.formData());
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

  const { data: existing, error: readError } = await supabase
    .from("user_alert_settings")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (readError) {
    return Response.json(
      {
        error: "No se pudo leer la configuración actual.",
      },
      {
        status: 500,
      },
    );
  }

  const payload = {
    ...settings,
    user_id: user.id,
    updated_at: new Date().toISOString(),
  };
  const result = existing
    ? await supabase
        .from("user_alert_settings")
        .update(payload)
        .eq("user_id", user.id)
    : await supabase.from("user_alert_settings").insert(payload);

  if (result.error) {
    return Response.json(
      {
        error: "No se pudo guardar la configuración de alertas.",
      },
      {
        status: 500,
      },
    );
  }

  return Response.redirect(new URL("/alerts", request.url), 303);
}
