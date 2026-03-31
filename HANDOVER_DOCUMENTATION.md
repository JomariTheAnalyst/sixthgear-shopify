# SixthGearMoto Project Handover Documentation

## 1. Executive Summary

This project is the SixthGearMoto headless storefront built with Next.js 15 and deployed separately from the Shopify hosted checkout.

Important repo note:
- The actual storefront app is in `sixthgear-frontend/`
- The workspace root also contains other folders and a placeholder root `package.json`
- Any boss handover should make it explicit that `sixthgear-frontend/` is the real app to run, deploy, test, and maintain

Current production architecture:
- Frontend: Next.js 15 App Router + React 19 + TypeScript
- Commerce backend: Shopify Storefront API
- CMS: Sanity Studio / Sanity hosted content
- Cache: Upstash Redis
- State/UI: Zustand + React context
- Reviews: Judge.me
- Deployment: Vercel
- Domain: `https://sixthgearmoto.com`
- Default storefront locale prefix: `/ph`

## 2. Current Status Snapshot

What is already in place:
- Shopify storefront integration is active
- Sanity Studio is integrated and actively used
- About page CMS integration is partially done
- Marketing revalidation and Shopify revalidation routes exist
- Redis caching exists
- Playwright smoke tests and GitHub Actions workflow exist
- Root route redirects to `/ph`

What is still mixed or incomplete:
- The codebase still contains legacy Strapi and Medusa references
- The homepage is still hybrid in places and not fully Sanity-only
- Services and First Gear pages still depend on `src/lib/strapi/*`
- Preview mode is still Strapi-based
- Documentation files in the repo are not fully aligned with the current stack

## 3. Current File Structure

This is the current high-value structure of the real storefront app inside `sixthgear-frontend/`.

```text
sixthgear-frontend/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── public/
├── sanity/
│   ├── schemaTypes/
│   │   ├── about-page.ts
│   │   ├── homepage.ts
│   │   ├── marketing.ts
│   │   ├── services-page.ts
│   │   ├── service.ts
│   │   └── index.ts
│   ├── structure.ts
│   ├── env.ts
│   └── lib/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── revalidate/
│   │   │   ├── revalidate-sanity/
│   │   │   └── ...
│   │   ├── studio/
│   │   ├── test-shopify/
│   │   ├── [countryCode]/
│   │   │   ├── (main)/
│   │   │   │   ├── about/
│   │   │   │   ├── account/
│   │   │   │   ├── cart/
│   │   │   │   ├── categories/
│   │   │   │   ├── collections/
│   │   │   │   ├── contact/
│   │   │   │   ├── first-gear/
│   │   │   │   ├── order/
│   │   │   │   ├── privacy/
│   │   │   │   ├── products/
│   │   │   │   ├── returns-warranty/
│   │   │   │   ├── services/
│   │   │   │   ├── store/
│   │   │   │   ├── terms/
│   │   │   │   ├── track-order/
│   │   │   │   ├── wishlist/
│   │   │   │   ├── @overlay/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── not-found.tsx
│   │   │   │   └── page.tsx
│   │   │   └── preview/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── lib/
│   │   ├── cache/
│   │   ├── cms/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── shopify/
│   │   ├── strapi/
│   │   └── util/
│   ├── modules/
│   │   ├── about/
│   │   ├── account/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── collections/
│   │   ├── common/
│   │   ├── contact/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── marketing/
│   │   ├── menu/
│   │   ├── order/
│   │   ├── products/
│   │   ├── search/
│   │   ├── services/
│   │   ├── shipping/
│   │   ├── skeletons/
│   │   ├── store/
│   │   └── wishlist/
│   ├── styles/
│   ├── types/
│   └── middleware.ts
├── tests/
│   ├── e2e/
│   ├── helpers/
│   ├── smoke/
│   └── README.md
├── .env.example
├── .env.local
├── .env.template
├── next.config.js
├── package.json
├── playwright.config.ts
├── sanity.config.ts
├── vercel.json
└── README.md
```

Generated or local-only folders that should not be treated as source of truth:
- `.next/`
- `node_modules/`
- `dist/`
- `playwright-report/`
- `test-results/`

## 4. Important App Entry Points

Core runtime files:
- `src/app/page.tsx`
  - Redirects `/` to `/ph`
- `src/middleware.ts`
  - Enforces locale prefixing and account/login route guards
