# Sixthgear Moto Storefront

Sixthgear Moto is a headless commerce storefront for motorcycle gear, parts,
services, rider stories, and First Gear Coffee. The current application is built
with Next.js, Shopify Storefront API, and Sanity CMS.

This repository previously carried Medusa and Strapi assumptions. The current
runtime direction is Shopify-first. Some Medusa/Strapi compatibility files still
exist in the codebase and should be treated as legacy migration residue unless a
feature still imports them directly.

## Stack

| Area | Technology |
| --- | --- |
| App framework | Next.js 15 App Router |
| UI | React 19, TypeScript, Tailwind CSS |
| Commerce | Shopify Storefront API |
| CMS | Sanity, with Studio mounted at `/studio` |
| Cart and customer actions | Next.js Server Actions backed by Shopify |
| Email | Resend contact form endpoint |
| Cache/rate limit helpers | Upstash Redis |
| Testing | Playwright |

## Main Features

- Storefront pages for home, store, collections, products, cart, checkout,
  wishlist, account, services, about, contact, rider stories, and First Gear
  Coffee.
- Shopify product catalog, collections, filters, search, cart mutations,
  checkout redirects, customer auth, addresses, and order data.
- Store page filtering with collection, brand collection, price, product type,
  tags, variant options, sale, and sold-out visibility controls.
- Service detail overlays using Next.js parallel/intercepted routes.
- Sanity-backed content helpers for homepage sections, service pages, about
  content, marketing data, rider stories, and CMS previews.
- Cloudinary, Shopify CDN, Sanity CDN, Unsplash, and local image support through
  `next/image` remote patterns.

## Local Setup

Use Node.js 20 or newer.

```bash
npm install
npm run dev
```

The dev server runs on:

```text
http://localhost:7000
```

## Environment Variables

Use `.env.example` as the current reference. `.env.template` still contains old
Medusa migration values and should not be used for normal Shopify development.

Minimum Shopify values:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_public_storefront_token
SHOPIFY_API_VERSION=2025-10
NEXT_PUBLIC_SITE_URL=http://localhost:7000
NEXT_PUBLIC_SITE_NAME="Sixthgear Moto"
```

Common optional integrations:

```env
SHOPIFY_ADMIN_ACCESS_TOKEN=
SHOPIFY_WEBHOOK_SECRET=

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-03-09
SANITY_REVALIDATE_SECRET=
SANITY_WEBHOOK_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

RESEND_API_KEY=
CONTACT_EMAIL_TO=
CONTACT_EMAIL_FROM=

NEXT_PUBLIC_TIDIO_PUBLIC_KEY=
```

## Scripts

```bash
npm run dev          # Start Next.js on port 7000 with Turbopack
npm run build        # Production build
npm run start        # Start production server on port 7000
npm run test         # Run Playwright tests
npm run test:smoke   # Run smoke tests
npm run test:e2e     # Run end-to-end tests
```

## Project Structure

```text
src/
  app/                  Next.js routes, layouts, route handlers, metadata
  lib/
    shopify/            Shopify GraphQL client, queries, mutations, types
    data/               Server actions and app-facing data access
    cms/                Sanity client and CMS query helpers
    cache/              Redis cache and rate limit utilities
    util/               Formatting, filters, pricing, cart, SEO helpers
  modules/
    home/               Homepage sections and product cards
    collections/        Store and collection listing UI
    products/           Product detail experience
    cart/               Cart drawer, cart page, checkout summary
    checkout/           Checkout and payment status flows
    account/            Login, profile, addresses, orders, support
    about/              About and service-oriented content
    common/             Shared UI, navigation, route progress, quick shop
  styles/               Global CSS
  types/                Shared types and legacy compatibility shims

sanity/                 Sanity schema and Studio structure
public/                 Static images and local assets
tests/                  Playwright tests
```

## Commerce Flow

1. Product and collection data is fetched from Shopify through GraphQL queries in
   `src/lib/shopify`.
2. Store and collection pages call data helpers in `src/lib/data`.
3. Cart and customer mutations run through server actions, keeping Shopify cart
   and customer tokens in server-managed cookies.
4. Product cards and listing templates adapt Shopify data into the shared UI
   shape used across the storefront.
5. Checkout redirects customers to Shopify's hosted checkout URL.

## CMS Flow

Sanity is configured in `sanity.config.ts` and mounted at `/studio`. CMS helpers
live mostly in `src/lib/cms`. The project also contains older `src/lib/strapi`
files from a previous direction; verify imports before editing or deleting them.

Sanity revalidation is handled through:

```text
POST /api/revalidate-sanity
```

Shopify webhook revalidation is handled through:

```text
POST /api/revalidate
```

## Development Notes

- Prefer Shopify collections for product grouping and storefront navigation.
- Brand filters on the store page are based on collections whose handles start
  with `brand-`.
- The default store page uses the `all-products` collection handle.
- First Gear Coffee is intentionally separated from the main store product flow.
- Keep product availability variant-aware: a product should be treated as in
  stock when any variant is available.
- Use `.env.example`, not the Medusa-oriented `.env.template`, when onboarding
  or deploying this version.

## Deployment Checklist

- Shopify Storefront token and store domain are set.
- Sanity project, dataset, and webhook secrets are set if CMS content is used.
- Cloudinary and other remote image hosts remain allowed in `next.config.js`.
- Contact form email variables are set if `/api/contact` is enabled.
- Run the build and relevant Playwright smoke tests before shipping.

## License

Private project for Sixthgear Moto.
