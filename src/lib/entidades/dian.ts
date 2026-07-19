/**
 * Primera entrada del directorio: la DIAN.
 *
 * Consolida en un solo lugar lo que es específico de la DIAN (destinatario,
 * canal de radicación, tipos y categorías admitidos). Reutiliza los datos base
 * que ya viven en `@/lib/legal/constants` para no duplicarlos.
 */
import { CATEGORIAS, ENTIDAD_DIAN, PETITION_TIPOS } from "@/lib/legal/constants";
import type { Entidad } from "./types";

export const DIAN: Entidad = {
  slug: "dian",
  nombre: ENTIDAD_DIAN.nombre,
  nombreCorto: ENTIDAD_DIAN.nombreCorto,
  competencia: ENTIDAD_DIAN.competencia,
  nivel: "nacional",
  sector: "tributario-aduanero-cambiario",
  activa: true,
  pqrs: {
    url: ENTIDAD_DIAN.pqrsUrl,
    canal: "Sistema de PQSRD de la DIAN",
    dominioOficial: "dian.gov.co",
    pasos: [
      {
        titulo: "Ten listo tu documento",
        texto:
          "Descarga el PDF que generaste, revísalo y fírmalo (firma manuscrita escaneada o firma tu nombre). Verifica que tu identificación y tus datos de notificación sean correctos.",
      },
      {
        titulo: "Entra al canal PQRSD de la DIAN",
        texto:
          "La DIAN recibe derechos de petición por su Sistema de PQSRD (Peticiones, Quejas, Sugerencias, Reclamos y Denuncias) en su página web.",
      },
      {
        titulo: "Elige el tipo de solicitud correcto",
        texto:
          "Selecciona el tipo que corresponde (petición de interés particular, petición de información, consulta, queja, etc.). Debe coincidir con el tipo que elegiste al generar el documento.",
      },
      {
        titulo: "Adjunta el PDF y envía",
        texto:
          "Diligencia tus datos, adjunta el PDF y radica. El sistema te dará un NÚMERO DE RADICADO y una fecha: guárdalos.",
      },
      {
        titulo: "Guarda el radicado",
        texto:
          "El número de radicado y la fecha son la prueba de tu solicitud. Con ellos podrás hacer seguimiento del término legal (próximamente en MiPeticion) y, si la DIAN no responde a tiempo, preparar una acción de tutela.",
      },
    ],
  },
  // La DIAN admite todos los tipos de solicitud del MVP.
  tiposDisponibles: PETITION_TIPOS.map((t) => t.value),
  categorias: CATEGORIAS,
  // La DIAN se rige por los términos generales de la Ley 1755 (sin excepciones aquí).
  terminoOverrides: {},
};
