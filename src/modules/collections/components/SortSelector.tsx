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
    <div className="relative group cursor-pointer inline-flex items-center gap-1.5 px-2 py-0.5 text-[#111] transition-opacity hover:opacity-70">
      <span className="text-[13px] font-bold uppercase tracking-wide">
        Sort
      </span>
      <svg
        className="w-3.5 h-3.5 text-[#111]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[16px]"
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
