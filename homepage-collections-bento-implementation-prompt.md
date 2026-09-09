# Implementation Task: Build Homepage Collections Bento Section

## Objective

Build a new **Sixthgear homepage Collections Bento section** for the existing Next.js storefront.

For this sprint, use **temporary hardcoded collection data and local/placeholder images only**.

Do **not** connect this section to Shopify metafields, Shopify collection references, Storefront API collection selection, or Sanity yet.

The goal is to complete and validate the visual design, bento layout, responsive behavior, interactions, typography, spacing, and links first. Later, only the data source should need to change when we migrate this section to Shopify-controlled collections.

This task is limited to this new homepage section.

---

## Mandatory First Step — Audit Before Editing

Before changing code:

1. Read the repository root `AGENTS.md`.
2. Locate the homepage composition and choose the correct insertion point.
3. Inspect existing homepage section/container patterns.
4. Check how `Outfit Variable` is already registered.
5. Check existing button/link/arrow patterns.
6. Check whether suitable local collection/category images already exist and can be reused temporarily.
7. Check the existing collection route pattern before assigning href values.
8. Do not change Shopify queries, metafields, Sanity schemas, cart logic, or unrelated homepage sections.
9. Do not perform unrelated refactors.

---

## Visual Reference

Inspect the supplied reference image before implementing.

Reference screenshot:

`9d878b99-030b-4047-b283-74e75f979d5f.png`

If that filename is unavailable, inspect the image attached to this task/message.

Use it as the reference for:

- centered heading and short supporting text
- one large image tile on the left
- two smaller stacked image tiles on the right
- rounded corners
- image-first cards
- collection name overlay
- compact CTA
- clean white surrounding background
- generous spacing

Do not copy the reference site's branding, products, text, or imagery.

Adapt the layout to Sixthgear.

---

## Typography

Use:

`public/fonts/outfit-variable-latin.woff2`

Use Outfit throughout this section.

Reuse the existing font registration. Do not register it twice and do not load an external font.

Use the current homepage heading/body conventions so this section matches About Us, Services, and Our Team.

Collection names should be bold and immediately readable over imagery.

---

## Horizontal Section Spacing

Continue the current homepage alignment rule.

On sufficiently large desktop screens:

- left spacing: `233px`
- right spacing: `233px`

Do not apply this globally to other sections in this task.

Do not force 233px on smaller widths.

Target:

- large desktop: 233px left/right
- smaller desktop: responsive reduction
- tablet: responsive reduction
- mobile: approximately 20px–24px

No horizontal overflow.

---

## Section Header

Create a centered header inspired by the reference.

Suggested heading:

`Recommended Collections For You`

Add one short supporting sentence beneath it.

Keep the supporting copy concise.

If an existing approved heading already exists for this section, preserve it instead of inventing unrelated copy.

---

## Temporary Hardcoded Data

For this sprint, use a centralized local data array.

Do not scatter hardcoded values through JSX.

Use a simple typed model similar to:

```ts
type HomeCollectionItem = {
  key: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
  ctaLabel?: string;
};
```

Follow the repository's existing TypeScript conventions.

Temporary collection items may include:

- Apparel
- Riding Gear
- Communications / Intercoms
- Helmets
- Bags & Luggages
- Big-Bike Parts

If equivalent collection routes already exist, use those verified routes.

If an exact href cannot be confirmed from the repository, keep it clearly centralized and report it as temporary in the completion notes. Do not invent complex routing behavior.

The hardcoded array must be easy to replace later with Shopify data.

---

## Temporary Images

Prefer existing local project images where suitable.

If there are no good collection images, use maintainable local placeholders.

Do not fetch random remote images.

Do not add an image dependency.

Do not create final production artwork during this sprint.

All current images are temporary.

---

## Bento Layout — First 3 Items

Reproduce the reference composition:

```text
┌───────────────────────┬───────────────────────┐
│                       │   COLLECTION 02       │
│                       │                       │
│    COLLECTION 01      ├───────────────────────┤
│                       │   COLLECTION 03       │
│                       │                       │
└───────────────────────┴───────────────────────┘
```

Requirements:

- item 1 = large/tall left tile
- item 2 = upper-right tile
- item 3 = lower-right tile
- consistent gaps
- rounded corners
- full-bleed images
- readable title and CTA overlays
- responsive rather than fixed pixel sizing

Prefer CSS Grid.

Avoid complicated absolute positioning if Grid can produce the layout.

---

## More Than 3 Collections

The section must support 4–6 temporary items.

Group items in sets of three.

Alternate the pattern:

### Group 1
- large left
- small upper-right
- small lower-right

### Group 2
- small upper-left
- small lower-left
- large right

Concept:

```text
GROUP 1

┌──────────────┬──────────────┐
│              │      2       │
│      1       ├──────────────┤
│              │      3       │
└──────────────┴──────────────┘

GROUP 2

┌──────────────┬──────────────┐
│      5       │              │
├──────────────┤      4       │
│      6       │              │
└──────────────┴──────────────┘
```

Do not shrink six items into tiny cards just to force one grid.

If fewer than six items exist, render the available items cleanly.

---

## Collection Tile Design

Each tile should contain:

- full-bleed image
- collection title
- compact CTA such as `View collection`
- optional arrow icon

The **entire tile must be clickable**.

The visual CTA is not the only click target.

Use the project's established Next.js `Link` pattern.

Do not nest links/buttons illegally.

Suggested visual structure:

```text
┌─────────────────────────┐
│ COLLECTION TITLE        │
│                         │
│                         │
│ [ View collection  ↗ ] │
└─────────────────────────┘
```

Keep placement close to the supplied reference.

Use enough contrast for text readability.

