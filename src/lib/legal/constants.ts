/**
 * Constantes de dominio: tipos de documento, tipos de petición (DIAN / Ley 1755
 * de 2015), términos legales y categorías del intake.
 *
 * IMPORTANTE (correctitud legal): el término en días hábiles lo determina el
 * CÓDIGO a partir del `tipo` — nunca se toma del texto generado por la IA.
 */

export type DocType = 'CC' | 'NIT' | 'CE' | 'PASAPORTE' | 'TI';

export const DOC_TYPES: { value: DocType; label: string }[] = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'NIT', label: 'NIT' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de identidad' },
];

export function docTypeLabel(value: DocType): string {
  return DOC_TYPES.find((d) => d.value === value)?.label ?? value;
}

export type PetitionTipo =
  | 'peticion_interes_particular'
  | 'peticion_interes_general'
  | 'peticion_informacion'
  | 'consulta'
  | 'queja'
  | 'reclamo'
  | 'sugerencia'
  | 'denuncia';

export interface TipoInfo {
  value: PetitionTipo;
  label: string;
  /** Término legal en días hábiles (Ley 1755 de 2015). */
  termDays: number;
  descripcion: string;
}

export const PETITION_TIPOS: TipoInfo[] = [
  {
    value: 'peticion_interes_particular',
    label: 'Petición de interés particular',
    termDays: 15,
    descripcion:
      'Solicitas algo que te afecta directamente (una devolución, un trámite, una decisión).',
  },
  {
    value: 'peticion_interes_general',
    label: 'Petición de interés general',
    termDays: 15,
    descripcion: 'Solicitas algo que beneficia a la comunidad, no solo a ti.',
  },
  {
    value: 'peticion_informacion',
    label: 'Petición de información o documentos',
    termDays: 10,
    descripcion:
      'Pides información, copias o documentos. Término más corto: 10 días hábiles.',
  },
  {
    value: 'consulta',
    label: 'Consulta',
    termDays: 30,
    descripcion:
      'Pides el concepto o la interpretación de la DIAN sobre una norma de su competencia.',
  },
  {
    value: 'queja',
    label: 'Queja',
    termDays: 15,
    descripcion:
      'Manifiestas inconformidad por la conducta de un funcionario o por la atención recibida.',
  },
  {
    value: 'reclamo',
    label: 'Reclamo',
    termDays: 15,
    descripcion: 'Reportas la suspensión injustificada o la mala prestación de un servicio.',
  },
  {
    value: 'sugerencia',
    label: 'Sugerencia',
    termDays: 15,
    descripcion: 'Propones una mejora en el servicio o la gestión de la entidad.',
  },
  {
    value: 'denuncia',
    label: 'Denuncia',
    termDays: 15,
    descripcion:
      'Pones en conocimiento una conducta irregular. No debe mezclarse con una petición.',
  },
];

const TERM_BY_TIPO: Record<PetitionTipo, number> = PETITION_TIPOS.reduce(
  (acc, t) => {
    acc[t.value] = t.termDays;
    return acc;
  },
  {} as Record<PetitionTipo, number>,
);

/** Término legal en días hábiles para un tipo de petición. */
export function terminoDias(tipo: PetitionTipo): number {
  return TERM_BY_TIPO[tipo] ?? 15;
}

export function tipoInfo(tipo: PetitionTipo): TipoInfo {
  return PETITION_TIPOS.find((t) => t.value === tipo) ?? PETITION_TIPOS[0];
}

export function tipoLabel(tipo: PetitionTipo): string {
  return tipoInfo(tipo).label;
}

export const ENTIDAD_DIAN = {
  nombre: 'Dirección de Impuestos y Aduanas Nacionales (DIAN)',
  nombreCorto: 'DIAN',
  competencia: 'asuntos tributarios, aduaneros y cambiarios',
  pqrsUrl: 'https://www.dian.gov.co/atencionciudadano/PQSRD/Paginas/PQSR.aspx',
} as const;

export interface CategoriaInfo {
  value: string;
  label: string;
  tipoSugerido: PetitionTipo;
}

export const CATEGORIAS: CategoriaInfo[] = [
  { value: 'devoluciones', label: 'Devolución o compensación de saldos a favor', tipoSugerido: 'peticion_interes_particular' },
  { value: 'rut', label: 'RUT (inscripción, actualización o cancelación)', tipoSugerido: 'peticion_interes_particular' },
  { value: 'declaraciones', label: 'Declaraciones y obligaciones tributarias', tipoSugerido: 'peticion_interes_particular' },
  { value: 'facturacion', label: 'Facturación electrónica', tipoSugerido: 'peticion_interes_particular' },
  { value: 'firma_electronica', label: 'Firma electrónica / instrumento de firma', tipoSugerido: 'peticion_interes_particular' },
  { value: 'cobro_coactivo', label: 'Cobro coactivo, embargos o acuerdos de pago', tipoSugerido: 'peticion_interes_particular' },
  { value: 'informacion', label: 'Solicitud de información o copias de documentos', tipoSugerido: 'peticion_informacion' },
  { value: 'consulta_normativa', label: 'Consulta sobre la interpretación de una norma', tipoSugerido: 'consulta' },
  { value: 'atencion', label: 'Queja por la atención recibida', tipoSugerido: 'queja' },
  { value: 'otro', label: 'Otro', tipoSugerido: 'peticion_interes_particular' },
];

export function categoriaInfo(value: string): CategoriaInfo | undefined {
  return CATEGORIAS.find((c) => c.value === value);
}

export const DISCLAIMER =
  'Esto no es asesoría legal. MiPeticion es una herramienta que te ayuda a redactar; revisa, ajusta y verifica el contenido antes de firmarlo y radicarlo.';
