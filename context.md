### Architecture Summary

- Headless commerce storefront built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS.
- Shopify is accessed directly through GraphQL:
  - Storefront API for catalog, collections, search, carts, customers, orders, and hosted checkout.
  - Admin API client for customer metafields, though no active caller of that module was found.
- This is not a Shopify Liquid theme and not a Hydrogen/Oxygen application. No Liquid templates or Hydrogen configuration were found.
- Sanity is the primary CMS integration, with Sanity Studio embedded at `/studio`.
- Strapi is described as migration residue, but it is still actively imported by homepage, services, rider stories, First Gear Coffee, navigation, preview, and sitemap code. The application is therefore currently a Sanity/Strapi hybrid rather than exclusively Sanity.
- Upstash Redis supplies caching and cache invalidation.
- Checkout hands the user to Shopify’s hosted `checkoutUrl`.
- Production entry points:
  - Root application layout: [src/app/layout.tsx](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/layout.tsx)
  - Root route redirecting to `/ph`: [src/app/page.tsx](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/page.tsx)
  - Localized storefront: [src/app/[countryCode]/(main)/page.tsx](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/page.tsx)
  - Request routing and maintenance handling: [src/middleware.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/middleware.ts)
  - Production commands are `next build` and `next start -p 7000`.

### Important File Paths

- Application manifest and scripts: [package.json](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/package.json)
- Next.js configuration: [next.config.js](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/next.config.js)
- Runtime environment validation: [src/lib/env.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/env.ts)
- Current environment template: [.env.example](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/.env.example)
- Legacy migration environment template: [.env.migration.template](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/.env.migration.template)
- Storefront routes: [src/app](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app)
- Shopify integration: [src/lib/shopify](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/shopify)
- Storefront data/actions: [src/lib/data](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/data)
- Sanity frontend integration: [src/lib/cms](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/cms)
- Sanity Studio and schemas: [sanity](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity)
- Remaining Strapi integration: [src/lib/strapi](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/strapi)
- Vercel configuration: [vercel.json](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/vercel.json)
- CI smoke-test workflow: [.github/workflows/playwright.yml](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/.github/workflows/playwright.yml)

### Shopify Setup

- Storefront API:
  - Client: [src/lib/shopify/client.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/shopify/client.ts)
  - Uses `@shopify/storefront-api-client`.
  - Server requests use a private Storefront token and five-minute tagged caching, except customer-authenticated requests, which use `no-store`.
  - Browser requests use the public Storefront token.
  - Configured Storefront API version defaults to `2025-10`.
  - Queries cover products, collections, carts, customers, orders, search, and recommendations.
- Admin API:
  - Client: [src/lib/shopify/admin-client.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/shopify/admin-client.ts)
  - Uses Admin GraphQL API version `2025-01`.
  - Customer wishlist metafield operations exist in [src/lib/shopify/admin/customer-metafields.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/shopify/admin/customer-metafields.ts).
  - No imports calling this customer-metafield module were found, so its production use is unconfirmed.
- Webhook:
  - `POST /api/revalidate` is implemented in [src/app/api/revalidate/route.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/api/revalidate/route.ts).
  - It validates `x-shopify-hmac-sha256`, revalidates Shopify cache tags, and invalidates Redis product, collection, search, and homepage keys.
  - The repository does not identify which Shopify webhook topics are registered externally.
- Checkout:
  - Shopify cart `checkoutUrl` is used for the hosted checkout handoff.
  - Checkout logic is primarily in [src/lib/data/cart.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/data/cart.ts).
- Theme integration:
  - No `.liquid` files, Shopify theme configuration, or Theme Kit configuration found.
- Shopify app integration:
  - No `shopify.app.toml` or equivalent Shopify app configuration found.
  - App-related credential names exist in `.env.example`, but no installed-app/OAuth workflow was identified.
- No Shopify store domain, store ID, app ID, webhook registrations, or external Shopify configuration was inspected or exposed.

### Sanity Setup

- Studio configuration: [sanity.config.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity.config.ts)
  - Studio title: `Sixthgear CMS`
  - Mounted at `/studio`
  - Uses Structure Tool and Vision.
- Embedded Studio route: [src/app/studio/[[...tool]]/page.tsx](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/studio/[[...tool]]/page.tsx)
- CLI configuration: [sanity.cli.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity.cli.ts)
- Project/dataset configuration: [sanity/env.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity/env.ts)
  - Project ID and dataset are environment-driven.
  - Actual project ID and dataset value were not inspected.
  - Default API version in code is `2026-03-09`.
- Schema registry: [sanity/schemaTypes/index.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity/schemaTypes/index.ts)
  - Includes homepage, hero, brands, categories, services, collections, coffee, experiences, testimonials, team, store location, marketing, popup/promo content, about page, blog posts, and blog categories.
- Studio structure: [sanity/structure.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity/structure.ts)
  - Provides singleton-style homepage, marketing, services page, and about page entries, plus service and blog collections.
- Queries:
  - Active frontend GROQ queries: [src/lib/cms/queries.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/cms/queries.ts)
  - A second query/client implementation also exists under [sanity/lib/cms](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity/lib/cms).
- Frontend client:
  - [src/lib/cms/client.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/cms/client.ts)
  - Uses `next-sanity`, CDN reads, revalidation intervals, and the `sanity` cache tag.
- Sanity webhook:
  - `POST /api/revalidate-sanity` is implemented in [src/app/api/revalidate-sanity/route.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/api/revalidate-sanity/route.ts).
  - Accepts a secret through `x-sanity-webhook-secret` or the JSON body.
  - Revalidates Sanity tags and selected homepage/rider-story paths.

