# Task: Build Shop Mega Menu

## Objective

Revamp the existing **SHOP** navbar dropdown into a large visual mega menu using the attached reference image as the layout/design guide.

Reference image:
`c058bd36-8487-467d-a1bb-975daa7aefce.png`

Inspect the reference before implementing.

For this sprint:

- hardcode the menu items and images
- use the real existing collection/page links from the repository
- do **not** connect this to Shopify metafields or Sanity yet
- preserve all existing navbar functionality

---

## Required Menu Items

Use these six destinations:

1. All Products
2. Riding Gear
3. Parts & Accessories
4. Helmets
5. Bags & Luggage
6. Communications

Before coding the href values, audit the existing collection routes/handles and use the real current URLs. Do not guess routes.

Keep the data centralized in one array/object so it can later be replaced by Shopify-controlled data.

Example shape:

```ts
{
  title, image, imageAlt, href
}
```

---

## Desktop Design

When SHOP is hovered or keyboard-focused, open a large full-width mega-menu panel directly beneath the navbar.

Use the attached reference for:

- large image-first cards
- category title at the top-left
- very light neutral card background
- subtle corner radius
- clean spacing
- minimal UI
- no heavy shadows or borders

### Card sizing

Reference size:

```text
366px × 436px
```

Treat this as the preferred/max desktop size and preserve the aspect ratio:

```text
366 / 436
```

Do **not** force six literal 366px cards if they exceed viewport width.

Cards must scale responsively to fit the available desktop width without page overflow.

Use a small radius similar to the reference.

---

## Images

Use existing local project images as temporary placeholders where possible.

Do not fetch random remote images and do not create final artwork in this sprint.

Each card image should:

- fill the card cleanly
- use `object-fit: cover` or `contain` depending on the chosen local asset
- remain responsive
- avoid distortion
- have useful alt text

---

## Interaction

The entire card is clickable.

Use the existing Next.js `Link` pattern.

On desktop:

- hover/focus SHOP → mega menu opens
- moving pointer from SHOP into the mega menu must keep it open
- leaving both SHOP and mega menu closes it
- pressing `Escape` closes it
- selecting a destination closes/navigates normally
- keyboard navigation must remain usable

Use only a subtle card hover effect, such as:

```text
image scale: 1 → approximately 1.02
```

No dramatic animation.

---

## Mobile

Do not show the desktop card grid inside the mobile navigation.

For mobile/touch navigation:

- SHOP expands as a simple accessible list/accordion
- show the same six destinations
- each item links directly to the real collection/page
- no hover dependency
- no horizontal overflow

Preserve the existing mobile-nav architecture where possible.

---

## Typography

Use the existing local Outfit font:

`public/fonts/outfit-variable-latin.woff2`

Reuse the existing font registration.

Keep category titles bold, clean, and readable.

---

## Navbar Preservation Rule

This is a presentation enhancement only.

Do **not** remove or break:

- Home / About / Shop / Services / First Gear Coffee / Contact links
- Services dropdown behavior
- search
- cart/cart drawer/count
- login/account
- wishlist or other existing actions
- sticky header behavior
- mobile navigation
- keyboard accessibility
- existing route localization
- any existing state/event logic

Audit the current navbar before editing.

---

## Header/Dropdown Positioning

Because the navbar is also being reduced/redesigned, verify the mega menu uses the **actual current header height**, not an old hardcoded offset.

Check and adjust only if needed:

- mega-menu top position
- sticky header offsets
- announcement bar interaction
- z-index/stacking
- page content below the header

The mega menu must not appear with a gap or overlap the navbar incorrectly.

---

## Future Ownership

For now:

```text
Hardcoded menu data
        ↓
ShopMegaMenu
        ↓
ShopMegaMenuCard
```

Later we will decide/migrate the data source to Shopify.

Do not add Shopify metafields, Storefront API queries, or Sanity fields in this sprint.

---

## Scope

Do not:

- redesign unrelated homepage sections
- change commerce logic
- install unnecessary dependencies
- perform broad navbar refactors beyond what this mega menu requires
- deploy
- push unless explicitly instructed

---

## Verification

After implementation and diff inspection, run exactly once:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Do not run extra test suites or repeated verification loops.

---

## Focused Browser Review

Perform one focused review because this task requires interaction validation.

Check desktop and mobile:

### Desktop

- SHOP opens the visual mega menu
- six cards render correctly
- cards scale without overflow
- real collection links work
- menu stays open while moving from SHOP into the panel
- Escape closes it
- keyboard focus works
- hover effect is subtle
- mega menu aligns correctly under the reduced navbar
- no z-index/overlay issues

### Mobile

- SHOP uses a simple list/accordion
- all six links work
- no desktop card grid is forced into mobile
- no horizontal overflow

---

## Completion Report

Report only:

### Files Changed

List changed files.

### Implementation Summary

Briefly explain the mega-menu structure, responsive behavior, and hardcoded data.

### Verification

Report:

```text
npx tsc --noEmit
npm run lint
npm run build
```

### Browser Review

Report the single desktop/mobile check.

### Follow-up

Mention that Shopify/Sanity control is intentionally deferred.

Stop after reporting.
