# SixthGearMoto Project State Audit

Read-only audit. No code changes were made while preparing this document.

## Audit 1 — Environment Variables

Source read:
- `sixthgear-frontend/.env.example`

Raw file content observed:

```env
SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

SHOPIFY_ADMIN_ACCESS_TOKEN=shpca_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

SHOPIFY_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
SHOPIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_SHOP_ID=12345678

NEXTAUTH_SECRET=generate_with__openssl_rand_hex_32
NEXTAUTH_URL=http://localhost:3000

PAYLOAD_SECRET=generate_with__openssl_rand_hex_32
DATABASE_URI=postgresql://user:password@ep-xxx.neon.tech/neondb

XENDIT_SECRET_KEY=xnd_development_xxxx
XENDIT_WEBHOOK_TOKEN=your_xendit_webhook_token

RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@yourstore.ph

BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxx

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Your Store Name

REVALIDATION_SECRET=generate_with__openssl_rand_hex_32

JUDGEME_API_TOKEN=your_judgeme_token
NEXT_PUBLIC_JUDGEME_SHOP=your-store-name.myshopify.com

SANITY_WEBHOOK_SECRET=generate_with__openssl_rand_hex_32
```

Environment variable names found:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- `SHOPIFY_WEBHOOK_SECRET`
- `SHOPIFY_CLIENT_ID`
- `SHOPIFY_CLIENT_SECRET`
- `SHOPIFY_SHOP_ID`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `PAYLOAD_SECRET`
- `DATABASE_URI`
- `XENDIT_SECRET_KEY`
- `XENDIT_WEBHOOK_TOKEN`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `BLOB_READ_WRITE_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`
- `REVALIDATION_SECRET`
- `JUDGEME_API_TOKEN`
- `NEXT_PUBLIC_JUDGEME_SHOP`
- `SANITY_WEBHOOK_SECRET`

Audit finding:
- The env example includes active Shopify and Sanity variables, but also older or currently unclear variables for NextAuth, Payload CMS, Xendit, Resend, and Vercel Blob.

## Audit 2 — External Services Used

Command output from source env usage scan:

```text
src\app\api\revalidate-sanity\route.ts:5:  const expectedSecret 
src\lib\data\reviews.ts:119:  const shopDomain 
src\lib\data\reviews.ts:6:const PRIVATE_TOKEN 
src\lib\data\reviews.ts:7:const SHOP_DOMAIN 
src\lib\env.ts:113:        NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN:
src\lib\env.ts:114:          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "",
src\lib\env.ts:115:        NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
src\lib\env.ts:116:          process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
src\lib\env.ts:118:        NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN,
src\lib\env.ts:119:        NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN: process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN,
src\lib\env.ts:30:  NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: z
src\lib\env.ts:32:    .min(1, "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN is required"),
src\lib\env.ts:33:  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: shopifyDomain.optional(),
src\lib\env.ts:35:  NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN: z.string().min(1).optional(),
src\lib\env.ts:36:  NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN: z.string().min(1).optional(),
src\lib\env.ts:57:    SHOPIFY_STOREFRONT_ACCESS_TOKEN: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
src\lib\env.ts:58:    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
src\lib\env.ts:59:    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
src\lib\env.ts:60:    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
src\lib\env.ts:61:    SHOPIFY_ADMIN_ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
src\lib\env.ts:62:    SHOPIFY_WEBHOOK_SECRET: process.env.SHOPIFY_WEBHOOK_SECRET,
src\lib\env.ts:63:    SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
src\lib\env.ts:65:    JUDGEME_PRIVATE_TOKEN: process.env.JUDGEME_PRIVATE_TOKEN,
src\lib\env.ts:66:    JUDGEME_SHOP_DOMAIN: process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN,
src\lib\env.ts:80:    NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN:
src\lib\env.ts:81:      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
src\lib\env.ts:82:    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
src\lib\env.ts:83:      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
src\lib\env.ts:85:    NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN,
src\lib\env.ts:86:    NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN: process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN,
src\lib\shopify\client.ts:4:const publicAccessToken 
src\lib\shopify\client.ts:43:      "[shopify] Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN for client-side Shopify requests."
src\lib\shopify\client.ts:5:const publicDomain 
```

Active external services clearly visible from current source:
- Shopify
- Sanity webhook integration
- Upstash Redis
- Judge.me

Present in env example but not clearly active in the scanned `src` env usage:
- Xendit
- NextAuth
- Cloudflare
- Cloudinary

Audit finding:
- Some services are clearly active in the codebase, while others appear to be legacy, planned, or not currently wired through the main source path.