### Deployment Setup

- The Git remote’s default branch is `main`, and the checked-out branch tracks `origin/main`.
- `main` is the strongest repository evidence for the production branch, but the repository contains no Vercel project metadata proving which Git branch is mapped to the Production environment.
- Hosting is documented and configured for Vercel:
  - [vercel.json](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/vercel.json) defines response headers.
  - Runtime code checks `VERCEL_ENV`, `VERCEL_URL`, and `NEXT_PUBLIC_VERCEL_URL`.
- No repository workflow performs the actual deployment. The deployment is therefore likely controlled by an external Vercel Git integration, but that configuration is not present locally.
- GitHub Actions workflow:
  - Runs local Playwright smoke tests on pushes and pull requests targeting `main` or `master`.
  - Listens for successful `Production` deployment-status events and then runs smoke tests against production.
  - It validates deployments but does not create them.
- No Docker, Netlify, Fly.io, Render, Hydrogen Oxygen, or Shopify theme deployment configuration was found.

### Environment Variable Names

Current `.env.example` names:

```text
CONTACT_EMAIL_FROM
CONTACT_EMAIL_TO
JUDGEME_PRIVATE_TOKEN
NEXT_PUBLIC_BUSINESS_ADDRESS
NEXT_PUBLIC_BUSINESS_EMAIL
NEXT_PUBLIC_BUSINESS_FACEBOOK_URL
NEXT_PUBLIC_BUSINESS_GOOGLE_MAPS_URL
NEXT_PUBLIC_BUSINESS_GOOGLE_PROFILE_URL
NEXT_PUBLIC_BUSINESS_IMAGE_URL
NEXT_PUBLIC_BUSINESS_INSTAGRAM_URL
NEXT_PUBLIC_BUSINESS_LINKEDIN_URL
NEXT_PUBLIC_BUSINESS_LOGO_URL
NEXT_PUBLIC_BUSINESS_PHONE
NEXT_PUBLIC_BUSINESS_TIKTOK_URL
NEXT_PUBLIC_BUSINESS_TWITTER_URL
NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN
NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
NEXT_PUBLIC_SITE_NAME
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_TIDIO_PUBLIC_KEY
NEXTAUTH_SECRET
NEXTAUTH_URL
RESEND_API_KEY
SANITY_REVALIDATE_SECRET
SANITY_WEBHOOK_SECRET
SHOPIFY_ADMIN_ACCESS_TOKEN
SHOPIFY_API_VERSION
SHOPIFY_CLIENT_ID
SHOPIFY_CLIENT_SECRET
SHOPIFY_SHOP_ID
SHOPIFY_STORE_DOMAIN
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_WEBHOOK_SECRET
UPSTASH_REDIS_REST_TOKEN
UPSTASH_REDIS_REST_URL
```

Additional names referenced by source/configuration but absent from the current example:

```text
CI
MAINTENANCE_MODE
MEDUSA_BACKEND_URL
MEDUSA_CLOUD_S3_HOSTNAME
MEDUSA_CLOUD_S3_PATHNAME
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_DEFAULT_REGION
NEXT_PUBLIC_MEDUSA_BACKEND_URL
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
NEXT_PUBLIC_STRAPI_URL
NEXT_PUBLIC_VERCEL_URL
NODE_ENV
REVALIDATION_SECRET
STRAPI_TOKEN
STRAPI_URL
STRIPE_API_KEY
TEST_ENV
VERCEL_ENV
VERCEL_URL
```

Additional legacy migration-template names:

```text
BLOB_READ_WRITE_TOKEN
CACHE_TTL
DATABASE_URI
DEBUG
ENABLE_PREVIEW_MODE
ENABLE_REVIEWS
ENABLE_SEARCH
ENABLE_WISHLIST
KLAVIYO_API_KEY
KLAVIYO_LIST_ID
NEXT_PUBLIC_CURRENCY
NEXT_PUBLIC_CURRENCY_SYMBOL
NEXT_PUBLIC_DEFAULT_LOCALE
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_GTM_ID
NEXT_PUBLIC_SENTRY_DSN
NEXT_TELEMETRY_DISABLED
NEXTAUTH_DEBUG
PAYLOAD_ADMIN_PATH
PAYLOAD_SECRET
RESEND_FROM_EMAIL
SENTRY_AUTH_TOKEN
XENDIT_PUBLIC_KEY
XENDIT_SECRET_KEY
XENDIT_WEBHOOK_TOKEN
```

No `.env.local` contents or secret values were read or disclosed.

### Unknown or Missing Information

- Exact production URL and custom-domain/DNS configuration.
- Definitive Vercel Production branch mapping and Vercel project name.
- Actual deployment trigger settings, build overrides, environment scopes, and Vercel team ownership.
- Actual Shopify store, app installation, permissions/scopes, and registered webhook topics.
- Whether the dormant Admin API customer-metafield integration is intended for production.
- Actual Sanity project ID, dataset value, deployment ownership, CORS settings, and registered webhook configuration.
- Whether `SANITY_REVALIDATE_SECRET` is obsolete; the current webhook route uses `SANITY_WEBHOOK_SECRET`.
- Whether `REVALIDATION_SECRET` is still required; the current Shopify webhook route uses `SHOPIFY_WEBHOOK_SECRET`.
- Which legacy Medusa, Strapi, NextAuth, Payload, Xendit, Stripe, and other migration variables remain operationally required.
- Strapi is still used by active production routes despite documentation describing it as legacy; the intended migration boundary is not documented.
- Both `main` and `master` appear in CI triggers, but only `main` exists in the inspected Git branch list.
- No files were modified during this audit.