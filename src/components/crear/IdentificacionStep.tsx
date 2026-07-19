"use client";

import { useState } from "react";
import { DOC_TYPES } from "@/lib/legal/constants";
import { Field, Select, TextInput } from "@/components/ui/form";
import type { IdentificacionData } from "@/lib/peticion/storage";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function IdentificacionStep({
  value,
  onChange,
  onNext,
}: {
  value: IdentificacionData;
  onChange: (v: IdentificacionData) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof IdentificacionData, string>>>({});

  function set<K extends keyof IdentificacionData>(key: K, v: IdentificacionData[K]) {
    onChange({ ...value, [key]: v });
  }

  function validar(): boolean {
    const e: Partial<Record<keyof IdentificacionData, string>> = {};
    if (value.nombre.trim().length < 3) e.nombre = "Ingresa tu nombre completo.";
    if (value.docNumber.trim().length < 3) e.docNumber = "Ingresa el número de documento.";
    if (!EMAIL_RE.test(value.correo.trim())) e.correo = "Ingresa un correo válido.";
    if (value.ciudad.trim().length < 2) e.ciudad = "Ingresa tu ciudad.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">1. Identificación</h2>
        <p className="text-sm text-slate-600">
          El derecho de petición exige que estés identificado(a). Estos datos van dentro del
          documento; no se envían a ningún servidor hasta que decidas guardar tu petición.
        </p>
      </div>

      <Field label="Nombre completo" htmlFor="nombre" required error={errors.nombre}>
        <TextInput
          id="nombre"
          value={value.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          placeholder="Ej. María Camila Rodríguez Peña"
          autoComplete="name"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Tipo de documento" htmlFor="docType" required>
          <Select
            id="docType"
            value={value.docType}
            onChange={(e) => set("docType", e.target.value as IdentificacionData["docType"])}
          >
            {DOC_TYPES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Número de documento"
          htmlFor="docNumber"
          required
          error={errors.docNumber}
        >
          <TextInput
            id="docNumber"
            value={value.docNumber}
            onChange={(e) => set("docNumber", e.target.value)}
            inputMode="numeric"
            placeholder="Ej. 1012345678"
          />
        </Field>
        <Field label="Ciudad" htmlFor="ciudad" required error={errors.ciudad}>
          <TextInput
            id="ciudad"
            value={value.ciudad}
            onChange={(e) => set("ciudad", e.target.value)}
            placeholder="Ej. Bogotá D.C."
            autoComplete="address-level2"
          />
        </Field>
      </div>

      <Field
        label="Correo electrónico"
        htmlFor="correo"
        required
        error={errors.correo}
        hint="Para notificaciones y, más adelante, para el seguimiento del plazo."
      >
        <TextInput
          id="correo"
          type="email"
          value={value.correo}
          onChange={(e) => set("correo", e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
        />
      </Field>

      <Field
        label="Dirección de notificación (opcional)"
        htmlFor="direccion"
        hint="Dirección física donde deseas recibir notificaciones, si aplica."
      >
        <TextInput
          id="direccion"
          value={value.direccionNotificacion}
          onChange={(e) => set("direccionNotificacion", e.target.value)}
          placeholder="Ej. Calle 00 # 00-00, barrio, ciudad"
          autoComplete="street-address"
        />
      </Field>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => {
            if (validar()) onNext();
          }}
          className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
