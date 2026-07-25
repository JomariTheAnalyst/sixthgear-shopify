# Implement Sanity Visual Editing for SixthGear

## Role

Act as the senior Next.js and Sanity engineer for SixthGear.

Implement Sanity **Presentation**, secure **Draft Mode**, live draft preview, and **click-to-edit overlays** for the existing storefront. Preserve the current design, CMS selectors, Shopify ownership, and complete fallback behavior.

## Project

```text
C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify
```

Current stack:

- Next.js 15 App Router
- React 19
- TypeScript
- Sanity Studio at `/studio`
- Shopify Storefront API
- Active CMS layer under `src/lib/cms`
- Vercel deployment

The Mintlify documentation skill is unrelated to this implementation. Use the installed Sanity and `next-sanity` versions as the compatibility source. Do not upgrade Next.js.

## Read before writing

Inspect:

```text
package.json
sanity.config.ts
sanity/env.ts
src/app/layout.tsx
src/middleware.ts
next.config.js
vercel.json
src/lib/cms/client.ts
src/lib/cms/queries.ts
src/lib/cms/types.ts
sanity/lib/live.ts
src/app/[countryCode]/preview/page.tsx
src/components/preview-indicator.tsx
.env.example
src/lib/env.ts
```

Search for:

```text
presentationTool
VisualEditing
SanityLive
defineLive
draftMode
defineEnableDraftMode
stega
stegaClean
data-sanity
data-sanity-edit-target
encodeDataAttribute
createDataAttribute
SANITY_API_READ_TOKEN
```

Use only APIs supported by the installed package versions. Do not copy newer Next.js examples without checking compatibility.

## Required implementation

### 1. Presentation Tool

Add Sanity Presentation to `sanity.config.ts` while preserving Structure and Vision.

Configure:

```text
Tool label: Visual Editor
Initial route: /ph
Enable Draft Mode: /api/draft-mode/enable
Disable Draft Mode: /api/draft-mode/disable
Studio location: /studio
```

Add document-location resolvers for:

```text
homepage  → /ph
aboutPage → /ph/about
marketing → /ph
blogPost  → /ph/rider-stories/{slug}
```

Use only the canonical singleton IDs:

```text
homepage
aboutPage
marketing
```

Do not add Services, First Gear, Shopify product, collection, checkout, or account resolvers yet.

### 2. Secure Draft Mode

Create:

```text
src/app/api/draft-mode/enable/route.ts
src/app/api/draft-mode/disable/route.ts
```

Requirements:

- Validate Draft Mode activation through Sanity.
- Use a server-only `SANITY_API_READ_TOKEN`.
- Prevent open redirects.
- Reject unauthorized or malformed requests.
- Never log or expose the token.
- Keep published pages working when Draft Mode is disabled.

Add only the variable name to `.env.example` and server-side environment validation:

```text
SANITY_API_READ_TOKEN
```

Never prefix it with `NEXT_PUBLIC_`.

### 3. Draft-aware Sanity fetching

Preserve the existing published client behavior.

Published visitors:

```text
perspective: published
stega: false
existing CDN and cache behavior
no read token
```

Draft Mode:

```text
perspective: drafts
stega: true
useCdn: false
server-only read token
no public caching
live updates enabled
```

Use the version-compatible equivalent of:

```text
defineLive
sanityFetch
SanityLive
VisualEditing
```

Do not create another competing Sanity client.

### 4. Click-to-edit overlays

Visible overlays are required.

Support automatic text overlays by preserving stega metadata on visible Sanity strings.

Add explicit annotations for:

- Section wrappers
- Images
- Cards
- Carousel items
- Accordion items
- Array objects
- Boolean toggles
- Links
- Campaign dates and positions
- Featured Collection editorial content

Use the installed package’s supported equivalent of:

```text
data-sanity
data-sanity-edit-target
encodeDataAttribute
createDataAttribute
```

Do not guess imports.

Use `_key`-based array paths:

```text
whatWeOffer.cards[_key=="..."]
ourTeamSection.teamMembers[_key=="..."]
marquee.items[_key=="..."]
serviceBrandsSection.brands[_key=="..."]
ourSpaceExperience.items[_key=="..."]
```

Do not use numeric array indexes.

### 5. Overlay coverage

Add click-to-edit targets to:

```text
Homepage Hero
Marquee
Homepage About
Categories
Coffee Showcase
Homepage Services
What We Offer
Brands We Support
Satisfied Customers
Franchise
Our Team
Client Testimonials
Store Location
CTA Banner
Announcement Bar
Promo Banners
Featured Collection
Popup
Rider Stories
About main content
Our Space & Experience
```

At minimum, verify exact field targeting for:

```text
homepage.whatWeOffer
homepage.ourTeamSection
homepage.marquee
homepage.serviceBrandsSection
aboutPage.ourSpaceExperience
```

Images must open their image fields. Array cards must open the exact `_key` object.

### 6. Fallback sections

Preserve the existing atomic fallback contract:

```text
useSanityContent absent or false
→ render the complete local fallback
→ do not hide the section
```

When fallback content is displayed:

- Add one section-level Sanity edit target.
- Link it to the section object or `useSanityContent`.
- Do not annotate local fallback text or images as Sanity fields.
- Clicking the section must let the editor open the CMS section, populate it, and enable Sanity content.

When valid Sanity content is enabled:

- Render Sanity content only.
- Enable field-level text, image, card, and array-item overlays.
- Do not append fallback entries.

