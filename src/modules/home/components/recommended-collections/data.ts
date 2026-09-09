/**
 * TEMPORARY homepage collection data.
 *
 * This sprint is intentionally hardcoded so the bento layout, cropping,
 * responsive behavior, and interactions can be validated before the section is
 * wired to Shopify. When the migration happens, only this module should be
 * replaced: `RecommendedCollections` consumes `HomeCollectionItem[]` and knows
 * nothing about where the items came from.
 *
 * Images are placeholders reused from existing local project photography. They
 * are on-brand Sixthgear store/workshop/riding shots, not collection-accurate
 * artwork, and are expected to be replaced alongside the Shopify migration.
 *
 * Ordering is significant: items are consumed in groups of three and the FIRST
 * item of each group renders as that group's large tile.
 */
export type HomeCollectionItem = {
  key: string
  title: string
  image: string
  imageAlt: string
  href: string
  ctaLabel?: string
}

export const HOME_COLLECTION_ITEMS: HomeCollectionItem[] = [
  {
    key: "riding-gear",
    title: "Riding Gear",
    image: "/images/franchise/sixthgear-inside.jpg",
    imageAlt:
      "Adventure motorcycle on display inside the Sixthgear Moto showroom",
    href: "/collections/riding-gear",
  },
  {
    key: "helmets",
    title: "Helmets",
    image: "/images/cta-placeholder.jpg",
    imageAlt: "Riders browsing the helmet and gear wall inside the Sixthgear store",
    href: "/collections/helmet",
  },
  {
    key: "communications",
    title: "Communications",
    image: "/images/sixthgear-image1.jpg",
    imageAlt: "Motorcycles being serviced on lifts inside the Sixthgear garage",
    href: "/collections/communications",
  },
]

/**
 * Kept for a later sprint. The section already groups items in threes and
 * alternates the large tile between left and right, so appending any of these
 * to `HOME_COLLECTION_ITEMS` renders a second, mirrored bento group with no
 * component changes.
 *
 * `/collections/apparel` is the only href here not already referenced elsewhere
 * in the repository; confirm the real Shopify handle before using it.
 */
export const DEFERRED_HOME_COLLECTION_ITEMS: HomeCollectionItem[] = [
  {
    key: "big-bike-parts",
    title: "Big-Bike Parts",
    image: "/images/sixthgear-workshop.jpg",
    imageAlt: "Sixthgear retail floor lined with big bikes and parts displays",
    href: "/collections/parts-and-accessories",
  },
  {
    key: "bags-and-luggages",
    title: "Bags and Luggages",
    image: "/images/homepage/slideshow-hero/sixthgear-hero.jpg",
    imageAlt: "Rider carrying a loaded touring pack seated on a motorcycle",
    href: "/collections/bags-and-luggages",
  },
  {
    key: "apparel",
    title: "Apparel",
    image: "/images/homepage/hero/sixthgear-store 2.jpg",
    imageAlt: "Exterior of the Sixthgear Moto store at dusk",
    href: "/collections/apparel",
  },
]
