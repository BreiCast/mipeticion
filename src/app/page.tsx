import Link from "next/link";
import { PETITION_TIPOS } from "@/lib/legal/constants";

const PASOS = [
  {
    n: 1,
    titulo: "Cuéntanos tu caso",
    texto:
      "Escribe en tus palabras qué pasó con la DIAN y qué necesitas. Sin lenguaje legal.",
  },
  {
    n: 2,
    titulo: "Generamos el documento",
    texto:
      "Convertimos tu problema en un derecho de petición formal, con hechos, fundamentos y peticiones.",
  },
  {
    n: 3,
    titulo: "Revisa y descarga",
    texto: "Editas lo que quieras, descargas el PDF y lo radicas tú mismo(a) en la DIAN.",
  },
  {
    n: 4,
    titulo: "Seguimiento del plazo",
    texto:
      "Registras el radicado y te avisamos del término legal. Si no responden, generamos un borrador de tutela. (Próximamente)",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold text-indigo-600">
            Derecho de petición · Art. 23 C.P. · Ley 1755 de 2015
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Exige una respuesta formal de la DIAN, sin abogado.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            El derecho de petición te permite exigir a la DIAN una respuesta en un plazo legal.
            MiPeticion convierte tu problema en un documento correcto, listo para que lo firmes y
            radiques.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/crear"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Crear mi derecho de petición
            </Link>
            <Link
              href="/guia-dian"
              className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cómo se radica en la DIAN
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Gratis y sin cuenta para generar y descargar. No es asesoría legal.
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-xl font-bold text-slate-900">Cómo funciona</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((p) => (
            <div key={p.n} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {p.n}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{p.titulo}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Términos legales */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-xl font-bold text-slate-900">
            Plazos según el tipo de petición
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Calculamos el vencimiento en días hábiles (excluyendo fines de semana y festivos de
            Colombia), conforme a la Ley 1755 de 2015.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-4 font-medium">Tipo de solicitud</th>
                  <th className="py-2 pr-4 font-medium">Término</th>
                </tr>
              </thead>
              <tbody>
                {PETITION_TIPOS.map((t) => (
                  <tr key={t.value} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-800">{t.label}</td>
                    <td className="py-2 pr-4 font-medium text-slate-900">
                      {t.termDays} días hábiles
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            El término lo determina el tipo de solicitud, no el texto: MiPeticion lo fija
            automáticamente.
          </p>
        </div>
      </section>
    </div>
  );
}
