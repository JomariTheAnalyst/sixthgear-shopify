// STUB for migration — returns empty array (Shopify does not have a native "brands" concept)
export const listBrands = async () => {
  return [] as { id: string; name: string; handle: string }[];
};
