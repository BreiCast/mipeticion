import { describe, expect, it } from 'vitest';
import {
  CHIQUINQUIRA_DESDE,
  domingoDePascua,
  esFestivo,
  festivosDeColombia,
  festivosSet,
  trasladarALunes,
} from './festivos';
import { parseISODate, toISODate, utcDate } from './date-utils';

describe('domingoDePascua', () => {
  it('coincide con fechas conocidas de Pascua', () => {
    expect(toISODate(domingoDePascua(2024))).toBe('2024-03-31');
    expect(toISODate(domingoDePascua(2025))).toBe('2025-04-20');
    expect(toISODate(domingoDePascua(2026))).toBe('2026-04-05');
    expect(toISODate(domingoDePascua(2027))).toBe('2027-03-28');
  });
});

describe('trasladarALunes (Ley Emiliani)', () => {
  it('deja el lunes igual', () => {
    // 2026-06-29 es lunes
    expect(toISODate(trasladarALunes(utcDate(2026, 6, 29)))).toBe('2026-06-29');
  });
  it('mueve al lunes siguiente', () => {
    // 6 de enero de 2026 es martes -> lunes 12
    expect(toISODate(trasladarALunes(utcDate(2026, 1, 6)))).toBe('2026-01-12');
    // 15 de agosto de 2026 es sábado -> lunes 17
    expect(toISODate(trasladarALunes(utcDate(2026, 8, 15)))).toBe('2026-08-17');
  });
});

describe('festivosDeColombia(2026)', () => {
  // Lista oficial verificada (19 festivos, incluye Virgen de Chiquinquirá).
  const esperados2026 = [
    '2026-01-01', // Año Nuevo
    '2026-01-12', // Reyes Magos
    '2026-03-23', // San José
    '2026-04-02', // Jueves Santo
    '2026-04-03', // Viernes Santo
    '2026-05-01', // Día del Trabajo
    '2026-05-18', // Ascensión
    '2026-06-08', // Corpus Christi
    '2026-06-15', // Sagrado Corazón
    '2026-06-29', // San Pedro y San Pablo
    '2026-07-13', // Virgen de Chiquinquirá (Ley 2578/2026)
    '2026-07-20', // Grito de Independencia
    '2026-08-07', // Batalla de Boyacá
    '2026-08-17', // Asunción de la Virgen
    '2026-10-12', // Día de la Raza
    '2026-11-02', // Todos los Santos
    '2026-11-16', // Independencia de Cartagena
    '2026-12-08', // Inmaculada Concepción
    '2026-12-25', // Navidad
  ];

  it('produce exactamente los 19 festivos oficiales', () => {
    const fechas = festivosDeColombia(2026).map((f) => f.fecha);
    expect(fechas).toEqual(esperados2026);
  });

  it('festivosSet contiene cada fecha', () => {
    const s = festivosSet(2026);
    for (const f of esperados2026) expect(s.has(f)).toBe(true);
    expect(s.size).toBe(19);
  });
});

describe('Virgen de Chiquinquirá (vigencia por año)', () => {
  it('no aparece antes de 2026', () => {
    expect(CHIQUINQUIRA_DESDE).toBe(2026);
    const nombres2025 = festivosDeColombia(2025).map((f) => f.nombre);
    expect(nombres2025.some((n) => n.includes('Chiquinquirá'))).toBe(false);
  });
  it('aparece en 2027 el lunes 12 de julio', () => {
    const set2027 = festivosSet(2027);
    expect(set2027.has('2027-07-12')).toBe(true);
  });
});

describe('esFestivo', () => {
  it('reconoce festivos y días normales', () => {
    expect(esFestivo(parseISODate('2026-07-20'))).toBe(true); // Independencia
    expect(esFestivo(parseISODate('2026-07-13'))).toBe(true); // Chiquinquirá
    expect(esFestivo(parseISODate('2026-07-16'))).toBe(false); // jueves normal
    expect(esFestivo(parseISODate('2026-12-25'))).toBe(true); // Navidad
  });
});
