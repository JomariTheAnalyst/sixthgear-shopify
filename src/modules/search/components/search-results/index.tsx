"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import { convertToLocale } from "@lib/util/money"
import SearchHit from "../search-hit"

type PredictiveProduct = {
  id: string
  handle: string
  title: string
  featuredImage: { url: string; altText?: string | null } | null
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  availableForSale: boolean
}

interface SearchResultsProps {
  query: string
  products: PredictiveProduct[]
  loading?: boolean
  onProductClick: (handle: string) => void
  onSeeAllResults: () => void
}

const SearchResults = ({
  query,
  products,
  loading = false,
  onProductClick,
  onSeeAllResults,
}: SearchResultsProps) => {
  const canSearch = query.trim().length >= 2

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Searching products...</span>
      </div>
    )
  }

  if (!canSearch) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p className="text-sm">Type at least 2 characters to search.</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No products found for &ldquo;{query}&rdquo;</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        Top matches for &ldquo;{query}&rdquo;
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {products.map((product) => (
          <SearchHit
            key={product.id}
            hit={{
              handle: product.handle,
              title: product.title,
              thumbnail: product.featuredImage?.url || null,
              imageAlt: product.featuredImage?.altText || product.title,
              price: convertToLocale({
                amount: product.priceRange.minVariantPrice.amount,
                currency_code: product.priceRange.minVariantPrice.currencyCode,
                locale: "en-PH",
              }),
              availableForSale: product.availableForSale,
            }}
            onClick={() => onProductClick(product.handle)}
          />
        ))}
      </div>

      <button
        onClick={onSeeAllResults}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        See all results
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default SearchResults
