export type ShopMenuItem = {
  title: string
  image: string
  imageAlt: string
  href: string
  imageFit: "cover" | "contain"
  titleTone?: "light" | "dark"
}

export const SHOP_MENU_ITEMS = [
  {
    title: "All Products",
    image: "/images/product-categories/parts-and-accessories2.png",
    imageAlt:
      "Rider in full black gear on an adventure motorcycle fitted with an aftermarket exhaust, auxiliary lights and radiator guard",
    href: "/store",
    imageFit: "contain",
  },
  {
    title: "Riding Gear",
    image: "/images/product-categories/ridinggear1.png",
    imageAlt:
      "Rider in full black riding gear: helmet, armoured jacket, gloves, riding pants and touring boots",
    href: "/collections/riding-gear",
    imageFit: "contain",
  },
  {
    title: "Parts & Accessories",
    image: "/images/product-categories/parts-and-accessories1.png",
    imageAlt:
      "Flat lay of motorcycle parts: titanium exhaust system, LED auxiliary lights, radiator guards, brake pads and a phone mount",
    href: "/collections/parts-and-accessories",
    imageFit: "contain",
  },
  {
    title: "Helmets",
    image: "/images/product-categories/helmets1.png",
    imageAlt:
      "Rider in a gloss black full-face motorcycle helmet and black riding jacket, facing forward",
    href: "/collections/helmet",
    imageFit: "contain",
  },
  {
    title: "Bags & Luggage",
    image: "/images/product-categories/bags-and-luggages1.png",
    imageAlt:
      "Rider on a black adventure motorcycle fitted with aluminium top box and side cases, seen from behind",
    href: "/collections/bags-and-luggages",
    imageFit: "contain",
  },
  {
    title: "Communications",
    image: "/images/product-categories/intercoms1.png",
    imageAlt:
      "Black motorcycle Bluetooth intercom unit with helmet speakers, boom microphone, mounting clip and USB-C cable",
    href: "/collections/communications",
    imageFit: "contain",
  },
] as const satisfies readonly ShopMenuItem[]
