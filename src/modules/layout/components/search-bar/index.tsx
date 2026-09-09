"use client"

import { useState } from "react"
import EnhancedSearchModal from "@modules/search/components/enhanced-search-modal"

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center text-gray-900 transition-colors hover:text-[#F16D34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16D34]"
        aria-label="Search products"
        title="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.7}
          stroke="currentColor"
          className="h-[22px] w-[22px]"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>

      <EnhancedSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}

export default SearchBar
