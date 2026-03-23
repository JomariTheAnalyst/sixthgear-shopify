# Enhancement Auth Prompt â€” Step 1 Audit Findings

Below is the complete audit of the requested files and configurations before proceeding with the customer authentication enhancements.

---

## 1. Register Page and RegisterForm Component

### Register Page Route (`src/app/[countryCode]/(auth)/login/page.tsx`)

The register page doesn't have a standalone route; it is rendered within the `LoginTemplate` component when the URL is `/[countryCode]/login`.

```tsx
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Sixthgear account.",
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ redirect?: string }>
}) {
  const { countryCode } = await params
  const { redirect: redirectTo } = await searchParams
  const customer = await retrieveCustomer().catch(() => null)

  if (customer) {
    redirect(redirectTo || `/${countryCode}/account`)
  }

  return <LoginTemplate />
}
```

### Register Form Component (`src/modules/account/components/register/index.tsx`)

The component that manages the form state and redirects. The key section handles the redirect logic after a successful submission:

```tsx
// Track submissions
useEffect(() => {
  if (isPending) {
    hasSubmitted.current = true
    setClientError(null)
  }
}, [isPending])

// Redirect on successful registration
useEffect(() => {
  // NOTE: This redirect only triggers when `message === null`
  if (hasSubmitted.current && !isPending && message === null) {
    router.push(`/${countryCode}/register/success`)
  }
}, [isPending, message, router, countryCode])
```

---

## 2. Account Invite Email Template (Manual Step Instructions)

**MANUAL STEP â€” Shopify Admin Email Template**

1. Go to **Shopify Admin â†’ Settings â†’ Notifications**
2. Scroll to the **Customer notifications** section.
3. Open the **Customer account invite** (or **Customer account activation**) template and click **Edit code**.
4. Find the link that generates the activation URL:
   `href="{{ customer.account_activation_url }}"`
5. Replace it with your custom storefront URL:

```liquid
<!-- For Production -->
<a href="https://sixthgearmoto.ph/ph/activate?url={{ customer.account_activation_url | url_encode }}">
  Activate your account
</a>

<!-- For Localhost Testing -->
<a href="http://localhost:7000/ph/activate?url={{ customer.account_activation_url | url_encode }}">
  Activate your account
</a>

<!-- For Cloudflare Tunnel Testing -->
<a href="https://your-tunnel-url.trycloudflare.com/ph/activate?url={{ customer.account_activation_url | url_encode }}">
  Activate your account
</a>
```

> **Developer Note:**
> Since the project is not yet deployed, **yes**, you can use Localhost (`http://localhost:7000`) or a Cloudflare Tunnel for testing. Ensure you update the Shopify email template's `href` to point directly to your testing environment as shown above; otherwise, Shopify will intercept the default `.myshopify.com` links and redirect them to the Shop app natively.

---

## 3. Server Action for Customer Signup (`src/lib/data/customer.ts`)

This specific function explains the image provided showing the red error text `Account exists but needs activation. Check your email.`:

```typescript
export async function signup(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const firstName = formData.get("first_name") as string | null;
  // ... field parsing and rate limits ...

  try {
    const result = await shopifyCustomerCreate({ ... })

    if (!result) {
      return "Registration failed. Please try again."
    }

    const userErrors = result.customerUserErrors || []
    if (userErrors.length > 0) {
      const errorCode = userErrors[0].code
      switch (errorCode) {
        // ISSUE: Shopify creates the account but requires activation by default.
        // Returning this as an error string blocks the `RegisterForm` from seeing
        // `message === null`, which stops the redirect to the success page.
        case "CUSTOMER_DISABLED":
          return "Account exists but needs activation. Check your email."
        case "TAKEN":
          return "An account with this email already exists."
        default:
          return userErrors[0].message || "Registration failed. Please try again."
      }
    }

    // Auto-login (Only triggered if Shopify instantly activates the account)
    // ...
    return null // Expected success state that triggers the redirect
  } catch (error) { ... }
}
```

---

## 4. Middleware Full Content (`src/middleware.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ph"
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true"
const IS_PRODUCTION = process.env.VERCEL_ENV === "production"
const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token"

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // â”€â”€ MAINTENANCE MODE (Production only) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (
      MAINTENANCE_MODE &&
      IS_PRODUCTION &&
      !pathname.includes("/maintenance") &&
      !pathname.startsWith("/_next/") &&
      !pathname.startsWith("/api/") &&
      !pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|json|xml|txt)$/)
    ) {
      const urlSegments = pathname.split("/").filter(Boolean)
      const countryCode =
        urlSegments[0]?.length === 2 ? urlSegments[0] : DEFAULT_REGION

      const maintenanceUrl = new URL(`/${countryCode}/maintenance`, request.url)
      const response = NextResponse.rewrite(maintenanceUrl)
      response.headers.set("Retry-After", "3600")
      return response
    }

    // â”€â”€ Skip static assets and API routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next()
    }

    // â”€â”€ Parse country code â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const urlSegments = pathname.split("/").filter(Boolean)
    const potentialCountryCode = urlSegments[0]?.toLowerCase()
    const hasCountryCode =
      potentialCountryCode && potentialCountryCode.length === 2
    const countryCode = hasCountryCode ? potentialCountryCode : DEFAULT_REGION

    // â”€â”€ Routes without country code â€” redirect to add it â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (!hasCountryCode) {
      if (pathname === "/" || pathname === "") {
        return NextResponse.redirect(
          `${request.nextUrl.origin}/${DEFAULT_REGION}`,
          307
        )
      }

      const queryString = request.nextUrl.search || ""
      return NextResponse.redirect(
        `${request.nextUrl.origin}/${DEFAULT_REGION}${pathname}${queryString}`,
        307
      )
    }

    // â”€â”€ AUTH: Protect /account/* routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const pathAfterCountry = "/" + urlSegments.slice(1).join("/")
    const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value

    if (pathAfterCountry.startsWith("/account")) {
      if (!customerToken) {
        const loginUrl = new URL(`/${countryCode}/login`, request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // â”€â”€ AUTH: Redirect logged-in users away from auth pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (pathAfterCountry === "/login" || pathAfterCountry === "/register") {
      if (customerToken) {
        return NextResponse.redirect(
          new URL(`/${countryCode}/account`, request.url)
        )
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error(
      "Middleware: Error occurred, allowing request through:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
}
```

---

## 5. Check Upstash Redis Dependencies

`package.json` was examined regarding the dependencies `upstash` or `ratelimit`. The packages are **not installed**. Therefore, the native `lru-cache` in-memory solution was used for the rate limiter.

---

## Diagnostics for Image 1: The Activation Messaging Bug

In the prompt screenshot, the form renders:
`<span class="text-sm text-red-600">Account exists but needs activation. Check your email.</span>`

**Root Cause:**
Shopify defaults all headless registrations into a `CUSTOMER_DISABLED` confirmation state to verify the email via an activation link. When the mutation returns `CUSTOMER_DISABLED`, the `signup` Server Action translates this into an error string to display in the UI. When `useActionState` receives a string message, it assumes failureâ€”which prevents your `router.push('/ph/register/success')` lifecycle hook from firing.

**Required Fix Request:**
We must update `src/lib/data/customer.ts` to capture the `"CUSTOMER_DISABLED"` case inside the `signup` function, treat it as a **success state**, and return `null` (or a redirect flag) so the `RegisterForm` hook resolves it into a successful redirect to the new confirmation page.
