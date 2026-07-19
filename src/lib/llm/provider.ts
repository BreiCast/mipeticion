import type { PetitionTipo } from '@/lib/legal/constants';
import type { GeneratedContent, IntakeInput } from '@/lib/schema/peticion';

export interface GenerarParams {
  input: IntakeInput;
  tipo: PetitionTipo;
  terminoDias: number;
}

/** Contrato de un proveedor de generación de contenido de peticiones. */
export interface LLMProvider {
  readonly nombre: string;
  generarContenido(params: GenerarParams): Promise<GeneratedContent>;
}
