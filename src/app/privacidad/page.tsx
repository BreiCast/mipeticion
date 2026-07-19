import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad y tratamiento de datos — MiPeticion",
  description:
    "Política de tratamiento de datos personales de MiPeticion conforme a la Ley 1581 de 2012.",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">
        Política de privacidad y tratamiento de datos
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Conforme a la Ley 1581 de 2012 (habeas data) y normas concordantes.
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base font-semibold text-slate-900">1. Qué datos tratamos</h2>
          <p className="mt-1">
            Para redactar tu derecho de petición usamos tu nombre, tipo y número de documento,
            correo electrónico, ciudad y, opcionalmente, una dirección de notificación, además del
            relato de tu caso. Estos son los datos mínimos necesarios para que el documento sea
            válido (la identificación del peticionario es un requisito legal).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">2. Dónde se guardan</h2>
          <p className="mt-1">
            Mientras solo estás redactando, tus datos permanecen en <strong>tu navegador</strong>{" "}
            (almacenamiento local) y no se guardan en nuestros servidores. El texto de tu caso se
            envía a nuestro servidor únicamente para generar el documento y no se conserva
            asociado a tu identidad. Solo guardaremos tu petición de forma persistente si más
            adelante decides crear una cuenta para hacer seguimiento del plazo.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">3. Para qué los usamos</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Generar y permitirte editar y descargar tu derecho de petición.</li>
            <li>
              Cuando lo actives, calcular el término legal y enviarte recordatorios de vencimiento.
            </li>
          </ul>
          <p className="mt-2">
            No vendemos tus datos ni los compartimos con terceros con fines comerciales.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">4. Tus derechos</h2>
          <p className="mt-1">
            Puedes conocer, actualizar, rectificar y solicitar la supresión de tus datos, y revocar
            la autorización otorgada. Puedes borrar el borrador local en cualquier momento con el
            botón «Empezar de nuevo».
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900">5. Aviso importante</h2>
          <p className="mt-1">
            MiPeticion es una herramienta de apoyo y <strong>no constituye asesoría legal</strong>.
            Revisa y verifica el contenido antes de firmarlo y radicarlo. La radicación la realizas
            tú directamente ante la DIAN; MiPeticion no presenta peticiones en tu nombre.
          </p>
        </section>
      </div>
    </div>
  );
}
