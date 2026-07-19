/**
 * Tipos del directorio de entidades públicas.
 *
 * Hoy el MVP tiene una sola entidad (la DIAN), pero la meta es que MiPeticion
 * sirva para presentar PQRSD a cualquier entidad pública de Colombia. Este tipo
 * modela lo que es ESPECÍFICO de cada entidad; lo transversal (términos de la
 * Ley 1755, cálculo de días hábiles, capa LLM, PDF, tutela) permanece genérico.
 */
import type { CategoriaInfo, PetitionTipo } from "@/lib/legal/constants";

/** Nivel de gobierno de la entidad (útil para enrutamiento futuro). */
export type NivelGobierno =
  | "nacional"
  | "departamental"
  | "distrital"
  | "municipal"
  | "otro";

/** Un paso de la guía de radicación propia de la entidad. */
export interface PasoRadicacion {
  titulo: string;
  texto: string;
}

/** Canal oficial de PQRSD de la entidad. */
export interface CanalPqrs {
  /** URL oficial del canal de PQRSD. */
  url: string;
  /** Nombre del canal, para mostrar. Ej.: "Sistema de PQSRD de la DIAN". */
  canal: string;
  /** Dominio oficial para que la persona verifique dónde está radicando. */
  dominioOficial?: string;
  /** Pasos para radicar en esta entidad. */
  pasos: PasoRadicacion[];
}

export interface Entidad {
  /** Identificador estable en minúsculas (se usará en la columna `entity` y en rutas). */
  slug: string;
  /** Nombre completo oficial. */
  nombre: string;
  /** Sigla o nombre corto. */
  nombreCorto: string;
  /** Ámbito de competencia, en lenguaje sencillo. */
  competencia: string;
  nivel: NivelGobierno;
  /** Sector temático para enrutamiento futuro: 'tributario', 'salud', 'servicios-publicos'… */
  sector?: string;
  /** Si está disponible en el producto. `false` = próximamente. */
  activa: boolean;
  /** Canal y guía de radicación. */
  pqrs: CanalPqrs;
  /** Tipos de solicitud que admite la entidad. */
  tiposDisponibles: PetitionTipo[];
  /** Categorías de problema propias de la entidad (para el intake). */
  categorias: CategoriaInfo[];
  /**
   * Excepciones de término en días hábiles por tipo. Vacío = usa los términos
   * generales de la Ley 1755 de 2015. Se reserva para reglas especiales de
   * ciertas entidades; el núcleo del cálculo sigue siendo compartido.
   */
  terminoOverrides?: Partial<Record<PetitionTipo, number>>;
}
