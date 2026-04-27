import "server-only";

import { getDefaultPlanConfig, getPlanConfig, type PlanConfig } from "./config";
import { createClient } from "@/lib/supabase/server";

export type UserPlan = {
  plan: PlanConfig;
  status: string;
  currentPeriodEnd: string | null;
};

type UserPlanRow = {
  plan: string | null;
  status: string | null;
  current_period_end: string | null;
};

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const defaultPlan = getDefaultPlanConfig();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_plans")
      .select("plan, status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return {
        plan: defaultPlan,
        status: "active",
        currentPeriodEnd: null,
      };
    }

    const row = data as UserPlanRow;

    return {
      plan: getPlanConfig(row.plan),
      status: row.status ?? "active",
      currentPeriodEnd: row.current_period_end,
    };
  } catch {
    return {
      plan: defaultPlan,
      status: "active",
      currentPeriodEnd: null,
    };
  }
}
