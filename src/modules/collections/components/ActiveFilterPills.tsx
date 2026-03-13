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
      label: v,
      onRemove: () =>
        onRemove({
          ...activeState,
          vendors: activeState.vendors.filter((x) => x !== v),
        }),
    });
  });

  activeState.productTypes.forEach((t) => {
    pills.push({
      label: t,
      onRemove: () =>
        onRemove({
          ...activeState,
          productTypes: activeState.productTypes.filter((x) => x !== t),
        }),
    });
  });

  activeState.tags.forEach((tag) => {
    pills.push({
      label: tag,
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
      label: `₱${min.toLocaleString()} – ${max}`,
      onRemove: () => onRemove({ ...activeState, priceRange: null }),
    });
  }

  if (activeState.available) {
    pills.push({
      label: "In Stock Only",
      onRemove: () => onRemove({ ...activeState, available: false }),
    });
  }

  if (activeState.onSale) {
    pills.push({
      label: "On Sale",
      onRemove: () => onRemove({ ...activeState, onSale: false }),
    });
  }

  if (pills.length === 0) return null;

  const hasMultiple = pills.length > 1;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {pills.map((pill, i) => (
        <span
          key={i}
          className="group inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100 hover:border-gray-300 transition-all"
        >
          {pill.label}
          <button
            onClick={pill.onRemove}
            className="w-4 h-4 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            aria-label={`Remove ${pill.label}`}
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
              onSale: false,
            })
          }
          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
