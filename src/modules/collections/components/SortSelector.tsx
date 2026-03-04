"use client";

import { SORT_OPTIONS, type ProductCollectionSortKeys } from "@lib/shopify/types";

type SortSelectorProps = {
  currentSortKey: ProductCollectionSortKeys;
  currentReverse: boolean;
  onChange: (sortKey: ProductCollectionSortKeys, reverse: boolean) => void;
};

export default function SortSelector({
  currentSortKey,
  currentReverse,
  onChange,
}: SortSelectorProps) {
  const currentValue = `${currentSortKey}-${currentReverse}`;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="hidden sm:inline text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap"
      >
        Sort by
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={currentValue}
          onChange={(e) => {
            const [sortKey, reverse] = e.target.value.split("-");
            onChange(
              sortKey as ProductCollectionSortKeys,
              reverse === "true"
            );
          }}
          className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 cursor-pointer transition-all"
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={`${option.sortKey}-${option.reverse}`}
              value={`${option.sortKey}-${option.reverse}`}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
