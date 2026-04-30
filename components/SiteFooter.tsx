import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link 
              href="/" 
              className="text-lg font-bold tracking-tight text-emerald-400"
            >
              VortSignal
            </Link>
            <p className="text-xs text-zinc-500">
              Señales crypto con análisis técnico
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link 
              href="/disclaimer" 
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              Disclaimer
            </Link>
            <Link 
              href="/terms" 
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              Términos
            </Link>
            <Link 
              href="/privacy" 
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              Privacidad
            </Link>
            <Link 
              href="/contact" 
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              Contacto
            </Link>
          </nav>
        </div>

        <div className="mt-6 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-zinc-600">
            © {currentYear} VortSignal. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}