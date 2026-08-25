# Implementation Task: Revamp Homepage Services Section

## Objective

Revamp the existing **Sixthgear homepage Services section** to closely follow the layout, visual hierarchy, and interaction behavior shown in the user-supplied desktop and mobile reference screenshots.

This is a presentation/interaction revamp of the existing Services section.

Preserve the existing service data, service URLs, Sanity/fallback behavior, and business logic wherever possible. Do not rebuild the content architecture unnecessarily.

This task is limited to the homepage Services section.

---

# Mandatory First Step — Audit Before Editing

Before changing code:

1. Read the repository root `AGENTS.md`.
2. Locate the homepage Services section and all components it currently uses.
3. Identify where service:
   - title
   - description
   - image
   - slug
   - href/URL
   are currently sourced.
4. Check whether the section already uses GSAP or another existing animation pattern.
5. Check how `Outfit Variable` is currently registered after the About Us work.
6. Inspect the existing responsive breakpoints and shared layout/container conventions.
7. Preserve current service URLs and Sanity/fallback content resolution.
8. Do not perform unrelated refactors or cleanup.

---

# Visual References — Inspect Before Implementing

**Inspect all supplied reference screenshots before implementation.**

The screenshots are the primary reference for:

- desktop editorial list layout
- large horizontal service rows
- service title on the left
- service description on the right
- subtle horizontal divider lines
- hover/focus mode
- floating image preview for the active service
- fading non-active rows
- mobile accordion layout
- mobile chevron behavior
- expanded description
- expanded image placement
- spacing and visual simplicity

Desktop references supplied in the conversation/task:

- `dda2a75e-34f7-4480-8392-fab57876ed3e.png`
- `49d599eb-a6a3-4992-b6e0-d39df4b7d7d3.png`

Mobile references supplied with the latest task:

- `eeb9fbb6-0db0-41ac-a621-a5913a6b9065.png`
- `2a00a557-097d-4e5d-a4b2-f6ff792cc9b5.png`

If direct filenames are unavailable in the IDE, inspect the screenshots attached to the implementation task/message.

Use the references for **layout and behavior**, not for their branding, copy, imagery, or colors.

Continue using Sixthgear service content and service images.

---

# Typography

Use the existing local font:

```text
public/fonts/outfit-variable-latin.woff2
```

Use Outfit Variable for both service titles and service descriptions.

Reuse the existing project font registration if Outfit is already configured. Do not register the same font twice.

Do not load an external font.

---

## Service Name / Service Heading

Desktop target:

```css
font-family: "Outfit", sans-serif;
font-size: 32px;
line-height: 32px;
font-weight: 900;
letter-spacing: normal;
color: #000000;
```

Service names should be visually heavy and editorial, matching the supplied reference.

Allow responsive scaling only where genuinely required on narrower devices. Preserve the strong hierarchy.

---

## Service Description

Desktop target:

```css
font-family: "Outfit", sans-serif;
font-size: 20px;
line-height: 30px;
font-weight: 300;
letter-spacing: normal;
color: #000000;
```

Descriptions must remain readable and should not become overly wide.

---

# Horizontal Section Spacing

Continue the homepage spacing rule established for the About Us revamp.

On sufficiently large desktop screens:

```text
left section spacing: 233px
right section spacing: 233px
```

This Services section must visually align with the revamped About Us section.

Do not apply this spacing globally to unrelated sections during this task.

Do not force 233px spacing on tablet or mobile.

Use responsive reductions based on the project's existing breakpoint conventions.

Target behavior:

```text
Large desktop: 233px left/right
Smaller desktop: reduced responsive spacing
Tablet: reduced spacing
Mobile: approximately 20px–24px safe horizontal spacing
```

There must never be horizontal overflow.

---

# Desktop Layout

On desktop, recreate the editorial service-list structure shown in the reference.

Each service is one large horizontal row.

Conceptual structure:

```text
──────────────────────────────────────────────────────────────

SERVICE NAME                    Service description goes here
                                across a readable text width.

──────────────────────────────────────────────────────────────

SERVICE NAME                    Service description goes here
                                across a readable text width.

──────────────────────────────────────────────────────────────
```

Requirements:

- service name column on the left
- service description column on the right
- generous vertical row spacing
- thin subtle divider between service rows
- clean background
- no card containers around individual rows
- no heavy shadows
- no gradients
- no decorative clutter
- preserve semantic heading/link structure
- render all existing homepage services dynamically rather than hardcoding a fixed count

Use the existing service content.

---

# Desktop Hover / Focus Mode

This is a core requirement.

When no service is hovered/focused:

- all service names are fully visible
- all descriptions are fully visible
- no floating service image is shown

When a service becomes active through mouse hover or keyboard focus:

### Active service

- service name stays solid `#000000`
- description stays solid `#000000`
- divider remains visible
- its corresponding service image appears as a floating preview

### Non-active services

Fade the other service rows to a subdued gray/reduced opacity similar to the reference.

Start around:

```text
opacity: approximately 0.30–0.40
```

Tune visually against the screenshots.

Do not make the inactive content so faint that the list becomes unreadable.