## Audit 3 — Pages That Exist

Command output:

```text
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(auth)\activate\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(auth)\forgot-password\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(auth)\login\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(auth)\reset-password\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(checkout)\checkout\failed\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(checkout)\checkout\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(checkout)\checkout\success\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(checkout)\payment-status\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\@overlay\(.)services\[slug]\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\about\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\account\@dashboard\addresses\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\account\@dashboard\orders\details\[id]\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\account\@dashboard\orders\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\account\@dashboard\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\account\@dashboard\profile\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\account\@dashboard\support\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\account\@login\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\cart\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\categories\[...category]\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\collections\[handle]\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\contact\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\first-gear\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\order\[id]\confirmed\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\order\[id]\transfer\[token]\accept\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\order\[id]\transfer\[token]\decline\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\order\[id]\transfer\[token]\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\order\confirmed\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\order\test\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\privacy\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\products\[handle]\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\returns-warranty\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\services\[slug]\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\services\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\store\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\terms\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\track-order\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\(main)\wishlist\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\maintenance\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\[countryCode]\preview\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\page.tsx
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\src\app\studio\[[...tool]]\page.tsx
```

Simplified route list:

- `/`
- `/studio/[[...tool]]`
- `/:countryCode/maintenance`
- `/:countryCode/preview`
- `/:countryCode/activate`
- `/:countryCode/forgot-password`
- `/:countryCode/login`
- `/:countryCode/reset-password`
- `/:countryCode/checkout`
- `/:countryCode/checkout/failed`
- `/:countryCode/checkout/success`
- `/:countryCode/payment-status`
- `/:countryCode`
- `/:countryCode/about`
- `/:countryCode/account`
- `/:countryCode/account/addresses`
- `/:countryCode/account/orders`
- `/:countryCode/account/orders/details/:id`
- `/:countryCode/account/profile`
- `/:countryCode/account/support`
- `/:countryCode/cart`
- `/:countryCode/categories/[...category]`
- `/:countryCode/collections/:handle`
- `/:countryCode/contact`
- `/:countryCode/first-gear`
- `/:countryCode/order/confirmed`
- `/:countryCode/order/test`
- `/:countryCode/order/:id/confirmed`
- `/:countryCode/order/:id/transfer/:token`
- `/:countryCode/order/:id/transfer/:token/accept`
- `/:countryCode/order/:id/transfer/:token/decline`
- `/:countryCode/privacy`
- `/:countryCode/products/:handle`
- `/:countryCode/returns-warranty`
- `/:countryCode/services`
- `/:countryCode/services/:slug`
- `/:countryCode/store`
- `/:countryCode/terms`
- `/:countryCode/track-order`
- `/:countryCode/wishlist`

Audit finding:
- The app includes storefront, auth, account, checkout, order transfer, preview, maintenance, and Studio routes.

## Audit 4 — Remaining TODO Items / Legacy Markers

Command output:

```text
src\types\global.ts:1:import { StorePrice } from "@medusajs/types"
src\lib\utils.ts:9: * className utility (replacement for clx from @medusajs/ui)
src\lib\cms\fallback.ts:4: * Provides field-level fallback logic for Strapi CMS integration.
src\lib\cms\fallback.ts:8:const STRAPI_URL =
src\lib\cms\fallback.ts:9:  process.env.STRAPI_URL ||
src\lib\cms\fallback.ts:10:  process.env.NEXT_PUBLIC_STRAPI_URL ||
src\lib\cms\fallback.ts:34: * Handles both absolute and relative URLs from Strapi
src\lib\cms\fallback.ts:88: * Convert Strapi URL to absolute URL
src\lib\cms\fallback.ts:91: * @param pathOrUrl - URL or path from Strapi
src\lib\cms\fallback.ts:102:  // Relative path - prepend Strapi URL
src\lib\cms\fallback.ts:103:  const baseUrl = STRAPI_URL.endsWith("/")
src\lib\cms\fallback.ts:104:    ? STRAPI_URL.slice(0, -1)
src\lib\cms\fallback.ts:105:    : STRAPI_URL
src\lib\util\variant-helpers.ts:1:import { HttpTypes } from "@medusajs/types"
src\lib\util\variant-helpers.ts:185:  // Check inventory_quantity (may be null in Medusa v2)
src\lib\util\sort-products.ts:1:import { HttpTypes } from "@medusajs/types"
src\lib\util\product.ts:1:import { HttpTypes } from "@medusajs/types";
src\lib\util\money.ts:12: * Extract numeric value from Medusa v2 BigNumber objects
src\modules\wishlist\templates\wishlist-template.tsx:10:/** Converts a WishlistItem → Medusa-like shape that ProductCard expects */
src\lib\util\map-shopify-cart.ts:3: * which expects HttpTypes.StoreCart-like interface (from Medusa).
src\lib\util\get-product-pricing.ts:3: * Single source of truth for calculating sale prices from Medusa v2 pricing
src\lib\util\get-product-pricing.ts:6:import { HttpTypes } from "@medusajs/types"
src\lib\util\get-product-pricing.ts:21: * Note: Medusa v2 returns calculated_amount already in the display unit (pesos),
src\lib\util\get-product-pricing.ts:39: * Get pricing information from a Medusa product
src\app\[countryCode]\preview\page.tsx:28:import { fetchHomeContent } from "@lib/strapi/home"
src\app\[countryCode]\preview\page.tsx:34:} from "@lib/strapi/home-with-fallbacks"
src\app\[countryCode]\preview\page.tsx:35:import { getShopByBrandsWithFallbacks } from "@lib/strapi/shop-by-brands"
src\app\[countryCode]\preview\page.tsx:36:import { getSpaceAndExperienceWithFallbacks } from "@lib/strapi/space-and-experience"
src\app\[countryCode]\preview\page.tsx:37:import { getSatisfiedCustomersWithFallbacks } from "@lib/strapi/satisfied-customers"
src\app\[countryCode]\preview\page.tsx:38:import { getClientTestimonialsWithFallbacks } from "@lib/strapi/client-testimonials"
```

