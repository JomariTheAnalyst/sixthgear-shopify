"use client";

import { useState, useRef, useEffect } from "react";
import type { ShopifyFilter, FilterState } from "@lib/shopify/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

type FilterBarProps = {
  filters: ShopifyFilter[];
  activeState: FilterState;
  onChange: (next: FilterState) => void;
  collectionsMenu?: { handle: string; title: string }[];
  brandCollectionsMenu?: { handle: string; title: string }[];
  showSoldOutToggle?: boolean;
};

export default function FilterBar({
  filters,
  activeState,
  onChange,
  collectionsMenu,
  brandCollectionsMenu,
  showSoldOutToggle = false,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [localPriceMin, setLocalPriceMin] = useState(
    activeState.priceRange?.min?.toString() || ""
  );
  const [localPriceMax, setLocalPriceMax] = useState(
    activeState.priceRange?.max !== Infinity
      ? activeState.priceRange?.max?.toString() || ""
      : ""
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Filter logic functions (byte-for-byte from FilterSidebar) ──

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

  const handleOnSaleToggle = () => {
    onChange({
      ...activeState,
      onSale: !activeState.onSale,
    });
  };

  const handleShowSoldOutToggle = () => {
    onChange({
      ...activeState,
      showSoldOut: !activeState.showSoldOut,
      available: false,
    });
  };

  // ── Active counts ──

  const activeBrandCollection = brandCollectionsMenu?.find(
    (collection) => collection.handle === activeState.collection
  );

  const activeCount =
    activeState.vendors.length +
    activeState.productTypes.length +
    activeState.tags.length +
    activeState.variantOptions.length +
    (activeState.priceRange ? 1 : 0) +
    (activeState.available ? 1 : 0) +
    (activeState.showSoldOut ? 1 : 0) +
    (activeState.onSale ? 1 : 0) +
    (activeBrandCollection ? 1 : 0);

  const getGroupActiveCount = (filter: ShopifyFilter): number => {
    if (filter.type === "PRICE_RANGE") {
      return activeState.priceRange ? 1 : 0;
    }
    const filterType = getFilterBinding(filter.id);
    const isVariant = isVariantFilter(filter.id);

    if (isVariant) {
      const optName = getVariantOptionName(filter);
      return activeState.variantOptions.filter((o) => o.name === optName)
        .length;
    }

    if (filterType === "vendors") return activeState.vendors.length;
    if (filterType === "productTypes") return activeState.productTypes.length;
    if (filterType === "tags") return activeState.tags.length;

    return 0;
  };

  const clearAll = () => {
    setLocalPriceMin("");
    setLocalPriceMax("");
    onChange({
      ...activeState,
      collection: null,
      vendors: [],
      productTypes: [],
      tags: [],
      variantOptions: [],
      priceRange: null,
      available: false,
      showSoldOut: false,
      onSale: false,
    });
  };

  // ── Filtered groups (same exclusions as FilterSidebar) ──

  const filteredGroups = filters.filter((f) => {
    const label = f.label.trim().toLowerCase();
    const id = f.id.trim().toLowerCase();
    return (
      label !== "color" &&
      label !== "availability" &&
      !id.includes("availability")
    );
  });

  // ── Render ──

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex items-center gap-2 flex-wrap">
        {/* SECTION A — Filter dropdown buttons */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide lg:flex-wrap lg:overflow-visible">
          
          {/* Custom Navigation Dropdown for Collections */}
          {collectionsMenu && collectionsMenu.length > 0 && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setOpenDropdown(openDropdown === "collection-menu" ? null : "collection-menu")}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[13px] font-bold uppercase tracking-wide transition-all duration-150 whitespace-nowrap ${
                  openDropdown === "collection-menu" ? "text-gray-500" : "text-[#111] hover:opacity-70"
                }`}
              >
                Collection
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "collection-menu" ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === "collection-menu" && (
                <div className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[220px] max-w-[280px] animate-in fade-in-0 zoom-in-95 duration-150 py-2 max-h-64 overflow-y-auto">
                  {collectionsMenu.map((col) => (
                    <LocalizedClientLink
                      key={col.handle}
                      href={`/collections/${col.handle}`}
                      className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors hover:bg-gray-50 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {col.title}
                    </LocalizedClientLink>
                  ))}
                </div>
              )}
            </div>
          )}

          {brandCollectionsMenu && brandCollectionsMenu.length > 0 && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setOpenDropdown(openDropdown === "brand-menu" ? null : "brand-menu")}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[13px] font-bold uppercase tracking-wide transition-all duration-150 whitespace-nowrap ${
                  openDropdown === "brand-menu"
                    ? "text-gray-500"
                    : activeBrandCollection
                    ? "text-[#111]"
                    : "text-[#111] hover:opacity-70"
                }`}
              >
                Brands
                {activeBrandCollection && (
                  <span
                    className={`ml-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      openDropdown === "brand-menu"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    1
                  </span>
                )}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === "brand-menu" ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === "brand-menu" && (
                <div className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[220px] max-w-[280px] animate-in fade-in-0 zoom-in-95 duration-150 py-2 max-h-64 overflow-y-auto">
                  {brandCollectionsMenu.map((brand) => {
                    const isActive = activeState.collection === brand.handle;

                    return (
                      <LocalizedClientLink
                        key={brand.handle}
                        href={`/store?collection=${encodeURIComponent(brand.handle)}`}
                        className={`flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors hover:bg-gray-50 text-sm ${
                          isActive
                            ? "font-medium text-gray-900 bg-gray-50"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {brand.title}
                      </LocalizedClientLink>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {filteredGroups.map((filter) => {
            const isOpen = openDropdown === filter.id;
            const groupCount = getGroupActiveCount(filter);
            const filterType = getFilterBinding(filter.id);
            const isVariant = isVariantFilter(filter.id);

            const uniqueValues = filter.values.filter(
              (value, index, allValues) => {
                const key = value.label.trim().toLowerCase();
                return (
                  allValues.findIndex(
                    (candidate) =>
                      candidate.label.trim().toLowerCase() === key
                  ) === index
                );
              }
            );

            return (
              <div key={filter.id} className="relative flex-shrink-0">
                {/* Dropdown trigger button */}
                <button
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : filter.id)
                  }
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[13px] font-bold uppercase tracking-wide transition-all duration-150 whitespace-nowrap ${
                    isOpen
                      ? "text-gray-500"
                      : groupCount > 0
                      ? "text-[#111]"
                      : "text-[#111] hover:opacity-70"
                  }`}
                >
                  {filter.label}
                  {groupCount > 0 && (
                    <span
                      className={`ml-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isOpen
                          ? "bg-gray-100 text-gray-500"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      {groupCount}
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
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
                </button>

                {/* Dropdown panel */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-gray-100 min-w-[220px] max-w-[280px] animate-in fade-in-0 zoom-in-95 duration-150">
                    {filter.type === "PRICE_RANGE" ? (
                      <div className="p-4 space-y-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          Price Range
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₱
                            </span>
                            <input
                              type="number"
                              placeholder="Min"
                              value={localPriceMin}
                              onChange={(e) =>
                                setLocalPriceMin(e.target.value)
                              }
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
                              onChange={(e) =>
                                setLocalPriceMax(e.target.value)
                              }
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
                    ) : (
                      <div className="py-2 max-h-64 overflow-y-auto">
                        {uniqueValues.map((val) => {
                          const isActive = isValueActive(
                            filterType,
                            val.label,
                            filter
                          );
                          const isDisabled =
                            val.count === 0 && !isActive;

                          return (
                            <label
                              key={val.id}
                              className={`flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors ${
                                isDisabled
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:bg-gray-50"
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
                                    handleCheckboxToggle(
                                      filterType,
                                      val.label
                                    );
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                              />
                              <span
                                className={`flex-1 text-sm ${
                                  isActive
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
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
                )}
              </div>
            );
          })}
        </div>

        {/* SECTION B — ON SALE toggle button */}
        <button
          onClick={handleOnSaleToggle}
          className={`inline-flex items-center px-2 py-0.5 text-[13px] font-bold uppercase tracking-wide transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
            activeState.onSale
              ? "text-orange-500 opacity-100"
              : "text-[#111] hover:opacity-70"
          }`}
        >
          On Sale
        </button>

        {/* SECTION C — Divider and Clear All */}
        {showSoldOutToggle && (
          <button
            onClick={handleShowSoldOutToggle}
            className={`inline-flex items-center px-2 py-0.5 text-[13px] font-bold uppercase tracking-wide transition-all duration-150 whitespace-nowrap flex-shrink-0 ${
              activeState.showSoldOut
                ? "text-orange-500 opacity-100"
                : "text-[#111] hover:opacity-70"
            }`}
            aria-pressed={activeState.showSoldOut}
          >
            Show Sold Out
          </button>
        )}

        {activeCount > 0 && (
          <>
            <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0" />
            <button
              onClick={clearAll}
              className="text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Clear all
            </button>
          </>
        )}
      </div>
    </div>
  );
}
