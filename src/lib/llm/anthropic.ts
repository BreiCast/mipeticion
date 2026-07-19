/**
 * Proveedor de generación con Claude (Anthropic). SOLO servidor: la API key
 * nunca debe llegar al cliente. Fuerza salida estructurada vía tool use y valida
 * el resultado con Zod.
 */
import Anthropic from '@anthropic-ai/sdk';
import { generatedContentSchema, type GeneratedContent } from '@/lib/schema/peticion';
import { CONTENT_TOOL_SCHEMA, TOOL_NAME } from './json-schema';
import { SYSTEM_PROMPT, construirMensajeUsuario } from './prompt';
import type { GenerarParams, LLMProvider } from './provider';

const DEFAULT_MODEL = 'claude-sonnet-5';

export class AnthropicProvider implements LLMProvider {
  readonly nombre = 'anthropic';
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(apiKey: string, model: string = process.env.LLM_MODEL || DEFAULT_MODEL) {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generarContenido({ input, tipo }: GenerarParams): Promise<GeneratedContent> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: construirMensajeUsuario(input, tipo) }],
      tools: [
        {
          name: TOOL_NAME,
          description: 'Entrega el contenido estructurado del derecho de petición.',
          input_schema: CONTENT_TOOL_SCHEMA as unknown as Anthropic.Messages.Tool.InputSchema,
        },
      ],
      tool_choice: { type: 'tool', name: TOOL_NAME },
    });

    const toolUse = message.content.find((block) => block.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('El modelo no devolvió el contenido estructurado esperado.');
    }
    return generatedContentSchema.parse(toolUse.input);
  }
}
