"use client"

import { Loader2, Search } from "lucide-react"

type PredictiveCollection = {
  id: string
  title: string
  handle: string
}

interface AutocompleteSuggestionsProps {
  query: string
  collections: PredictiveCollection[]
  loading?: boolean
  onCollectionClick: (handle: string) => void
  onSearchClick: () => void
  onSuggestionClick: (suggestion: string) => void
}

const AutocompleteSuggestions = ({
  query,
  collections,
  loading = false,
  onCollectionClick,
  onSearchClick,
  onSuggestionClick,
}: AutocompleteSuggestionsProps) => {
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center gap-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Searching...</span>
      </div>
    )
  }

  if (collections.length === 0 && query.trim().length >= 2) {
    return (
      <div className="p-4 text-center text-gray-400">
        <Search className="w-5 h-5 mx-auto mb-1 opacity-50" />
        <p className="text-sm">No matching collections</p>
      </div>
    )
  }

  return (
    <div className="p-3">
      {collections.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 px-1">
            Collections
          </p>
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onCollectionClick(collection.handle)}
              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
            >
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">
                {collection.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 && (
        <button
          type="button"
          onClick={onSearchClick}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
          Search for &ldquo;{query}&rdquo;
        </button>
      )}
    </div>
  )
}

export default AutocompleteSuggestions
