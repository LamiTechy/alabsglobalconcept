/**
 * Simple fixed-window in-memory rate limiter.
 * Suitable for a single server instance (Vercel serverless functions are
 * isolated — swap the store for Upstash/Redis in high-traffic setups).
 */

type Bucket = { count: number; resetAt: number };

const globalStore = globalThis as unknown as { __rateBuckets?: Map<string, Bucket> };
const buckets = globalStore.__rateBuckets ?? new Map<string, Bucket>();
globalStore.__rateBuckets = buckets;

export type RateLimitResult = { ok: boolean; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  max = Number(process.env.RATE_LIMIT_MAX || 10),
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000)
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= max) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "unknown";
}
