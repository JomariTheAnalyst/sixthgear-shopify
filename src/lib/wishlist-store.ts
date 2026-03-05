import { create } from "zustand"

const WISHLIST_STORAGE_KEY = "wishlist"

// ─── WishlistItem: everything needed to render a product card ───
export type WishlistItem = {
  handle: string
  id: string
  title: string
  imageUrl: string | null
  imageAlt: string | null
  price: number
  compareAtPrice: number | null
  currencyCode: string
  availableForSale: boolean
  vendor: string
  variantId: string
  addedAt: number
}

// ─── Validation ───
function isValidItem(item: unknown): item is WishlistItem {
  if (!item || typeof item !== "object") return false
  const i = item as Record<string, unknown>
  return (
    typeof i.handle === "string" &&
    typeof i.id === "string" &&
    typeof i.title === "string" &&
    typeof i.price === "number" &&
    typeof i.currencyCode === "string" &&
    typeof i.availableForSale === "boolean" &&
    typeof i.vendor === "string" &&
    typeof i.variantId === "string" &&
    typeof i.addedAt === "number"
  )
}

function dedupeItems(items: WishlistItem[]): WishlistItem[] {
  const seen = new Set<string>()
  const output: WishlistItem[] = []
  for (const item of items) {
    const handle = item.handle?.trim()
    if (!handle || seen.has(handle)) continue
    seen.add(handle)
    output.push(item)
  }
  return output
}

// ─── localStorage read/write ───
function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Filter out old-format items (plain strings) and invalid items
    return dedupeItems(parsed.filter(isValidItem))
  } catch {
    return []
  }
}

function writeWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
}

// ─── Store type ───
type WishlistStore = {
  items: WishlistItem[]
  hydrated: boolean
  hydrate: () => void
  add: (item: WishlistItem) => void
  remove: (handle: string) => void
  toggle: (item: WishlistItem) => void
  isInWishlist: (handle: string) => boolean
  clear: () => void
}

function setAndPersist(
  set: (partial: Partial<WishlistStore>) => void,
  items: WishlistItem[]
) {
  writeWishlist(items)
  set({ items, hydrated: true })
}

// ─── Zustand store ───
export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    const items = readWishlist()
    set({ items, hydrated: true })
  },

  add: (item) => {
    const handle = item.handle?.trim()
    if (!handle) return

    const current = get().hydrated ? get().items : readWishlist()
    if (current.some((existing) => existing.handle === handle)) return

    const next = dedupeItems([...current, item])
    setAndPersist(set, next)
  },

  remove: (handle) => {
    const normalized = handle.trim()
    if (!normalized) return

    const current = get().hydrated ? get().items : readWishlist()
    const next = current.filter((item) => item.handle !== normalized)
    setAndPersist(set, next)
  },

  toggle: (item) => {
    const handle = item.handle?.trim()
    if (!handle) return

    const current = get().hydrated ? get().items : readWishlist()
    const exists = current.some((existing) => existing.handle === handle)

    const next = exists
      ? current.filter((existing) => existing.handle !== handle)
      : dedupeItems([...current, item])

    setAndPersist(set, next)
  },

  isInWishlist: (handle) => {
    const normalized = handle.trim()
    const current = get().hydrated ? get().items : readWishlist()
    return current.some((item) => item.handle === normalized)
  },

  clear: () => {
    setAndPersist(set, [])
  },
}))
