"use client";

import { useState } from "react";
import {
  CATEGORIAS,
  PETITION_TIPOS,
  categoriaInfo,
  tipoInfo,
} from "@/lib/legal/constants";
import { Field, Select, TextArea } from "@/components/ui/form";
import type { ProblemaData } from "@/lib/peticion/storage";

export function ProblemaStep({
  value,
  onChange,
  onBack,
  onSubmit,
  loading,
  error,
}: {
  value: ProblemaData;
  onChange: (v: ProblemaData) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof ProblemaData, string>>>({});

  function set<K extends keyof ProblemaData>(key: K, v: ProblemaData[K]) {
    onChange({ ...value, [key]: v });
  }

  function onCategoria(cat: string) {
    const info = categoriaInfo(cat);
    onChange({
      ...value,
      categoria: cat,
      // Sugerimos el tipo según la categoría; el usuario puede cambiarlo abajo.
      tipoSugerido: info?.tipoSugerido ?? value.tipoSugerido,
    });
  }

  function validar(): boolean {
    const e: Partial<Record<keyof ProblemaData, string>> = {};
    if (!value.categoria) e.categoria = "Elige una categoría.";
    if (value.quePaso.trim().length < 20) e.quePaso = "Cuéntanos con un poco más de detalle.";
    if (value.quePides.trim().length < 10) e.quePides = "Describe concretamente qué solicitas.";
    if (!value.aceptaVeracidad) e.aceptaVeracidad = "Debes declarar que la información es veraz.";
    if (!value.aceptaTratamientoDatos)
      e.aceptaTratamientoDatos = "Debes autorizar el tratamiento de tus datos.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const tipoActual = tipoInfo(value.tipoSugerido);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">2. Tu problema</h2>
        <p className="text-sm text-slate-600">
          Cuéntanos qué pasó y qué necesitas. Con esto redactaremos el documento; luego podrás
          revisarlo y editarlo.
        </p>
      </div>

      <Field label="Categoría del problema" htmlFor="categoria" required error={errors.categoria}>
        <Select
          id="categoria"
          value={value.categoria}
          onChange={(e) => onCategoria(e.target.value)}
        >
          <option value="">Selecciona una categoría…</option>
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Tipo de solicitud"
        htmlFor="tipo"
        hint={tipoActual.descripcion}
      >
        <Select
          id="tipo"
          value={value.tipoSugerido}
          onChange={(e) => set("tipoSugerido", e.target.value as ProblemaData["tipoSugerido"])}
        >
          {PETITION_TIPOS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label} ({t.termDays} días hábiles)
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="¿Qué pasó?"
        htmlFor="quePaso"
        required
        error={errors.quePaso}
        hint="Describe los hechos: fechas, radicados, trámites, lo que ocurrió. Entre más claro, mejor."
      >
        <TextArea
          id="quePaso"
          rows={6}
          value={value.quePaso}
          onChange={(e) => set("quePaso", e.target.value)}
          placeholder="Ej. El 3 de marzo presenté la solicitud de devolución del saldo a favor de mi declaración de renta 2024, con radicado N.º… A la fecha no he recibido respuesta…"
        />
      </Field>

      <Field
        label="¿Qué le pides a la DIAN?"
        htmlFor="quePides"
        required
        error={errors.quePides}
        hint="Sé concreto: qué quieres que haga o resuelva la entidad."
      >
        <TextArea
          id="quePides"
          rows={4}
          value={value.quePides}
          onChange={(e) => set("quePides", e.target.value)}
          placeholder="Ej. Que se resuelva de fondo mi solicitud de devolución y se me informe el estado del trámite y la fecha estimada de pago."
        />
      </Field>

      <div className="space-y-2 rounded-md bg-slate-50 p-3">
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={value.aceptaVeracidad}
            onChange={(e) => set("aceptaVeracidad", e.target.checked)}
          />
          <span>
            Declaro que la información que proporciono es veraz y corresponde a hechos reales.
          </span>
        </label>
        {errors.aceptaVeracidad && (
          <p className="text-xs text-rose-600">{errors.aceptaVeracidad}</p>
        )}
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={value.aceptaTratamientoDatos}
            onChange={(e) => set("aceptaTratamientoDatos", e.target.checked)}
          />
          <span>
            Autorizo el tratamiento de mis datos personales conforme a la{" "}
            <a href="/privacidad" target="_blank" className="underline">
              política de privacidad
            </a>{" "}
            (Ley 1581 de 2012).
          </span>
        </label>
        {errors.aceptaTratamientoDatos && (
          <p className="text-xs text-rose-600">{errors.aceptaTratamientoDatos}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
        >
          ← Volver
        </button>
        <button
          type="button"
          onClick={() => {
            if (validar()) onSubmit();
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {loading ? "Redactando…" : "Generar mi derecho de petición"}
        </button>
      </div>
    </div>
  );
}