When the pointer/focus leaves the Services interaction area:

- remove the active preview
- restore all rows to their normal full-opacity state

---

# Desktop Floating Image Preview

The active service image should appear **over the service list**, similar to the supplied desktop reference.

It must not permanently reserve a large empty image column.

The preview should feel layered over the editorial layout.

Preferred visual position:

- between the left service-title column and the right description column
- vertically associated with the active row
- visually centered around the active service rather than following the mouse cursor

Do **not** make the image literally chase the cursor.

The image may overlap portions of the text columns in the same controlled way as the reference, but active text must remain understandable.

Requirements:

- use the existing image associated with the active service
- responsive dimensions
- `object-fit: cover`
- approximately `14px–16px` border radius
- no heavy shadow
- no gradient
- preview should not affect document layout or cause rows to jump
- preview layer should use `pointer-events: none` so it never blocks service links
- keep appropriate stacking context
- prevent preview overflow outside the intended section where necessary

The image should transition smoothly when moving from one service to another.

A restrained transition is appropriate:

```text
opacity: 0 → 1
translateY: ~8–12px → 0
scale: ~0.98 → 1
```

Keep the transition quick and subtle.

If the existing Services component already uses GSAP, keep the GSAP animation scoped to this section and reuse the current lifecycle pattern.

If GSAP is not needed for this effect, CSS transitions plus React state are acceptable.

Do not add a new animation dependency.

---

# Desktop Click Behavior

**Every service must remain clickable.**

On desktop:

- treat the full service row as the service navigation target where semantically practical
- clicking a service navigates to that service's existing `href`
- do not replace existing localized URLs with hardcoded URLs
- preserve Next.js client navigation using the project's established `Link` pattern

Keyboard users must also be able to focus and activate each service.

Keyboard focus must trigger the same visual focus mode as mouse hover.

---

# Mobile Layout — Accordion

The latest mobile screenshots define the mobile behavior.

Do **not** attempt to reproduce desktop hover behavior on touch screens.

Mobile should use an accordion.

---

## Mobile Default / Collapsed State

On initial mobile load:

- all services are collapsed
- show the service name on the left
- show a downward chevron on the right
- hide the service description
- hide the service image
- maintain generous vertical spacing between service items
- keep the design visually clean like the supplied reference

Concept:

```text
SERVICE NAME                                      ˅


SERVICE NAME                                      ˅


SERVICE NAME                                      ˅
```

Do not show a permanent image grid on mobile.

---

## Mobile Expanded State

When a user taps a service accordion header:

- expand that service in place
- rotate/change the chevron to point upward
- show the service description underneath the service name
- show the corresponding service image underneath the description
- preserve the same vertical order shown in the reference:

```text
SERVICE NAME                                      ˄

Service description goes here across multiple
lines with comfortable reading width.

[                 SERVICE IMAGE                 ]
```

The service image should:

- use the existing service image
- span the available content width
- maintain a suitable responsive aspect ratio
- use `object-fit: cover`
- use the same approximately `14px–16px` rounded corners
- never overflow horizontally

---

# Mobile Accordion State Rules

Use **single-open accordion behavior**.

Rules:

1. All items start collapsed.
2. Tapping a collapsed service opens it.
3. Opening a new service closes the previously open service.
4. Tapping the currently open service header closes it again.
5. Only one service may be expanded at a time.

Do not autoplay or cycle through services.

Keep expand/collapse motion subtle.

Do not add an animation library solely for accordion height animation.

---

# Mobile Navigation / Clickability

The accordion header needs to toggle expansion, so do not make the same tap both expand and immediately navigate away.

To preserve the requirement that every service is clickable:

- accordion header/button = expand/collapse control
- expanded service image/content area = service navigation link

At minimum, make the expanded service image a clear navigation target to the service's existing URL.

If the existing design allows the expanded description/content area to be wrapped safely as the service link without harming accessibility, that is acceptable.

Do not add a large visible CTA/button unless required by the existing Sixthgear UI or necessary for usability. Stay close to the supplied mobile reference.

Use proper accessible semantics:

```text
button:
aria-expanded
aria-controls
```

The linked service content must remain keyboard accessible.

Do not nest interactive elements illegally.

---

# Responsive Breakpoint Behavior

Use the repository's existing responsive conventions.

General behavior:

## Large Desktop

- 233px left/right spacing
- two-column editorial row
- hover/focus mode enabled
- floating active-service image preview

## Smaller Desktop / Tablet Landscape

- reduce side spacing
- preserve two-column layout while sufficient width exists
- resize preview image appropriately
- avoid text collisions

## Tablet / Touch-Oriented Layout

If hover is unreliable or layout becomes too constrained, transition cleanly to the accordion experience.

Use capability/layout-aware behavior rather than forcing desktop hover onto coarse pointers.

## Mobile

- accordion layout
- approximately 20px–24px horizontal spacing
- no hover dependency
- no floating preview
- no horizontal scrolling
- full-width expanded image

---

# Accessibility

Requirements:

