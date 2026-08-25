# Implementation Task: Revamp Homepage About Us Section

## Objective

Revamp the existing **Sixthgear homepage About Us section** using the user-supplied screenshots as the primary **layout and design reference**.

This task is limited to the homepage About Us section. Do **not** redesign, refactor, or restyle unrelated homepage sections.

The desired direction is:

- large editorial typography on the left
- About Us body content and CTA beneath the heading
- two-column photographic collage on the right for desktop
- responsive content-first layout on mobile
- rounded image cards
- subtle GSAP scroll-based parallax on the image columns
- local Outfit Variable font for both headings and body text

---

## Mandatory First Step: Audit Before Editing

Before making changes:

1. Read the repository root `AGENTS.md` and follow it.
2. Locate the existing homepage and current About Us section/component.
3. Identify the current styling approach used by that section.
4. Check whether GSAP and ScrollTrigger are already installed/configured.
5. Check how fonts are currently registered in the project.
6. Preserve existing About Us content, data flow, links, accessibility, and business behavior unless this task explicitly changes them.

Do not perform unrelated cleanup while auditing.

---

## Visual Reference

**Inspect the two screenshots attached with this task before implementing anything.**

Treat the screenshots as the visual reference for:

- desktop composition
- mobile composition
- typography scale and hierarchy
- left-content/right-gallery relationship
- two-column image collage
- irregular/masonry image heights
- image spacing
- rounded corners
- overall editorial feel
- mobile stacking behavior

The screenshots are **layout/design references only**.

Do not copy the reference website's text, branding, colors, imagery, or content. Continue using Sixthgear's own About Us content.

Reference screenshots supplied with this task:

- `fcc0a808-65e9-43d9-b0d3-c1e596b5712f.png`
- `b4d97ec3-817e-48b4-813d-e6f53b890e41.png`

If the IDE does not have access to those filenames directly, inspect the images attached to this task/message.

---

# Design Requirements

## 1. Section Layout — Desktop

Create a two-part editorial layout:

### Left side

Contains:

- existing About Us eyebrow/label if one currently exists
- main About Us heading
- existing About Us body copy
- existing CTA/button if one currently exists

The text area should remain visually stable while the image collage provides movement.

### Right side

Create a two-column image collage inspired by the supplied reference.

Use **6 placeholder images for now**.

Suggested structure:

- Column 1: 3 images
- Column 2: 3 images

The collage should intentionally use different card heights rather than looking like a uniform product grid.

Use the **278 × 374 proportion** as the primary portrait image ratio:

```text
278 / 374 ≈ 0.743
```

For the shorter cards, use a compatible wider/shorter crop so the collage resembles the reference.

Do not hardcode actual rendered images to only 278 × 374 pixels. Images must remain responsive and should use sufficiently large placeholder assets.

Use:

```css
object-fit: cover;
```

where appropriate.

---

## 2. Desktop Horizontal Margin

For this About Us section only, use:

```text
Left margin/padding: 233px
Right margin/padding: 233px
```

on sufficiently large desktop screens.

This 233px desktop spacing is intended to become a common horizontal alignment standard for other homepage sections later, but:

**Do not modify the other sections in this task.**

Do not force 233px padding onto tablet or mobile widths.

Use responsive spacing below large desktop widths so content never overflows or becomes cramped.

A suitable responsive approach is:

- large desktop: exactly `233px` horizontal section padding
- smaller desktop/tablet: progressively reduced responsive padding
- mobile: compact safe padding, approximately `20px–24px`

Choose breakpoints based on the existing project conventions rather than inventing an unrelated breakpoint system.

---

# Typography

Use the existing local font file:

```text
public/fonts/outfit-variable-latin.woff2
```

Use **Outfit Variable for both heading and body copy** within this section.

If the project already has a proper font-loading strategy, integrate the font into that existing system.

If it is not currently registered, add it cleanly without introducing a new font dependency.

For CSS `@font-face`, the variable range should support:

```css
font-weight: 100 900;
font-style: normal;
font-display: swap;
```

Do not load Outfit from Google Fonts or another external font service.

---

## Main Heading — Large Desktop

Use these exact desktop values:

```css
font-family: "Outfit", sans-serif;
font-size: 104px;
line-height: 104px;
font-weight: 900;
letter-spacing: -2.6px;
color: #000000;
```

The heading should feel large, bold, editorial, and visually similar in scale to the supplied desktop reference.

Do not force `104px` onto smaller screens.

