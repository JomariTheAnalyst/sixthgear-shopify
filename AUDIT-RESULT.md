Sprint 1: Safe SEO Critical Fixes

Goal:
Fix low-risk production SEO gaps from the audit without changing ecommerce rendering/caching behavior.

Important rules:

* Do not migrate product, collection, or store pages from SSR to ISR in this sprint.
* Do not change product pricing, inventory, availability, cart, checkout, account, or user-specific behavior.
* Do not add fake schema fields.
* Do not noindex clean canonical product, collection, service, rider story, or homepage URLs.
* Do not keyword-stuff metadata.

Task 1 — Add Page-Specific OpenGraph and Twitter Metadata to Collection Pages

In:
`src/app/[countryCode]/(main)/collections/[handle]/page.tsx`

Update `generateMetadata` to include page-specific `openGraph` and `twitter`.

Use:

* `collection.seo.title` with fallback to `collection.title`
* `collection.seo.description` with fallback to `collection.description`
* `collection.image?.url` for image when available
* clean canonical from existing `getLocalizedCanonicalPath`

OpenGraph should include:

* `type: "website"`
* `title`
* `description`
* `url`
* `siteName`
* `images` only when a valid image exists

Twitter should include:

* `card: "summary_large_image"` when image exists
* `card: "summary"` when no image exists
* `title`
* `description`
* `images` only when a valid image exists

Follow the safe pattern already used by product pages, but include collection-specific URL and image fallback behavior.

Task 2 — Add Page-Specific OpenGraph and Twitter Metadata to Homepage

In:
`src/app/[countryCode]/(main)/page.tsx`

Update homepage `generateMetadata` to include explicit `openGraph` and `twitter`.

Use homepage positioning:
`SixthGearMoto | Motorcycle Parts, Riding Gear & Service Center Makati`

Use a natural homepage description:
`Shop premium motorcycle parts, riding gear, Akrapovic exhausts, and big bike accessories at SixthGearMoto. Visit our motorcycle shop, service center, carwash, and coffee spot in Makati, Philippines.`

Use the Sanity hero/social image if already available through the existing homepage data flow. If not available, use a centralized default OG image from the site config. Do not scatter hardcoded production image URLs across files.

OpenGraph should include:

* `type: "website"`
* `title`
* `description`
* `url`
* `siteName`
* `images`

Twitter should include:

* `card: "summary_large_image"`
* `title`
* `description`
* `images`

Task 3 — Add Safe Noindex Handling for Non-Canonical Parameter URLs

Audit and implement safe `robots` metadata handling for query-parameter URLs.

Use App Router `searchParams` in `generateMetadata` where available.

Noindex/follow these parameter URLs:

* `sort`
* `filter`
* `tag`
* `q`
* `search`
* `from`
* `variant`
* `v_id`
* UTM/tracking params
* unknown non-canonical query parameters

Do not noindex:

* clean product URLs
* clean collection URLs
* clean service URLs
* clean rider story URLs
* homepage
* store page without parameters

Pagination rule:

* Do not blindly noindex `page > 1` yet.
* First audit whether pagination URLs expose unique crawlable product lists or duplicate the canonical page.
* If pagination is duplicate/UI-only, recommend noindex/follow.
* If pagination is important for product discovery, recommend index/follow with a clean self-canonical or a controlled pagination strategy.
* Return recommendation before changing pagination indexing behavior.

Canonical rule:

* Canonical for parameter URLs should still point to the clean canonical page.
* Do not create canonical URLs with sort/filter/search/tracking parameters.

Task 4 — Production Domain Verification

Because production environment variables are already set in Vercel, only verify the output.

Confirm on deployed or production-like build:

* sitemap URLs use `https://www.sixthgearmoto.com/ph`
* canonical URLs use the production domain
* OpenGraph URLs use the production domain
* JSON-LD URLs use the production domain
* no localhost URLs appear in production output

Task 5 — Verification

Run:

* `npx.cmd tsc --noEmit`
* `npm.cmd run build`

Verify:

* One collection page has collection-specific OG/Twitter metadata.
* Homepage has page-specific OG/Twitter metadata.
* Clean collection/product pages remain indexable.
* Filtered/sorted/tracking URLs return `noindex, follow`.
* Pagination behavior is audited and documented before any noindex change.
* Canonicals remain clean.
* Sitemap and robots still respond.
* No localhost URLs appear in production output.

Return:

* changed files
* summary of changes
* metadata examples from one collection and homepage
* noindex behavior table
* pagination recommendation
* build/typecheck output
* risks or follow-up recommendations

Out of scope for this sprint:

* ISR migration
* Shopify webhook revalidation
* product GTIN/MPN
* review schema
* LocalBusiness schema
* Service schema
* rider story Article schema
* image optimization changes
