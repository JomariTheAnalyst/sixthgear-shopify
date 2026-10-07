/**
 * Homepage About section content.
 *
 * Hardcoded for now: this section is not connected to Sanity. It moves to
 * Sanity in the later Sanity task; until then, edit everything here.
 */
export const HOME_ABOUT = {
  label: "About Us",
  heading: "We Offer Complete Diagnostics for Your Motorcycle",
  paragraph:
    "Sixth Gear Moto Supply Café + Lounge is a rider-built motorcycle hub combining professional workshop service, premium accessories, riding gear, detailing, performance upgrades, and a relaxed café experience powered by First Gear Coffee.",
  checklist: [
    "Motorcycle Service and Advanced Diagnostics",
    "Parts, Accessories, Luggage and Communications",
    "Helmets, Riding Gear and Apparel",
    "Café Lounge and Rider Community",
  ],
  button: {
    label: "More About Us",
    /** Country prefix is added by LocalizedClientLink. */
    href: "/about",
  },
  /** Moving text rows behind the photos. */
  rowText: "SIXTHGEAR MOTORCYCLE.",
  /**
   * Widths fit the largest rendered size at 2x: the photo box tops out near
   * 632 CSS px (stacked layout at ~767px wide), so the top photo is at most
   * ~484 px and the bottom ~440 px wide (968 / 880 device px on retina).
   */
  images: {
    /** "Axe" shape, top right (766:660 box). */
    top: {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/c_fill,g_auto,ar_766:660,w_1000,f_auto,q_auto/v1790752600/_LIZ7077_edited_e6t9ry.jpg",
      alt: "A Sixth Gear mechanic crouches beside a Royal Enfield, working on it next to a blue sport bike in the workshop",
    },
    /** Trapezoid, bottom left (700:570 box). */
    bottom: {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/c_fill,g_auto,ar_700:570,w_920,f_auto,q_auto/v1790752587/_LIZ7064_edited_w5w05h.jpg",
      alt: "A Sixth Gear mechanic kneels behind a Royal Enfield, working at its rear wheel under the Sixth Gear Motorcycle sign",
    },
  },
} as const