Audit finding:
- Legacy Strapi and Medusa references are still present in the codebase.
- `src/lib/cms/fallback.ts` still contains `STRAPI_URL` logic.
- `src/app/[countryCode]/preview/page.tsx` is still Strapi-based.
- `@medusajs/types` is still used across utility and UI layers.

## Audit 5 — Sanity Schemas Registered

Source:
- `sixthgear-frontend/sanity/schemaTypes/index.ts`

Raw file content:

```ts
import { type SchemaTypeDefinition } from 'sanity'

import heroSection from './hero-section'
import homepage from './homepage'
import heroSlide from './heroSlide'
import brandItem from './brandItem'
import statItem from './statItem'
import shopByBrandsSection from './shop-by-brands-section'
import aboutSection from './about-section'
import categoryItem from './categoryItem'
import categoriesSection from './categoriesSection'
import servicesSection from './services-section'
import serviceItem from './serviceItem'
import collectionHero from './collection-hero'
import coffeeItem from './coffee-item'
import coffeeShowcase from './coffee-showcase'
import experienceItem from './experience-item'
import spaceExperiences from './space-experiences'
import serviceBrandItem from './service-brand-item'
import serviceBrandsSection from './service-brands-section'
import customerItem from './customer-item'
import satisfiedCustomers from './satisfied-customers'
import franchiseSection from './franchise-section'
import teamMember from './team-member'
import ourTeamSection from './our-team-section'
import testimonialItem from './testimonial-item'
import clientTestimonials from './client-testimonials'
import storeLocation from './store-location'
import ctaBanner from './cta-banner'
import popupAd from './popup-ad'
import featuredCollection from './featured-collection'
import promoBanner from './promo-banner'
import announcementBar from './announcement-bar'
import marketing from './marketing'
import servicesPage from './services-page'
import aboutPage from './about-page'
import service from './service'
import homepageCollectionSection from './homepageCollectionSection'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    heroSection,
    heroSlide,
    brandItem,
    statItem,
    shopByBrandsSection,
    aboutSection,
    categoryItem,
    categoriesSection,
    servicesSection,
    serviceItem,
    collectionHero,
    coffeeItem,
    coffeeShowcase,
    experienceItem,
    spaceExperiences,
    serviceBrandItem,
    serviceBrandsSection,
    customerItem,
    satisfiedCustomers,
    franchiseSection,
    teamMember,
    ourTeamSection,
    testimonialItem,
    clientTestimonials,
    storeLocation,
    ctaBanner,
    popupAd,
    featuredCollection,
    promoBanner,
    announcementBar,
    marketing,
    servicesPage,
    aboutPage,
    service,
    homepageCollectionSection,

    homepage,
  ],
}
```

Registered schema names:

