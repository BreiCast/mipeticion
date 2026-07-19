/**
 * Directorio (registro) de entidades públicas.
 *
 * Hoy solo la DIAN está activa. Para agregar una entidad: crea su archivo (p. ej.
 * `supersalud.ts`) exportando un `Entidad`, e inclúyelo en `ENTIDADES`. El resto
 * del sistema (términos, generación, PDF, tutela) ya es genérico y la tomará.
 */
import { terminoDias, type PetitionTipo } from "@/lib/legal/constants";
import { DIAN } from "./dian";
import type { Entidad } from "./types";

/** Todas las entidades registradas (activas y próximas). */
export const ENTIDADES: Entidad[] = [DIAN];

const POR_SLUG = new Map<string, Entidad>(ENTIDADES.map((e) => [e.slug, e]));

/** Slug de la entidad por defecto del MVP. */
export const ENTIDAD_POR_DEFECTO_SLUG = "dian";

export function getEntidad(slug: string): Entidad | undefined {
  return POR_SLUG.get(slug);
}

export function entidadPorDefecto(): Entidad {
  return DIAN;
}

export function listarEntidades(): Entidad[] {
  return ENTIDADES;
}

/** Entidades disponibles en el producto (excluye las marcadas como próximamente). */
export function listarEntidadesActivas(): Entidad[] {
  return ENTIDADES.filter((e) => e.activa);
}

/**
 * Término en días hábiles para una (entidad, tipo). Usa la excepción de la
 * entidad si existe; de lo contrario, el término general de la Ley 1755 de 2015.
 */
export function terminoParaEntidad(entidad: Entidad, tipo: PetitionTipo): number {
  return entidad.terminoOverrides?.[tipo] ?? terminoDias(tipo);
}

export { DIAN } from "./dian";
export type { CanalPqrs, Entidad, NivelGobierno, PasoRadicacion } from "./types";
