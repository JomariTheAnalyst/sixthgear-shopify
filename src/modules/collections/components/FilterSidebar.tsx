"use client";

import { useState } from "react";
import type { ShopifyFilter, FilterState } from "@lib/shopify/types";

type FilterSidebarProps = {
  filters: ShopifyFilter[];
  activeState: FilterState;
  onChange: (next: FilterState) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

export default function FilterSidebar({
  filters,
  activeState,
  onChange,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const [localPriceMin, setLocalPriceMin] = useState(
    activeState.priceRange?.min?.toString() || ""
  );
  const [localPriceMax, setLocalPriceMax] = useState(
    activeState.priceRange?.max !== Infinity
      ? activeState.priceRange?.max?.toString() || ""
      : ""
  );

  const handleCheckboxToggle = (
    filterType: "vendors" | "productTypes" | "tags",
    value: string
  ) => {
    const current = activeState[filterType] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onChange({ ...activeState, [filterType]: next });
  };

  const handleVariantOptionToggle = (name: string, value: string) => {
    const exists = activeState.variantOptions.find(
      (o) => o.name === name && o.value === value
    );
    const next = exists
      ? activeState.variantOptions.filter(
          (o) => !(o.name === name && o.value === value)
        )
      : [...activeState.variantOptions, { name, value }];

    onChange({ ...activeState, variantOptions: next });
  };

  const handlePriceApply = () => {
    const min = localPriceMin ? parseFloat(localPriceMin) : 0;
    const max = localPriceMax ? parseFloat(localPriceMax) : Infinity;
    onChange({
      ...activeState,
      priceRange: min === 0 && max === Infinity ? null : { min, max },
    });
  };

  const handlePriceClear = () => {
    setLocalPriceMin("");
    setLocalPriceMax("");
    onChange({ ...activeState, priceRange: null });
  };

  // Map Shopify filter IDs to our state keys
  const getFilterBinding = (filterId: string) => {
    if (filterId.includes("vendor") || filterId.includes("productVendor"))
      return "vendors";
    if (filterId.includes("productType") || filterId.includes("product_type"))
      return "productTypes";
    if (filterId.includes("tag")) return "tags";
    return null;
  };

  const isVariantFilter = (filterId: string) => {
    return (
      filterId.includes("option") ||
      filterId.includes("variant") ||
      filterId.includes("filter.v.option")
    );
  };

  const getVariantOptionName = (filter: ShopifyFilter): string => {
    // Extract option name from the filter label (e.g., "Color", "Size")
    return filter.label;
  };

  const isValueActive = (
    filterType: string | null,
    value: string,
    filter: ShopifyFilter
  ): boolean => {
    if (filterType === "vendors") return activeState.vendors.includes(value);
    if (filterType === "productTypes")
      return activeState.productTypes.includes(value);
    if (filterType === "tags") return activeState.tags.includes(value);
    if (isVariantFilter(filter.id)) {
      const optName = getVariantOptionName(filter);
      return activeState.variantOptions.some(
        (o) => o.name === optName && o.value === value
      );
    }
    return false;
  };

  const renderFilterGroup = (filter: ShopifyFilter) => {
    // Price range filter
    if (filter.type === "PRICE_RANGE") {
      return (
        <div key={filter.id} className="border-b border-gray-200 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">
            {filter.label}
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₱
              </span>
              <input
                type="number"
                placeholder="Min"
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(e.target.value)}
                className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
              />
            </div>
            <span className="text-gray-400">–</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ₱
              </span>
              <input
                type="number"
                placeholder="Max"
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(e.target.value)}
                className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handlePriceApply}
              className="flex-1 py-1.5 bg-gray-900 text-white text-xs font-semibold uppercase rounded hover:bg-gray-800 transition-colors"
            >
              Apply
            </button>
            {activeState.priceRange && (
              <button
                onClick={handlePriceClear}
                className="py-1.5 px-3 text-xs text-gray-500 hover:text-gray-900 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      );
    }

    // List-type filters (checkboxes)
    const filterType = getFilterBinding(filter.id);
    const isVariant = isVariantFilter(filter.id);
    const uniqueValues = filter.values.filter((value, index, allValues) => {
      const key = value.label.trim().toLowerCase();
      return (
        allValues.findIndex(
          (candidate) => candidate.label.trim().toLowerCase() === key
        ) === index
      );
    });

    return (
      <div key={filter.id} className="border-b border-gray-200 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-3">
          {filter.label}
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {uniqueValues.map((val) => {
            const isActive = isValueActive(filterType, val.label, filter);
            const isDisabled = val.count === 0 && !isActive;

            return (
              <label
                key={val.id}
                className={`flex items-center gap-2 cursor-pointer text-sm ${
                  isDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-gray-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  disabled={isDisabled}
                  onChange={() => {
                    if (isDisabled) return;
                    if (isVariant) {
                      handleVariantOptionToggle(
                        getVariantOptionName(filter),
                        val.label
                      );
                    } else if (filterType) {
                      handleCheckboxToggle(filterType, val.label);
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-gray-700">{val.label}</span>
                <span className="text-gray-400 text-xs ml-auto">
                  ({val.count})
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const sidebarContent = (
    <div className="space-y-0">
      {/* Dynamic Shopify filters */}
      {filters
        .filter((f) => {
          const label = f.label.trim().toLowerCase();
          const id = f.id.trim().toLowerCase();
          return (
            label !== "color" &&
            label !== "availability" &&
            !id.includes("availability")
          );
        })
        .map((filter) => renderFilterGroup(filter))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 pr-8">
        <h2
          className="text-lg font-black uppercase tracking-tight text-gray-900 mb-4"
          style={{ fontFamily: "BRHendrix, sans-serif" }}
        >
          Filters
        </h2>
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-black uppercase tracking-tight text-gray-900"
                style={{ fontFamily: "BRHendrix, sans-serif" }}
              >
                Filters
              </h2>
              <button
                onClick={onMobileClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
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
            </div>
            {sidebarContent}
            <button
              onClick={onMobileClose}
              className="w-full mt-4 py-3 bg-gray-900 text-white font-bold uppercase text-sm rounded hover:bg-gray-800 transition-colors"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
