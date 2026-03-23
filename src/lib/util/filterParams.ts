import type { FilterState, ProductCollectionSortKeys } from "@lib/shopify/types";

export function getDefaultFilterState(): FilterState {
  return {
    collection: null,
    vendors: [],
    productTypes: [],
    tags: [],
    variantOptions: [],
    priceRange: null,
    available: false,
    onSale: false,
    sortKey: "COLLECTION_DEFAULT",
    reverse: false,
  };
}

export function parseSearchParams(params: URLSearchParams): FilterState {
  const state = getDefaultFilterState();

  const collection = params.get("collection");
  if (collection) state.collection = collection;

  const vendors = params.getAll("vendor");
  if (vendors.length) state.vendors = vendors;

  const types = params.getAll("type");
  if (types.length) state.productTypes = types;

  const tags = params.getAll("tag");
  if (tags.length) state.tags = tags;

  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  if (minPrice || maxPrice) {
    state.priceRange = {
      min: minPrice ? parseFloat(minPrice) : 0,
      max: maxPrice ? parseFloat(maxPrice) : Infinity,
    };
  }

  if (params.get("available") === "true") {
    state.available = true;
  }

  if (params.get("onSale") === "true") {
    state.onSale = true;
  }

  const sort = params.get("sort");
  if (sort) {
    state.sortKey = sort as ProductCollectionSortKeys;
  }

  if (params.get("reverse") === "true") {
    state.reverse = true;
  }

  // Variant options: ?option=Color:Red&option=Size:M
  const optionParams = params.getAll("option");
  optionParams.forEach((opt) => {
    const [name, value] = opt.split(":");
    if (name && value) {
      state.variantOptions.push({ name, value });
    }
  });

  return state;
}

export function serializeFilterState(state: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.collection) {
    params.set("collection", state.collection);
  }

  state.vendors.forEach((v) => params.append("vendor", v));
  state.productTypes.forEach((t) => params.append("type", t));
  state.tags.forEach((tag) => params.append("tag", tag));

  if (state.priceRange) {
    params.set("minPrice", String(state.priceRange.min));
    if (state.priceRange.max !== Infinity) {
      params.set("maxPrice", String(state.priceRange.max));
    }
  }

  if (state.available) {
    params.set("available", "true");
  }

  if (state.onSale) {
    params.set("onSale", "true");
  }

  if (state.sortKey !== "COLLECTION_DEFAULT") {
    params.set("sort", state.sortKey);
  }

  if (state.reverse) {
    params.set("reverse", "true");
  }

  state.variantOptions.forEach((opt) => {
    params.append("option", `${opt.name}:${opt.value}`);
  });

  return params;
}
