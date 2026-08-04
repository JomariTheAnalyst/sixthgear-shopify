import assert from "node:assert/strict"
import test from "node:test"

import {
  isBrandCollectionHandle,
  selectBrandCollections,
} from "../../src/lib/shopify/brand-collections.ts"

const collection = (overrides = {}) => ({
  id: "gid://shopify/Collection/1",
  title: "Klim",
  handle: "brand-klim",
  image: null,
  ...overrides,
})

test("matches only the exact case-insensitive brand- prefix", () => {
  assert.equal(isBrandCollectionHandle("brand-klim"), true)
  assert.equal(isBrandCollectionHandle("BRAND-AGV"), true)
  assert.equal(isBrandCollectionHandle(" brand-Quadlock "), true)
  assert.equal(isBrandCollectionHandle("brands-klim"), false)
  assert.equal(isBrandCollectionHandle("my-brand-klim"), false)
  assert.equal(isBrandCollectionHandle("brand"), false)
  assert.equal(isBrandCollectionHandle("akrapovic-exhaust"), false)
})

test("deduplicates handles, skips invalid data, and orders by title", () => {
  const result = selectBrandCollections([
    collection({ id: "3", title: "Quad Lock", handle: "brand-quadlock" }),
    collection({ id: "2", title: "AGV", handle: "BRAND-AGV" }),
    collection({ id: "duplicate", title: "Duplicate", handle: "brand-AGV" }),
    collection({ id: "wrong-prefix", title: "Wrong", handle: "brands-wrong" }),
    collection({
      id: "seo",
      title: "Akrapovic Exhaust",
      handle: "akrapovic-exhaust",
    }),
    collection({ id: "", title: "Invalid", handle: "brand-invalid" }),
    collection({ id: "1", title: "Klim", handle: "brand-klim" }),
    null,
  ])

  assert.deepEqual(
    result.map(({ title, handle }) => ({ title, handle })),
    [
      { title: "AGV", handle: "BRAND-AGV" },
      { title: "Klim", handle: "brand-klim" },
      { title: "Quad Lock", handle: "brand-quadlock" },
    ]
  )
})

test("does not impose a four-card result cap", () => {
  const result = selectBrandCollections(
    Array.from({ length: 12 }, (_, index) =>
      collection({
        id: String(index),
        title: `Brand ${String(index).padStart(2, "0")}`,
        handle: `brand-brand-${index}`,
      })
    )
  )

  assert.equal(result.length, 12)
})

test("retains matching collections gathered from multiple Shopify pages", () => {
  const handles = [
    "brand-akrapovic",
    "brand-arrow",
    "brand-quadlock",
    "brand-klim",
    "brand-agv",
    "brand-alpinestars",
    "brand-dainese",
    "brand-motul",
    "brand-shoei",
  ]
  const firstPage = handles
    .slice(0, 5)
    .map((handle, index) =>
      collection({ id: `page-1-${index}`, title: handle, handle })
    )
  const secondPage = handles
    .slice(5)
    .map((handle, index) =>
      collection({ id: `page-2-${index}`, title: handle, handle })
    )

  assert.deepEqual(
    selectBrandCollections([...firstPage, ...secondPage]).map(
      (item) => item.handle
    ),
    [...handles].sort()
  )
})
