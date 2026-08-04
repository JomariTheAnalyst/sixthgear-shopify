import type { ShopifyImage } from "./types"

export type BrandCollection = {
  id: string
  title: string
  handle: string
  image: ShopifyImage | null
}

export type BrandCollectionCandidate = {
  id?: string | null
  title?: string | null
  handle?: string | null
  image?: ShopifyImage | null
}

const BRAND_COLLECTION_PREFIX = "brand-"

export function isBrandCollectionHandle(handle: string): boolean {
  return handle.trim().toLowerCase().startsWith(BRAND_COLLECTION_PREFIX)
}

export function selectBrandCollections(
  candidates: ReadonlyArray<BrandCollectionCandidate | null | undefined>
): BrandCollection[] {
  const collectionsByHandle = new Map<string, BrandCollection>()

  for (const candidate of candidates) {
    const id = candidate?.id?.trim()
    const title = candidate?.title?.trim()
    const handle = candidate?.handle?.trim()

    if (!id || !title || !handle || !isBrandCollectionHandle(handle)) {
      continue
    }

    const normalizedHandle = handle.toLowerCase()
    if (collectionsByHandle.has(normalizedHandle)) continue

    collectionsByHandle.set(normalizedHandle, {
      id,
      title,
      handle,
      image: candidate?.image ?? null,
    })
  }

  return Array.from(collectionsByHandle.values()).sort(
    (left, right) =>
      left.title.localeCompare(right.title, undefined, {
        sensitivity: "base",
      }) || left.handle.localeCompare(right.handle)
  )
}
