"use server"

import { cookies, headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomBytes } from "crypto"
import { serverEnv } from "@lib/env"
import {
  customerCreate as shopifyCustomerCreate,
  customerAccessTokenCreate,
  customerAccessTokenDelete,
  customerRecover as shopifyCustomerRecover,
  customerResetByUrl as shopifyCustomerResetByUrl,
  customerActivateByUrl as shopifyCustomerActivateByUrl,
  customerUpdate as shopifyCustomerUpdate,
  customerAddressCreate as shopifyCustomerAddressCreate,
  customerAddressUpdate as shopifyCustomerAddressUpdate,
  customerAddressDelete as shopifyCustomerAddressDelete,
  customerDefaultAddressUpdate as shopifyCustomerDefaultAddressUpdate,
} from "@lib/shopify/mutations/customer"
import { getCustomer as shopifyGetCustomer } from "@lib/shopify/queries/customer"
import { ShopifyCustomer } from "@lib/shopify/types"
import {
  authRateLimit,
  recoverRateLimit,
  registerRateLimit,
  resetRateLimit,
  updateRateLimit,
  passwordChangeRateLimit,
} from "@lib/util/rate-limit"
import {
  TURNSTILE_ERROR_MESSAGE,
  TURNSTILE_FIELD,
  verifyTurnstile,
} from "@lib/util/turnstile"

/** Visitor IP, read the same way as the rate limiter in @lib/util/rate-limit. */
async function getRequestIp(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get("x-forwarded-for")
  const realIp = headersList.get("x-real-ip")
  return forwarded?.split(",")[0].trim() ?? realIp ?? "anonymous"
}

// â”€â”€â”€ Cookie Helpers â€” Customer Token â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token"
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: serverEnv.NODE_ENV === "production",
}

export async function getCustomerToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value
}

async function setCustomerToken(
  token: string,
  expiresAt: string
): Promise<void> {
  const expiryDate = new Date(expiresAt)
  const maxAge = Math.floor((expiryDate.getTime() - Date.now()) / 1000)
  const cookieStore = await cookies()
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge: Math.max(maxAge, 0),
  })
}

async function deleteCustomerToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE)
}

// â”€â”€â”€ Auth Result Type â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type AuthResult = {
  success: boolean
  error?: string
}

type ActivationErrorCode =
  | "activation_missing_url"
  | "activation_malformed_url"
  | "activation_expired"
  | "activation_used"
  | "already_activated"
  | "activation_failed"

type LegacyAddressActionState = {
  success: boolean
  error: string | boolean | null
  [key: string]: unknown
}

function mapActivationError(
  code: string | undefined,
  message: string | undefined
): ActivationErrorCode {
  const normalizedCode = (code || "").toUpperCase()
  const normalizedMessage = (message || "").toLowerCase()

  if (
    normalizedCode.includes("ALREADY") ||
    normalizedCode.includes("ENABLED") ||
    normalizedMessage.includes("already enabled") ||
    normalizedMessage.includes("already active")
  ) {
    return "already_activated"
  }

  if (
    normalizedCode.includes("EXPIRED") ||
    normalizedMessage.includes("expired")
  ) {
    return "activation_expired"
  }

  if (
    normalizedMessage.includes("already been used") ||
    normalizedMessage.includes("already used")
  ) {
    return "activation_used"
  }

  if (
    normalizedCode.includes("INVALID") ||
    normalizedMessage.includes("invalid")
  ) {
    return "activation_malformed_url"
  }

  return "activation_failed"
}

