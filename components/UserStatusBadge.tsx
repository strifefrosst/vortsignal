type UserStatusBadgeProps = {
  role: "admin" | "user";
  plan: "FREE" | "PRO" | "ELITE";
};

const roleStyles = {
  admin: "bg-amber-400/20 text-amber-300 border-amber-400/30",
  user: "bg-zinc-400/20 text-zinc-300 border-zinc-400/30",
};

const planStyles = {
  FREE: "bg-zinc-500/20 text-zinc-300 border-zinc-400/30",
  PRO: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  ELITE: "bg-violet-400/20 text-violet-300 border-violet-400/30",
};

export default function UserStatusBadge({ role, plan }: UserStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleStyles[role]}`}
      >
        {role === "admin" ? "ADMIN" : "USER"}
      </span>
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${planStyles[plan]}`}
      >
        {plan}
      </span>
    </div>
  );
}