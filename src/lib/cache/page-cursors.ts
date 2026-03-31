import { redis, cacheKey } from "./redis"

const isServer = typeof window === "undefined"

// TTL for page cursors — matches collection TTL
const PAGE_CURSOR_TTL = 600 // 10 minutes

/**
 * Build a scoped cache key for page-to-cursor mapping.
 * Scope includes collection handle, sort, and filter fingerprint so
 * cursor maps are invalidated automatically when filters change.
 */
function buildPageCursorKey(
  scope: string,
  sortKey: string,
  filterHash: string
): string {
  return cacheKey("pagecursors", scope, sortKey, filterHash)
}

/**
 * Store the cursor needed to fetch a specific page number.
 * Called after fetching page N, storing the endCursor as
 * the "entry cursor" for page N+1.
 */
export async function storePageCursor(
  scope: string,
  sortKey: string,
  filterHash: string,
  pageNumber: number,
  cursor: string
): Promise<void> {
  if (!isServer || !cursor) return

  try {
    const key = buildPageCursorKey(scope, sortKey, filterHash)
    // Store: field = page number, value = cursor
    await redis.hset(key, { [String(pageNumber)]: cursor })
    await redis.expire(key, PAGE_CURSOR_TTL)
  } catch (error) {
    console.error("[page-cursors] Failed to store cursor:", error)
  }
}

/**
 * Retrieve the cursor needed to fetch a specific page number.
 * For page 2, we need the endCursor that was stored after page 1 loaded.
 */
export async function getPageCursor(
  scope: string,
  sortKey: string,
  filterHash: string,
  pageNumber: number
): Promise<string | null> {
  if (!isServer || pageNumber <= 1) return null

  try {
    const key = buildPageCursorKey(scope, sortKey, filterHash)
    const cursor = await redis.hget<string>(key, String(pageNumber))
    return cursor || null
  } catch (error) {
    console.error("[page-cursors] Failed to retrieve cursor:", error)
    return null
  }
}

/**
 * Generate a stable hash from filter state for cache scoping.
 */
export function hashFilters(filters: unknown[], reverse?: boolean): string {
  const input = JSON.stringify({ filters, reverse })
  // Simple stable hash — good enough for cache keys
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
