// STUB for migration — wires product functions to Shopify
import { getProducts, getProduct } from "@lib/shopify"

// Shared mapper: Shopify card → Medusa-like shape
function mapShopifyCard(p: any) {
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.featuredImage?.url,
    images: p.featuredImage ? [{ url: p.featuredImage.url }] : [],
    collection: { title: p.vendor },
    tags: p.tags?.map((t: string) => ({ value: t })) || [],
    options: p.options?.map((opt: any) => ({
      id: opt.id,
      title: opt.name,
      values: opt.values?.map((v: string) => ({ id: v, value: v })) || []
    })) || [],
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
  } as any;
}

export const listProducts = async (opts?: any) => {
  try {
    const handle = opts?.queryParams?.handle;
    if (handle) {
      const product = await getProduct(handle);
      return { response: { products: product ? [product] : [], count: product ? 1 : 0 } };
    }
    const { products, pageInfo } = await getProducts({ first: opts?.queryParams?.limit || 20 });
    return { response: { products: products.map(mapShopifyCard), count: products.length } };
  } catch {
    return { response: { products: [], count: 0 } };
  }
};

export const listProductsWithSort = async (opts?: any) => {
  try {
    const { products } = await getProducts({ first: 20 });
    return { response: { products: products.map(mapShopifyCard), count: products.length } };
  } catch {
    return { response: { products: [], count: 0 } };
  }
};

export const getProductByHandle = async (handle?: string, _countryCode?: string) => {
  if (!handle) return null;
  try {
    return await getProduct(handle);
  } catch {
    return null;
  }
};

export const getProductsInventory = async (ids?: string[]) => {
  // Shopify handles inventory through availableForSale, no separate endpoint needed
  return {} as Record<string, Record<string, number>>;
};

export const submitProductReview = async (opts?: any) => null as any;
export const checkProductPurchased = async (opts?: any) => false;
export const getProductReviews = async (opts?: any) => ({ reviews: [], count: 0, average_rating: 0 });
export const getProductInventory = async (opts?: any) => ({});
