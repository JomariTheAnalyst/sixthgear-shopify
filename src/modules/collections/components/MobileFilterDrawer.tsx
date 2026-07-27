"use client";

import { useState, useEffect } from "react";
import type { ShopifyFilter, FilterState } from "@lib/shopify/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useLenisScrollLock } from "@modules/common/components/lenis-provider";

type MobileFilterDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  filters: ShopifyFilter[];
  activeState: FilterState;
  onChange: (next: FilterState) => void;
  collectionsMenu?: { handle: string; title: string }[];
  brandCollectionsMenu?: { handle: string; title: string }[];
  showSoldOutToggle?: boolean;
  productCount: number;
};

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  activeState,
  onChange,
  collectionsMenu,
  brandCollectionsMenu,
  showSoldOutToggle = false,
  productCount,
}: MobileFilterDrawerProps) {
  useLenisScrollLock(isOpen);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [localPriceMin, setLocalPriceMin] = useState(
    activeState.priceRange?.min?.toString() || ""
  );
  const [localPriceMax, setLocalPriceMax] = useState(
    activeState.priceRange?.max !== Infinity
      ? activeState.priceRange?.max?.toString() || ""
      : ""
  );

  // ── Filter logic ──

  const getFilterBinding = (filterId: string) => {
    if (filterId.includes("vendor") || filterId.includes("productVendor"))
      return "vendors";
    if (filterId.includes("productType") || filterId.includes("product_type"))
      return "productTypes";
    if (filterId.includes("tag")) return "tags";
    return null;
  };

  const isVariantFilter = (filterId: string) =>
    filterId.includes("option") ||
    filterId.includes("variant") ||
    filterId.includes("filter.v.option");

  const getVariantOptionName = (filter: ShopifyFilter): string => filter.label;

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

  const handleOnSaleToggle = () =>
    onChange({ ...activeState, onSale: !activeState.onSale });

  const handleShowSoldOutToggle = () =>
    onChange({
      ...activeState,
      showSoldOut: !activeState.showSoldOut,
      available: false,
    });

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

  const getGroupActiveCount = (filter: ShopifyFilter): number => {
    if (filter.type === "PRICE_RANGE") return activeState.priceRange ? 1 : 0;
    const filterType = getFilterBinding(filter.id);
    if (isVariantFilter(filter.id)) {
      const optName = getVariantOptionName(filter);
      return activeState.variantOptions.filter((o) => o.name === optName).length;
    }
    if (filterType === "vendors") return activeState.vendors.length;
    if (filterType === "productTypes") return activeState.productTypes.length;
    if (filterType === "tags") return activeState.tags.length;
    return 0;
  };

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

  const filteredGroups = filters.filter((f) => {
    const label = f.label.trim().toLowerCase();
    const id = f.id.trim().toLowerCase();
    return label !== "color" && label !== "availability" && !id.includes("availability");
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] bg-black/40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-0 z-[201] bg-[#F8F8F5] flex flex-col transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 bg-[#F8F8F5]">
          <span className="text-base font-bold uppercase tracking-widest text-[#111]">
            Filters
            {activeCount > 0 && (
              <span className="ml-2 text-xs font-bold text-gray-400">
                ({activeCount} active)
              </span>
            )}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#111] hover:opacity-60 transition-opacity"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Filter List */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto">
          {/* Collection row */}
          {collectionsMenu && collectionsMenu.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() =>
                  setOpenGroup(openGroup === "collections" ? null : "collections")
                }
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-[#111]">
                  Collection
                </span>
                <svg
                  className={`w-4 h-4 text-[#111] transition-transform duration-200 ${
                    openGroup === "collections" ? "rotate-45" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {openGroup === "collections" && (
                <div className="px-5 pb-4 space-y-1">
                  {collectionsMenu.map((col) => (
                    <LocalizedClientLink
                      key={col.handle}
                      href={`/collections/${col.handle}`}
                      className="block py-2 text-sm text-gray-600 hover:text-[#111] transition-colors"
                      onClick={onClose}
                    >
                      {col.title}
                    </LocalizedClientLink>
                  ))}
                </div>
              )}
            </div>
          )}

          {brandCollectionsMenu && brandCollectionsMenu.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() =>
                  setOpenGroup(openGroup === "brands" ? null : "brands")
                }
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-[#111] flex items-center gap-2">
                  Brands
                  {activeBrandCollection && (
                    <span className="w-4 h-4 rounded-full bg-[#111] text-white text-[10px] flex items-center justify-center font-bold">
                      1
                    </span>
                  )}
                </span>
                <svg
                  className={`w-4 h-4 text-[#111] transition-transform duration-200 ${
                    openGroup === "brands" ? "rotate-45" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {openGroup === "brands" && (
                <div className="px-5 pb-4 space-y-1">
                  {brandCollectionsMenu.map((brand) => {
                    const isActive = activeState.collection === brand.handle;

                    return (
                      <LocalizedClientLink
                        key={brand.handle}
                        href={`/store?collection=${encodeURIComponent(brand.handle)}`}
                        className={`block py-2 text-sm transition-colors ${
                          isActive
                            ? "font-medium text-[#111]"
                            : "text-gray-600 hover:text-[#111]"
                        }`}
                        onClick={onClose}
                      >
                        {brand.title}
                      </LocalizedClientLink>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Dynamic filter groups */}
          {filteredGroups.map((filter) => {
            const isGroupOpen = openGroup === filter.id;
            const groupCount = getGroupActiveCount(filter);
            const filterType = getFilterBinding(filter.id);
            const isVariant = isVariantFilter(filter.id);

            const uniqueValues = filter.values.filter((value, index, all) => {
              const key = value.label.trim().toLowerCase();
              return all.findIndex((c) => c.label.trim().toLowerCase() === key) === index;
            });

            return (
              <div key={filter.id} className="border-b border-gray-200">
                <button
                  onClick={() => setOpenGroup(isGroupOpen ? null : filter.id)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-[#111] flex items-center gap-2">
                    {filter.label}
                    {groupCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#111] text-white text-[10px] flex items-center justify-center font-bold">
                        {groupCount}
                      </span>
                    )}
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#111] transition-transform duration-200 ${
                      isGroupOpen ? "rotate-45" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
                  </svg>
                </button>

                {isGroupOpen && (
                  <div className="px-5 pb-4">
                    {filter.type === "PRICE_RANGE" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₱</span>
                            <input
                              type="number"
                              placeholder="Min"
                              value={localPriceMin}
                              onChange={(e) => setLocalPriceMin(e.target.value)}
                              className="w-full pl-6 pr-2 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
                            />
                          </div>
                          <span className="text-gray-300 text-xs">–</span>
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₱</span>
                            <input
                              type="number"
                              placeholder="Max"
                              value={localPriceMax}
                              onChange={(e) => setLocalPriceMax(e.target.value)}
                              className="w-full pl-6 pr-2 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handlePriceApply}
                          className="w-full py-2 bg-[#111] text-white text-xs font-bold uppercase rounded-lg"
                        >
                          Apply
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {uniqueValues.map((val) => {
                          const isActive = isValueActive(filterType, val.label, filter);
                          const isDisabled = val.count === 0 && !isActive;
                          return (
                            <label
                              key={val.id}
                              className={`flex items-center gap-3 py-2.5 cursor-pointer ${
                                isDisabled ? "opacity-40 cursor-not-allowed" : ""
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
                                className="w-4 h-4 rounded border-gray-400 text-[#111] focus:ring-[#111] cursor-pointer"
                              />
                              <span className={`flex-1 text-sm ${isActive ? "text-[#111] font-medium" : "text-gray-600"}`}>
                                {val.label}
                              </span>
                              <span className="text-[11px] text-gray-400 tabular-nums">{val.count}</span>
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

        {/* On Sale row */}
        <div className="border-b border-gray-200">
          <button
            onClick={handleOnSaleToggle}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <span className={`text-sm font-bold uppercase tracking-widest ${activeState.onSale ? "text-orange-500" : "text-[#111]"}`}>
              On Sale
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${activeState.onSale ? "rotate-45 text-orange-500" : "text-[#111]"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        {showSoldOutToggle && (
          <div className="border-b border-gray-200">
            <button
              onClick={handleShowSoldOutToggle}
              className="w-full flex items-center justify-between px-5 py-4"
              aria-pressed={activeState.showSoldOut}
            >
              <span className={`text-sm font-bold uppercase tracking-widest ${activeState.showSoldOut ? "text-orange-500" : "text-[#111]"}`}>
                Show Sold Out
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${activeState.showSoldOut ? "rotate-45 text-orange-500" : "text-[#111]"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        )}
        </div>

        {/* Sticky Footer */}
        <div className="px-5 py-4 border-t border-gray-200 bg-[#F8F8F5] flex gap-3">
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex-none px-4 py-4 border border-gray-300 rounded-lg text-[#111] text-xs font-bold uppercase tracking-wide hover:border-[#111] transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-[#111] text-white font-bold uppercase tracking-widest text-sm rounded-lg text-center"
          >
            View {productCount} Product{productCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
}
