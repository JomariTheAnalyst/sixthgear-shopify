# Role

Act as a senior frontend engineer auditing the SixthGear headless ecommerce storefront.

# Project

Repository:

C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify

Architecture:

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Shopify Storefront API for commerce
- Sanity for editorial content
- Sanity Studio mounted at `/studio`

The owner is planning to redesign the homepage Featured Brands / Shop by Brands section located below the marquee.

# Planned Direction

The future section should:

- Be fully curated through Sanity instead of being limited to four Shopify-controlled cards.
- Allow an unlimited number of brand entries.
- Let editors add, remove, enable, disable, and reorder entries.
- Link each entry to an existing Shopify collection.
- Let Sanity control the brand name, supporting label, collection handle/link, image, and alt text.
- Use portrait cards with a fixed 2:3 aspect ratio. Recommended minimum image size: 400 × 600 px.
- Use `object-cover` so every card keeps the same visual dimensions.
- Follow the supplied visual direction:
  - rounded portrait cards
  - full-bleed image
  - dark bottom gradient
  - brand name near the bottom
  - smaller uppercase supporting text underneath
  - partial next card visible
- Support mouse dragging and touch swiping.
- Loop seamlessly without a visible start or end.
- Preserve accessibility, responsive behavior, performance, and reduced-motion support.
- Keep Shopify as the source of truth for the destination collection. Sanity only controls presentation and collection selection.

# Audit Only

Do not modify any files yet.

Inspect the current implementation and report the exact data flow from Sanity and Shopify into the rendered section.

Start with these likely locations, but confirm the actual paths:

- `src/modules/home/components/featured-brand/index.tsx`
- `src/app/[countryCode]/(main)/page.tsx`
- `src/lib/cms/queries.ts`
- `src/lib/cms`
- `sanity/schemaTypes`
- `sanity/structure.ts`
- `package.json`

Also search for:

- `FeaturedBrand`
- `ShopByBrands`
- `shopByBrands`
- `BrandStatsStrip`
- Shopify collection queries used by the section
- Existing carousel or slider libraries
- Embla, Swiper, Keen Slider, Framer Motion, GSAP, or custom drag logic
- Existing Sanity image helpers and collection-handle fields
- Local fallback brand data

# Required Audit Findings

Report:

1. Exact files involved in the section.
2. Current component hierarchy and props.
3. Current source of the four brand cards.
4. Whether current Sanity fields are actually consumed.
5. Existing Sanity schema fields and validation.
6. Existing GROQ projections and TypeScript types.
7. How Shopify collections are currently fetched and mapped.
8. Current fallback behavior when Sanity data is missing.
9. Existing carousel dependency that should be reused, if any.
10. Whether seamless looping can be implemented with the existing dependency.
11. Current responsive breakpoints and card sizing.
12. Any hydration, Server Component, Client Component, image, or performance risks.
13. Exact files that would need modification.
14. Recommended Sanity schema shape for the approved direction.
15. A concise implementation sequence.

# Important Decisions to Flag

Explicitly identify whether owner approval is still required for:

- Brand title versus Shopify collection title
- Optional supporting label
- Internal collection handle versus manually entered URL
- Whether incomplete Sanity entries should be skipped or use fallbacks
- Whether the current statistics strip remains, moves, or is removed
- Whether desktop wheel scrolling should move the carousel
- Whether keyboard arrow navigation should be visible

# Rules

- Read only; do not edit files.
- Do not generate implementation code.
- Do not create schemas yet.
- Do not install dependencies.
- Do not assume the previous audit still reflects the current branch.
- Preserve Shopify as the commerce source of truth.
- Avoid broad homepage or CMS refactors.
- Reference exact file paths, components, functions, queries, and schema types.
- Clearly separate confirmed findings from recommendations.

# Output Format

Return:

1. Current implementation summary
2. File and data-flow map
3. Confirmed limitations
4. Existing reusable infrastructure
5. Recommended schema and frontend approach
6. Required owner decisions
7. Exact implementation file list
8. Risks and verification checklist