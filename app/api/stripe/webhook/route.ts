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
        const session = event.data.object as Stripe.Checkout.Session & {
          customer: string | null;
          subscription: string | null;
        };

        // Retrieve full session with expanded customer and subscription
        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ["customer", "subscription"] }
        );

        // Get userId from metadata or client_reference_id
        const userId = fullSession.metadata?.user_id || fullSession.client_reference_id;
        const plan = fullSession.metadata?.plan;

        // Get stripeCustomerId - handle both string and object
        let stripeCustomerId: string | null = null;
        if (fullSession.customer) {
          stripeCustomerId = typeof fullSession.customer === "string"
            ? fullSession.customer
            : fullSession.customer.id;
        }

        // Get stripeSubscriptionId - handle both string and object
        let stripeSubscriptionId: string | null = null;
        if (fullSession.subscription) {
          stripeSubscriptionId = typeof fullSession.subscription === "string"
            ? fullSession.subscription
            : fullSession.subscription.id;
        }

        const hasUserId = !!userId;
        const hasPlan = !!plan && (plan === "PRO" || plan === "ELITE");
        const hasCustomer = !!stripeCustomerId;
        const hasSubscription = !!stripeSubscriptionId;

        // For subscription mode, require customer and subscription
        if (fullSession.mode === "subscription" && (!hasCustomer || !hasSubscription)) {
          console.error("checkout.session.completed: missing customer or subscription for subscription session");
          return NextResponse.json(
            { error: "Missing customer or subscription in subscription session" },
            { status: 500 }
          );
        }

        // If missing userId or plan, return 200 to avoid retrying invalid events
        if (!hasUserId || !hasPlan) {
          console.log(`checkout.session.completed: missing userId=${hasUserId}, plan=${plan || "missing"} - skipping`);
          break;
        }

        const { error: upsertError } = await adminClient
          .from("user_plans")
          .upsert(
            {
              user_id: userId,
              plan: plan,
              status: "active",
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id",
              ignoreDuplicates: false,
            }
          );

        if (upsertError) {
          console.error("checkout.session.completed: Supabase upsert failed:", upsertError);
          return NextResponse.json(
            { error: "Failed to persist user plan" },
            { status: 500 }
          );
        }

        console.log(`checkout.session.completed persisted: userId=${hasUserId}, plan=${plan}, customer=${hasCustomer}, subscription=${hasSubscription}`);
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
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

          if (updateError) {
            console.error("Failed to update subscription:", updateError);
          } else {
            console.log(`Subscription ${subscription.id} updated for user ${userId}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription & {
          id: string;
        };
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const { error: updateError } = await adminClient
            .from("user_plans")
            .update({
              plan: "FREE",
              status: "active",
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

          if (updateError) {
            console.error("Failed to revert to FREE:", updateError);
          } else {
            console.log(`Subscription deleted for user ${userId}, reverted to FREE`);
          }
        } else {
          // Try to find by stripe_subscription_id
          const { data: existingPlan } = await adminClient
            .from("user_plans")
            .select("user_id")
            .eq("stripe_subscription_id", subscription.id)
            .maybeSingle();

          if (existingPlan?.user_id) {
            const { error: updateError } = await adminClient
              .from("user_plans")
              .update({
                plan: "FREE",
                status: "active",
                stripe_subscription_id: null,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", existingPlan.user_id);

            if (updateError) {
              console.error("Failed to revert to FREE:", updateError);
            } else {
              console.log(`Subscription deleted for user ${existingPlan.user_id}, reverted to FREE`);
            }
          } else {
            console.log(`Subscription ${subscription.id} deleted but no user mapping found`);
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