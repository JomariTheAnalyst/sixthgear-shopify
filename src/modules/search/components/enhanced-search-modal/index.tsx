"use client"

import { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Search, Clock, TrendingUp, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { getPredictiveSearch } from "@lib/data/search"
import type { ShopifyPredictiveSearchResult } from "@lib/shopify/types"
import RecentSearches, { addRecentSearch } from "../recent-searches"
import PopularSuggestions from "../popular-suggestions"
import HotDealsProducts from "../hot-deals-products"
import SearchResults from "../search-results"
import AutocompleteSuggestions from "../autocomplete-suggestions"
import YouMayLike from "../you-may-like"

interface EnhancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const EnhancedSearchModal = ({ isOpen, onClose }: EnhancedSearchModalProps) => {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [results, setResults] = useState<ShopifyPredictiveSearchResult>({
    products: [],
    collections: [],
    pages: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Reset query when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setDebouncedQuery("")
      setResults({ products: [], collections: [], pages: [] })
      setIsLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults({ products: [], collections: [], pages: [] })
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    getPredictiveSearch(debouncedQuery)
      .then((nextResults) => {
        if (!cancelled) {
          setResults(nextResults)
        }
      })
      .catch((error) => {
        console.error(error)
        if (!cancelled) {
          setResults({ products: [], collections: [], pages: [] })
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addRecentSearch(query)
      router.push(`/store?query=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    addRecentSearch(suggestion)
  }

  const handleProductClick = (handle: string) => {
    if (query.trim()) {
      addRecentSearch(query)
    }

    router.push(`/products/${handle}`)
    onClose()
  }

  const handleCollectionClick = (handle: string) => {
    if (query.trim()) {
      addRecentSearch(query)
    }

    router.push(`/collections/${handle}`)
    onClose()
  }

  const handleSeeAllResults = () => {
    if (!query.trim()) return

    addRecentSearch(query)
    router.push(`/store?query=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  const isSearching = query.trim().length > 0
  const showLoadingIndicator = isSearching && isLoading

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[120]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-6 md:pt-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                {/* Search Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search for products..."
                      className="flex-1 border-0 focus:ring-0 text-base placeholder-gray-400 focus:outline-none"
                      autoFocus
                    />
                    {showLoadingIndicator && (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    )}
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="flex max-h-[60vh]">
                  {/* Left Column: Suggestions */}
                  <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                    {isSearching ? (
                      <>
                        {/* Autocomplete Suggestions */}
                        <div className="border-b border-gray-200">
                          <AutocompleteSuggestions
                            collections={results.collections.slice(0, 4)}
                            loading={isLoading && results.collections.length === 0}
                            query={debouncedQuery}
                            onCollectionClick={handleCollectionClick}
                            onSearchClick={handleSeeAllResults}
                            onSuggestionClick={handleSuggestionClick}
                          />
                        </div>
                        {/* Popular Suggestions */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-medium text-gray-700">
                              Popular Searches
                            </h3>
                          </div>
                          <PopularSuggestions
                            query={query}
                            onSuggestionClick={handleSuggestionClick}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <h3 className="text-sm font-medium text-gray-700">
                            Recent Searches
                          </h3>
                        </div>
                        <RecentSearches onSearchClick={handleSuggestionClick} />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Products */}
                  <div className="flex-1 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Search Results
                        </h3>
                        <SearchResults
                          query={debouncedQuery}
                          products={results.products.slice(0, 6)}
                          loading={isLoading && results.products.length === 0}
                          onProductClick={handleProductClick}
                          onSeeAllResults={handleSeeAllResults}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <YouMayLike onClose={onClose} />
                        <div className="p-4 border-t border-gray-100">
                          <HotDealsProducts onProductClick={handleProductClick} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default EnhancedSearchModal
