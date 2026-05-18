"use client"

import Image from "next/image"

type SearchHitData = {
  handle: string
  title: string
  thumbnail: string | null
  imageAlt?: string | null
  price?: string
  availableForSale?: boolean
}

interface SearchHitProps {
  hit: SearchHitData
  onClick: () => void
}

const SearchHit = ({ hit, onClick }: SearchHitProps) => {
  const thumbnailUrl = hit.thumbnail || "/placeholder-product.png"

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
    >
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {hit.thumbnail ? (
          <Image
            src={thumbnailUrl}
            alt={hit.imageAlt || hit.title || "Product"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-[#F16D34]">
          {hit.title || "Untitled Product"}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {hit.price && (
            <p className="text-xs font-medium text-gray-500">{hit.price}</p>
          )}
          {hit.availableForSale === false && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Sold out
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gray-400 group-hover:text-[#F16D34] transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </button>
  )
}

export default SearchHit
