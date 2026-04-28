import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;

        if (userId && (plan === "PRO" || plan === "ELITE")) {
          const { data, error: upsertError } = await adminClient
            .from("user_plans")
            .upsert(
              {
                user_id: userId,
                plan: plan,
                status: "active",
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: "user_id",
                ignoreDuplicates: false,
              }
            );

          if (upsertError) {
            console.error("Failed to upsert user plan:", upsertError);
          } else {
            console.log(`Plan ${plan} activated for user ${userId}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription & {
          current_period_end: number;
        };
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const status =
            subscription.status === "active" || subscription.status === "trialing"
              ? "active"
              : subscription.status === "past_due"
                ? "past_due"
                : "inactive";

          const { error: updateError } = await adminClient
            .from("user_plans")
            .update({
              status: status,
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

          if (updateError) {
            console.error("Failed to update subscription:", updateError);
          } else {
            console.log(`Subscription updated for user ${userId}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const { error: updateError } = await adminClient
            .from("user_plans")
            .update({
              plan: "FREE",
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

          if (updateError) {
            console.error("Failed to revert to FREE:", updateError);
          } else {
            console.log(`Subscription deleted for user ${userId}, reverted to FREE`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}