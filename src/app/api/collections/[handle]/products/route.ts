import { NextRequest } from "next/server"

import { getCollectionProductsByHandle } from "@lib/shopify"

type RouteContext = {
  params: Promise<{
    handle: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  const searchParams = request.nextUrl.searchParams
  const rawLimit = Number(searchParams.get("limit"))
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 6

  try {
    const { handle } = await context.params
    const products = await getCollectionProductsByHandle(handle, limit)
    return Response.json(products)
  } catch {
    return Response.json([], { status: 200 })
  }
}
