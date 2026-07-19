"use client";

import { useState } from "react";
import { terminoDias, tipoLabel } from "@/lib/legal/constants";
import { documentoATexto } from "@/lib/peticion/texto";
import type { GenerateResponse, PeticionDocument } from "@/lib/schema/peticion";
import { Field, TextArea, TextInput } from "@/components/ui/form";
import { EditableList } from "./EditableList";

export function PeticionPreview({
  documento,
  meta,
  onChange,
  onEditarDatos,
  onReiniciar,
}: {
  documento: PeticionDocument;
  meta: GenerateResponse["meta"] | null;
  onChange: (doc: PeticionDocument) => void;
  onEditarDatos: () => void;
  onReiniciar: () => void;
}) {
  const [descargando, setDescargando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const dias = terminoDias(documento.tipo);

  function update(partial: Partial<PeticionDocument>) {
    onChange({ ...documento, ...partial });
  }

  async function descargarPDF() {
    setDescargando(true);
    setPdfError(null);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documento }),
      });
      if (!res.ok) throw new Error("pdf");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "derecho-de-peticion-DIAN.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setPdfError("No se pudo generar el PDF. Vuelve a intentarlo.");
    } finally {
      setDescargando(false);
    }
  }

  async function copiarTexto() {
    try {
      await navigator.clipboard.writeText(documentoATexto(documento));
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      setPdfError("Tu navegador no permitió copiar. Descarga el PDF.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabecera de acciones */}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-indigo-900">
              {tipoLabel(documento.tipo)}
            </p>
            <p className="text-xs text-indigo-700">
              Término legal: <strong>{dias} días hábiles</strong> (calculado automáticamente según
              el tipo). {meta?.proveedor === "plantilla" && "Generado con plantilla base."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={descargarPDF}
              disabled={descargando}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {descargando && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              Descargar PDF
            </button>
            <button
              type="button"
              onClick={copiarTexto}
              className="rounded-md border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              {copiado ? "¡Copiado!" : "Copiar texto"}
            </button>
          </div>
        </div>
        {pdfError && <p className="mt-2 text-xs text-rose-600">{pdfError}</p>}
      </div>

      {/* Documento editable */}
      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 sm:p-7">
        <p className="text-sm text-slate-500">{documento.ciudadFecha}</p>

        <div className="text-sm text-slate-700">
          <p className="font-medium">Señores</p>
          <p className="font-semibold uppercase">{documento.destinatario.entidad}</p>
          <Field label="Dependencia (opcional)" htmlFor="dependencia">
            <TextInput
              id="dependencia"
              value={documento.destinatario.dependencia ?? ""}
              onChange={(e) =>
                update({
                  destinatario: { ...documento.destinatario, dependencia: e.target.value },
                })
              }
              placeholder="Ej. Dirección Seccional de Impuestos de…"
            />
          </Field>
        </div>

        <Field label="Asunto" htmlFor="asunto">
          <TextInput
            id="asunto"
            value={documento.asunto}
            onChange={(e) => update({ asunto: e.target.value })}
          />
        </Field>

        <Field label="Saludo" htmlFor="saludo">
          <TextInput
            id="saludo"
            value={documento.saludo ?? ""}
            onChange={(e) => update({ saludo: e.target.value })}
          />
        </Field>

        <Field label="Introducción" htmlFor="intro">
          <TextArea
            id="intro"
            rows={3}
            value={documento.cuerpoIntro ?? ""}
            onChange={(e) => update({ cuerpoIntro: e.target.value })}
          />
        </Field>

        <EditableList
          title="Hechos"
          singular="Hecho"
          items={documento.hechos}
          onChange={(hechos) => update({ hechos })}
          help="Los hechos se numeran automáticamente en el documento."
        />

        <EditableList
          title="Fundamentos de derecho"
          singular="Fundamento"
          items={documento.fundamentos}
          onChange={(fundamentos) => update({ fundamentos })}
        />

        <EditableList
          title="Peticiones"
          singular="Petición"
          items={documento.peticiones}
          onChange={(peticiones) => update({ peticiones })}
        />

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Solicitud de respuesta en término (fijado por ley)
          </p>
          <p className="mt-1 text-sm text-slate-700">{documento.solicitudRespuestaTermino}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Notificación — dirección" htmlFor="notifDir">
            <TextInput
              id="notifDir"
              value={documento.notificacion.direccion ?? ""}
              onChange={(e) =>
                update({
                  notificacion: { ...documento.notificacion, direccion: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Notificación — correo" htmlFor="notifCorreo">
            <TextInput
              id="notifCorreo"
              value={documento.notificacion.correo ?? ""}
              onChange={(e) =>
                update({
                  notificacion: { ...documento.notificacion, correo: e.target.value },
                })
              }
            />
          </Field>
        </div>

        <div className="border-t border-slate-200 pt-4 text-sm text-slate-700">
          <p>Atentamente,</p>
          <p className="mt-6 font-medium">{documento.firma.nombre}</p>
          <p className="text-slate-500">{documento.firma.documento}</p>
          <p className="mt-1 text-xs text-slate-400">
            ¿Un dato de identificación está mal?{" "}
            <button type="button" onClick={onEditarDatos} className="underline">
              Editar mis datos
            </button>
            .
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          href="/guia-dian"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          → Cómo radicar esto en la DIAN
        </a>
        <button
          type="button"
          onClick={onReiniciar}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Empezar de nuevo
        </button>
      </div>
    </div>
  );
}