Scale the heading fluidly/responsively for tablet and mobile while retaining the same visual hierarchy.

A fluid `clamp()` approach is acceptable if it produces the correct desktop maximum and a strong but usable mobile size.

Avoid text clipping, overflow, or awkward single-word lines on common mobile widths.

---

## Body Typography

Use:

```css
font-family: "Outfit", sans-serif;
font-size: 20px;
line-height: 30px;
font-weight: 300;
letter-spacing: normal;
color: #000000;
```

The desktop body target is exactly `20px / 30px`.

On small devices, the body size may scale slightly if necessary for responsive usability, but do not make it visually tiny.

Preserve paragraph structure and readable line lengths.

---

# Image Styling

Use subtle rounded corners inspired by the reference.

Start with approximately:

```css
border-radius: 14px;
```

or:

```css
border-radius: 16px;
```

Use one consistent radius throughout the collage unless the existing design system already defines an appropriate radius token.

Requirements:

- responsive width
- `object-fit: cover`
- no stretched images
- no heavy shadows
- no gradients
- no floating decorative elements
- no fake 3D treatment
- no excessive borders
- no unnecessary overlays

Keep the look clean and photographic.

---

# Placeholder Images

Use **6 temporary placeholder images** during implementation.

Prefer existing local placeholder/sample assets if the repository already contains suitable images.

If not, create a simple maintainable placeholder implementation without introducing a new image library or unnecessary dependency.

The placeholders are temporary and must be easy to replace later with the final Sixthgear images.

Keep the image source data centralized rather than hardcoding the same markup six times where avoidable.

---

# GSAP Parallax Animation

Use **GSAP + ScrollTrigger** for the image-gallery movement.

The intended behavior:

## First Image Column

As the user scrolls through the About Us section:

```text
Column 1 moves vertically upward.
```

This should have the larger/faster parallax travel.

Initial target travel:

```text
approximately 120px–160px upward
```

Tune within that range based on the actual section height and visual result.

---

## Second Image Column

As the user scrolls through the same section:

```text
Column 2 moves vertically downward.
```

It should move **more slowly and over a smaller distance** than Column 1.

Initial target travel:

```text
approximately 60px–100px downward
```

The result should create depth rather than obvious animation.

---

## Animation Architecture

Animate the **column wrappers**, not every image independently.

Preferred conceptual structure:

```text
imageGallery
├── imageColumnOne   ← GSAP vertical transform
│   ├── image
│   ├── image
│   └── image
│
└── imageColumnTwo   ← GSAP vertical transform
    ├── image
    ├── image
    └── image
```

Use ScrollTrigger with scroll-scrubbed movement so the transforms follow the user's scroll position.

The movement should:

- be smooth
- be subtle
- remain tied to scrolling
- not continue autonomously after scroll
- avoid layout shifts
- use transforms rather than properties that trigger expensive layout recalculation
- clean up ScrollTrigger/GSAP instances when the component unmounts

Use GSAP context or the existing project GSAP lifecycle pattern if one already exists.

Do not create global ScrollTrigger side effects.

---

# Reduced Motion

Respect:

```css
prefers-reduced-motion: reduce
```

Users requesting reduced motion should receive the static collage without meaningful parallax movement.

The section must remain fully usable and visually coherent without the animation.

---

# Responsive Behavior

The section must work across desktop, laptop, tablet, and mobile devices.

## Desktop

Use the reference-inspired composition:

```text
┌───────────────────────────┬────────────────────────────┐
│                           │                            │
│  ABOUT US CONTENT         │  IMAGE COL 1  IMAGE COL 2 │
│                           │                            │
│  Large heading            │  [ image ]    [ image ]   │
│  Body copy                │                            │
│  CTA                      │  [ image ]    [ image ]   │
│                           │                            │
│                           │  [ image ]    [ image ]   │
│                           │                            │
└───────────────────────────┴────────────────────────────┘
```

At large desktop size, apply the exact `233px` left/right section spacing.

---

## Tablet

Reduce horizontal spacing and heading scale.

Maintain a strong editorial composition without allowing the content or gallery to become too narrow.

Use the existing project's responsive conventions.

---

## Mobile

Follow the supplied mobile screenshots closely:

1. Heading/content first
2. Body copy
3. CTA
4. Image collage beneath the content

The mobile image collage should preferably remain a **two-column composition**, similar to the reference, when the available width supports it.

For extremely narrow screens, allow the layout to adapt gracefully rather than producing tiny, unusable cards or horizontal overflow.

