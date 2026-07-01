/**
 * Lightweight fixed-window rate limiter backed by Redis.
 *
 * Used to throttle the public, unauthenticated endpoints (student self-service
 * create + duplicate check) so an anonymous caller cannot spam writes or use
 * the duplicate check as a fast enumeration oracle.
 *
 * Fails OPEN: if Redis is unavailable or errors, the request is allowed. Redis
 * is treated as optional infrastructure across this app (see `redis.ts`), so we
 * favour availability over strict enforcement — this is abuse mitigation, not a
 * hard quota.
 */
import { getRedisClient } from "@/lib/redis";
import Logger from "@/lib/server-logger";

const logger = new Logger("Rate Limit");

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

/**
 * Increment a per-key counter in a fixed time window and report whether the
 * caller is still within the allowed limit.
 *
 * @param key            Stable identifier for the bucket (e.g. `route:ip`).
 * @param limit          Max requests permitted within the window.
 * @param windowSeconds  Window length in seconds.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  try {
    const client = getRedisClient();

    // Not connected (e.g. local dev without Redis) → fail open.
    if (client.status !== "ready") {
      return { allowed: true, remaining: limit, limit };
    }

    const redisKey = `ratelimit:${key}`;
    const count = await client.incr(redisKey);

    // First hit in this window: set the expiry so the bucket resets.
    if (count === 1) {
      await client.expire(redisKey, windowSeconds);
    }

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      limit,
    };
  } catch (error) {
    logger.warn(
      `Rate limit check failed, allowing request: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return { allowed: true, remaining: limit, limit };
  }
}

/**
 * Best-effort client IP extraction from proxy headers for rate-limit keying.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
