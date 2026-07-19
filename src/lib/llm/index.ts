/**
 * Fábrica de proveedor LLM. Usa Claude (Anthropic) si hay ANTHROPIC_API_KEY;
 * de lo contrario cae a un generador de plantilla determinística para que la app
 * funcione de extremo a extremo sin clave.
 */
import { AnthropicProvider } from './anthropic';
import type { LLMProvider } from './provider';
import { TemplateProvider } from './template';

let cached: LLMProvider | null = null;

export function getLLMProvider(): LLMProvider {
  if (cached) return cached;
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (key) {
    cached = new AnthropicProvider(key);
  } else {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        '[MiPeticion] ANTHROPIC_API_KEY no configurada: se usa el generador de plantilla determinística.',
      );
    }
    cached = new TemplateProvider();
  }
  return cached;
}

export type { GenerarParams, LLMProvider } from './provider';
