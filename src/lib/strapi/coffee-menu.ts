/**
 * Strapi Coffee Menu Content Fetcher
 *
 * Fetches dynamic content for the First Gear Coffee Menu page from Strapi CMS.
 * Uses dynamic zone with blocks (similar to Home/About pages)
 */

import { fetchStrapi } from "../strapi"
import { StrapiImage } from "./home"

// ============================================================================
// TYPE DEFINITIONS - Strapi Response Structure
// ============================================================================

export interface CoffeeMenuHeroBlock {
  __component: string // Flexible to match any component name
  id: number
  pageName: string
  heading: string
  subheading: string
  background_image: StrapiImage | null
  is_active: boolean
}

export interface CoffeeMenuPageContent {
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    blocks: Array<CoffeeMenuHeroBlock | any>
  }
}

export interface VariantComponent {
  id: number
  label: string
  price: number
  is_active: boolean
}

export interface MenuItemData {
  id: number
  documentId: string
  name: string
  description: string
  image: StrapiImage | null
  isPopular: boolean
  sortOrder: number
  is_active: boolean
  variants: VariantComponent[]
}

export interface MenuCategoryData {
  id: number
  documentId: string
  name: string
  shortDescription: string
  slug: string
  sortOrder: number
  is_active: boolean
  menu_items: MenuItemData[]
}

export interface MenuCategoriesResponse {
  data: MenuCategoryData[]
}

// ============================================================================
// TYPE DEFINITIONS - Frontend UI Format
// ============================================================================

export interface CoffeeMenuHero {
  pageTitle: string
  pageSubtitle: string
  backgroundImage: string | null
}

export interface MenuVariant {
  id: number
  label: string
  price: number
}

export interface MenuItemUI {
  id: string
  name: string
  description: string
  image: string | null
  isPopular: boolean
  variants: MenuVariant[]
}

export interface MenuCategoryUI {
  id: string
  name: string
  description: string
  slug: string
  items: MenuItemUI[]
}

// ============================================================================
// FETCH FUNCTIONS
// ============================================================================

/**
 * Fetch Coffee Menu Page hero content from Strapi
 */
export async function fetchCoffeeMenuPage(): Promise<CoffeeMenuPageContent | null> {

  return fetchStrapi<CoffeeMenuPageContent>("/api/coffee-menu-page", {
    params: {
      "populate[blocks][populate]": "*",
    },
  })
}

/**
 * Fetch Menu Categories with Items and Variants from Strapi
 */
export async function fetchMenuCategories(): Promise<MenuCategoriesResponse | null> {

  return fetchStrapi<MenuCategoriesResponse>("/api/menu-categories", {
    params: {
      filters: {
        is_active: {
          $eq: true,
        },
      },
      sort: ["sortOrder:asc"],
      "populate[menu_items][populate]": "*",
    },
  })
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Resolve Strapi image URL to absolute URL
 */
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
  return `${strapiUrl}${url.startsWith("/") ? "" : "/"}${url}`
}

// ============================================================================
// TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform Coffee Menu Page data to UI format
 */
export function transformCoffeeMenuHero(
  pageData: CoffeeMenuPageContent | null
): CoffeeMenuHero | null {

  if (!pageData?.data?.blocks || pageData.data.blocks.length === 0) {
    return null
  }

  // Log all blocks for debugging
  pageData.data.blocks.forEach((block: any, index: number) => {
  })

  // Try to find the hero block - be flexible with component name
  // Look for any block that contains "menu" or "coffee" or "hero" or "first"
  const heroBlock = pageData.data.blocks.find(
    (block: any) =>
      block.__component &&
      (block.__component.toLowerCase().includes("menu") ||
        block.__component.toLowerCase().includes("coffee") ||
        block.__component.toLowerCase().includes("hero") ||
        block.__component.toLowerCase().includes("first"))
  ) as CoffeeMenuHeroBlock | undefined

  if (!heroBlock) {
    return null
  }


  // Check if is_active is explicitly false (not just undefined/null)
  if (heroBlock.is_active === false) {
    return null
  }

  const heroData = {
    pageTitle: heroBlock.heading || "Our Menu",
    pageSubtitle:
      heroBlock.subheading ||
      "Handcrafted brews served with passion. More than a pit stopâ€”it's where riders refuel, relax, and reconnect.",
    backgroundImage: resolveImageUrl(heroBlock.background_image?.url),
  }


  return heroData
}

/**
 * Transform Menu Categories data to UI format
 */
export function transformMenuCategories(
  categoriesData: MenuCategoriesResponse | null
): MenuCategoryUI[] {

  if (!categoriesData?.data) {
    return []
  }

  const transformedCategories = categoriesData.data
    .filter((category) => category.is_active)
    .map((category) => ({
      id: category.slug || category.documentId,
      name: category.name,
      description: category.shortDescription || "",
      slug: category.slug,
      items: transformMenuItems(category.menu_items),
    }))
    .filter((category) => category.items.length > 0) // Hide empty categories


  return transformedCategories
}

/**
 * Transform Menu Items data to UI format
 */
function transformMenuItems(items: MenuItemData[] | undefined): MenuItemUI[] {
  if (!items) {
    return []
  }

  const transformedItems = items
    .filter((item) => item.is_active)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      id: item.documentId,
      name: item.name,
      description: item.description || "",
      image: resolveImageUrl(item.image?.url),
      isPopular: item.isPopular || false,
      variants: transformVariants(item.variants),
    }))


  return transformedItems
}

/**
 * Transform Variants data to UI format
 */
function transformVariants(
  variants: VariantComponent[] | undefined
): MenuVariant[] {
  if (!variants) return []

  return variants
    .filter((variant) => variant.is_active)
    .map((variant) => ({
      id: variant.id,
      label: variant.label,
      price: variant.price,
    }))
}

// ============================================================================
// MAIN GETTER FUNCTIONS
// ============================================================================

/**
 * Get Coffee Menu Hero content
 */
export async function getCoffeeMenuHero(): Promise<CoffeeMenuHero | null> {
  try {
    const pageData = await fetchCoffeeMenuPage()
    return transformCoffeeMenuHero(pageData)
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Get Menu Categories with Items
 */
export async function getMenuCategories(): Promise<MenuCategoryUI[]> {
  try {
    const categoriesData = await fetchMenuCategories()
    return transformMenuCategories(categoriesData)
  } catch (error) {
    console.error(error)
    return []
  }
}