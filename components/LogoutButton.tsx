import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default function LogoutButton() {
  async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
      >
        Cerrar sesion
      </button>
    </form>
  );
}
