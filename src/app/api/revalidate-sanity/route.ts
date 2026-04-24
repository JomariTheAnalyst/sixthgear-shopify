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
    let body: any = null

    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      body = await request.json().catch(() => null)
      bodySecret = typeof body?.secret === "string" ? body.secret : null
    }

    const providedSecret = headerSecret || bodySecret

    if (providedSecret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    revalidateTag("sanity")
    revalidatePath("/")
    revalidatePath("/ph")
    revalidatePath("/ph/rider-stories")

    const slug =
      typeof body?.slug?.current === "string"
        ? body.slug.current
        : typeof body?.slug === "string"
          ? body.slug
          : typeof body?.document?.slug?.current === "string"
            ? body.document.slug.current
            : null

    if (slug) {
      revalidatePath(`/ph/rider-stories/${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    )
  }
}
