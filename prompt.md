````markdown
# Task: Add Services Statement + Animated Stats Section

## Objective

Add a new section **directly below the Services hero section**.

Use the attached reference image as the layout/design inspiration:
attached image

Do **not** add the drone or any product image. This section should contain only:

1. a large centered statement
2. a 3-column stats block underneath

Preserve all existing Services page functionality and sections.

---

## Statement

Use Outfit Variable and create a bold editorial statement centered on the page:

> **From routine maintenance to performance upgrades, Sixthgear keeps every ride ready for what’s next.**

Highlight:

> **ready for what’s next.**

Use a tasteful Sixthgear accent treatment inspired by the highlighted phrase in the reference.

Requirements:

- heavy/bold Outfit
- centered
- large responsive typography
- generous whitespace
- black text
- clean white/light background
- max-width so the statement does not stretch too wide
- scale appropriately on tablet/mobile

Do not add extra illustrations or decorative clutter.

---

## Stats Section

Add **3 service-related stats** beneath the statement.

Before hardcoding numbers, audit the existing Services data and derive verified counts where possible, such as:

- number of Service Categories
- number of Brands Serviced
- number of individual Service Options / offerings

Example layout:

```text
8+                     6+                     20+
SERVICE CATEGORIES     BRANDS SERVICED        SERVICE OPTIONS
```
````

Prefer deriving counts from existing project data rather than duplicating numbers.

**Do not invent business metrics** such as jobs completed, customers served, years of experience, or percentages unless verified in the repository.

Keep stat configuration centralized and easy to edit later.

---

## GSAP Animation

Use the project's existing GSAP + ScrollTrigger setup.

When the section enters the viewport:

- statement: subtle fade + upward reveal
- numeric stats: count from `0` to final value
- slightly stagger the three stats
- animation runs once
- final values remain visible

Keep animation subtle and premium.

Respect `prefers-reduced-motion`; show final values immediately when reduced motion is enabled.

Do not add another animation dependency.

---

## Responsive Layout

### Desktop

- centered statement
- 3 stats in one horizontal row
- generous spacing

### Tablet

- maintain 3 columns where readable or adapt gracefully

### Mobile

- stack stats vertically or use a responsive layout that keeps labels readable
- no horizontal overflow
- statement typography scales cleanly

Use Outfit Variable throughout.

---

## Scope

Do not:

- modify the Services hero
- redesign existing service sections
- change service URLs/content
- change Sanity schemas
- change Shopify logic
- modify navbar/dropdowns
- install new dependencies
- deploy or push

---

## Verification

After implementation and diff inspection, run exactly once:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Then perform **one focused browser check** of this new section on desktop and mobile.

Verify:

- correct placement below hero
- statement layout/highlight
- responsive typography
- 3 stats render correctly
- count-up animation works
- reduced-motion handling
- no layout shift or horizontal overflow

Report files changed, implementation summary, verification results, and browser findings. Stop after reporting.

```

```
