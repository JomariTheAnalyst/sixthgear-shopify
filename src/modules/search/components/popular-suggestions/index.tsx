"use client"

import { TrendingUp } from "lucide-react"

interface PopularSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
}

const POPULAR_SEARCHES = [
  "Helmet",
  "Gloves",
  "Jacket",
  "SEC Moto",
  "Knee Guards",
  "Riding Boots",
  "Rain Gear",
]

const PopularSuggestions = ({
  query,
  onSuggestionClick,
}: PopularSuggestionsProps) => {
  // Filter chips by current query if user is typing
  const filtered = query.trim()
    ? POPULAR_SEARCHES.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : POPULAR_SEARCHES

  if (filtered.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filtered.map((term) => (
        <button
          key={term}
          onClick={() => onSuggestionClick(term)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
        >
          <TrendingUp className="w-3 h-3 text-gray-400" />
          {term}
        </button>
      ))}
    </div>
  )
}

export default PopularSuggestions
