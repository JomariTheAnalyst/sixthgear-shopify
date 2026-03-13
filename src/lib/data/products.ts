// STUB for migration — wires product functions to Shopify
import { getProducts, getProduct } from "@lib/shopify"

function mapShopifyCard(p: any) {
  const price = p.priceRange?.minVariantPrice || p.variants?.edges?.[0]?.node?.price
  const compareAtPrice = p.compareAtPriceRange?.minVariantPrice || p.variants?.edges?.[0]?.node?.compareAtPrice

  // Map all images
  const images = p.images?.edges?.map((e: any) => ({ url: e.node.url })) || []
  if (images.length === 0 && p.featuredImage) {
    images.push({ url: p.featuredImage.url })
  }

  // Map all variants
  const variants = p.variants?.edges?.map((edge: any) => {
    const node = edge.node
    const variantPrice = node.price || price
    const variantCompare = node.compareAtPrice || compareAtPrice

    return {
      id: node.id,
      title: node.title || node.selectedOptions?.map((o: any) => o.value).join(" / ") || "Default Title",
      allow_backorder: false,
      manage_inventory: true,
      inventory_quantity: node.availableForSale !== false ? 10 : 0,
      options: node.selectedOptions?.map((o: any) => ({
        value: o.value,
        option: { title: o.name }
      })) || [],
      calculated_price: {
        calculated_amount: variantPrice ? parseFloat(variantPrice.amount) : null,
        original_amount: variantCompare ? parseFloat(variantCompare.amount) : null,
        currency_code: variantPrice?.currencyCode || "php"
      },
      image: node.image ? { url: node.image.url } : null,
      thumbnail: node.image?.url || null,
    }
  }) || [
    {
      id: p.id,
      allow_backorder: false,
      manage_inventory: true,
      inventory_quantity: p.availableForSale ? 10 : 0,
      calculated_price: {
        calculated_amount: price ? parseFloat(price.amount) : null,
        original_amount: compareAtPrice ? parseFloat(compareAtPrice.amount) : null,
        currency_code: price?.currencyCode || "php"
      }
    }
  ]

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.featuredImage?.url || images[0]?.url,
    images,
    collection: { title: p.vendor || "Sixthgear" },
    tags: p.tags?.map((t: string) => ({ value: t })) || [],
    options: p.options?.map((opt: any) => ({
      id: opt.id,
      title: opt.name,
      values: opt.values?.map((v: string) => ({ id: v, value: v })) || []
    })) || [],
    variants
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
