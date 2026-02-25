"use client";

import type { FilterState } from "@lib/shopify/types";

type ActiveFilterPillsProps = {
  activeState: FilterState;
  onRemove: (next: FilterState) => void;
};

export default function ActiveFilterPills({
  activeState,
  onRemove,
}: ActiveFilterPillsProps) {
  const pills: { label: string; onRemove: () => void }[] = [];

  activeState.vendors.forEach((v) => {
    pills.push({
      label: `Brand: ${v}`,
      onRemove: () =>
        onRemove({
          ...activeState,
          vendors: activeState.vendors.filter((x) => x !== v),
        }),
    });
  });

  activeState.productTypes.forEach((t) => {
    pills.push({
      label: `Category: ${t}`,
      onRemove: () =>
        onRemove({
          ...activeState,
          productTypes: activeState.productTypes.filter((x) => x !== t),
        }),
    });
  });

  activeState.tags.forEach((tag) => {
    pills.push({
      label: `Tag: ${tag}`,
      onRemove: () =>
        onRemove({
          ...activeState,
          tags: activeState.tags.filter((x) => x !== tag),
        }),
    });
  });

  activeState.variantOptions.forEach((opt) => {
    pills.push({
      label: `${opt.name}: ${opt.value}`,
      onRemove: () =>
        onRemove({
          ...activeState,
          variantOptions: activeState.variantOptions.filter(
            (x) => !(x.name === opt.name && x.value === opt.value)
          ),
        }),
    });
  });

  if (activeState.priceRange) {
    const min = activeState.priceRange.min;
    const max =
      activeState.priceRange.max === Infinity
        ? "∞"
        : `₱${activeState.priceRange.max.toLocaleString()}`;
    pills.push({
      label: `Price: ₱${min.toLocaleString()} – ${max}`,
      onRemove: () => onRemove({ ...activeState, priceRange: null }),
    });
  }

  if (activeState.available) {
    pills.push({
      label: "In Stock Only",
      onRemove: () => onRemove({ ...activeState, available: false }),
    });
  }

  if (pills.length === 0) return null;

  const hasMultiple = pills.length > 1;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {pills.map((pill, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
        >
          {pill.label}
          <button
            onClick={pill.onRemove}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-300 transition-colors"
            aria-label={`Remove ${pill.label}`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      ))}
      {hasMultiple && (
        <button
          onClick={() =>
            onRemove({
              ...activeState,
              vendors: [],
              productTypes: [],
              tags: [],
              variantOptions: [],
              priceRange: null,
              available: false,
            })
          }
          className="text-sm text-gray-500 hover:text-gray-900 underline transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
