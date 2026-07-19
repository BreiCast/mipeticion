"use client";

import { useEffect, useState } from "react";
import { firmaDocumento } from "@/lib/peticion/ensamblar";
import {
  cargarBorrador,
  guardarBorrador,
  limpiarBorrador,
  type IdentificacionData,
  type ProblemaData,
} from "@/lib/peticion/storage";
import type { GenerateResponse, PeticionDocument } from "@/lib/schema/peticion";
import { IdentificacionStep } from "./IdentificacionStep";
import { ProblemaStep } from "./ProblemaStep";
import { PeticionPreview } from "@/components/preview/PeticionPreview";

type Step = "identificacion" | "problema" | "preview";

const IDENT_DEFAULT: IdentificacionData = {
  nombre: "",
  docType: "CC",
  docNumber: "",
  correo: "",
  ciudad: "",
  direccionNotificacion: "",
};

const PROBLEMA_DEFAULT: ProblemaData = {
  categoria: "",
  tipoSugerido: "peticion_interes_particular",
  quePaso: "",
  quePides: "",
  aceptaVeracidad: false,
  aceptaTratamientoDatos: false,
};

const STEPS: { key: Step; label: string }[] = [
  { key: "identificacion", label: "Identificación" },
  { key: "problema", label: "Tu problema" },
  { key: "preview", label: "Revisar y descargar" },
];

function aplicarIdentidad(
  doc: PeticionDocument,
  ident: IdentificacionData,
): PeticionDocument {
  return {
    ...doc,
    peticionario: {
      nombre: ident.nombre,
      docType: ident.docType,
      docNumber: ident.docNumber,
      direccionNotificacion: ident.direccionNotificacion,
      correo: ident.correo,
      ciudad: ident.ciudad,
    },
    destinatario: { ...doc.destinatario, ciudad: ident.ciudad },
    notificacion: { direccion: ident.direccionNotificacion, correo: ident.correo },
    firma: { nombre: ident.nombre, documento: firmaDocumento(ident.docType, ident.docNumber) },
  };
}

export function CrearFlow() {
  const [step, setStep] = useState<Step>("identificacion");
  const [ident, setIdent] = useState<IdentificacionData>(IDENT_DEFAULT);
  const [problema, setProblema] = useState<ProblemaData>(PROBLEMA_DEFAULT);
  const [documento, setDocumento] = useState<PeticionDocument | null>(null);
  const [meta, setMeta] = useState<GenerateResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage al montar. El primer render (servidor y primer
  // paint del cliente) usa los valores por defecto para evitar desajustes de
  // hidratación; luego este efecto aplica el borrador guardado.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const b = cargarBorrador();
    if (b) {
      if (b.identificacion) setIdent({ ...IDENT_DEFAULT, ...b.identificacion });
      if (b.problema) setProblema({ ...PROBLEMA_DEFAULT, ...b.problema });
      if (b.documento) {
        setDocumento(b.documento);
        setMeta(b.meta ?? null);
        setStep("preview");
      }
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function irDeIdentificacion() {
    if (documento) {
      // Estamos editando datos de una petición ya generada: aplicar y volver.
      const actualizado = aplicarIdentidad(documento, ident);
      setDocumento(actualizado);
      guardarBorrador({ identificacion: ident, documento: actualizado });
      setStep("preview");
    } else {
      guardarBorrador({ identificacion: ident });
      setStep("problema");
    }
  }

  async function generar() {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        peticionario: {
          nombre: ident.nombre,
          docType: ident.docType,
          docNumber: ident.docNumber,
          correo: ident.correo,
          ciudad: ident.ciudad,
          direccionNotificacion: ident.direccionNotificacion,
        },
        categoria: problema.categoria,
        tipoSugerido: problema.tipoSugerido,
        quePaso: problema.quePaso,
        quePides: problema.quePides,
        aceptaVeracidad: problema.aceptaVeracidad,
        aceptaTratamientoDatos: problema.aceptaTratamientoDatos,
      };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const msg =
          (data as { error?: string } | null)?.error ??
          "No se pudo generar la petición. Intenta de nuevo.";
        setError(msg);
        return;
      }
      const ok = data as GenerateResponse;
      setDocumento(ok.documento);
      setMeta(ok.meta);
      guardarBorrador({ problema, documento: ok.documento, meta: ok.meta });
      setStep("preview");
    } catch {
      setError("Error de red. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function actualizarDocumento(doc: PeticionDocument) {
    setDocumento(doc);
    guardarBorrador({ documento: doc });
  }

  function reiniciar() {
    limpiarBorrador();
    setIdent(IDENT_DEFAULT);
    setProblema(PROBLEMA_DEFAULT);
    setDocumento(null);
    setMeta(null);
    setError(null);
    setStep("identificacion");
  }

  const currentIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <ol className="flex items-center gap-2 text-xs sm:text-sm">
        {STEPS.map((s, i) => {
          const activo = i === currentIndex;
          const hecho = i < currentIndex;
          return (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={[
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  activo
                    ? "bg-indigo-600 text-white"
                    : hecho
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <span className={activo ? "font-medium text-slate-900" : "text-slate-500"}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <span className="mx-1 text-slate-300">→</span>}
            </li>
          );
        })}
      </ol>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {!hydrated ? (
          <p className="text-sm text-slate-400">Cargando…</p>
        ) : step === "identificacion" ? (
          <IdentificacionStep value={ident} onChange={setIdent} onNext={irDeIdentificacion} />
        ) : step === "problema" ? (
          <ProblemaStep
            value={problema}
            onChange={setProblema}
            onBack={() => setStep("identificacion")}
            onSubmit={generar}
            loading={loading}
            error={error}
          />
        ) : documento ? (
          <PeticionPreview
            documento={documento}
            meta={meta}
            onChange={actualizarDocumento}
            onEditarDatos={() => setStep("identificacion")}
            onReiniciar={reiniciar}
          />
        ) : null}
      </div>
    </div>
  );
}
