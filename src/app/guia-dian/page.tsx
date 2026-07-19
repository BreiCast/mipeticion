import type { Metadata } from "next";
import Link from "next/link";
import { DIAN } from "@/lib/entidades";

// Nota (multi-entidad): cuando haya más entidades, esta página pasará a una ruta
// dinámica tipo /guia/[entidad] que lea la entidad del directorio. Hoy usa la DIAN.
const entidad = DIAN;

export const metadata: Metadata = {
  title: `Cómo radicar tu petición en la ${entidad.nombreCorto} — MiPeticion`,
  description: `Guía paso a paso para radicar tu derecho de petición ante la ${entidad.nombreCorto} por el canal de PQRSD.`,
};

export default function GuiaDianPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">
        Cómo radicar tu petición en la {entidad.nombreCorto}
      </h1>
      <p className="mt-2 text-slate-600">
        MiPeticion te ayuda a redactar el documento, pero <strong>tú lo radicas</strong>. Nunca
        presentamos peticiones en tu nombre. Sigue estos pasos:
      </p>

      <ol className="mt-6 space-y-4">
        {entidad.pqrs.pasos.map((p, i) => (
          <li key={i} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {i + 1}
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">{p.titulo}</h2>
              <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-lg border border-indigo-200 bg-indigo-50 p-5">
        <h2 className="font-semibold text-indigo-900">Canal oficial de la {entidad.nombreCorto}</h2>
        <p className="mt-1 text-sm text-indigo-800">
          Radica en el {entidad.pqrs.canal}.
          {entidad.pqrs.dominioOficial && (
            <>
              {" "}
              Verifica siempre que estés en el dominio oficial{" "}
              <span className="font-mono">{entidad.pqrs.dominioOficial}</span>.
            </>
          )}
        </p>
        <a
          href={entidad.pqrs.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Ir al {entidad.pqrs.canal} ↗
        </a>
      </div>

      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p>
          <strong>Recuerda:</strong> el término legal de respuesta corre a partir del día
          siguiente a la radicación, en días hábiles. Si la {entidad.nombreCorto} no responde de
          fondo y a tiempo, puede haber una violación al derecho de petición que se protege
          mediante acción de tutela (art. 86 C.P.; Decreto 2591 de 1991).
        </p>
      </div>

      <div className="mt-8">
        <Link href="/crear" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
          ← Volver a crear mi petición
        </Link>
      </div>
    </div>
  );
}
