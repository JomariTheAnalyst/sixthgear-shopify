// STUB for migration — returns Shopify collections as "categories"
import { getCollections } from "@lib/shopify"

export const getCategoryByHandle = async (handle?: string) => {
  if (!handle) return null;
  const collections = await getCollections(50);
  return collections.find(c => c.handle === handle) || null;
};

export const listCategories = async () => {
  try {
    const collections = await getCollections(20);
    return collections.map(c => ({
      id: c.id,
      name: c.title,
      handle: c.handle,
      description: c.description || "",
    }));
  } catch {
    return [];
  }
};
