import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-black tracking-tighter text-emerald-400/20">
          404
        </h1>
        
        <h2 className="mt-4 text-2xl font-bold text-white">
          Página no encontrada
        </h2>
        
        <p className="mt-4 text-sm text-zinc-400">
          La página que buscas no existe o ha sido movida.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 font-semibold text-emerald-200 hover:bg-emerald-400/20 transition-colors"
          >
            <span aria-hidden="true">🏠</span>
            Ir al inicio
          </Link>
          
          <Link
            href="/signals"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
          >
            <span aria-hidden="true">📊</span>
            Señales
          </Link>
          
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
          >
            <span aria-hidden="true">💳</span>
            Planes
          </Link>
        </div>
      </div>
    </div>
  );
}