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
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  const activeCount =
    activeState.vendors.length +
    activeState.productTypes.length +
    activeState.tags.length +
    activeState.variantOptions.length +
    (activeState.priceRange ? 1 : 0) +
    (activeState.available ? 1 : 0);

  const clearAll = () => {
    setLocalPriceMin("");
    setLocalPriceMax("");
    onChange({
      ...activeState,
      vendors: [],
      productTypes: [],
      tags: [],
      variantOptions: [],
      priceRange: null,
      available: false,
    });
  };

  const renderFilterGroup = (filter: ShopifyFilter) => {
    const isCollapsed = collapsedSections[filter.id] ?? false;

    // Price range filter
    if (filter.type === "PRICE_RANGE") {
      return (
        <div key={filter.id} className="border-b border-gray-100 py-4">
          <button
            onClick={() => toggleSection(filter.id)}
            className="w-full flex items-center justify-between group"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
              {filter.label}
            </h3>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                isCollapsed ? "" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {!isCollapsed && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ₱
                  </span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={localPriceMin}
                    onChange={(e) => setLocalPriceMin(e.target.value)}
                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
                  />
                </div>
                <span className="text-gray-300 text-xs">–</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ₱
                  </span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={localPriceMax}
                    onChange={(e) => setLocalPriceMax(e.target.value)}
                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePriceApply}
                  className="flex-1 py-1.5 bg-gray-900 text-white text-xs font-semibold uppercase rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
                {activeState.priceRange && (
                  <button
                    onClick={handlePriceClear}
                    className="py-1.5 px-3 text-xs text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
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
      <div key={filter.id} className="border-b border-gray-100 py-4">
        <button
          onClick={() => toggleSection(filter.id)}
          className="w-full flex items-center justify-between group"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
            {filter.label}
          </h3>
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              isCollapsed ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {!isCollapsed && (
          <div className="mt-3 space-y-2 max-h-52 overflow-y-auto pr-1">
            {uniqueValues.map((val) => {
              const isActive = isValueActive(filterType, val.label, filter);
              const isDisabled = val.count === 0 && !isActive;

              return (
                <label
                  key={val.id}
                  className={`flex items-center gap-2.5 py-0.5 cursor-pointer text-sm ${
                    isDisabled
                      ? "opacity-30 cursor-not-allowed"
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
                    className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-offset-0 transition-colors"
                  />
                  <span className={`flex-1 text-sm ${isActive ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                    {val.label}
                  </span>
                  <span className="text-[10px] text-gray-300 tabular-nums">
                    {val.count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const filteredGroups = filters.filter((f) => {
    const label = f.label.trim().toLowerCase();
    const id = f.id.trim().toLowerCase();
    return (
      label !== "color" &&
      label !== "availability" &&
      !id.includes("availability")
    );
  });

  const sidebarContent = (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            Filters
          </h2>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gray-900 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Groups */}
      {filteredGroups.map((filter) => renderFilterGroup(filter))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0 pr-6">
        <div className="sticky top-28">{sidebarContent}</div>
      </aside>

      {/* Mobile drawer overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up">
            {/* Drawer Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Filters</h2>
                {activeCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gray-900 rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                onClick={onMobileClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content */}
            <div className="px-6 py-2">
              {filteredGroups.map((filter) => renderFilterGroup(filter))}
            </div>

            {/* Drawer Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onMobileClose}
                className="flex-1 py-3 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