A restrained overlay/text scrim is acceptable only if needed.

---

## Tile Corners and Images

Use a consistent radius around `16px`, or reuse an appropriate existing radius token.

Images should:

- use the existing Next.js image strategy
- use `object-fit: cover`
- remain responsive
- avoid stretching
- avoid layout shift
- use appropriate `sizes`
- have useful alt text

Large and small bento tiles may crop the same image differently.

---

## Hover / Focus Interaction

On desktop/fine pointers, keep animation restrained.

On hover/focus:

- image scale may move to approximately `1.02–1.04`
- CTA/arrow may shift slightly
- overlay may change subtly

Suggested transition duration: approximately `250–400ms`.

Do not use:

- bouncing
- rotation
- large zoom
- 3D flips
- autoplay media
- continuous animation

The design must remain clear with reduced motion enabled.

---

## Responsive Layout

Do not simply shrink the desktop bento.

### Tablet / medium mobile

For each 3-item group, prefer:

```text
┌─────────────────────┐
│     LARGE ITEM      │
└─────────────────────┘

┌──────────┬──────────┐
│ SMALL 2  │ SMALL 3  │
└──────────┴──────────┘
```

### Narrow mobile

Allow:

```text
[ Collection 1 ]
[ Collection 2 ]
[ Collection 3 ]
```

if two small columns become too cramped.

Requirements:

- no horizontal scrolling
- readable titles
- tappable CTA
- intentional image cropping
- useful card heights
- approximately 20px–24px mobile side spacing

Use existing project breakpoints where practical.

---

## Accessibility

Requirements:

- semantic section heading
- whole-tile link is keyboard accessible
- visible focus state
- useful image alt text
- readable CTA
- do not rely only on hover
- respect `prefers-reduced-motion`

For reduced motion, disable scale/translation while preserving layout and navigation.

---

## Performance

Keep the section lightweight.

Requirements:

- responsive Next.js images
- no autoplay video
- no animation library for this section
- prefer CSS transitions
- avoid oversized placeholder assets
- do not eagerly load every large image unless appropriate
- avoid unnecessary React state
- keep this section server-rendered/static if client state is not required

Do not turn the whole component into a Client Component solely for CSS hover effects.

---

## Future Shopify Migration Boundary

This sprint is intentionally hardcoded.

Structure the code so the future change is only the source of the data.

Current:

```text
Temporary local collection data
            ↓
     CollectionBento
            ↓
   CollectionBentoTile
```

Future:

```text
Shopify-selected collections
            ↓
     CollectionBento
            ↓
   CollectionBentoTile
```

Do not add Shopify metafield code, Shopify selection queries, or Sanity integration now.

---

## Scope Guardrails

### Allowed

- new homepage Collections Bento section
- direct helper/presentation components
- local temporary data
- local placeholder images
- section-specific responsive styles
- hover/focus effects
- collection links
- accessibility required by this section

### Not Allowed

Do not:

- add Shopify metafields
- add Storefront API collection-selection work
- add Sanity fields
- change product/cart/checkout logic
- redesign About Us
- redesign Services
- redesign Our Team
- redesign Categories
- globally refactor the 233px container
- change navigation/footer
- install unnecessary dependencies
- perform broad CSS cleanup
- refactor unrelated files
- change deployment configuration
- deploy
- push unless explicitly instructed

---

## Suggested Component Architecture

Follow the existing repo structure first.

A reasonable conceptual structure is:

```text
RecommendedCollections
├── CollectionBentoGroup
│   ├── CollectionBentoTile
│   ├── CollectionBentoTile
│   └── CollectionBentoTile
```

Keep temporary data centralized and presentation reusable.

Avoid over-abstraction.

---

## Verification

After implementation and diff inspection, run **exactly these three commands once**:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Do not add Jest, Vitest, Playwright, Cypress, Lighthouse, formatter commands, extra builds, or unrelated tests.

Follow `AGENTS.md`.

Do not repeatedly run verification during implementation.

---

## Focused Browser Review

A browser review is important because the bento proportions, image cropping, and responsive layout need visual confirmation.

After implementation and the three verification commands, perform **one focused browser review** of this homepage section only.

Do not repeatedly browse after every small edit.

### Desktop

Confirm:

- white surrounding background
- 233px side spacing at the intended large-desktop breakpoint
- centered header
- first group uses one large left + two stacked right tiles
- second group alternates if 4–6 items exist
- consistent rounded corners
- intentional image crops
- readable title/CTA
- full tile clickable
- subtle hover
- no layout shift
- no horizontal overflow

### Tablet

Confirm:

- spacing reduces cleanly
- layout does not become cramped
- title/CTA remain readable
- transition to mobile composition happens before tiles become too narrow

### Mobile

Confirm:

- approximately 20px–24px side spacing
- large tile first
- smaller tiles use two columns where appropriate
- narrow widths stack cleanly
- no horizontal overflow
- text remains readable
- CTA remains tappable
- cards keep useful image height

---

## Completion Report

When finished, provide:

### Files Changed
List only files actually changed.

### Implementation Summary
Briefly explain:
- new bento section
- hardcoded temporary data
- alternating group pattern
- responsive behavior
- Outfit usage
- 233px desktop spacing
- hover/focus interaction
- placeholder-image strategy
- future Shopify migration boundary

### Verification

Report only:

```text
npx tsc --noEmit
npm run lint
npm run build
```

with pass/fail status.

### Browser Review
Report the one focused desktop/tablet/mobile review.

### Follow-up Notes

Clearly mention:

- collection content is currently hardcoded
- images are temporary/placeholders
- Shopify metafield/selection integration is intentionally deferred
- any temporary href values that still need confirmation

Do not begin another task after the completion report.
