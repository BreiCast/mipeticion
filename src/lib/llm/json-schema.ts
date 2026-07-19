/**
 * JSON Schema para la herramienta que fuerza la salida estructurada del modelo.
 * Es un espejo (simplificado) de `generatedContentSchema` de Zod, que sigue
 * siendo el validador autoritativo tras la generación.
 */
export const TOOL_NAME = 'entregar_contenido_peticion';

export const CONTENT_TOOL_SCHEMA = {
  type: 'object',
  properties: {
    asunto: {
      type: 'string',
      description:
        'Asunto breve del oficio. Ej.: "Derecho de petición — devolución de saldo a favor".',
    },
    saludo: {
      type: 'string',
      description: 'Saludo formal. Ej.: "Respetados señores:".',
    },
    cuerpoIntro: {
      type: 'string',
      description:
        'Párrafo introductorio que presenta el objeto de la petición, sin repetir la identificación del peticionario.',
    },
    hechos: {
      type: 'array',
      description: 'Hechos en afirmaciones claras y numerables, en orden lógico.',
      items: { type: 'string' },
      minItems: 1,
    },
    fundamentos: {
      type: 'array',
      description:
        'Fundamentos de derecho. Incluye el art. 23 C.P. y la Ley 1755 de 2015; no inventes normas.',
      items: { type: 'string' },
      minItems: 1,
    },
    peticiones: {
      type: 'array',
      description: 'Peticiones concretas y accionables.',
      items: { type: 'string' },
      minItems: 1,
    },
    dependenciaSugerida: {
      type: 'string',
      description: 'Dependencia de la DIAN si se conoce; en caso contrario, cadena vacía.',
    },
  },
  required: ['asunto', 'hechos', 'fundamentos', 'peticiones'],
} as const;