- `heroSection`
- `homepage`
- `heroSlide`
- `brandItem`
- `statItem`
- `shopByBrandsSection`
- `aboutSection`
- `categoryItem`
- `categoriesSection`
- `servicesSection`
- `serviceItem`
- `collectionHero`
- `coffeeItem`
- `coffeeShowcase`
- `experienceItem`
- `spaceExperiences`
- `serviceBrandItem`
- `serviceBrandsSection`
- `customerItem`
- `satisfiedCustomers`
- `franchiseSection`
- `teamMember`
- `ourTeamSection`
- `testimonialItem`
- `clientTestimonials`
- `storeLocation`
- `ctaBanner`
- `popupAd`
- `featuredCollection`
- `promoBanner`
- `announcementBar`
- `marketing`
- `servicesPage`
- `aboutPage`
- `service`
- `homepageCollectionSection`

## Audit 6 — Current Package Versions

Source:
- `sixthgear-frontend/package.json`

Relevant versions:

```text
Next              : ^15.5.11
React             : 19.0.3
ReactDOM          : 19.0.3
ShopifyStorefront : ^1.0.9
NextSanity        : ^11.6.12
Sanity            : ^4.22.0
```

Audit finding:
- Current core stack is Next 15 + React 19 + Shopify Storefront API + next-sanity + Sanity 4.

## Audit 7 — Test Scripts Available

Source:
- `sixthgear-frontend/package.json`

Scripts:

```text
dev                  : next dev --turbopack -p 7000
build                : next build
start                : next start -p 7000
lint                 : next lint
analyze              : ANALYZE=true next build
test                 : playwright test
test:smoke           : playwright test tests/smoke
test:prod            : npx cross-env TEST_ENV=production playwright test tests/smoke
test:ui              : playwright test --ui
test:report          : playwright show-report
test:headed          : playwright test tests/smoke --headed
test:e2e             : playwright test tests/e2e
test:e2e:headed      : playwright test tests/e2e --headed
test:e2e:ui          : playwright test --ui
test:e2e:debug       : playwright test --debug
test:e2e:report      : playwright show-report
test:e2e:codegen     : playwright codegen http://localhost:7000
test:checkout        : playwright test tests/e2e/checkout
test:checkout:stripe : playwright test tests/e2e/checkout-stripe
test:checkout:cod    : playwright test tests/e2e/checkout-cod
```

Audit finding:
- Smoke tests and older checkout-focused E2E scripts coexist.
- `test:prod` depends on `cross-env`, but `cross-env` is not declared in dependencies or devDependencies.

## Audit 8 — Vercel Project Name

Sources checked:
- `sixthgear-frontend/vercel.json`
- `.vercel/project.json`

Command output:

```json
{
  "headers": [
    {
      "source": "/",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://rational-peace-7a8493cc74.strapiapp.com http://localhost:1337"
        },
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    },
    {
      "source": "/:countryCode(ph|us|sg|my)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://rational-peace-7a8493cc74.strapiapp.com http://localhost:1337"
        },
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    },
    {
      "source": "/:countryCode(ph|us|sg|my)/preview",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://rational-peace-7a8493cc74.strapiapp.com http://localhost:1337"
        },
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    },
    {
      "source": "/api/preview",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://rational-peace-7a8493cc74.strapiapp.com http://localhost:1337"
        },
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    }
  ]
}
No project.json
```

Audit finding:
- No local `.vercel/project.json` exists, so the Vercel project name cannot be confirmed from local metadata.
- `vercel.json` still contains Strapi preview CSP rules.

## Audit 9 — CMS Sections Status

Source:
- `sixthgear-frontend/src/lib/cms/client.ts`

Requested grep output:

```text
35:export async function getHomepageHero(): Promise<SanityHeroSection | null> {
54:    console.error('[Sanity] getHomepageHero failed:', error)
59:export async function getHomepageShopByBrands(): Promise<SanityShopByBrandsSection | null> {
78:    console.error('[Sanity] getHomepageShopByBrands failed:', error)
83:export async function getHomepageAbout(): Promise<SanityAboutSection | null> {
102:    console.error('[Sanity] getHomepageAbout failed:', error)
107:export async function getHomepageCategories(): Promise<SanityCategoriesSection | null> {
126:    console.error('[Sanity] getHomepageCategories failed:', error)
131:export async function getHomepageServices(): Promise<SanityServicesSection | null> {
150:    console.error('[Sanity] getHomepageServices failed:', error)
180:export async function getHomepageCollectionSections(): Promise<HomepageCollectionSection[]> {
204:    console.error('[Sanity] getHomepageCollectionSections failed:', error)
231:export async function getCoffeeShowcase(): Promise<SanityCoffeeShowcase | null> {
250:    console.error('[Sanity] getCoffeeShowcase failed:', error)
399:export async function getStoreLocation(): Promise<SanityStoreLocation | null> {
418:    console.error('[Sanity] getStoreLocation failed:', error)
447:export async function getMarketingData(): Promise<SanityMarketingData> {
467:    console.error('[Sanity] getMarketingData failed:', error)
477:export async function getServicesPage(): Promise<SanityServicesPage | null> {
492:    console.error('[Sanity] getServicesPage failed:', error)
```

