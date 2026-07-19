/**
 * Esquemas Zod: entrada del intake, contenido generado por la IA y documento
 * final. La validación con Zod es la fuente de verdad; el JSON Schema que se le
 * pasa al modelo (lib/llm/json-schema.ts) solo guía la generación.
 */
import { z } from 'zod';

export const docTypeSchema = z.enum(['CC', 'NIT', 'CE', 'PASAPORTE', 'TI']);

export const petitionTipoSchema = z.enum([
  'peticion_interes_particular',
  'peticion_interes_general',
  'peticion_informacion',
  'consulta',
  'queja',
  'reclamo',
  'sugerencia',
  'denuncia',
]);

export const peticionarioSchema = z.object({
  nombre: z.string().trim().min(3, 'Ingresa tu nombre completo.').max(160),
  docType: docTypeSchema,
  docNumber: z.string().trim().min(3, 'Ingresa el número de documento.').max(40),
  correo: z.string().trim().email('Ingresa un correo válido.').max(160),
  ciudad: z.string().trim().min(2, 'Ingresa tu ciudad.').max(80),
  direccionNotificacion: z.string().trim().max(200).optional().default(''),
});
export type Peticionario = z.infer<typeof peticionarioSchema>;

/** Entrada que el cliente envía a /api/generate. */
export const intakeInputSchema = z.object({
  peticionario: peticionarioSchema,
  categoria: z.string().min(1).max(60),
  tipoSugerido: petitionTipoSchema.optional(),
  quePaso: z
    .string()
    .trim()
    .min(20, 'Cuéntanos con un poco más de detalle qué pasó.')
    .max(4000),
  quePides: z
    .string()
    .trim()
    .min(10, 'Describe concretamente qué le pides a la DIAN.')
    .max(2000),
  aceptaVeracidad: z
    .boolean()
    .refine((v) => v === true, 'Debes declarar que la información es veraz.'),
  aceptaTratamientoDatos: z
    .boolean()
    .refine((v) => v === true, 'Debes autorizar el tratamiento de tus datos.'),
});
export type IntakeInput = z.infer<typeof intakeInputSchema>;

/** Lo que produce el modelo (solo el contenido "creativo"; el resto lo fija el código). */
export const generatedContentSchema = z.object({
  asunto: z.string().trim().min(3).max(240),
  saludo: z.string().trim().max(200).optional().default(''),
  cuerpoIntro: z.string().trim().max(1200).optional().default(''),
  hechos: z.array(z.string().trim().min(1).max(1200)).min(1).max(40),
  fundamentos: z.array(z.string().trim().min(1).max(1200)).min(1).max(20),
  peticiones: z.array(z.string().trim().min(1).max(1200)).min(1).max(20),
  dependenciaSugerida: z.string().trim().max(160).optional().default(''),
});
export type GeneratedContent = z.infer<typeof generatedContentSchema>;

/** Documento estructurado final del derecho de petición. */
export const peticionDocumentSchema = z.object({
  tipo: petitionTipoSchema,
  ciudadFecha: z.string().min(3).max(120),
  destinatario: z.object({
    entidad: z.string().min(3).max(160),
    dependencia: z.string().max(160).optional().default(''),
    ciudad: z.string().max(80).optional().default(''),
  }),
  asunto: z.string().min(3).max(240),
  peticionario: z.object({
    nombre: z.string().min(1).max(160),
    docType: docTypeSchema,
    docNumber: z.string().min(1).max(40),
    direccionNotificacion: z.string().max(200).optional().default(''),
    correo: z.string().max(160),
    ciudad: z.string().max(80).optional().default(''),
  }),
  saludo: z.string().max(200).optional().default(''),
  cuerpoIntro: z.string().max(1200).optional().default(''),
  hechos: z.array(z.string().min(1)).min(1).max(40),
  fundamentos: z.array(z.string().min(1)).min(1).max(20),
  peticiones: z.array(z.string().min(1)).min(1).max(20),
  solicitudRespuestaTermino: z.string().min(3).max(800),
  notificacion: z.object({
    direccion: z.string().max(200).optional().default(''),
    correo: z.string().max(160).optional().default(''),
  }),
  firma: z.object({
    nombre: z.string().min(1).max(160),
    documento: z.string().min(1).max(120),
  }),
});
export type PeticionDocument = z.infer<typeof peticionDocumentSchema>;

/** Respuesta de /api/generate. */
export const generateResponseSchema = z.object({
  documento: peticionDocumentSchema,
  meta: z.object({
    tipo: petitionTipoSchema,
    tipoLabel: z.string(),
    terminoDias: z.number(),
    proveedor: z.string(),
  }),
});
export type GenerateResponse = z.infer<typeof generateResponseSchema>;
