import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
            MP
          </span>
          MiPeticion
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-4">
          <Link href="/guia-dian" className="hidden text-slate-600 hover:text-slate-900 sm:inline">
            Guía DIAN
          </Link>
          <Link href="/privacidad" className="hidden text-slate-600 hover:text-slate-900 sm:inline">
            Privacidad
          </Link>
          <Link
            href="/crear"
            className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
          >
            Crear petición
          </Link>
        </nav>
      </div>
    </header>
  );
}