- `next.config.js`
  - Next.js image hosts, headers, preview-related CSP
- `src/lib/env.ts`
  - Runtime environment validation
- `src/lib/shopify/*`
  - Shopify client, queries, and types
- `src/lib/cms/*`
  - Sanity client, queries, and types
- `src/lib/cache/redis.ts`
  - Upstash Redis setup and TTLs
- `src/app/api/revalidate/route.ts`
  - Shopify webhook revalidation endpoint
- `src/app/api/revalidate-sanity/route.ts`
  - Sanity webhook revalidation endpoint

## 5. Routing and Locale Behavior

Current storefront routing behavior:
- Default country code is `ph`
- `/` redirects to `/ph`
- Middleware automatically prefixes routes that do not already include a locale
- Protected account routes require a Shopify customer token cookie

Current locale-aware main routes:
- `/ph`
- `/ph/store`
- `/ph/about`
- `/ph/services`
- `/ph/contact`
- `/ph/first-gear`
- `/ph/account`
- `/ph/cart`
- `/ph/collections/...`
- `/ph/products/...`

Supported country code pattern in middleware and config:
- `ph`
- `us`
- `sg`
- `my`

Documentation must explicitly state that the live storefront defaults to `/ph`.

## 6. CMS and Content Model Status

Sanity is the current CMS in active use.

Sanity Studio singleton structure currently includes:
- Homepage
- Marketing
- Services Page
- About Page

Current About page CMS coverage:
- Hero
- Story
- What We Offer
- Our Values
- Why Choose Us
- CEO Quote

Current CMS-backed content areas elsewhere:
- Homepage sections
- Marketing sections
- Services page content shell
- Collection hero content
- Services documents

Important handover note:
- Sanity is active, but the codebase is not fully Sanity-only yet
- Several legacy Strapi-backed sections and preview flows still exist

## 7. Environment Variables and Secrets

The current runtime contract is defined in `src/lib/env.ts`.

Required server-side variables:
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_STORE_DOMAIN`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Optional server-side variables:
- `SHOPIFY_ADMIN_ACCESS_TOKEN`
- `SHOPIFY_WEBHOOK_SECRET`
- `SHOPIFY_API_VERSION`
- `REVALIDATION_SECRET`
- `JUDGEME_PRIVATE_TOKEN`
- `JUDGEME_SHOP_DOMAIN`

Required client-safe variables:
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

Optional client-safe variables:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN`
- `NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN`

Additional operational secret in use:
- `SANITY_WEBHOOK_SECRET`

Documentation should include:
- which platform owns each secret
- where each secret is configured
- who has access to update it
- what breaks if it is missing

Recommended documentation table:

| Variable | Required | Used For | Owner / Source |
| --- | --- | --- | --- |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes | Shopify storefront reads | Shopify |
| `SHOPIFY_STORE_DOMAIN` | Yes | Shopify domain config | Shopify |
| `UPSTASH_REDIS_REST_URL` | Yes | Redis cache access | Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Redis auth | Upstash |
| `SHOPIFY_WEBHOOK_SECRET` | Recommended | Shopify revalidation webhook validation | Shopify |
| `SANITY_WEBHOOK_SECRET` | Recommended | Sanity revalidation route security | Sanity / Vercel |
| `NEXT_PUBLIC_SITE_URL` | Recommended | absolute URLs, metadata | Vercel |
| `JUDGEME_*` | Optional | reviews integration | Judge.me |

## 8. Caching and Revalidation

Upstash Redis is active and should be included in the handover.

Current cache TTLs in `src/lib/cache/redis.ts`:
- `PRODUCT`: 300
- `COLLECTION`: 300
- `COLLECTIONS_LIST`: 600
- `SEARCH`: 120
- `HOMEPAGE`: 300

Current key prefix strategy:
- `sixthgear:v2:dev:*`
- `sixthgear:v2:prod:*`

Current webhook routes:
- Shopify revalidation: `/api/revalidate`
- Sanity revalidation: `/api/revalidate-sanity`

Current behavior:
- Shopify webhook route validates `x-shopify-hmac-sha256`
- Sanity webhook route validates the configured secret
- Cache invalidation triggers Next.js tags and Redis pattern invalidation

Documentation should include:
- exact webhook endpoints
- secret setup
- expected payload/authentication behavior
- how to test each webhook manually

## 9. Testing and CI/CD

