/**
 * Festivos oficiales de Colombia, calculados por algoritmo (no tabla estática).
 *
 * Reglas:
 *  - Fijos (no se trasladan): Año Nuevo, Día del Trabajo, Grito de Independencia
 *    (20 jul), Batalla de Boyacá (7 ago), Inmaculada Concepción (8 dic), Navidad.
 *  - Relativos a Pascua, sin traslado: Jueves y Viernes Santo.
 *  - Relativos a Pascua con los offsets clásicos que ya caen en lunes:
 *    Ascensión (E+43), Corpus Christi (E+64), Sagrado Corazón (E+71).
 *  - Ley Emiliani (Ley 51 de 1983): se trasladan al lunes siguiente si no caen en
 *    lunes: Reyes (6 ene), San José (19 mar), San Pedro y San Pablo (29 jun),
 *    Virgen de Chiquinquirá (9 jul, desde 2026), Asunción (15 ago), Día de la Raza
 *    (12 oct), Todos los Santos (1 nov), Independencia de Cartagena (11 nov).
 *
 * NOTA LEGAL — Virgen de Chiquinquirá: creado por la Ley 2578 de 2026 (sancionada
 * el 1 de junio de 2026), rige desde 2026. Existe una demanda de
 * inconstitucionalidad en curso ante la Corte Constitucional; mientras no haya
 * fallo que suspenda sus efectos, el día se cuenta como festivo. Si la Corte lo
 * tumba, ajustar `CHIQUINQUIRA_DESDE` (ponerlo en un año futuro inalcanzable) o
 * eliminar la entrada correspondiente en `festivosDeColombia`.
 */
import { addUTCDays, toISODate, utcDate } from './date-utils';

/** Primer año en que rige el festivo de la Virgen de Chiquinquirá (Ley 2578/2026). */
export const CHIQUINQUIRA_DESDE = 2026;

/** Domingo de Pascua (algoritmo de Butcher / Meeus, calendario gregoriano). */
export function domingoDePascua(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utcDate(year, month, day);
}

/** Traslada al lunes siguiente si la fecha no cae en lunes (Ley Emiliani). */
export function trasladarALunes(date: Date): Date {
  const dow = date.getUTCDay(); // 0 = domingo … 6 = sábado
  const add = (8 - dow) % 7; // 0 si ya es lunes
  return addUTCDays(date, add);
}

export interface Festivo {
  /** Fecha observada del festivo, 'YYYY-MM-DD'. */
  fecha: string;
  nombre: string;
}

/** Lista de festivos observados de Colombia para el año dado, ordenada por fecha. */
export function festivosDeColombia(year: number): Festivo[] {
  const pascua = domingoDePascua(year);

  const items: { date: Date; nombre: string }[] = [
    // Fijos
    { date: utcDate(year, 1, 1), nombre: 'Año Nuevo' },
    { date: utcDate(year, 5, 1), nombre: 'Día del Trabajo' },
    { date: utcDate(year, 7, 20), nombre: 'Grito de Independencia' },
    { date: utcDate(year, 8, 7), nombre: 'Batalla de Boyacá' },
    { date: utcDate(year, 12, 8), nombre: 'Inmaculada Concepción' },
    { date: utcDate(year, 12, 25), nombre: 'Navidad' },
    // Relativos a Pascua, sin traslado
    { date: addUTCDays(pascua, -3), nombre: 'Jueves Santo' },
    { date: addUTCDays(pascua, -2), nombre: 'Viernes Santo' },
    // Relativos a Pascua (offsets que caen en lunes)
    { date: addUTCDays(pascua, 43), nombre: 'Ascensión del Señor' },
    { date: addUTCDays(pascua, 64), nombre: 'Corpus Christi' },
    { date: addUTCDays(pascua, 71), nombre: 'Sagrado Corazón de Jesús' },
    // Emiliani (traslado al lunes siguiente)
    { date: trasladarALunes(utcDate(year, 1, 6)), nombre: 'Reyes Magos' },
    { date: trasladarALunes(utcDate(year, 3, 19)), nombre: 'Día de San José' },
    { date: trasladarALunes(utcDate(year, 6, 29)), nombre: 'San Pedro y San Pablo' },
    { date: trasladarALunes(utcDate(year, 8, 15)), nombre: 'Asunción de la Virgen' },
    { date: trasladarALunes(utcDate(year, 10, 12)), nombre: 'Día de la Raza' },
    { date: trasladarALunes(utcDate(year, 11, 1)), nombre: 'Todos los Santos' },
    { date: trasladarALunes(utcDate(year, 11, 11)), nombre: 'Independencia de Cartagena' },
  ];

  if (year >= CHIQUINQUIRA_DESDE) {
    items.push({
      date: trasladarALunes(utcDate(year, 7, 9)),
      nombre: 'Día de la Virgen de Chiquinquirá',
    });
  }

  return items
    .map((it) => ({ fecha: toISODate(it.date), nombre: it.nombre }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

const setCache = new Map<number, Set<string>>();

/** Conjunto de fechas ('YYYY-MM-DD') festivas del año, con memoización. */
export function festivosSet(year: number): Set<string> {
  let s = setCache.get(year);
  if (!s) {
    s = new Set(festivosDeColombia(year).map((f) => f.fecha));
    setCache.set(year, s);
  }
  return s;
}

/** True si la fecha (solo día, UTC) es festivo nacional en Colombia. */
export function esFestivo(date: Date): boolean {
  return festivosSet(date.getUTCFullYear()).has(toISODate(date));
}
