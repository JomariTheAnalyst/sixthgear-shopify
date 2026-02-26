"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { serverEnv } from "@lib/env"
import {
  customerCreate as shopifyCustomerCreate,
  customerAccessTokenCreate,
  customerAccessTokenDelete,
  customerRecover as shopifyCustomerRecover,
  customerResetByUrl as shopifyCustomerResetByUrl,
  customerActivateByUrl as shopifyCustomerActivateByUrl,
  customerUpdate as shopifyCustomerUpdate,
} from "@lib/shopify/mutations/customer"
import { getCustomer as shopifyGetCustomer } from "@lib/shopify/queries/customer"
import { ShopifyCustomer } from "@lib/shopify/types"
import {
  authRateLimit,
  recoverRateLimit,
  registerRateLimit,
  resetRateLimit,
  updateRateLimit,
} from "@lib/util/rate-limit"

// ─── Cookie Helpers — Customer Token ─────────────────────────────────────────

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

// ─── Auth Result Type ────────────────────────────────────────────────────────

type AuthResult = {
  success: boolean
  error?: string
}

// ─── Server Actions ──────────────────────────────────────────────────────────

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

  if (!password || password.length < 5) {
    return "Password must be at least 5 characters."
  }

  // Rate Limiting
  const allowed = await registerRateLimit.check(5)
  if (!allowed) {
    return "Too many requests. Please try again later."
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
          return "Password must be at least 5 characters."
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
    console.error("[signup] Error:", error)
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

    return null // success
  } catch (error) {
    console.error("[login] Error:", error)
    return "Login failed. Please try again."
  }
}

/**
 * Logout — invalidate token on Shopify, clear cookie, redirect.
 */
export async function signout(countryCode: string): Promise<void> {
  const token = await getCustomerToken()

  if (token) {
    // Fire and forget — don't block on Shopify's response
    customerAccessTokenDelete(token).catch(() => {})
  }

  await deleteCustomerToken()
  revalidatePath("/", "layout")
  redirect(`/${countryCode}`)
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
    console.error("[retrieveCustomer] Error:", error)
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

  try {
    await shopifyCustomerRecover(email)
    return "success"
  } catch (error) {
    console.error("[requestPasswordReset] Error:", error)
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
    console.error("[resetPassword] Error:", error)
    return "Password reset failed. Please try again."
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
    console.error("[updateCustomer] Error:", error)
    return "Update failed. Please try again."
  }
}

// ─── Legacy compat stubs (keep for existing imports) ─────────────────────────

// TODO: Implement in address management phase
export const addCustomerAddress = async (_prevState?: any, _formData?: any) =>
  null as any

// TODO: Implement in address management phase
export const deleteCustomerAddress = async (_addressId?: string) =>
  null as any

// TODO: Implement in address management phase
export const updateCustomerAddress = async (
  _prevState?: any,
  _formData?: any
) => null as any