Playwright is already installed and configured.

Current Playwright setup:
- Config file: `playwright.config.ts`
- Local base URL: `http://localhost:7000`
- Production base URL: `https://sixthgearmoto.com`
- Browsers: Chrome only
- Projects:
  - Desktop Chrome
  - Mobile Chrome
- Locale: `en-PH`
- Timezone: `Asia/Manila`

Current smoke test files:
- `tests/smoke/pages.spec.ts`
- `tests/smoke/navbar.spec.ts`
- `tests/smoke/product.spec.ts`

Current GitHub Actions workflow:
- `.github/workflows/playwright.yml`
- Runs local smoke tests on push and pull request to `main` and `master`
- Runs production smoke tests on successful Production deployment status

Important testing issue to document:
- `package.json` script `test:prod` uses `npx cross-env ...`
- `cross-env` is not listed in dependencies or devDependencies
- This is a setup/documentation issue that should be fixed or explicitly documented before handover

Recommended documentation items:
- local test commands
- production smoke test command
- how to view Playwright report
- where artifacts are stored
- current CI trigger behavior

## 10. What Must Be Done Before Boss Handover

These are the highest-priority handover tasks based on the current codebase.

### Priority 1: Fix project documentation drift

Current issue:
- `README.md` still states Strapi is the CMS
- `tests/README.md` still documents an older backend-driven E2E flow
- several docs in the repo no longer match the active architecture

What to do:
- rewrite `README.md` to reflect Shopify + Sanity + Redis + Vercel
- rewrite `tests/README.md` to reflect smoke tests, local port `7000`, and current CI
- remove or archive obsolete docs so the boss does not inherit contradictory instructions

### Priority 2: Document the real deployment and ownership model

The handover must include who owns access to:
- GitHub repository
- Vercel project
- Shopify store admin
- Sanity project and Studio
- Upstash Redis instance
- Judge.me account
- domain and DNS provider

Without this, the handover is incomplete even if the code is working.

### Priority 3: Confirm production secrets and webhook wiring

Must verify:
- Vercel environment variables are complete
- Shopify webhook is pointing to the correct production URL
- Sanity webhook is configured and using the matching secret
- `NEXT_PUBLIC_SITE_URL` and store domain values are correct

### Priority 4: Decide what to do with legacy Strapi and Medusa code

This is the biggest technical debt area.

Still present today:
- `src/lib/strapi/*`
- Strapi preview page
- Strapi preview CSP in `next.config.js`
- Strapi references in `vercel.json`
- homepage hybrid logic
- services and coffee page Strapi dependencies
- many `@medusajs/types` imports
- `_medusa_*` cookie naming in parts of the data layer

Before handover, one of these must happen:
- either clean it up
- or document it clearly as known migration debt with exact scope and next steps

### Priority 5: Clean preview strategy

Current issue:
- preview mode is still Strapi-oriented
- preview page says "Strapi CMS Preview Mode"
- CSP and embedding rules still target a Strapi Cloud domain

If the boss expects Sanity-only operation, this is confusing and should be resolved or documented explicitly.

### Priority 6: Confirm testing is runnable by the next maintainer

