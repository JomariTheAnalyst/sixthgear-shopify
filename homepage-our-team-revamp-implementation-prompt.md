# Implementation Task: Revamp Homepage Our Team Section

## Objective

Revamp the existing **Sixthgear homepage Our Team section** using the user-supplied screenshot as the primary layout and visual reference.

The new section should feel clean, modern, editorial, and friendly while remaining aligned with the visual system already being established across the homepage.

This task is limited to the homepage Our Team section and its direct Sanity content model/query support.

Do not redesign unrelated sections.

## Mandatory First Step — Audit Before Editing

Before making changes:

1. Read the repository root `AGENTS.md`.
2. Locate the current homepage Our Team section and all related components.
3. Identify whether team content currently comes from local fallback data, Sanity, or both.
4. Locate any existing team-related Sanity schema/query/projection.
5. Check whether a carousel/slider library is already installed.
6. Check how the `Outfit Variable` font is currently registered.
7. Inspect existing homepage spacing/breakpoint conventions.
8. Preserve current section content/data flow unless this task explicitly changes it.
9. Do not perform unrelated cleanup or refactors.

## Visual Reference

Inspect the image attached to this task before implementing.

Reference screenshot:

`ef269a5b-1e20-4dec-b117-f9c29cec53bc.png`

If the filename itself is unavailable, inspect the image attached to the implementation task/message.

Use it as the primary reference for:

- centered section heading treatment
- clean white background
- large image-first employee cards
- rounded card/image corners
- name and role placement
- social icons near the bottom
- generous whitespace
- four-card desktop composition
- carousel behavior when more employees exist

Do not copy the reference website's copy, people, branding, colors, or unrelated UI.

Use Sixthgear's own team content.

## Overall Section Requirements

Use white background.

Use the existing local Outfit font:

`public/fonts/outfit-variable-latin.woff2`

Use Outfit for the section label, section heading, employee name, employee role, short description, and controls where appropriate.

Reuse the existing font registration if Outfit is already configured. Do not load an external font.

## Desktop Horizontal Spacing

Continue the homepage spacing rule already established in the About Us and Services revamps.

On sufficiently large desktop screens:

- left section spacing: `233px`
- right section spacing: `233px`

The Our Team section should visually align with those sections.

Do not apply this globally to unrelated homepage sections during this task.

Do not force 233px on narrower screens.

Target behavior:

- Large desktop: 233px left/right
- Smaller desktop: reduced responsive spacing
- Tablet: reduced spacing
- Mobile: approximately 20px–24px

No horizontal overflow is allowed.

## Section Header

Create a clean centered header inspired by the reference.

Suggested structure:

- eyebrow/label: `OUR TEAM`
- heading: `Meet the people behind Sixthgear`

If the current section already has approved heading copy, preserve it unless a small presentation adjustment is needed.

Do not invent large amounts of new marketing copy.

Use Outfit Variable.

Do not reuse the 104px About Us heading size here. Follow the existing homepage heading scale and keep the team heading visually strong but subordinate to About Us.

## Team Card Content

Each employee card should support:

- `name`
- `role`
- `shortDescription`
- `professionalImage`
- `wackyImage`
- `imageAlt`
- `instagramUrl`
- `facebookUrl`
- `displayOrder`
- `isActive`

The exact internal field names may follow the repository's Sanity naming conventions.

## Short Description Rule

Each team member must have a concise role-focused description.

Maximum: **15 words**.

Descriptions should be professional, human, and lightly creative.

Use the following fallback descriptions for the current fallback employees:

### MARTIE — Head Mechanic
`Keeps every motorcycle performing at its best through expert diagnostics and precision repairs.`

### JAYSON — Service Advisor
`Guides riders through service needs with clear advice and smooth workshop coordination.`

### JAMES — Assistant Technician
`Supports repairs, maintenance, and installations with care, consistency, and technical attention.`

### CAMILLE — Supervisor
`Keeps daily operations organized while helping the team deliver a smooth customer experience.`

