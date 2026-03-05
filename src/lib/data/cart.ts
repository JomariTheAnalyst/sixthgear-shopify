"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  cartCreate as shopifyCartCreate,
  cartLinesAdd as shopifyCartLinesAdd,
  cartLinesUpdate as shopifyCartLinesUpdate,
  cartLinesRemove as shopifyCartLinesRemove,
  cartDiscountCodesUpdate as shopifyCartDiscountCodesUpdate,
  cartBuyerIdentityUpdateResult as shopifyCartBuyerIdentityUpdateResult,
} from "@lib/shopify/mutations/cart"
import { getCart as shopifyGetCart } from "@lib/shopify/queries/cart"
import { ShopifyCart } from "@lib/shopify/types"

// ─── Cookie helpers ─────────────────────────────────────────────────────────

const CART_COOKIE = "shopify_cart_id"
const COOKIE_OPTIONS = {
  httpOnly: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const value = cookieStore.get(CART_COOKIE)?.value

  if (!value) return undefined

  // Guard: detect and reject corrupted Zustand state objects.
  // A valid Shopify cart ID starts with "gid://shopify/Cart/".
  if (!value.startsWith("gid://shopify/Cart/")) {
    console.warn("[cart] Corrupted cart cookie detected — ignoring")
    return undefined
  }

  return value
}

