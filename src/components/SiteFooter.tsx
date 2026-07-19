import Link from "next/link";
import { DISCLAIMER } from "@/lib/legal/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl space-y-2 px-4 py-6 text-xs text-slate-500">
        <p>{DISCLAIMER}</p>
        <p>
          MiPeticion es una herramienta ciudadana para ejercer el derecho de petición (art. 23
          C.P.; Ley 1755 de 2015). No somos la DIAN ni una entidad pública.{" "}
          <Link href="/privacidad" className="underline hover:text-slate-700">
            Política de tratamiento de datos
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