### LIZA — Sales and Marketing Associate
`Connects riders with the right products through thoughtful service and brand communication.`

### ALTHEA — Sales and Marketing Associate
`Supports customer engagement and strengthens the brand through energetic, professional communication.`

### JAKE — Marketing Strategist
`Shapes campaigns and content that strengthen brand presence and deepen customer connection.`

If the existing CMS already contains real descriptions, preserve them unless they exceed the homepage 15-word rule.

Do not overwrite editorially approved content without a clear reason.

## Fallback Team Data

Preserve current fallback behavior if the section already uses fallback data.

Use the existing current images as placeholders.

Current known fallback people:

- MARTIE — Head Mechanic — `/images/team/team1.png`
- JAYSON — Service Advisor — `/images/team/team3.png`
- JAMES — Assistant Technician — `/images/team/team2.png`
- CAMILLE — Supervisor — `/images/team/team4.png`
- LIZA — Sales and Marketing Associate — `/images/team/team4.png`
- ALTHEA — Sales and Marketing Associate — `/images/team/team4.png`
- JAKE — Marketing Strategist — `/images/team/team4.png`

Do not fabricate new production employee images.

## Two-Image Interaction Model

Every employee must support two images.

### Image 1 — Professional
Used by default.

Field concept: `professionalImage`

### Image 2 — Happy / Wacky
Used during hover interaction on devices with hover capability.

Field concept: `wackyImage`

This image should show the same employee in a more relaxed, fun, expressive, or happy pose.

## Temporary Wacky Image Fallback

Real wacky images do not exist yet.

Until Sanity contains a separate wacky image:

- use the professional image as the fallback for both states
- do not show broken images
- do not invent remote placeholder URLs
- keep the component ready for the real second image later

Conceptually:

`wackyImage ?? professionalImage`

## Desktop Team Card Design

Each card should visually follow the supplied reference.

Structure:

```text
┌────────────────────────────┐
│                            │
│      PROFESSIONAL IMAGE    │
│                            │
├────────────────────────────┤
│ NAME                       │
│ Role                       │
│ Short description          │
│                            │
│ Instagram   Facebook       │
└────────────────────────────┘
```

Requirements:

- white card/background
- large image area
- rounded image corners
- card itself may have a subtle radius
- no heavy borders
- no gradients
- no heavy shadow
- clean spacing
- employee name visually stronger than role/description
- role directly below name
- short description below role
- social icons aligned cleanly near the lower area
- cards should have consistent height where practical

## Image Styling

Use responsive images consistent with the project's existing Next.js image strategy.

Requirements:

- `object-fit: cover`
- no stretching
- stable aspect ratio
- image fills the card width
- rounded corners
- no layout shift
- appropriate `sizes`
- meaningful alt text

## Hover Interaction — Professional to Wacky Image

On devices that support hover and fine pointers:

Default:
- professional image visible

On card hover/focus:
- professional image transitions out
- wacky image transitions in

On pointer leave:
- return to professional image

Use a smooth and tasteful crossfade with an optional very subtle scale.

Do not:

- spin images
- bounce cards
- use dramatic 3D flips
- distort the image
- move text around
- create layout jumps

The card may have a very subtle lift on hover if consistent with the homepage visual language.

## Keyboard Focus

Keyboard focus should receive an equivalent visual treatment where practical.

Do not make the experience mouse-only.

If the card contains social links, ensure focus states remain clear and interactive.

Do not create inaccessible nested links.

## Mobile / Touch Behavior

Do not depend on hover on mobile.

For coarse-pointer/touch devices:

- show the professional image by default
- keep cards swipeable in the carousel
- do not require a tap to switch to the wacky image
- do not introduce a two-tap navigation pattern

The second image may remain unused on mobile for this first version.

## Carousel Requirement

There are more than four employees, so implement the section as a responsive carousel/slider.

### Desktop
Target: **4 visible cards** where viewport width allows.

