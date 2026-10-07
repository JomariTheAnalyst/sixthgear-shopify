/**
 * Middleware - Shopify Storefront
 *
 * Public URLs have no country prefix (/about, /products/x). The routes still
 * live under app/[countryCode], so every page request is rewritten to /ph.
 *
 * Handles:
 * 1. URL normalisation: /ph/*, case variants, trailing slashes and legacy
 *    paths reach their current URL in one 308
 * 2. Maintenance mode (production only)
 * 3. Auth route protection (/account/* requires login)
 * 4. Auth page guards (redirect logged-in users away from /login)
 * 5. Internal rewrite to the /ph routes
 */

import { NextRequest, NextResponse } from "next/server"

const ROUTE_PREFIX = "/ph"
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true"
const IS_PRODUCTION = process.env.VERCEL_ENV === "production"
const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token"

// Old URLs (previous Shopify theme, renamed routes) and where they live now.
const LEGACY_PATHS: Record<string, string> = {
  "/index.html": "/",
  "/pages/about": "/about",
  "/pages/contact": "/contact",
  "/search": "/store",
  "/collections/helmets": "/collections/helmet",
}

// Top-level pages reached through an old relative link, e.g. "returns-warranty"
// clicked on /services/x became /services/returns-warranty.
const NESTED_TOP_LEVEL_PAGE =
  /^\/(?:services|products|collections|rider-stories|about|categories|store)\/(returns-warranty|privacy|terms|cookies|contact|about|store|services|first-gear|rider-stories|track-order|wishlist|cart|login)$/i

function getPublicPath(pathname: string) {
  let path = pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname

  if (/^\/ph(?=\/|$)/i.test(path)) {
    path = path.slice(ROUTE_PREFIX.length) || "/"
  }

  const legacyPath = LEGACY_PATHS[path.toLowerCase()]
  if (legacyPath) return legacyPath
  if (/^\/blogs(\/|$)/i.test(path)) return "/rider-stories"

  const nestedPage = path.match(NESTED_TOP_LEVEL_PAGE)
  if (nestedPage) return `/${nestedPage[1].toLowerCase()}`

  return path
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    if (
      pathname === "/studio" ||
      pathname.startsWith("/studio/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/")
    ) {
      return NextResponse.next()
    }

    const publicPath = getPublicPath(pathname)
    if (publicPath !== pathname) {
      // Built from scratch: a cloned nextUrl keeps the original trailing slash.
      const url = new URL(publicPath, request.url)
      url.search = request.nextUrl.search
      // Old Shopify search used ?q=, the store reads ?query=.
      if (publicPath === "/store" && url.searchParams.has("q")) {
        url.searchParams.set("query", url.searchParams.get("q") || "")
        url.searchParams.delete("q")
      }
      return NextResponse.redirect(url, 308)
    }

    const isDraftMode = request.cookies.has("__prerender_bypass")

    if (
      MAINTENANCE_MODE &&
      IS_PRODUCTION &&
      !isDraftMode &&
      publicPath !== "/maintenance"
    ) {
      const response = NextResponse.rewrite(
        new URL(`${ROUTE_PREFIX}/maintenance`, request.url)
      )
      response.headers.set("Retry-After", "3600")
      return response
    }

    const customerToken = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value

    // 302, not 307/308: these depend on the session and must never be cached.
    if (
      (publicPath === "/account" || publicPath.startsWith("/account/")) &&
      !customerToken
    ) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", publicPath)
      return NextResponse.redirect(loginUrl, 302)
    }

    if ((publicPath === "/login" || publicPath === "/register") && customerToken) {
      return NextResponse.redirect(new URL("/account", request.url), 302)
    }

    const url = request.nextUrl.clone()
    url.pathname = publicPath === "/" ? ROUTE_PREFIX : `${ROUTE_PREFIX}${publicPath}`
    return NextResponse.rewrite(url)
  } catch (error) {
    console.error(error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Pages only: skip framework assets, metadata files and static files in /public.
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image|twitter-image|images/|fonts/|animation/|.*\\.(?:ico|png|jpe?g|gif|svg|webp|avif|css|js|map|txt|xml|json|webmanifest|woff2?|ttf|otf|mp4|webm|pdf)$).*)",
  ],
}
