/**
 * Middleware — Shopify Storefront
 *
 * Handles:
 * 1. Maintenance mode (production only)
 * 2. Country code routing (defaults to "ph")
 * 3. Auth route protection (/account/* requires login)
 * 4. Auth page guards (redirect logged-in users away from /login)
 */

import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ph"
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true"
const IS_PRODUCTION = process.env.VERCEL_ENV === "production"
const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token"

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // ── MAINTENANCE MODE (Production only) ──────────────────────────────
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

    // ── Skip static assets and API routes ───────────────────────────────
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next()
    }

    // ── Parse country code ──────────────────────────────────────────────
    const urlSegments = pathname.split("/").filter(Boolean)
    const potentialCountryCode = urlSegments[0]?.toLowerCase()
    const hasCountryCode =
      potentialCountryCode && potentialCountryCode.length === 2
    const countryCode = hasCountryCode ? potentialCountryCode : DEFAULT_REGION

    // ── Routes without country code — redirect to add it ────────────────
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

    // ── AUTH: Protect /account/* routes ──────────────────────────────────
    const pathAfterCountry = "/" + urlSegments.slice(1).join("/")
    const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value

    if (pathAfterCountry.startsWith("/account")) {
      if (!customerToken) {
        const loginUrl = new URL(`/${countryCode}/login`, request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // ── AUTH: Redirect logged-in users away from auth pages ─────────────
    if (
      pathAfterCountry === "/login" ||
      pathAfterCountry === "/register"
    ) {
      if (customerToken) {
        return NextResponse.redirect(
          new URL(`/${countryCode}/account`, request.url)
        )
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.warn(
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
