"use server"

import { cookies, headers } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  CONSENT_COOKIE_NAME,
  parseConsent,
  toShopifyVisitorConsent,
} from "@lib/consent/consent"
import {
  cartCreate as shopifyCartCreate,
  cartLinesAdd as shopifyCartLinesAdd,
  cartLinesUpdate as shopifyCartLinesUpdate,
  cartLinesRemove as shopifyCartLinesRemove,
  cartDiscountCodesUpdate as shopifyCartDiscountCodesUpdate,
  cartBuyerIdentityUpdateResult as shopifyCartBuyerIdentityUpdateResult,
} from "@lib/shopify/mutations/cart"
import {
  getCart as shopifyGetCart,
  getCartCheckoutUrlWithConsent,
} from "@lib/shopify/queries/cart"
import { ShopifyCart } from "@lib/shopify/types"

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Cookie helpers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

const CART_COOKIE = "shopify_cart_id"
const COOKIE_OPTIONS = {
  httpOnly: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  // HTTPS-only in production; plain http://localhost keeps working in dev.
  secure: process.env.NODE_ENV === "production",
}

async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const value = cookieStore.get(CART_COOKIE)?.value

  if (!value) return undefined

  // Guard: detect and reject corrupted Zustand state objects.
  // A valid Shopify cart ID starts with "gid://shopify/Cart/".
  if (!value.startsWith("gid://shopify/Cart/")) {
    console.warn("[cart] Corrupted cart cookie detected - ignoring")
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Cart actions Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

/**
 * 1. createCart Ã¢â‚¬â€ creates a new empty Shopify cart, saves ID to cookie
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
 * 2. retrieveCart Ã¢â‚¬â€ reads cart ID from cookie and fetches from Shopify
 *    Safe to call from Server Components (read-only cookie access).
 */
export async function retrieveCart(): Promise<ShopifyCart | null> {
  const cartId = await getCartId()
  if (!cartId) return null

  const cart = await shopifyGetCart(cartId)

  if (!cart) {
    // Cart is expired/invalid on Shopify's side.
    // We CANNOT delete the cookie here (may be called from Server Component).
    // Return null Ã¢â‚¬â€ the next addToCart call will create a fresh cart
    // and overwrite the stale cookie automatically.
    return null
  }

  return cart
}

/**
 * 3. addToCart Ã¢â‚¬â€ the main Server Action called by ProductActions
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

  // If no cart or stale cart Ã¢â‚¬â€ create a fresh one
  // setCartCookie() is safe here because addToCart IS a Server Action
  if (!cart) {
    cart = await createCart()
    // createCart calls setCartCookie() internally Ã¢â‚¬â€ stale cookie overwritten
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
 * 4. updateLineItem Ã¢â‚¬â€ update quantity of a line item in the cart
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
 * 5. deleteLineItem Ã¢â‚¬â€ remove a line item from the cart
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
 * 6. applyDiscount Ã¢â‚¬â€ apply a discount code to the cart
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
 * 7. associateBuyerIdentity ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â links cart to logged-in customer token when available
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
      return null
    }

    return result.cart
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * 8. getCheckoutUrl Ã¢â‚¬â€ returns the Shopify hosted checkout URL
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
  const checkoutUrl = associatedCart?.checkoutUrl || fallbackCheckoutUrl

  return (await withVisitorConsent(cart.id)) || checkoutUrl
}

/**
 * Re-reads the checkout URL with the visitor's cookie choice (sg_consent and
 * the Global Privacy Control header) encoded by Shopify. Null when there is
 * no choice to pass or the request fails, so checkout always still works.
 */
async function withVisitorConsent(cartId: string): Promise<string | null> {
  const cookieStore = await cookies()
  const headerList = await headers()
  const visitorConsent = toShopifyVisitorConsent(
    parseConsent(cookieStore.get(CONSENT_COOKIE_NAME)?.value),
    headerList.get("sec-gpc") === "1"
  )

  if (!visitorConsent) return null

  try {
    return await getCartCheckoutUrlWithConsent(cartId, visitorConsent)
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * 9. changeLineItemVariant Ã¢â‚¬â€ switches an existing cart line to another variant.
 */
export async function changeLineItemVariant(opts: {
  lineId: string
  newVariantId: string
  quantity: number
}): Promise<ShopifyCart> {
  const { lineId, newVariantId, quantity } = opts
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("[cart] changeLineItemVariant: No cart exists")
  }

  if (!lineId || !newVariantId) {
    throw new Error("[cart] changeLineItemVariant: Missing line or variant ID")
  }

  const updatedCart = await shopifyCartLinesUpdate(cartId, [
    {
      id: lineId,
      merchandiseId: newVariantId,
      quantity: Math.max(1, quantity),
    },
  ])

  if (!updatedCart) {
    throw new Error("[cart] changeLineItemVariant: Shopify returned no cart data")
  }

  revalidatePath("/", "layout")
  return updatedCart
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Legacy compat stubs (used by cart drawer, keep for now) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export const listCartOptions = async () => null as any
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

