"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BillingPortalButtonProps {
  children: React.ReactNode;
}

export default function BillingPortalButton({
  children,
}: BillingPortalButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePortal = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al abrir portal de facturación");
      }

      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error("No se recibió URL del portal");
      }
    } catch (err) {
      console.error("Portal error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePortal}
        disabled={loading}
        className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Cargando..." : children}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}