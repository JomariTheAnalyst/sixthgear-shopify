import { redis } from "@lib/cache/redis"

export async function GET() {
  try {
    await redis.ping()
    return Response.json({
      status: "ok",
      redis: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      {
        status: "degraded",
        redis: "unavailable",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  }
}
