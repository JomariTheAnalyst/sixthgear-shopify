import type {
  ShopifyImage,
  ShopifyMoney,
  ShopifyProductOption,
} from "@lib/shopify/types"

export type FeaturedMenuVariant = {
  id: string
  title?: string
  availableForSale?: boolean
  selectedOptions: {
    name: string
    value: string
  }[]
  price?: ShopifyMoney
  compareAtPrice?: ShopifyMoney | null
  image?: ShopifyImage
}

export type FeaturedMenuProduct = {
  id: string | number
  category: string
  handle: string
  image: string
  name: string
  description: string
  price: string
  compareAtPrice?: string | null
  isOnSale?: boolean
  options?: ShopifyProductOption[]
  variants?: FeaturedMenuVariant[]
}
