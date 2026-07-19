import type { Metadata } from "next";
import { CrearFlow } from "@/components/crear/CrearFlow";

export const metadata: Metadata = {
  title: "Crear derecho de petición — MiPeticion",
  description:
    "Redacta tu derecho de petición a la DIAN en tres pasos y descárgalo listo para firmar y radicar.",
};

export default function CrearPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Crea tu derecho de petición a la DIAN
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Tres pasos: identifícate, cuéntanos tu caso y descarga el documento listo para firmar y
        radicar tú mismo(a).
      </p>
      <div className="mt-6">
        <CrearFlow />
      </div>
    </div>
  );
}
