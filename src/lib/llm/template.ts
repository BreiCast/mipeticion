/**
 * Proveedor de plantilla determinística (sin IA).
 *
 * Se usa como respaldo cuando no hay ANTHROPIC_API_KEY configurada, para que la
 * app funcione de extremo a extremo (generar → editar → PDF) en desarrollo y
 * pruebas. Produce un contenido razonable y estructurado a partir del relato.
 */
import { CATEGORIAS, tipoInfo, type PetitionTipo } from '@/lib/legal/constants';
import type { GeneratedContent } from '@/lib/schema/peticion';
import type { GenerarParams, LLMProvider } from './provider';

/** Divide un texto en frases limpias para usarlas como ítems (hechos/peticiones). */
function dividirEnItems(texto: string, max: number): string[] {
  const items = texto
    .split(/\n+|(?<=[.;])\s+/)
    .map((s) => s.trim().replace(/\s+/g, ' '))
    .filter((s) => s.length > 0)
    .map((s) => (/[.;:!?]$/.test(s) ? s : `${s}.`));
  return items.slice(0, max);
}

function fundamentosPorTipo(tipo: PetitionTipo): string[] {
  const base = [
    'El artículo 23 de la Constitución Política reconoce el derecho de toda persona a presentar peticiones respetuosas a las autoridades y a obtener pronta resolución.',
    'La Ley 1755 de 2015 regula el derecho fundamental de petición y fija los términos dentro de los cuales las autoridades deben resolver de fondo.',
  ];
  if (tipo === 'peticion_informacion') {
    base.push(
      'Al tratarse de una solicitud de información o de documentos, la respuesta debe atender el término especial previsto en la Ley 1755 de 2015 para este tipo de peticiones.',
    );
  } else if (tipo === 'consulta') {
    base.push(
      'Por tratarse de una consulta sobre la interpretación de normas de competencia de la DIAN, aplica el término especial previsto para las consultas en la Ley 1755 de 2015.',
    );
  }
  return base;
}

export class TemplateProvider implements LLMProvider {
  readonly nombre = 'plantilla';

  async generarContenido(params: GenerarParams): Promise<GeneratedContent> {
    const { input, tipo } = params;
    const info = tipoInfo(tipo);
    const categoria =
      CATEGORIAS.find((c) => c.value === input.categoria)?.label ?? input.categoria;

    const hechos = dividirEnItems(input.quePaso, 25);
    const peticiones = dividirEnItems(input.quePides, 15);

    return {
      asunto: `${info.label} — ${categoria}`,
      saludo: 'Respetados señores:',
      cuerpoIntro:
        'En ejercicio del derecho fundamental de petición consagrado en el artículo 23 de la Constitución Política y regulado por la Ley 1755 de 2015, me dirijo respetuosamente a la DIAN para presentar la siguiente solicitud, con fundamento en los hechos y peticiones que expongo a continuación.',
      hechos: hechos.length > 0 ? hechos : ['(Describe aquí los hechos de tu caso.)'],
      fundamentos: fundamentosPorTipo(tipo),
      peticiones:
        peticiones.length > 0 ? peticiones : ['(Describe aquí lo que solicitas.)'],
      dependenciaSugerida: '',
    };
  }
}
