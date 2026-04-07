import { Redis } from "@upstash/redis"
import { serverEnv } from "@lib/env"

const isServer = typeof window === "undefined"

export const redis = isServer
  ? new Redis({
      url: serverEnv.UPSTASH_REDIS_REST_URL,
      token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
    })
  : (null as unknown as Redis)

const ENV = isServer && serverEnv.NODE_ENV === "production" ? "prod" : "dev"
const PREFIX = `sixthgear:v2:${ENV}`

export function cacheKey(resource: string, ...parts: string[]): string {
  return `${PREFIX}:${resource}:${parts.join(":")}`
}

export const TTL = {
  PRODUCT: 300,
  COLLECTION: 300,
  COLLECTIONS_LIST: 600,
  SEARCH: 120,
  HOMEPAGE: 300,
  RATE_LIMIT_CONTACT: 3600,
  RATE_LIMIT_LOGIN: 900,
  RATE_LIMIT_REGISTER: 3600,
  RATE_LIMIT_RECOVER: 3600,
  RATE_LIMIT_RESET: 3600,
  RATE_LIMIT_UPDATE: 3600,
} as const

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> {
  if (!isServer) {
    return fetcher()
  }

  try {
    const cached = await redis.get<T | string>(key)
    if (cached !== null) {
      if (typeof cached === "string") {
        return JSON.parse(cached) as T
      }
      return cached as T
    }

    const result = await fetcher()
    await redis.setex(key, ttl, JSON.stringify(result))
    return result
  } catch (error) {
    // DYNAMIC_SERVER_USAGE occurs during Next.js static build when Redis
    // uses no-store fetch under static generation. This is expected during
    // build attempts on routes that should be force-dynamic.
    const isDynamicServerError =
      error instanceof Error &&
      (error.message.includes("DYNAMIC_SERVER_USAGE") ||
        error.message.includes("Dynamic server usage") ||
        (error as any).digest === "DYNAMIC_SERVER_USAGE")

    if (!isDynamicServerError) {
      console.error(
        "[cache] Redis unavailable, falling back to direct fetch:",
        error
      )
    }

    return fetcher()
  }
}

export async function invalidatePattern(pattern: string): Promise<void> {
  if (!isServer) {
    return
  }

  try {
    const fullPattern = `${PREFIX}:${pattern}:*`
    // redis.keys() is acceptable for catalogs under ~10,000 products.
    // For larger catalogs, replace with a tag-based invalidation approach
    // using Redis Sets to track keys per tag group.
    const keys = await redis.keys(fullPattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("[cache] Redis invalidation failed:", error)
  }
}

export async function checkRateLimit(
  action: string,
  ip: string,
  limit: number,
  ttlSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  if (!isServer) {
    return { allowed: true, remaining: limit }
  }

  try {
    const key = cacheKey("ratelimit", action, ip)
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, ttlSeconds)
    }

    const allowed = current <= limit
    const remaining = Math.max(0, limit - current)
    return { allowed, remaining }
  } catch (error) {
    console.error("[ratelimit] Redis unavailable, allowing request:", error)
    return { allowed: true, remaining: limit }
  }
}
