import { revalidateTag } from "next/cache"
import { NextRequest } from "next/server"
import { serverEnv } from "@lib/env"
import { invalidatePattern } from "@lib/cache/redis"

export async function POST(request: NextRequest) {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256")
  const body = await request.text()
  const secret = serverEnv.SHOPIFY_WEBHOOK_SECRET

  if (!secret) {
    console.error("[revalidate] SHOPIFY_WEBHOOK_SECRET not configured")
    return Response.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  const isValid = await validateShopifyHmac(body, hmacHeader, secret)
  if (!isValid) {
    console.error("[revalidate] Invalid HMAC signature")
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  revalidateTag("shopify")
  revalidateTag("shopify-products")
  revalidateTag("shopify-collections")

  await Promise.all([
    invalidatePattern("product"),
    invalidatePattern("products"),
    invalidatePattern("collection"),
    invalidatePattern("collections"),
    invalidatePattern("search"),
    invalidatePattern("homepage"),
  ])

  const topic = request.headers.get("x-shopify-topic") ?? "unknown"

  return Response.json({ revalidated: true, topic })
}

async function validateShopifyHmac(
  body: string,
  hmacHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!hmacHeader) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body))
  const computed = Buffer.from(signature).toString("base64")
  return computed === hmacHeader
}