- semantic service links
- keyboard-accessible desktop service rows
- keyboard focus triggers desktop active/focus mode
- mobile headers use actual buttons
- use `aria-expanded`
- use `aria-controls`
- expanded panels have stable IDs
- preserve visible focus states
- meaningful service images use appropriate alt text
- avoid duplicate/verbose alt text if the surrounding linked text already names the service
- interaction must remain understandable without animation
- honor `prefers-reduced-motion`

For reduced motion:

- keep desktop hover/focus state
- show/swap the image without meaningful scale/translation animation
- accordion remains fully functional

---

# Performance

Keep the homepage efficient.

Requirements:

- reuse Next.js image handling consistent with the repository
- do not eagerly load every service preview image at full resolution
- avoid unnecessary oversized source images
- desktop preview should load efficiently
- mobile expanded image should only become relevant when its accordion item is open
- avoid unnecessary React state
- one `activeIndex` for desktop focus/hover is sufficient
- one `openIndex` for the mobile accordion is sufficient
- do not attach separate global scroll/mouse listeners to every row
- do not add another animation library
- keep Client Component boundaries as narrow as practical

---

# Existing Data Architecture

Preserve the current service data pipeline.

The presentation should consume the existing service view model/data such as:

```text
title
description
image
href
slug
```

or its current repository equivalent.

Do not hardcode the actual service list into the presentation component if it is already sourced through Sanity/fallback data.

Do not change Sanity schemas for this visual revamp unless absolutely necessary and explicitly approved.

---

# Scope Guardrails

## Allowed

- homepage Services presentation components
- Services-specific responsive styles
- Services hover/focus state
- floating image preview
- mobile accordion behavior
- accessibility required for the interaction
- small service view-model adjustments if required by the existing data
- reuse of Outfit font
- direct helper components needed only for this section

## Not Allowed

Do not:

- redesign other homepage sections
- modify the About Us section
- globally apply the 233px container yet
- change Shopify product/cart/checkout behavior
- change authentication
- change navigation
- change footer
- change unrelated Sanity schemas
- rewrite service marketing copy
- change service URLs without a verified requirement
- install unrelated dependencies
- perform repo-wide CSS cleanup
- refactor unrelated components
- change deployment configuration
- deploy
- push unless explicitly instructed

---

# Implementation Quality

Prefer a clear structure that keeps data resolution separate from interaction/presentation.

A suitable conceptual architecture may be:

```text
Existing Services data/container
        ↓
HomepageServices
        ├── DesktopServicesList
        │     ├── ServiceRow
        │     └── ActiveServicePreview
        │
        └── MobileServicesAccordion
              └── MobileServiceItem
```

This is conceptual, not a mandatory filename structure.

Reuse existing components when they already provide the correct separation.

Avoid unnecessary abstraction.

---

# Verification

After implementation and diff inspection, run **exactly these three core commands once**:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Do not add:

- Jest
- Vitest
- Playwright
- Cypress
- Lighthouse
- formatting commands
- unrelated tests
- additional builds

Follow `AGENTS.md`.

Do not repeatedly run the core commands during implementation.

---

# Focused Browser Review

A browser review is **important for this task** because the requested hover/focus interaction and responsive accordion behavior cannot be verified by TypeScript/lint/build alone.

After the implementation and the three core verification commands, perform **one focused browser review** of the homepage Services section only.

Do not repeatedly browse after every small edit.

---

## Desktop Browser Review

Confirm:

- section aligns with the About Us section using 233px large-desktop left/right spacing
- service titles are visually `32px / 32px`, weight `900`
- descriptions are visually `20px / 30px`, weight `300`
- title-left / description-right structure matches the reference
- divider lines are subtle
- no active image is visible at rest
- hovering a service activates its image
- keyboard focus activates the same image/focus mode
- active title/description remain black
- non-active rows fade
- preview is associated with the active row
- preview does not chase the cursor
- preview does not block clicks
- moving between services swaps the image cleanly
- leaving the section restores all rows
- clicking each checked service opens the correct existing URL
- no horizontal overflow
- no layout jumping when preview appears

---

## Mobile Browser Review

Confirm against the supplied mobile screenshots:

- all services start collapsed
- title appears left
- down chevron appears right
- description/image are hidden while collapsed
- tapping one item expands it
- chevron changes/rotates upward
- description appears below the service title
- image appears below the description
- only one item remains open at a time
- tapping another closes the previous item
- tapping the active header closes it
- expanded image/content provides navigation to the correct service
- no desktop floating preview appears
- no hover dependency
- no horizontal overflow
- mobile spacing is comfortable
- image is full-width within the content area and rounded
- accordion remains usable at narrow phone widths

---

# Completion Report

When complete, provide:

## Files Changed

List only files actually changed.

## Implementation Summary

Briefly cover:

- desktop editorial row layout
- hover/focus mode
- active image preview
- service navigation
- mobile accordion behavior
- responsive 233px spacing
- Outfit typography
- accessibility/reduced motion

## Verification

Report only:

```text
npx tsc --noEmit
npm run lint
npm run build
```

with pass/fail status.

## Browser Review

Report the single focused desktop/mobile review.

## Notes

Mention any service entries that are missing usable images, URLs, or content from the existing data source.

Do not begin another task after completing the report.
