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
        className="text-sm font-medium text-gray-600 whitespace-nowrap"
      >
        Sort by:
      </label>
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
        className="text-sm border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:border-gray-900 cursor-pointer"
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
    </div>
  );
}
