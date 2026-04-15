"use client"

import { useState, useEffect } from "react"
import { searchProducts } from "@lib/data/search"
import SearchHit from "../search-hit"
import { Loader2, ArrowRight } from "lucide-react"

interface SearchResultsProps {
  query: string
  onProductClick: (handle: string) => void
}

interface ResultProduct {
  handle: string
  title: string
  thumbnail: string | null
  description?: string | null
}

const SearchResults = ({ query, onProductClick }: SearchResultsProps) => {
  const [products, setProducts] = useState<ResultProduct[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setProducts([])
      setTotalCount(0)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const result = await searchProducts(query.trim(), { first: 6 })
        const mapped: ResultProduct[] = result.products.map((p) => ({
          handle: p.handle,
          title: p.title,
          thumbnail: p.featuredImage?.url || null,
          description: null,
        }))
        setProducts(mapped)
        setTotalCount(result.totalCount)
      } catch (error) {
        console.error(error)
        setProducts([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Searching products...</span>
      </div>
    )
  }

  if (products.length === 0 && query.trim().length >= 2) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No products found for &ldquo;{query}&rdquo;</p>
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        {totalCount} product{totalCount !== 1 ? "s" : ""} found
      </p>

      <div className="grid grid-cols-2 gap-2">
        {products.map((product) => (
          <SearchHit
            key={product.handle}
            hit={product}
            onClose={() => onProductClick(product.handle)}
          />
        ))}
      </div>

      {totalCount > 6 && (
        <button
          onClick={() => onProductClick("")}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          See all {totalCount} results
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default SearchResults
