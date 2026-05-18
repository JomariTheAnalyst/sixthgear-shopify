import { Metadata } from "next"
import MenuTemplate from "@modules/menu/templates/menu-template"
import { getCoffeeMenuHero, getMenuCategories } from "@lib/strapi/coffee-menu"
import { formatPrice, getCollectionProductsByHandle } from "@lib/shopify"
import type { ShopifyProductCard } from "@lib/shopify/types"
import type { FeaturedMenuProduct } from "@modules/menu/components/featured-menu-section"

// ISR revalidation - same as other pages
export const revalidate = 60

const FIRST_GEAR_COLLECTION_HANDLE = "first-gear-coffee"
const FIRST_GEAR_FALLBACK_IMAGE =
  "/images/firstgear-coffee/first%20gear%20coffee%20white%20bg.png"

export const metadata: Metadata = {
  title: "First Gear Coffee",
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
    title: "First Gear Coffee",
    description:
      "Handcrafted brews served with passion. Explore our full menu of hot coffee, iced coffee, non-coffee drinks, and food.",
    type: "website",
  },
}

export default async function MenuPage() {

  const [heroData, categories, coffeeProducts] = await Promise.all([
    getCoffeeMenuHero(),
    getMenuCategories(),
    getCollectionProductsByHandle(FIRST_GEAR_COLLECTION_HANDLE, 24),
  ])

  if (heroData) {
  } else {
  }

  return (
    <MenuTemplate
      heroData={heroData}
      categories={categories}
      featuredMenuItems={coffeeProducts.map(mapCoffeeProductToMenuItem)}
    />
  )
}

function getMenuCategory(product: ShopifyProductCard): string {
  return product.productType || "Coffee Drinks"
}

function mapCoffeeProductToMenuItem(
  product: ShopifyProductCard
): FeaturedMenuProduct {
  const minPrice = Number(product.priceRange.minVariantPrice.amount)
  const compareAtMoney = product.compareAtPriceRange?.minVariantPrice ?? null
  const compareAtAmount = compareAtMoney ? Number(compareAtMoney.amount) : 0
  const isOnSale = compareAtAmount > minPrice

  return {
    id: product.id,
    category: getMenuCategory(product),
    handle: product.handle,
    image:
      product.featuredImage?.url ||
      product.images?.edges?.[0]?.node?.url ||
      FIRST_GEAR_FALLBACK_IMAGE,
    name: product.title,
    description:
      product.description?.trim() ||
      "Freshly prepared by First Gear Coffee for quick stops, easy hangouts, and proper cafe breaks.",
    price: formatPrice(product.priceRange.minVariantPrice),
    compareAtPrice: isOnSale && compareAtMoney ? formatPrice(compareAtMoney) : null,
    isOnSale,
    options: product.options ?? [],
    variants:
      product.variants?.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        availableForSale: node.availableForSale,
        selectedOptions: node.selectedOptions ?? [],
        price: node.price,
        compareAtPrice: node.compareAtPrice,
        image: node.image,
      })) ?? [],
  }
}
