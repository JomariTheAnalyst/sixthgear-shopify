/**
 * Homepage "Recommended Collections" editorial cards.
 *
 * Hardcoded for now; the section is not Sanity-driven. Handles are the real
 * Shopify collection handles (note: helmets is `helmet`, singular).
 */
export type EditorialCard = {
  key: string
  /** Shopify collection handle; the card links to `/collections/<handle>`. */
  handle: string
  /** Main title word. Rendered uppercase. */
  title: string
  /** Small tag after the title, rendered as "(TAG)". */
  tag: string
  /** Square (1:1) image, cropped to the card with object-cover. */
  image: string
  imageAlt: string
  /**
   * Short description in the card's outer top corner. Wrap words in
   * *asterisks* for the accent color. Hidden when empty.
   */
  cornerText?: string
}

export const EDITORIAL_CARDS: EditorialCard[] = [
  {
    key: "jackets",
    handle: "riding-gear",
    title: "Jackets",
    tag: "New",
    image:
      "https://res.cloudinary.com/djn9ubf6a/image/upload/v1790590050/kian0model_opdopc.png",
    imageAlt: "Rider in a black Sixthgear half-zip hoodie and jeans",
    cornerText:
      "New-season riding layers built for *Manila heat*, city traffic, and long weekend rides.",
  },
  {
    key: "helmets",
    handle: "helmet",
    title: "Helmets",
    tag: "New",
    image:
      "https://res.cloudinary.com/djn9ubf6a/image/upload/v1790732051/flor-model_jih0cr.png",
    imageAlt:
      "Rider in a black riding jacket holding a blue Airoh Commander 2 adventure helmet",
    cornerText:
      "Full-face, modular, and adventure helmets from the brands *riders trust* on every road.",
  },
]
