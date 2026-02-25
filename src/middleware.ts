/**
 * Simplified Middleware - Shopify Migration
 *
 * Removed Medusa region fetching
 * Simple locale-based routing for Philippine market
 */

import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ph"

// Maintenance mode - only active in production (Vercel)
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true"
const IS_PRODUCTION = process.env.VERCEL_ENV === "production"

/**
 * Simplified middleware for Shopify migration
 * - Removes Medusa region fetching
 * - Simple country code routing (defaults to 'ph')
 * - Maintains maintenance mode functionality
 */
export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // MAINTENANCE MODE CHECK (Production only)
    if (
      MAINTENANCE_MODE &&
      IS_PRODUCTION &&
      !pathname.includes("/maintenance") &&
      !pathname.startsWith("/_next/") &&
      !pathname.startsWith("/api/") &&
      !pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|json|xml|txt)$/)
    ) {
      console.log("[Middleware] Maintenance mode active, redirecting")

      const urlSegments = pathname.split("/").filter(Boolean)
      const countryCode =
        urlSegments[0]?.length === 2 ? urlSegments[0] : DEFAULT_REGION

      const maintenanceUrl = new URL(`/${countryCode}/maintenance`, request.url)
      const response = NextResponse.rewrite(maintenanceUrl)
      response.headers.set("Retry-After", "3600")

      return response
    }

    // Skip static assets and API routes
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next()
    }

    // Check if URL already has a country code (e.g., /ph, /us)
    const urlSegments = pathname.split("/").filter(Boolean)
    const potentialCountryCode = urlSegments[0]?.toLowerCase()

    // If it looks like a country code (2 chars), allow it through
    if (potentialCountryCode && potentialCountryCode.length === 2) {
      return NextResponse.next()
    }

    // Redirect root to default region (ph)
    if (pathname === "/" || pathname === "") {
      const redirectUrl = `${request.nextUrl.origin}/${DEFAULT_REGION}`
      return NextResponse.redirect(redirectUrl, 307)
    }

    // For any other path without country code, prepend default region
    const redirectPath = pathname
    const queryString = request.nextUrl.search || ""
    const redirectUrl = `${request.nextUrl.origin}/${DEFAULT_REGION}${redirectPath}${queryString}`

    return NextResponse.redirect(redirectUrl, 307)
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (meta files)
     * - Files with extensions (e.g., .png, .jpg, .svg, .css, .js)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
}
