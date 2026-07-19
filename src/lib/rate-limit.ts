/**
 * Rate limit best-effort en memoria (token bucket por clave).
 *
 * Nota: en entornos serverless el estado no se comparte entre instancias, así
 * que esto es una defensa básica contra abuso, no un límite estricto. Para
 * producción real conviene un backend compartido (p. ej. Upstash/Redis).
 */
interface Bucket {
  tokens: number;
  updated: number;
}

const buckets = new Map<string, Bucket>();

const DEFAULT_CAPACITY = 8; // ráfaga máxima
const REFILL_PER_MS = DEFAULT_CAPACITY / 60_000; // se recarga la capacidad en 1 minuto

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs: number;
}

export function rateLimit(key: string, capacity: number = DEFAULT_CAPACITY): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: capacity, updated: now };

  const elapsed = now - bucket.updated;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * REFILL_PER_MS);
  bucket.updated = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return { ok: true, retryAfterMs: 0 };
  }

  buckets.set(key, bucket);
  const needed = 1 - bucket.tokens;
  return { ok: false, retryAfterMs: Math.ceil(needed / REFILL_PER_MS) };
}
