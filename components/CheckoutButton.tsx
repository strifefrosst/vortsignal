"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  plan: "PRO" | "ELITE";
  children: React.ReactNode;
}

export default function CheckoutButton({ plan, children }: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Procesando..." : children}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}