Reduce GSAP travel distance on smaller screens if necessary.

There must be:

- no horizontal scrolling
- no clipped text
- no images overflowing the viewport
- no overlapping columns
- no CTA overflow
- no broken layout at common phone widths

---

# Accessibility

Preserve or improve accessibility.

Requirements:

- all meaningful images need appropriate `alt` text
- decorative placeholder imagery may use empty alt text where semantically correct
- preserve semantic heading hierarchy
- CTA must remain keyboard accessible
- do not use animation as the only means of communicating information
- honor reduced-motion preferences
- preserve visible focus states

---

# Performance

Do not sacrifice homepage performance for the effect.

Requirements:

- use Next.js image handling where consistent with the existing project
- provide responsive image sizing
- avoid loading unnecessarily oversized images
- use transform-based GSAP animation
- do not animate six images independently if two wrapper transforms achieve the result
- avoid unnecessary React state for scroll animation
- do not add another animation library
- do not create avoidable client-side JavaScript outside the animated section

If the section needs to become a Client Component for GSAP, keep the client boundary as narrow as practical.

---

# Scope Guardrails

## Allowed

- homepage About Us component changes
- About Us-specific styles
- reusable helper/component directly needed for this section
- local Outfit font registration if not already available
- six temporary image placeholders
- GSAP ScrollTrigger setup needed for this section
- responsive behavior for this section

## Not Allowed

Do not:

- redesign the hero
- redesign other homepage sections
- globally apply the new `233px` spacing to the whole site yet
- rewrite About Us marketing copy unless required by the existing component structure
- change Shopify commerce behavior
- change cart or checkout logic
- change authentication
- change Sanity schemas/content models unless absolutely required and approved
- change navigation
- change footer
- change deployment configuration
- install unrelated packages
- perform a broad CSS cleanup
- refactor unrelated components
- deploy the application
- push changes unless explicitly instructed

---

# Dependency Rule

Use the project's existing GSAP installation if available.

If GSAP or ScrollTrigger is not available:

**Stop and report that finding before adding a new dependency**, unless the repository's existing instructions explicitly authorize adding it for this approved task.

Do not silently introduce packages.

---

# Implementation Quality

Keep the implementation maintainable.

Prefer:

- clear component responsibilities
- centralized image configuration/data
- reusable styling where it genuinely improves the section
- existing project conventions
- typed props/data where TypeScript is already used
- minimal client boundary
- no duplicated animation logic
- no magic values scattered throughout multiple files

The `233px`, typography values, radius, and parallax travel values should be easy to identify and tune later.

---

# Verification

After implementation is complete, inspect the diff and then run **exactly these three core verification commands once**:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Do not add Jest, Vitest, Playwright, Cypress, Lighthouse, formatting, or unrelated verification commands.

Do not repeatedly run the three commands during implementation.

If a verification command fails, follow the repository `AGENTS.md` instructions for reporting/fixing behavior. Do not enter an uncontrolled fix-test loop.

---

# Focused Browser Review

A browser review **is important for this specific task** because static verification cannot confirm the requested design, responsiveness, or parallax behavior.

After the implementation and core verification, perform **one focused browser review** of the homepage About Us section.

Check only what materially matters:

### Desktop

- reference-inspired two-part layout
- exact 233px left/right spacing at the intended large-desktop breakpoint
- heading reaches the specified 104px / 104px desktop typography
- six-image collage appears correctly
- Column 1 scrolls upward
- Column 2 scrolls downward more slowly
- animation feels subtle rather than aggressive
- no image clipping outside the intended composition
- no horizontal overflow

### Mobile

- content appears before imagery
- typography scales correctly
- CTA remains usable
- collage responds cleanly
- no horizontal overflow
- image cards do not become unusably narrow
- parallax is reduced/appropriate for the viewport

Do not repeatedly browse the site after every code adjustment.

Do not audit unrelated pages.

---

# Completion Report

When finished, report:

## Files Changed

List only files actually changed.

## Implementation Summary

Briefly explain:

- layout changes
- responsive behavior
- Outfit font integration
- placeholder-image structure
- GSAP/ScrollTrigger implementation
- reduced-motion handling

## Core Verification

Report the result of exactly:

```text
npx tsc --noEmit
npm run lint
npm run build
```

## Browser Review

Report the single focused desktop/mobile About Us review and any relevant visual issue found.

## Notes / Follow-up

Mention anything that still needs the final Sixthgear images or user approval.

Do not start another task after completing this report.
