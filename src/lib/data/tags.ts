// STUB for migration — uses Shopify product tag search
import { getProducts } from "@lib/shopify"

export const getProductsByTagValue = async (tag?: string, limit?: number, _regionId?: string) => {
  if (!tag) return [];
  try {
    const { products } = await getProducts({ first: limit || 20, query: `tag:${tag}` });
    // Map to the Medusa-like format expected by consumers
    return products.map(p => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      thumbnail: p.featuredImage?.url,
      images: p.featuredImage ? [{ url: p.featuredImage.url }] : [],
      collection: { title: p.vendor },
      variants: [
        {
          id: p.id,
          allow_backorder: false,
          manage_inventory: true,
          inventory_quantity: p.availableForSale ? 10 : 0,
          calculated_price: {
            calculated_amount: p.priceRange?.minVariantPrice ? parseFloat(p.priceRange.minVariantPrice.amount) : null,
            original_amount: p.compareAtPriceRange?.minVariantPrice ? parseFloat(p.compareAtPriceRange.minVariantPrice.amount) : null,
            currency_code: p.priceRange?.minVariantPrice?.currencyCode || "php"
          }
        }
      ]
    })) as any[];
  } catch {
    return [];
  }
};