function generateActivationPassword(): string {
  const lower = "abcdefghijklmnopqrstuvwxyz"
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const digits = "0123456789"
  const symbols = "!@#$%^&*()-_=+"
  const all = `${lower}${upper}${digits}${symbols}`

  const pick = (chars: string) => chars[randomBytes(1)[0] % chars.length]

  // Ensure mixed character classes while keeping the full value random.
  const chars = [
    pick(lower),
    pick(upper),
    pick(digits),
    pick(symbols),
    ...Array.from(randomBytes(20), (b) => all[b % all.length]),
  ]

  // Shuffle using cryptographic randomness (Fisher-Yates).
  const entropy = randomBytes(chars.length)
  for (let i = chars.length - 1; i > 0; i--) {
    const j = entropy[i] % (i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join("")
}

function isLegacyAddressState(
  state: string | null | LegacyAddressActionState | Record<string, unknown>
): state is LegacyAddressActionState {
  return (
    typeof state === "object" &&
    state !== null &&
    !Array.isArray(state) &&
    "success" in state &&
    "error" in state
  )
}

function toAddressActionResult(
  state: string | null | LegacyAddressActionState | Record<string, unknown>,
  error: string | null
): string | null | LegacyAddressActionState {
  if (typeof state === "object" && state !== null && !Array.isArray(state)) {
    return {
      ...state,
      success: error === null,
      error,
    }
  }
  return error
}

// â”€â”€â”€ Server Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Register a new customer.
 * Called via useActionState from RegisterForm.
 *
 * This implements Option A: The password is sent to customerCreate,
 * which creates the account as ACTIVE immediately (no invite email).
 * Upon success, we immediately call customerAccessTokenCreate to log
 * the user in, store the token, and return null so the client redirects
 * to /account.
 */
export async function signup(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const firstName = formData.get("first_name") as string
  const lastName = formData.get("last_name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!firstName || !lastName || !email) {
    return "All fields are required."
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters."
  }

  // Rate Limiting
  const allowed = await registerRateLimit.check(5)
  if (!allowed) {
    return "Too many requests. Please try again later."
  }

  if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), await getRequestIp()))) {
    return TURNSTILE_ERROR_MESSAGE
  }

  try {
    // 1. Create the customer WITH password (auto-activates)
    const result = await shopifyCustomerCreate({
      firstName,
      lastName,
      email,
      password,
    })

    if (!result) {
      return "Registration failed. Please try again."
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      const errorCode = userErrors[0].code
      switch (errorCode) {
        case "TAKEN":
          return "An account with this email already exists."
        case "TOO_SHORT": // Shopify might return this for password constraints
          return "Password must be at least 8 characters."
        default:
          return userErrors[0].message || "Registration failed. Please try again."
      }
    }

    // 2. Success! Setup the session automatically.
    // Call the login API to get the token.
    const loginResult = await customerAccessTokenCreate({ email, password })

    if (
      loginResult && 
      (!loginResult.customerUserErrors || loginResult.customerUserErrors.length === 0) &&
      loginResult.customerAccessToken
    ) {
      await setCustomerToken(
        loginResult.customerAccessToken.accessToken,
        loginResult.customerAccessToken.expiresAt
      )
    }
    // If auto-login fails for some edge case, we still return null
    // so the user is sent to the success path (they can manually log in).

    return null
  } catch (error) {
    console.error(error)
    return "Registration failed. Please try again."
  }
}

/**
 * Login with email and password.
 * Called via useActionState from LoginForm.
 */
export async function login(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return "Email and password are required."
  }

  // Rate Limiting
  const allowed = await authRateLimit.check(5)
  if (!allowed) {
    return "Too many requests. Please try again later."
  }

  try {
    const result = await customerAccessTokenCreate({ email, password })

    if (!result) {
      return "Login failed. Please try again."
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      const errorCode = userErrors[0].code
      switch (errorCode) {
        case "UNIDENTIFIED_CUSTOMER":
          return "Invalid email or password."
        case "CUSTOMER_DISABLED":
          return "Your account is not activated. Check your email."
        default:
          return userErrors[0].message || "Login failed. Please try again."
      }
    }

    if (!result.customerAccessToken) {
      return "Login failed. No access token received."
    }

    await setCustomerToken(
      result.customerAccessToken.accessToken,
      result.customerAccessToken.expiresAt
    )

    return null
  } catch (error) {
    console.error(error)
    return "Login failed. Please try again."
  }
}

/**
 * Logout â€” invalidate token on Shopify, clear cookie, redirect.
 */
export async function signout(): Promise<void> {
  const token = await getCustomerToken()

  if (token) {
    // Fire and forget â€” don't block on Shopify's response
    customerAccessTokenDelete(token).catch(() => {})
  }

  await deleteCustomerToken()
  revalidatePath("/", "layout")
  redirect("/")
}

/**
 * Get the authenticated customer's data.
 * Returns null if not logged in or token expired.
 */