### Tablet
Target: **2–3 visible cards** depending on width.

### Mobile
Target: **1 card** or a subtle partial next-card preview if it works cleanly.

The carousel must be touch/swipe friendly.

## Carousel Controls

Prefer:

- previous/next arrows
- drag/swipe
- keyboard accessibility

Do not autoplay.

Do not continuously loop unless the existing carousel architecture already uses a stable accessible infinite-loop behavior.

Manual interaction is preferred.

## Carousel Dependency Rule

First inspect the repository.

If an appropriate carousel library already exists, reuse it.

If no carousel library exists:

- prefer a lightweight implementation using existing project capabilities
- do not silently install a dependency

If a new dependency appears necessary, stop and report that finding before adding it unless `AGENTS.md` explicitly authorizes dependency installation for the approved task.

A clean CSS scroll-snap implementation is acceptable if it provides touch swiping, desktop controls, correct responsive card sizing, accessibility, and stable performance.

## Social Links

Replace Twitter/X and LinkedIn with:

- Instagram
- Facebook

Each team member should support:

- `instagramUrl`
- `facebookUrl`

Rules:

- use the project's existing icon system
- do not introduce another icon package if suitable icons already exist
- include accessible labels such as `MARTIE on Instagram`
- if a URL is missing, do not render that icon
- do not render dummy `#` links
- cards must remain balanced when one or both social URLs are absent

## Sanity CMS Integration

This section must be wired to Sanity so the user can later manage real team information.

Extend or create the appropriate team schema using current repository conventions.

Each team member should support:

- name
- role
- short description
- professional image
- wacky image
- image alt
- Instagram URL
- Facebook URL
- display order
- active/inactive state

Recommended validation:

- name: required
- role: required
- short description: practical short-text limit, with schema description stating the 15-word homepage rule
- professional image: required for production content
- wacky image: optional
- Instagram URL: optional
- Facebook URL: optional
- display order: optional/default
- isActive: default true

Do not overengineer custom word-count validation.

## Sanity Query / Projection

Update the team query/projection so the homepage receives all required fields.

Do not fetch unnecessary content.

Resolve images using the existing Sanity image utility/pattern.

Preserve fallback behavior if Sanity returns no usable team members.

Filter inactive members if `isActive` exists.

Sort by `displayOrder` ascending with a stable fallback ordering.

## Source of Truth Behavior

Preferred flow:

```text
Sanity team content exists
        ↓
use Sanity

No usable Sanity team content
        ↓
use local fallback team data
```

Do not merge duplicate Sanity and fallback employees into one list.

## Responsive Behavior

### Large Desktop
- 233px horizontal section spacing
- 4 visible cards where possible
- centered header
- hover professional → wacky image
- previous/next controls
- drag support where implemented

### Smaller Desktop
- reduce section spacing
- 3–4 cards based on available width

### Tablet
- 2–3 cards
- touch/drag friendly
- no dependence on hover

### Mobile
- approximately 20px–24px horizontal spacing
- 1 card or controlled partial next-card preview
- swipe horizontally
- professional image remains default
- no horizontal page overflow
- card text remains readable
- social icons remain tappable

## Accessibility

Requirements:

- correct semantic heading hierarchy
- meaningful employee image alt text
- carousel controls are real buttons
- controls have accessible labels
- keyboard users can navigate controls
- visible focus states
- social links have accessible names
- no dummy links
- hover image swap is decorative and does not hide information
- section remains understandable with animations disabled
- respect `prefers-reduced-motion`

For reduced motion:

- disable unnecessary scale/lift movement
- simple instant/minimal image swap is acceptable
- carousel remains fully functional

## Performance

This is a homepage section, so keep it lightweight.

Requirements:

- use responsive Next.js image handling where already standard
- do not eagerly load every wacky image at maximum resolution
- professional images for initially visible cards may load normally
- secondary/wacky images should not cause unnecessary initial bandwidth
- avoid oversized carousel images
- no autoplay video
- no animation library required purely for image crossfade
- avoid unnecessary React state per card
- do not introduce global listeners for individual cards

