import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.SANITY_WEBHOOK_SECRET

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "SANITY_WEBHOOK_SECRET is not configured" },
      { status: 500 }
    )
  }

  try {
    const headerSecret = request.headers.get("x-sanity-webhook-secret")
    let bodySecret: string | null = null

    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => null)
      bodySecret = typeof body?.secret === "string" ? body.secret : null
    }

    const providedSecret = headerSecret || bodySecret

    if (providedSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    revalidateTag("sanity")
    revalidatePath("/")
    revalidatePath("/ph")

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[sanity-revalidate] Failed to revalidate", error)

    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    )
  }
}
