// STUB for migration — single-region setup (Philippines only)
export const getRegion = async (countryCode?: string) => ({
  id: "shopify_region",
  currency_code: "php",
  countries: [{ iso_2: "ph", name: "Philippines" }]
}) as any;

export const listRegions = async () => [{
  id: "shopify_region",
  currency_code: "php",
  countries: [{ iso_2: "ph", name: "Philippines" }]
}] as any;
