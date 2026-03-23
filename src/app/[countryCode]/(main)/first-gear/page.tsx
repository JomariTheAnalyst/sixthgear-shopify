import { Metadata } from "next"
import MenuTemplate from "@modules/menu/templates/menu-template"
import { getCoffeeMenuHero, getMenuCategories } from "@lib/strapi/coffee-menu"

// ISR revalidation - same as other pages
export const revalidate = 60

export const metadata: Metadata = {
  title: "Coffee Menu",
  description:
    "First Gear Coffee menu - Handcrafted espresso drinks, iced coffee, non-coffee beverages, and delicious food. Fuel your ride with great coffee at Sixthgear.",
  keywords: [
    "coffee menu",
    "espresso",
    "latte",
    "cold brew",
    "iced coffee",
    "cafe",
    "First Gear Coffee",
    "Sixthgear",
    "motorcycle cafe",
  ],
  openGraph: {
    title: "First Gear Coffee Menu | Sixthgear",
    description:
      "Handcrafted brews served with passion. Explore our full menu of hot coffee, iced coffee, non-coffee drinks, and food.",
    type: "website",
  },
}

export default async function MenuPage() {

  // Fetch hero and categories from Strapi
  const heroData = await getCoffeeMenuHero()
  const categories = await getMenuCategories()

  if (heroData) {
  } else {
  }

  return <MenuTemplate heroData={heroData} categories={categories} />
}