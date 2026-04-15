import { create } from "zustand";
import { ShopifyCart } from "./shopify/types";

export interface CartStore {
  cartId: string | null;
  cart: ShopifyCart | null;
  isDrawerOpen: boolean;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  setCartId: (cartId: string | null) => void;
  setCart: (cart: ShopifyCart | null) => void;
}

/**
 * Zustand cart store â€” IN-MEMORY ONLY, no persistence.
 *
 * The cart ID is owned by the server-side HttpOnly cookie
 * managed by src/lib/data/cart.ts (Server Actions).
 * This store holds the ShopifyCart object for UI rendering only.
 * On page refresh, the cart is re-fetched from Shopify via retrieveCart().
 */
export const useCartStore = create<CartStore>()((set, get) => ({
  cartId: null,
  cart: null,
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  setCartId: (cartId) => set({ cartId }),
  setCart: (cart) => set({ cart }),

  addItem: async () => {
    // Cart operations are handled by Server Actions in src/lib/data/cart.ts
    // This method is kept for interface compat but should not be called directly.
  },

  removeItem: async () => {
  },

  updateItem: async () => {
  },
}));