Must verify and document:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run test:smoke`
- `npm run test:prod`
- `npm run test:report`

Any broken script should either be fixed before handover or called out clearly in the handover notes.

### Priority 7: Clean or explain repo artifacts

The repo contains local artifact files and generated outputs such as:
- `build.log`
- `output.txt`
- `test.log`
- `services_out.html`
- `PLAYWRIGHT-SETUP.md`
- `FOLDER_STRUCTURE.md`
- temporary or migration-oriented notes

Before handover:
- remove junk if not needed
- or classify which docs are authoritative and which are legacy/internal notes

## 11. Current Known Technical Debt

These items should be listed honestly in the documentation.

### A. Legacy Strapi references remain

Confirmed legacy surfaces:
- `src/app/[countryCode]/preview/page.tsx`
- `src/app/[countryCode]/(main)/page.tsx`
- `src/app/[countryCode]/(main)/services/page.tsx`
- `src/app/[countryCode]/(main)/services/[slug]/page.tsx`
- `src/app/[countryCode]/(main)/first-gear/page.tsx`
- `src/modules/layout/templates/nav/index.tsx`
- `src/lib/data/service-detail.ts`
- `src/lib/strapi/*`
- `next.config.js`
- `vercel.json`

### B. Legacy Medusa references remain

Confirmed examples:
- many `@medusajs/types` imports across `src/modules/*` and `src/lib/*`
- `_medusa_jwt`
- `_medusa_cart_id`
- `_medusa_cache_id`
- `_medusa_locale`

These do not necessarily break runtime today, but they make ownership and architecture less clear.

### C. Homepage is still hybrid

Current homepage mixes:
- Sanity queries from `src/lib/cms/client.ts`
- legacy Strapi fallback fetchers
- a marketing stub from `src/lib/data/marketing.ts`

This increases maintenance cost and confuses future developers.

### D. Marketing data stub still exists

`src/lib/data/marketing.ts` currently returns an empty object shape:
- `strip: null`
- `banners: []`
- `popups: []`

If this is intentionally unused, it should be removed or documented.
If it is supposed to power active functionality, it still needs proper implementation.

### E. Environment checker is intentionally disabled

`check-env-variables.js` currently does nothing.

That means:
- some env validation exists in `src/lib/env.ts`
- but startup-level checks are intentionally disabled

This should be documented so the boss knows env safety depends on runtime code paths, not an upfront setup check.

### F. Test documentation is stale

`tests/README.md` still describes:
- old backend requirements
- old ports
- old test scope
- older browser assumptions

This should not be handed over as-is.

## 12. Recommended Handover Checklist

This is the checklist the boss should receive.

### Access checklist
- GitHub repo access confirmed
- Vercel project access confirmed
- Shopify admin access confirmed
- Shopify Storefront API token access confirmed
- Sanity project and Studio access confirmed
- Upstash Redis access confirmed
- Judge.me dashboard access confirmed
- domain registrar or DNS access confirmed

### Environment checklist
- production environment variables documented
- staging or development environment variables documented
- webhook secrets documented
- local `.env.local` setup instructions documented

### Operational checklist
- production deployment URL documented
- branch strategy documented
- rollback process documented
- cache invalidation and webhook flows documented
- preview strategy documented

### QA checklist
- `npm run build` passes
- smoke tests pass locally
- smoke tests pass in GitHub Actions
- production smoke tests are understood and monitored

### CMS checklist
- Sanity singleton docs listed
- About page ownership documented
- Homepage ownership documented
- Services page ownership documented
- who edits marketing banners and popup ads documented

## 13. What To Put In Your Final Boss Documentation

If you are preparing a final handover document for your boss, include these sections.

### Required documentation sections
- Project summary
- Live URLs and environments
- Tech stack
- Actual repo/app location
- File structure
- Local setup steps
- Production deployment flow
- Environment variables and secrets
- External services and ownership
- CMS overview
- Cache and webhook overview
- Testing and CI/CD overview
- Known issues and technical debt
- Immediate post-handover next steps
- Contact/owner list

### Required URLs to include
- Production storefront URL
- Vercel project URL
- Shopify admin/store URL
- Sanity Studio URL
- GitHub repository URL
- Upstash dashboard URL
- Judge.me dashboard URL

### Required credentials/access note
- never place raw secrets in the documentation
- instead document where they are stored and who can rotate them

## 14. Recommended Immediate Next Steps After Handover

If the boss plans to continue the project, these should be the first follow-up actions.

1. Rewrite `README.md` and `tests/README.md` to the current architecture.
2. Finish migration away from Strapi on homepage, services, menu, nav, and preview.
3. Remove or rename Medusa-era types and cookie names where no longer appropriate.
4. Clean and simplify the preview system for the active CMS.
5. Verify all production secrets and webhook endpoints.
6. Fix or replace any test commands that rely on undeclared tools such as `cross-env`.
7. Decide which internal docs are authoritative and archive the rest.

## 15. Honest Assessment

This project is handover-capable only if the handover is explicit about the current migration state.

What is good:
- the storefront has a modern stack
- Shopify and Sanity are active
- caching and revalidation exist
- smoke testing and CI are present
- the About page CMS migration has made real progress

What is risky:
- the repo still contains mixed-era architecture
- some documentation is outdated enough to mislead a new owner
- preview and some pages still rely on legacy Strapi paths
- several naming conventions still reflect Medusa even though the app is now Shopify-based

Bottom line:
- this is not a broken project
- but it is also not a fully cleaned, post-migration codebase
- the boss should receive both the working architecture and the remaining migration debt in writing

