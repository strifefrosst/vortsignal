import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Get user plan with stripe_customer_id
    const { data: userPlan, error: planError } = await adminClient
      .from("user_plans")
      .select("plan, stripe_customer_id, stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (planError) {
      console.error("Failed to fetch user plan:", planError);
      return NextResponse.json(
        { error: "Error al obtener tu plan" },
        { status: 500 }
      );
    }

    // Check if user has PRO or ELITE
    if (!userPlan || (userPlan.plan !== "PRO" && userPlan.plan !== "ELITE")) {
      return NextResponse.json(
        { error: "Solo disponible para planes PRO o ELITE" },
        { status: 403 }
      );
    }

    // Check if stripe_customer_id exists
    if (!userPlan.stripe_customer_id) {
      return NextResponse.json(
        {
          error:
            "No se ha encontrado tu información de pago. Por favor, realiza un nuevo checkout o contacta soporte.",
        },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json(
        { error: "Configuración de aplicación incompleta" },
        { status: 500 }
      );
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userPlan.stripe_customer_id,
      return_url: `${appUrl}/account`,
    });

    if (!portalSession.url) {
      return NextResponse.json(
        { error: "Error al crear sesión del portal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}