All exported functions from `src/lib/cms/client.ts`:

- `client`
- `getHomepageHero`
- `getHomepageShopByBrands`
- `getHomepageAbout`
- `getHomepageCategories`
- `getHomepageServices`
- `getHomepageCollectionSections`
- `getCollectionHero`
- `getCoffeeShowcase`
- `getSpaceExperiences`
- `getServiceBrandsSection`
- `getSatisfiedCustomers`
- `getFranchiseSection`
- `getOurTeamSection`
- `getClientTestimonials`
- `getStoreLocation`
- `getCtaBanner`
- `getMarketingData`
- `getServicesPage`
- `getAboutPage`
- `getAllServicesCMS`
- `getServiceBySlug`

Audit finding:
- The Sanity client layer is fairly complete for homepage, marketing, services, and about.
- Despite that, the app still uses legacy sources in some pages and preview flows.

## Audit 10 — Shopify Collections

Command output:

```text
src\modules\search\components\you-may-like\index.tsx:57:        const response = await fetch("/api/collections/best-sellers/products?limit=6")
src\modules\search\components\enhanced-search-modal\index.tsx:9:import HotDealsProducts from "../hot-deals-products"
src\modules\search\components\hot-deals-products\index.tsx:2:// Replacement: Shopify products query by tag 'hot-deal'
src\lib\data\search.ts:28:  const key = cacheKey("search", "hot-deals")
src\lib\data\search.ts:34:        query: "tag:hot-deals",
src\lib\cms\types.ts:165:  collectionHandle: string
src\lib\cms\types.ts:391:  collectionHandle: string | null
src\lib\cms\queries.ts:113:    collectionHandle,
src\lib\cms\queries.ts:299:      collectionHandle,
src\lib\cms\client.ts:156:  collectionHandle?: string | null
src\lib\cms\client.ts:166:  collectionHandle: string
src\lib\cms\client.ts:173:    typeof item?.collectionHandle === 'string' &&
src\lib\cms\client.ts:174:    item.collectionHandle.trim().length > 0 &&
src\lib\cms\client.ts:196:        collectionHandle: item.collectionHandle.trim(),
src\modules\home\components\product-sections\index.tsx:10:export { default as HotDealsSection } from "./hot-deals-section"
src\modules\home\components\product-sections\index.tsx:11:export { default as BestSellersSection } from "./best-sellers-section"
src\modules\home\components\product-sections\hot-deals-section\index.tsx:31:      viewAllLink={`/${countryCode}/store?tag=hot-deals`}
src\modules\home\components\product-sections\homepage-collection-rail\index.tsx:13:  collectionHandle: string
src\modules\home\components\product-sections\homepage-collection-rail\index.tsx:20:function ViewAllCard({ collectionHandle }: { collectionHandle: string }) {
src\modules\home\components\product-sections\homepage-collection-rail\index.tsx:21:  const collectionHref = `/store?collection=${encodeURIComponent(collectionHandle)}`
```

Audit finding:
- Collection and tag patterns currently visible include:
  - `best-sellers`
  - `hot-deals`
  - Sanity-defined `collectionHandle` values for homepage rails
- In this grep sample, `all-products` did not appear, though it is used elsewhere in the app’s store flow.
- The app mixes direct tags, API endpoints, and CMS-defined collection handles.

## Overall Findings

### Active current stack
- Shopify
- Sanity
- Upstash Redis
- Judge.me
- Playwright

### Clear legacy or migration leftovers
- Strapi preview flow
- Strapi fallback utilities
- Medusa type imports
- Strapi-specific CSP in `vercel.json`

### Operational notes
- The app has a large route surface beyond storefront pages
- The Sanity client layer is strong, but the app is still hybrid in some areas
- The environment file is broader than the currently visible env usage
- `test:prod` has a dependency mismatch because `cross-env` is not declared

### Documentation recommendation
This file is suitable as an internal project-state appendix. For boss-facing documentation, the most important sections to surface are:
- active stack
- env variables actually required
- route inventory
- Sanity schema inventory
- test/CI status
- legacy migration debt still remaining

