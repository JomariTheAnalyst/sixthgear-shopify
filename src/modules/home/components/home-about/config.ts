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
  images: {
    /**
     * "Axe" shape, top right (766:660 box). Manual crop in source pixels
     * (3936x2648) instead of g_auto, so the mechanic's hands sit above the
     * notch the bottom photo fits into.
     */
    top: {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/c_crop,x_1010,y_620,w_2354,h_2028/w_1600,f_auto,q_auto/v1790752600/_LIZ7077_edited_e6t9ry.jpg",
      alt: "A Sixth Gear mechanic crouches beside a Royal Enfield, working on it next to a blue sport bike in the workshop",
    },
    /** Trapezoid, bottom left (700:570 box). */
    bottom: {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/c_fill,g_auto,ar_700:570,w_1500,f_auto,q_auto/v1790752587/_LIZ7064_edited_w5w05h.jpg",
      alt: "A Sixth Gear mechanic kneels behind a Royal Enfield, working at its rear wheel under the Sixth Gear Motorcycle sign",
    },
  },
} as const
