import { headers } from "next/headers"
import { checkRateLimit, TTL } from "@lib/cache/redis"

type RateLimitInstance = {
  check: (limit: number) => Promise<boolean>
}

function createRateLimiter(
  action: string,
  ttlSeconds: number
): RateLimitInstance {
  return {
    async check(limit: number): Promise<boolean> {
      const headersList = await headers()
      const forwarded = headersList.get("x-forwarded-for")
      const realIp = headersList.get("x-real-ip")
      const ip = forwarded?.split(",")[0].trim() ?? realIp ?? "anonymous"

      const result = await checkRateLimit(action, ip, limit, ttlSeconds)
      return result.allowed
    },
  }
}

export const authRateLimit = createRateLimiter("login", TTL.RATE_LIMIT_LOGIN)
export const registerRateLimit = createRateLimiter(
  "register",
  TTL.RATE_LIMIT_REGISTER
)
export const recoverRateLimit = createRateLimiter(
  "recover",
  TTL.RATE_LIMIT_RECOVER
)
export const resetRateLimit = createRateLimiter("reset", TTL.RATE_LIMIT_RESET)
export const updateRateLimit = createRateLimiter(
  "update",
  TTL.RATE_LIMIT_UPDATE
)

export default authRateLimit
