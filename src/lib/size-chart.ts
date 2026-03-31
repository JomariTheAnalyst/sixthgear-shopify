import type { ShopifyMetafield } from "@lib/shopify/types"

export type SizeChartData = {
  headers: string[]
  rows: string[][]
}

export type SizeChartResult =
  | { type: "image"; url: string }
  | { type: "table"; data: SizeChartData }
  | { type: "none" }

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isSizeChartData(value: unknown): value is SizeChartData {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as { headers?: unknown; rows?: unknown }

  return (
    isStringArray(candidate.headers) &&
    Array.isArray(candidate.rows) &&
    candidate.rows.every((row) => isStringArray(row))
  )
}

function isLikelyUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

function resolveSizeChartImageUrl(field: ShopifyMetafield | undefined): string | null {
  if (!field) {
    return null
  }

  const referenceImageUrl = field.reference?.image?.url?.trim()

  if (referenceImageUrl) {
    return referenceImageUrl
  }

  const referenceUrl = field.reference?.url?.trim()

  if (referenceUrl) {
    return referenceUrl
  }

  const rawValue = field.value?.trim()

  if (rawValue && isLikelyUrl(rawValue)) {
    return rawValue
  }

  return null
}

export function resolveSizeChart(
  shopifyMetafields: ShopifyMetafield[] | null | undefined
): SizeChartResult {
  const metafields = Array.isArray(shopifyMetafields) ? shopifyMetafields : []

  const sizeChartImageField = metafields.find(
    (field) =>
      field.namespace === "custom" &&
      (field.key === "size_chart" || field.key === "size_chart_image")
  )

  const sizeChartImageUrl = resolveSizeChartImageUrl(sizeChartImageField)

  if (sizeChartImageUrl) {
    return { type: "image", url: sizeChartImageUrl }
  }

  const sizeChartData = metafields.find(
    (field) =>
      field.namespace === "custom" &&
      field.key === "size_chart_data" &&
      typeof field.value === "string" &&
      field.value.trim().length > 0
  )

  if (!sizeChartData) {
    return { type: "none" }
  }

  try {
    const parsed = JSON.parse(sizeChartData.value)

    if (isSizeChartData(parsed)) {
      return { type: "table", data: parsed }
    }
  } catch {
    return { type: "none" }
  }

  return { type: "none" }
}