export async function retrieveCustomer(): Promise<ShopifyCustomer | null> {
  const token = await getCustomerToken()
  if (!token) return null

  try {
    const customer = await shopifyGetCustomer(token)

    if (!customer) {
      // Token may be invalid/expired. In Server Components we cannot mutate cookies.
      // Keep this read-only and let explicit auth actions/routes clear stale cookies.
      return null
    }

    return customer
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Request a password reset email.
 * Always returns success for security (never confirms if email exists).
 */
export async function requestPasswordReset(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const email = formData.get("email") as string

  if (!email) {
    return "Email is required."
  }

  // Rate Limiting
  const allowed = await recoverRateLimit.check(5)
  if (!allowed) {
    return "Too many requests. Please try again later."
  }

  if (!(await verifyTurnstile(formData.get(TURNSTILE_FIELD), await getRequestIp()))) {
    return TURNSTILE_ERROR_MESSAGE
  }

  try {
    await shopifyCustomerRecover(email)
    return "success"
  } catch (error) {
    console.error(error)
    return "Something went wrong. Please try again."
  }
}

/**
 * Reset password using the Shopify reset URL from the email.
 */
export async function resetPassword(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const resetUrl = formData.get("reset_url") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm_password") as string

  if (!resetUrl || !password) {
    return "Missing required fields."
  }

  // Rate Limiting
  const allowed = await resetRateLimit.check(5)
  if (!allowed) {
    return "Too many requests. Please try again later."
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters."
  }

  if (password !== confirmPassword) {
    return "Passwords do not match."
  }

  try {
    const result = await shopifyCustomerResetByUrl(resetUrl, password)

    if (!result) {
      return "Password reset failed. The link may have expired."
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      return userErrors[0].message || "Password reset failed."
    }

    // Auto-login after successful reset
    if (result.customerAccessToken) {
      await setCustomerToken(
        result.customerAccessToken.accessToken,
        result.customerAccessToken.expiresAt
      )
    }

    return "success"
  } catch (error) {
    console.error(error)
    return "Password reset failed. Please try again."
  }
}

export async function getCustomerOrders(
  cursor?: string
): Promise<{
  orders: ShopifyCustomer["orders"]["edges"][number]["node"][]
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
}> {
  const token = await getCustomerToken()
  if (!token) {
    return {
      orders: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    }
  }

  try {
    const customer = await shopifyGetCustomer(token, cursor)

    if (!customer) {
      return {
        orders: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      }
    }

    return {
      orders: customer.orders?.edges?.map((edge) => edge.node) ?? [],
      pageInfo: {
        hasNextPage: customer.orders?.pageInfo?.hasNextPage ?? false,
        endCursor: customer.orders?.pageInfo?.endCursor ?? null,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      orders: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    }
  }
}

/**
 * Activate customer account using a Shopify activation URL.
 * On success, stores the returned customer token cookie.
 */
export async function activateCustomerAccountByUrl(
  activationUrl: string
): Promise<{ success: boolean; error?: ActivationErrorCode }> {
  if (!activationUrl?.trim()) {
    return { success: false, error: "activation_malformed_url" }
  }

  // Shopify requires a password in customerActivateByUrl.
  // Generate it server-side; it is never hardcoded or persisted.
  const generatedPassword = generateActivationPassword()

  try {
    const result = await shopifyCustomerActivateByUrl(
      activationUrl.trim(),
      generatedPassword
    )

    if (!result) {
      return { success: false, error: "activation_failed" }
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      const firstError = userErrors[0]
      return {
        success: false,
        error: mapActivationError(firstError.code, firstError.message),
      }
    }

    if (!result.customerAccessToken) {
      return { success: false, error: "activation_failed" }
    }

    await setCustomerToken(
      result.customerAccessToken.accessToken,
      result.customerAccessToken.expiresAt
    )

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "activation_failed" }
  }
}

/**
 * Update customer profile.
 * Called via useActionState from ProfileForm.
 */
export async function updateCustomer(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const token = await getCustomerToken()
  if (!token) return "You must be logged in."

  const firstName = formData.get("first_name") as string | null
  const lastName = formData.get("last_name") as string | null
  const email = formData.get("email") as string | null
  const phone = formData.get("phone") as string | null

  // Rate Limiting
  const allowed = await updateRateLimit.check(5)
  if (!allowed) {
    return "Too many requests. Please try again later."
  }

  const updateFields: Record<string, string> = {}
  if (firstName) updateFields.firstName = firstName
  if (lastName) updateFields.lastName = lastName
  if (email) updateFields.email = email
  if (phone !== null) updateFields.phone = phone || ""

  try {
    const result = await shopifyCustomerUpdate(token, updateFields)

    if (!result) {
      return "Update failed. Please try again."
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      return userErrors[0].message || "Update failed."
    }

    // Refresh token if a new one was issued
    if (result.customerAccessToken) {
      await setCustomerToken(
        result.customerAccessToken.accessToken,
        result.customerAccessToken.expiresAt
      )
    }

    revalidatePath("/", "layout")
    return "success"
  } catch (error) {
    console.error(error)
    return "Update failed. Please try again."
  }
}

// â”€â”€â”€ Legacy compat stubs (keep for existing imports) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function addCustomerAddress(
  _prevState: string | null,
  formData: FormData
): Promise<string | null>
export async function addCustomerAddress(
  _prevState: LegacyAddressActionState,
  formData: FormData
): Promise<LegacyAddressActionState>
export async function addCustomerAddress(
  _prevState: Record<string, unknown>,
  formData: FormData
): Promise<LegacyAddressActionState>
export async function addCustomerAddress(
  _prevState: string | null | LegacyAddressActionState | Record<string, unknown>,
  formData: FormData
): Promise<string | null | LegacyAddressActionState> {
  const token = await getCustomerToken()
  if (!token) return toAddressActionResult(_prevState, "You must be logged in.")

  const firstName = (formData.get("firstName") as string) || ""
  const lastName = (formData.get("lastName") as string) || ""
  const company = (formData.get("company") as string) || ""
  const address1 = (formData.get("address1") as string) || ""
  const address2 = (formData.get("address2") as string) || ""
  const city = (formData.get("city") as string) || ""
  const province = (formData.get("province") as string) || ""
  const country = (formData.get("country") as string) || "Philippines"
  const zip = (formData.get("zip") as string) || ""
  const phone = (formData.get("phone") as string) || ""
  const isDefault = formData.get("isDefault") as string | null

  if (!address1.trim()) return toAddressActionResult(_prevState, "Street address is required.")
  if (!city.trim()) return toAddressActionResult(_prevState, "City is required.")
  if (!province.trim()) return toAddressActionResult(_prevState, "Province is required.")
  if (!zip.trim()) return toAddressActionResult(_prevState, "ZIP code is required.")

  try {
    const result = await shopifyCustomerAddressCreate({
      customerAccessToken: token,
      address: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        company: company || undefined,
        address1: address1.trim(),
        address2: address2 || undefined,
        city: city.trim(),
        province: province.trim(),
        country: country || "Philippines",
        zip: zip.trim(),
        phone: phone || undefined,
      },
    })

    if (!result) {
      return toAddressActionResult(_prevState, "Failed to save address.")
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      return toAddressActionResult(
        _prevState,
        userErrors[0].message || "Failed to save address."
      )
    }

    if (isDefault === "on") {
      const newId = result.customerAddress?.id
      if (newId) {
        await shopifyCustomerDefaultAddressUpdate({
          customerAccessToken: token,
          addressId: newId,
        })
      }
    }

    revalidatePath("/", "layout")
    return toAddressActionResult(_prevState, null)
  } catch (error) {
    console.error(error)
    return toAddressActionResult(_prevState, "Failed to save address.")
  }
}