### 7. Featured Collection ownership

Sanity-editable:

```text
Campaign heading
Description
Campaign image and alt text
CTA label and destination
isActive
Start and end dates
Position
Shopify collection handle
```

Not Sanity-editable:

```text
Shopify product title
Price
Inventory
Availability
Variants
Shopify-owned product media
```

Clean the collection handle before sending it to Shopify.

### 8. Stega safety

Use `stegaClean` or the compatible equivalent before:

```text
URL validation
href assignment
Route construction
Slug use
Date parsing
Enum comparison
Campaign position matching
Shopify collection lookup
GraphQL variables
Metadata
Cache tags
Redis keys
Analytics identifiers
```

Rule:

```text
Cleaned value → logic, routes, metadata, external APIs
Original value → visible Sanity text and overlays
```

Do not strip source metadata from all rendered strings.

### 9. Layout and preview UI

Render live content and Visual Editing in `src/app/layout.tsx`.

Overlays must appear only in Draft Mode.

Normal visitors must receive:

```text
Published content only
No overlays
No preview controls
No draft token
No draft metadata
```

Reuse or replace `src/components/preview-indicator.tsx` so a **Disable Draft Mode** control:

- Appears only in Draft Mode
- Is hidden inside Presentation
- Appears when preview is opened directly
- Is accessible
- Links to `/api/draft-mode/disable`

Retire or redirect the old Strapi preview route after checking all callers. Do not maintain two preview systems.

### 10. Security and iframe review

Verify:

```text
/studio remains accessible
/api/draft-mode/* is not locale redirected
Draft cookies work in Presentation
/ph loads inside the Studio iframe
CSP and frame headers permit only the required origins
Maintenance mode does not unintentionally block authorized preview
```

Do not add wildcard CORS or unrestricted iframe permissions.

## Tests

Add focused tests for:

### Draft Mode

```text
Unauthorized activation rejected
Valid activation enables Draft Mode
Missing token fails safely
Disable route clears Draft Mode
External/open redirects rejected
```

### Resolvers

```text
Homepage → /ph
About Page → /ph/about
Blog post slug → correct route
Missing slug → no broken route
Canonical singleton IDs used
```

### Stega safety

```text
Collection handle cleaned before Shopify lookup
Campaign dates cleaned before parsing
Position cleaned before comparison
CTA URL cleaned before href use
Blog slug cleaned before route use
Visible text preserves source metadata
Metadata receives clean text
```

### Overlays

```text
No VisualEditing outside Draft Mode
VisualEditing present in Draft Mode
Fallback section has one section-level target
Fallback child text has no false Sanity target
Sanity array item uses a _key path
Sanity image targets the correct image field
Shopify product data has no Sanity target
```

Avoid brittle tests against private Sanity markup.

## Validation

Run:

```bash
npx sanity schema validate
npx tsc --noEmit --incremental false
npm run build
git diff --check
```

Run all existing CMS selector tests and all new Visual Editing tests.

## Required browser verification

Use the repository’s actual development command and port.

Verify:

1. Open `/studio`.
2. Open **Visual Editor**.
3. Confirm `/ph` loads in Presentation.
4. Turn on **Edit** mode.
5. Hover and click:
   - one heading
   - one image
   - one What We Offer card
   - one Our Team member
   - one Marquee item
   - one Brands We Support item
   - one fallback-rendered section
   - one About Page field
   - one Our Space & Experience item
   - one marketing banner
6. Confirm each opens the correct document and field or object.
7. Edit a draft field without publishing and confirm live preview updates.
8. Confirm the normal storefront still shows published content.
9. Confirm fallback remains complete when `useSanityContent` is false.
10. Confirm Shopify product price and inventory have no Sanity overlay.
11. Disable Draft Mode and confirm overlays disappear.

Do not claim Visual Editing works unless these browser checks were completed.

## Dashboard checklist

Return manual instructions for:

```text
Creating a minimum-permission Sanity draft-read token
Adding exact local and production CORS origins
Enabling credentials only where required
Adding SANITY_API_READ_TOKEN to Vercel
Redeploying
Verifying Presentation in production
```

Never expose token values.

## Constraints

Do not:

- Upgrade Next.js
- Execute the pending Sanity migration
- Modify live Sanity documents
- Modify Shopify data
- Build drag-and-drop page building
- Remove complete fallbacks
- Hide sections when `useSanityContent` is false
- Annotate fallback child content as Sanity fields
- Annotate Shopify product data
- Refactor unfinished Services CMS ownership
- Resolve unrelated Git conflicts

## Completion report

Return:

### Compatibility
Package versions before and after, with reasons for changes.

### Architecture
Show:

```text
Presentation
→ secure Draft Mode
→ draft-aware fetch
→ stega metadata
→ live update
→ click-to-edit overlay
→ correct document and field
```

### Files changed
List every created, changed, removed, or redirected file.

### Overlay coverage
List automatic text, section, image, card, `_key` array, fallback, and marketing targets.

### Browser results
For each tested element, report:

```text
Page
Element
Document opened
Field or object focused
Result
```

### Verification
Report schema validation, TypeScript, build, existing tests, new tests, and `git diff --check`.

### Dashboard work remaining
List token, CORS, Vercel environment, redeployment, and production verification.

### Integrity
Confirm:

- No live content changed
- No migration executed
- No Shopify data modified
- Complete fallback behavior preserved
- Normal visitors receive no drafts or overlays
- Draft token remains server-only
