/**
 * Ensambla el documento final del derecho de petición a partir del contenido
 * generado por la IA y de los datos del intake.
 *
 * Aquí viven los campos AUTORITATIVOS que NO dependen del modelo:
 *  - `tipo` (elegido por el usuario / categoría)
 *  - identificación del peticionario y firma (copiados del intake)
 *  - entidad destinataria (siempre la DIAN en el MVP)
 *  - la frase del término legal (construida con el número que fija el código)
 *  - un fundamento canónico (Art. 23 C.P. + Ley 1755 de 2015) siempre presente
 */
import {
  DocType,
  ENTIDAD_DIAN,
  PetitionTipo,
  docTypeLabel,
  terminoDias,
} from '@/lib/legal/constants';
import type {
  GeneratedContent,
  IntakeInput,
  PeticionDocument,
} from '@/lib/schema/peticion';

const FUNDAMENTO_CANONICO =
  'El artículo 23 de la Constitución Política consagra el derecho fundamental de petición. La Ley 1755 de 2015 regula su ejercicio y fija los términos de respuesta a cargo de las autoridades, entre ellas la DIAN.';

export function fraseTermino(dias: number): string {
  return (
    `Solicito que se resuelva de fondo esta petición y se me notifique la respuesta ` +
    `dentro del término legal de ${dias} días hábiles, contados a partir del día siguiente ` +
    `a su radicación, de conformidad con la Ley 1755 de 2015. En caso de no recibir ` +
    `respuesta oportuna, de fondo y congruente, acudiré a la acción de tutela para la ` +
    `protección de mi derecho fundamental de petición (art. 23 C.P.; Decreto 2591 de 1991).`
  );
}

export function firmaDocumento(docType: DocType, docNumber: string): string {
  return `${docTypeLabel(docType)} No. ${docNumber}`;
}

/** Garantiza que el fundamento canónico esté presente (una sola vez). */
function conFundamentoCanonico(fundamentos: string[]): string[] {
  const yaCita = fundamentos.some((f) => /1755/.test(f) && /petici/i.test(f));
  return yaCita ? fundamentos : [FUNDAMENTO_CANONICO, ...fundamentos];
}

export interface EnsamblarParams {
  input: IntakeInput;
  tipo: PetitionTipo;
  content: GeneratedContent;
  ciudadFecha: string;
}

export function ensamblarPeticion({
  input,
  tipo,
  content,
  ciudadFecha,
}: EnsamblarParams): PeticionDocument {
  const { peticionario } = input;
  const dias = terminoDias(tipo);

  return {
    tipo,
    ciudadFecha,
    destinatario: {
      entidad: ENTIDAD_DIAN.nombre,
      dependencia: content.dependenciaSugerida ?? '',
      ciudad: peticionario.ciudad,
    },
    asunto: content.asunto,
    peticionario: {
      nombre: peticionario.nombre,
      docType: peticionario.docType,
      docNumber: peticionario.docNumber,
      direccionNotificacion: peticionario.direccionNotificacion ?? '',
      correo: peticionario.correo,
      ciudad: peticionario.ciudad,
    },
    saludo: content.saludo || 'Respetados señores:',
    cuerpoIntro: content.cuerpoIntro ?? '',
    hechos: content.hechos,
    fundamentos: conFundamentoCanonico(content.fundamentos),
    peticiones: content.peticiones,
    solicitudRespuestaTermino: fraseTermino(dias),
    notificacion: {
      direccion: peticionario.direccionNotificacion ?? '',
      correo: peticionario.correo,
    },
    firma: {
      nombre: peticionario.nombre,
      documento: firmaDocumento(peticionario.docType, peticionario.docNumber),
    },
  };
}

/** Resuelve el tipo definitivo: preferencia del usuario, luego categoría, luego default. */
export function resolverTipo(input: IntakeInput): PetitionTipo {
  if (input.tipoSugerido) return input.tipoSugerido;
  return 'peticion_interes_particular';
}