export async function updateCustomerAddress(
  _prevState: string | null,
  formData: FormData
): Promise<string | null>
export async function updateCustomerAddress(
  _prevState: LegacyAddressActionState,
  formData: FormData
): Promise<LegacyAddressActionState>
export async function updateCustomerAddress(
  _prevState: Record<string, unknown>,
  formData: FormData
): Promise<LegacyAddressActionState>
export async function updateCustomerAddress(
  _prevState: string | null | LegacyAddressActionState | Record<string, unknown>,
  formData: FormData
): Promise<string | null | LegacyAddressActionState> {
  const token = await getCustomerToken()
  if (!token) return toAddressActionResult(_prevState, "You must be logged in.")

  const addressId = (formData.get("addressId") as string) || ""
  const firstName = (formData.get("firstName") as string) || ""
  const lastName = (formData.get("lastName") as string) || ""
  const company = (formData.get("company") as string) || ""
  const address1 = (formData.get("address1") as string) || ""
  const address2 = (formData.get("address2") as string) || ""
  const city = (formData.get("city") as string) || ""
  const province = (formData.get("province") as string) || ""
  const country = (formData.get("country") as string) || "Philippines"
  const zip = (formData.get("zip") as string) || ""
  const phone = (formData.get("phone") as string) || ""
  const isDefault = formData.get("isDefault") as string | null

  if (!addressId.trim()) return toAddressActionResult(_prevState, "Invalid address ID.")
  if (!address1.trim()) return toAddressActionResult(_prevState, "Street address is required.")
  if (!city.trim()) return toAddressActionResult(_prevState, "City is required.")
  if (!province.trim()) return toAddressActionResult(_prevState, "Province is required.")
  if (!zip.trim()) return toAddressActionResult(_prevState, "ZIP code is required.")

  try {
    const result = await shopifyCustomerAddressUpdate({
      customerAccessToken: token,
      id: addressId.trim(),
      address: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        company: company || undefined,
        address1: address1.trim(),
        address2: address2 || undefined,
        city: city.trim(),
        province: province.trim(),
        country: country || "Philippines",
        zip: zip.trim(),
        phone: phone || undefined,
      },
    })

    if (!result) {
      return toAddressActionResult(_prevState, "Failed to save address.")
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      return toAddressActionResult(
        _prevState,
        userErrors[0].message || "Failed to save address."
      )
    }

    if (isDefault === "on") {
      const updatedId = result.customerAddress?.id || addressId
      await shopifyCustomerDefaultAddressUpdate({
        customerAccessToken: token,
        addressId: updatedId,
      })
    }

    revalidatePath("/", "layout")
    return toAddressActionResult(_prevState, null)
  } catch (error) {
    console.error(error)
    return toAddressActionResult(_prevState, "Failed to save address.")
  }
}