CSS transitions are preferred for the image swap.

## Scope Guardrails

### Allowed

- homepage Our Team component changes
- direct child components used by the team section
- team-specific styles
- carousel behavior
- responsive behavior
- Sanity team schema
- Sanity team query/projection
- fallback team data cleanup
- Instagram/Facebook links
- professional/wacky dual-image support
- accessibility required by these changes

### Not Allowed

Do not:

- redesign About Us
- redesign Services
- redesign Categories
- globally apply the 233px margin yet
- change Shopify commerce logic
- change cart/checkout
- change authentication
- change navigation
- change footer
- rewrite unrelated Sanity schemas
- install unrelated packages
- perform broad CSS cleanup
- refactor unrelated components
- change deployment configuration
- deploy
- push unless explicitly instructed

## Suggested Component Architecture

Follow the existing repository structure first.

A reasonable conceptual architecture is:

```text
OurTeam
├── TeamCarousel
│   ├── TeamCard
│   ├── PreviousControl
│   └── NextControl
```

Each `TeamCard` consumes a normalized view model:

- key
- name
- role
- description
- professionalImage
- wackyImage
- imageAlt
- instagramUrl
- facebookUrl

Keep Sanity data normalization outside the low-level presentational card when practical.

Avoid unnecessary abstraction.

## Verification

After implementation and diff inspection, run **exactly these three core verification commands once**:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Do not add Jest, Vitest, Playwright, Cypress, Lighthouse, formatting commands, extra builds, or unrelated test commands.

Follow `AGENTS.md`.

Do not repeatedly run verification during implementation.

## Focused Browser Review

A browser review is important for this task because the carousel, responsive card count, and hover image swap require visual/runtime confirmation.

After implementation and the core verification, perform **one focused browser review** of the homepage Our Team section only.

Do not repeatedly browse the site after every small code change.

### Desktop Browser Review

Confirm:

- white background
- correct 233px large-desktop horizontal spacing
- section aligns with About Us and Services
- 4 cards are visible where intended
- carousel moves correctly
- previous/next controls work
- drag behavior works if implemented
- professional image displays by default
- hover changes to wacky image
- pointer leave restores professional image
- fallback to professional image works where no wacky image exists
- no image/card layout shift during hover
- employee name, role, and description remain stable
- Instagram/Facebook icons render only when URLs exist
- no dummy social links
- no horizontal page overflow

### Mobile Browser Review

Confirm:

- responsive mobile spacing
- one card or intended partial next-card preview
- swipe interaction works
- no desktop hover dependency
- professional image remains stable
- employee text remains readable
- social icons are tappable
- carousel does not cause page-level horizontal overflow
- controls do not overlap content
- section works at narrow phone widths

### Sanity Review

Confirm from code/configuration:

- team schema contains both professional and wacky image support
- short description is supported
- Instagram and Facebook URLs are supported
- display ordering is supported
- active/inactive behavior is supported if added
- query returns the new fields
- fallback data remains available when Sanity is empty

Do not require publishing production Sanity content as part of this sprint unless explicitly instructed.

## Completion Report

When finished, provide:

### Files Changed
List only files actually changed.

### Implementation Summary
Briefly explain:
- visual/card redesign
- carousel behavior
- responsive card counts
- professional/wacky hover interaction
- Outfit usage
- 233px large-desktop spacing
- Sanity integration
- fallback behavior
- social links

### Verification
Report only:

```text
npx tsc --noEmit
npm run lint
npm run build
```

with pass/fail status.

### Browser Review
Report the one focused desktop/mobile review.

### Sanity Notes
Mention:
- fields/schema added or updated
- whether current Sanity content needs migration/manual entry
- which current employees still use placeholder images
- which employees do not yet have wacky images or social URLs

Do not begin another task after the completion report.