async function setCartCookie(cartId: string): Promise<void> {
  // Guard: only accept valid Shopify GID format
  if (!cartId.startsWith("gid://shopify/Cart/")) {
    throw new Error(`[cart] Invalid cartId format: ${cartId}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(CART_COOKIE, cartId, COOKIE_OPTIONS)
}

async function deleteCartCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE)
}

// ─── Cart actions ───────────────────────────────────────────────────────────

/**
 * 1. createCart — creates a new empty Shopify cart, saves ID to cookie
 */
export async function createCart(): Promise<ShopifyCart> {
  const cart = await shopifyCartCreate()

  if (!cart) {
    throw new Error("[cart] Failed to create cart")
  }

  await setCartCookie(cart.id)
  return cart
}

/**
 * 2. retrieveCart — reads cart ID from cookie and fetches from Shopify
 *    Safe to call from Server Components (read-only cookie access).
 */
export async function retrieveCart(): Promise<ShopifyCart | null> {
  const cartId = await getCartId()
  if (!cartId) return null

  const cart = await shopifyGetCart(cartId)

  if (!cart) {
    // Cart is expired/invalid on Shopify's side.
    // We CANNOT delete the cookie here (may be called from Server Component).
    // Return null — the next addToCart call will create a fresh cart
    // and overwrite the stale cookie automatically.
    return null
  }

  return cart
}

/**
 * 3. addToCart — the main Server Action called by ProductActions
 *    Signature matches what callers already pass:
 *    addToCart({ variantId, quantity, countryCode })
 */
export async function addToCart(opts: {
  variantId: string
  quantity: number
  countryCode?: string
}): Promise<ShopifyCart> {
  const { variantId, quantity } = opts

  let cartId = await getCartId()
  let cart: ShopifyCart | null = null

  // Try existing cart first
  if (cartId) {
    cart = await shopifyGetCart(cartId)
  }

  // If no cart or stale cart — create a fresh one
  // setCartCookie() is safe here because addToCart IS a Server Action
  if (!cart) {
    cart = await createCart()
    // createCart calls setCartCookie() internally — stale cookie overwritten
  }

  const updatedCart = await shopifyCartLinesAdd(cart.id, [
    { merchandiseId: variantId, quantity },
  ])

  if (!updatedCart) {
    throw new Error("[cart] addToCart: Shopify returned no cart data")
  }

  // Revalidate so server components (layout, cart badge) re-render
  revalidatePath("/", "layout")

  return updatedCart
}

/**
 * 4. updateLineItem — update quantity of a line item in the cart
 */
export async function updateLineItem(opts: {
  lineId: string
  quantity: number
}): Promise<ShopifyCart> {
  const { lineId, quantity } = opts
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("[cart] updateLineItem: No cart exists")
  }

  if (quantity <= 0) {
    return deleteLineItem({ lineId })
  }

  const updatedCart = await shopifyCartLinesUpdate(cartId, [
    { id: lineId, quantity },
  ])

  if (!updatedCart) {
    throw new Error("[cart] updateLineItem: Shopify returned no cart data")
  }

  revalidatePath("/", "layout")
  return updatedCart
}

/**
 * 5. deleteLineItem — remove a line item from the cart
 */
export async function deleteLineItem(opts: {
  lineId: string
}): Promise<ShopifyCart> {
  const { lineId } = opts
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("[cart] deleteLineItem: No cart exists")
  }

  const updatedCart = await shopifyCartLinesRemove(cartId, [lineId])

  if (!updatedCart) {
    throw new Error("[cart] deleteLineItem: Shopify returned no cart data")
  }

  revalidatePath("/", "layout")
  return updatedCart
}

/**
 * 6. applyDiscount — apply a discount code to the cart
 */
export async function applyDiscount(
  discountCode: string
): Promise<ShopifyCart> {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("[cart] applyDiscount: No cart exists")
  }

  const updatedCart = await shopifyCartDiscountCodesUpdate(cartId, [
    discountCode,
  ])

  if (!updatedCart) {
    throw new Error("[cart] applyDiscount: Shopify returned no cart data")
  }

  revalidatePath("/", "layout")
  return updatedCart
}

/**
 * 7. associateBuyerIdentity â€” links cart to logged-in customer token when available
 *    Silent no-op for guests or association failures (guest checkout fallback).
 */
export async function associateBuyerIdentity(
  cartId: string
): Promise<ShopifyCart | null> {
  const { getCustomerToken } = await import("@lib/data/customer")
  const customerToken = await getCustomerToken()

  if (!customerToken) {
    return null
  }

  try {
    const result = await shopifyCartBuyerIdentityUpdateResult(cartId, {
      customerAccessToken: customerToken,
    })

    if (result.userErrors.length > 0) {
      console.warn(
        "[cart] cartBuyerIdentityUpdate userErrors:",
        result.userErrors
      )
      return null
    }

    return result.cart
  } catch (error) {
    console.warn("[cart] cartBuyerIdentityUpdate failed:", error)
    return null
  }
}

/**
 * 8. getCheckoutUrl — returns the Shopify hosted checkout URL
 *    Attempts cart/customer association first, then falls back to guest checkout URL.
 */
export async function getCheckoutUrl(): Promise<string> {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("[cart] getCheckoutUrl: No active cart")
  }

  const cart = await shopifyGetCart(cartId)

  if (!cart?.checkoutUrl) {
    throw new Error("[cart] getCheckoutUrl: Cart has no checkout URL")
  }

  const fallbackCheckoutUrl = cart.checkoutUrl
  const associatedCart = await associateBuyerIdentity(cart.id)
  if (associatedCart?.checkoutUrl) {
    return associatedCart.checkoutUrl
  }

  return fallbackCheckoutUrl
}

// ─── Legacy compat stubs (used by cart drawer, keep for now) ────────────────

export const listCartOptions = async () => null as any
export const changeLineItemVariant = async (opts?: any) => null as any
export const forceNewCart = async (_countryCode?: string) => {
  await deleteCartCookie()
  const cart = await createCart()
  revalidatePath("/", "layout")
  return cart
}
export const setAddresses = async (opts?: any) => null as any
export const updateCart = async (opts?: any) => null as any
export const applyPromotions = async (opts?: any) => null as any
export const initiatePaymentSession = async (cart?: any, data?: any) =>
  null as any
export const placeOrder = async (_cartId?: string) => null as any
export const setShippingMethod = async (opts?: any) => null as any
export const createCheckoutCartFromSelection = async (opts?: any) =>
  null as any
