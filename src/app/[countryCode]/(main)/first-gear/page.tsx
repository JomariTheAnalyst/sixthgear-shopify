import { Metadata } from "next"
import {
  getBreadcrumbStructuredData,
  getCanonicalPath,
  getOpenGraph,
} from "@lib/seo"
import JsonLd from "@modules/common/components/json-ld"
import MenuTemplate from "@modules/menu/templates/menu-template"
import { getCoffeeMenuHero, getMenuCategories } from "@lib/strapi/coffee-menu"

// ISR revalidation - same as other pages
export const revalidate = 60

const breadcrumbStructuredData = getBreadcrumbStructuredData([
  { name: "Home", path: "/" },
  { name: "First Gear Coffee", path: "/first-gear" },
])

export const metadata: Metadata = {
  title: "First Gear Coffee",
  description:
    "First Gear Coffee menu - Handcrafted espresso drinks, iced coffee, non-coffee beverages, and delicious food. Fuel your ride with great coffee at SixthGear Moto.",
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
  openGraph: getOpenGraph({
    title: "First Gear Coffee",
    description:
      "Handcrafted brews served with passion. Explore our full menu of hot coffee, iced coffee, non-coffee drinks, and food.",
    path: "/first-gear",
  }),
  twitter: {
    card: "summary",
    title: "First Gear Coffee",
    description:
      "Handcrafted brews served with passion. Explore our full menu of hot coffee, iced coffee, non-coffee drinks, and food.",
  },
  alternates: {
    canonical: getCanonicalPath("/first-gear"),
  },
}

export default async function MenuPage() {

  const [heroData, categories] = await Promise.all([
    getCoffeeMenuHero(),
    getMenuCategories(),
  ])

  if (heroData) {
  } else {
  }

  return (
    <>
      <JsonLd id="first-gear-breadcrumbs" data={breadcrumbStructuredData} />
      <MenuTemplate
        heroData={heroData}
        categories={categories}
        showFeaturedMenu={false}
      />
    </>
  )
}