export async function deleteCustomerAddress(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  const token = await getCustomerToken()
  if (!token) return { success: false, error: "You must be logged in." }
  if (!addressId?.trim()) return { success: false, error: "Invalid address ID." }

  try {
    const result = await shopifyCustomerAddressDelete({
      customerAccessToken: token,
      id: addressId.trim(),
    })

    if (!result) {
      return { success: false, error: "Failed to delete address." }
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      return {
        success: false,
        error: userErrors[0].message || "Failed to delete address.",
      }
    }

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete address." }
  }
}

export async function setDefaultAddress(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  const token = await getCustomerToken()
  if (!token) return { success: false, error: "You must be logged in." }
  if (!addressId?.trim()) return { success: false, error: "Invalid address ID." }

  try {
    const result = await shopifyCustomerDefaultAddressUpdate({
      customerAccessToken: token,
      addressId: addressId.trim(),
    })

    if (!result) {
      return { success: false, error: "Failed to set default address." }
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      return {
        success: false,
        error: userErrors[0].message || "Failed to set default address.",
      }
    }

    revalidatePath("/", "layout")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to set default address." }
  }
}

export async function changePassword(
  currentPassword?: string,
  newPassword?: string,
  confirmPassword?: string
): Promise<{ success: boolean; error?: string }> {
  // 1. Rate Limiting (5 attempts max, 15 min window)
  const allowed = await passwordChangeRateLimit.check(5)
  if (!allowed) {
    return { success: false, error: "Too many requests. Please try again later." }
  }

  // 2. Get current customer session
  const token = await getCustomerToken()
  if (!token) {
    return { success: false, error: "You must be logged in to change your password." }
  }

  // 3. Get current customer email
  const customer = await shopifyGetCustomer(token)
  if (!customer || !customer.email) {
    return { success: false, error: "Unable to verify your account. Please log in again." }
  }

  // 4. Server-side validation
  const oldPass = (currentPassword || "").trim()
  const newPass = (newPassword || "").trim()
  const confirmPass = (confirmPassword || "").trim()

  if (!oldPass || !newPass || !confirmPass) {
    return { success: false, error: "All fields are required." }
  }

  if (newPass.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." }
  }

  if (newPass !== confirmPass) {
    return { success: false, error: "New password and confirm password do not match." }
  }

  if (newPass === oldPass) {
    return { success: false, error: "New password must be different from your current password." }
  }

  try {
    // 5. Re-authenticate with current password to verify they know it
    const loginResult = await customerAccessTokenCreate({
      email: customer.email,
      password: oldPass,
    })

    if (!loginResult || !loginResult.customerAccessToken || loginResult.customerUserErrors?.length) {
      return { success: false, error: "Current password is incorrect." }
    }

    const verificationToken = loginResult.customerAccessToken.accessToken

    // 6. Update password using the fresh verified token
    const updateResult = await shopifyCustomerUpdate(verificationToken, {
      password: newPass,
    })

    if (!updateResult) {
      return { success: false, error: "Unable to update your password right now. Please try again." }
    }

    const userErrors = updateResult.customerUserErrors || []
    if (userErrors.length > 0) {
      return { success: false, error: "Unable to update your password right now. Please try again." }
    }

    // 7. Handle token refresh
    if (updateResult.customerAccessToken) {
      await setCustomerToken(
        updateResult.customerAccessToken.accessToken,
        updateResult.customerAccessToken.expiresAt
      )
    } else {
      // If we didn't get a new token in the response, store the verification token
      await setCustomerToken(
        loginResult.customerAccessToken.accessToken,
        loginResult.customerAccessToken.expiresAt
      )
    }

    // 8. Revalidate
    revalidatePath("/", "layout")
    
    // 9. Return success
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Unable to update your password right now. Please try again." }
  }
}
