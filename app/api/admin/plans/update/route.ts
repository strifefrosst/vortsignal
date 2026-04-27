import { getAdminSession } from "@/lib/auth/admin";
import { isPlanId, type PlanId } from "@/lib/plans/config";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

async function findUserByEmail(email: string): Promise<User | null> {
  const admin = createAdminClient();
  const normalizedEmail = email.trim().toLowerCase();
  const perPage = 1000;

  for (let page = 1; page <= 5; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const match = data.users.find(
      (user) => user.email?.trim().toLowerCase() === normalizedEmail,
    );

    if (match) {
      return match;
    }

    if (data.users.length < perPage) {
      return null;
    }
  }

  return null;
}

function redirectToAdmin(request: Request, params: Record<string, string>) {
  const url = new URL("/admin/plans", request.url);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return Response.redirect(url, 303);
}

export async function POST(request: Request) {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    return Response.json(
      {
        error: "Debes iniciar sesion para cambiar planes.",
      },
      {
        status: 401,
      },
    );
  }

  if (!isAdmin) {
    return Response.json(
      {
        error: "No tienes permisos para cambiar planes.",
      },
      {
        status: 403,
      },
    );
  }

  let email = "";
  let plan: PlanId | null = null;

  try {
    const formData = await request.formData();
    email = String(formData.get("email") ?? "").trim().toLowerCase();
    const requestedPlan = String(formData.get("plan") ?? "").toUpperCase();
    plan = isPlanId(requestedPlan) ? requestedPlan : null;
  } catch {
    return redirectToAdmin(request, { status: "invalid" });
  }

  if (!email || !plan) {
    return redirectToAdmin(request, { status: "invalid", email });
  }

  try {
    const targetUser = await findUserByEmail(email);

    if (!targetUser) {
      return redirectToAdmin(request, { status: "not-found", email, plan });
    }

    const admin = createAdminClient();
    const { error } = await admin.from("user_plans").upsert(
      {
        user_id: targetUser.id,
        plan,
        status: "active",
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      return redirectToAdmin(request, { status: "error", email, plan });
    }

    return redirectToAdmin(request, { status: "updated", email, plan });
  } catch {
    return redirectToAdmin(request, { status: "error", email, plan });
  }
}
