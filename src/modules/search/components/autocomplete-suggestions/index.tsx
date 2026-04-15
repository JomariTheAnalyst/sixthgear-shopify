"use client"

import { useState, useEffect } from "react"
import { getPredictiveSearch } from "@lib/data/search"
import Image from "next/image"
import { Search, Loader2 } from "lucide-react"

interface AutocompleteSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
}

interface PredictiveProduct {
  id: string
  title: string
  handle: string
  featuredImage: { url: string; altText: string | null } | null
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  availableForSale: boolean
}

interface PredictiveCollection {
  id: string
  title: string
  handle: string
}

const AutocompleteSuggestions = ({
  query,
  onSuggestionClick,
}: AutocompleteSuggestionsProps) => {
  const [products, setProducts] = useState<PredictiveProduct[]>([])
  const [collections, setCollections] = useState<PredictiveCollection[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setProducts([])
      setCollections([])
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const result = await getPredictiveSearch(query.trim())
        setProducts(result.products.slice(0, 5))
        setCollections(result.collections.slice(0, 3))
      } catch (error) {
        console.error(error)
        setProducts([])
        setCollections([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center gap-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Searching...</span>
      </div>
    )
  }

  if (products.length === 0 && collections.length === 0 && query.trim().length >= 2) {
    return (
      <div className="p-4 text-center text-gray-400">
        <Search className="w-5 h-5 mx-auto mb-1 opacity-50" />
        <p className="text-sm">No suggestions found</p>
      </div>
    )
  }

  const formatPrice = (amount: string, currency: string) => {
    const num = parseFloat(amount)
    const symbol = currency.toUpperCase() === "PHP" ? "â‚±" : "$"
    return `${symbol}${num.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="p-3">
      {/* Collection suggestions */}
      {collections.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 px-1">
            Collections
          </p>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onSuggestionClick(col.title)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{col.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Product suggestions */}
      {products.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 px-1">
            Products
          </p>
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => onSuggestionClick(product.title)}
              className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
            >
              <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Search className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate group-hover:text-[#F16D34] transition-colors">
                  {product.title}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AutocompleteSuggestions
