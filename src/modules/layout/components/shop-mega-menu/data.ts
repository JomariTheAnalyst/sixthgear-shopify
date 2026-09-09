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
    image: "/images/homepage/slideshow-hero/sixthgear-hero.jpg",
    imageAlt: "Motorcycle rider equipped for the road",
    href: "/store",
    imageFit: "cover",
    titleTone: "light",
  },
  {
    title: "Riding Gear",
    image: "/images/product-categories/shoes.png",
    imageAlt: "Black motorcycle riding boots",
    href: "/collections/riding-gear",
    imageFit: "contain",
  },
  {
    title: "Parts & Accessories",
    image: "/images/product-categories/exhaust.png",
    imageAlt: "Motorcycle exhaust accessory",
    href: "/collections/parts-and-accessories",
    imageFit: "contain",
  },
  {
    title: "Helmets",
    image: "/images/product-categories/helmets.png",
    imageAlt: "Black off-road motorcycle helmet",
    href: "/collections/helmet",
    imageFit: "contain",
  },
  {
    title: "Bags & Luggage",
    image: "/images/product-categories/bags-and-boxes (1).png",
    imageAlt: "Black motorcycle luggage case",
    href: "/collections/bags-and-luggages",
    imageFit: "contain",
  },
  {
    title: "Communications",
    image: "/images/product-categories/intercom.png",
    imageAlt: "Motorcycle helmet communication device",
    href: "/collections/communications",
    imageFit: "contain",
  },
] as const satisfies readonly ShopMenuItem[]
