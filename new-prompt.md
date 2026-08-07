Fix the sticky horizontal drag on mobile for:

1. Homepage **Shop by Brands**
2. Homepage **Product Categories**

The issue: on touch devices, the user has to drag too far before the carousel moves enough to reveal the next card.

## Inspect first

Check the current GSAP/Draggable implementation and Lenis integration.

Verify whether the problem comes from:

- Lenis intercepting touch/pointer gestures
- excessive drag resistance
- incorrect drag-distance-to-progress mapping
- snapping or easing during active drag
- `touch-action` CSS
- nested parallax transforms fighting the carousel track
- oversized slide widths or incorrect measurements

Do not disable Lenis globally.

## Fix requirements

- Horizontal swipes must feel direct and lightweight on mobile
- Small natural swipes should move the carousel noticeably
- Keep vertical page scrolling normal
- Use appropriate `touch-action` such as `pan-y` on horizontal draggable areas
- Remove unnecessary drag resistance or heavy easing during active drag
- Parallax must only affect the inner image, never resist the main track movement
- Preserve infinite looping for Shop by Brands
- Preserve finite/non-looping behavior for Product Categories
- Keep desktop behavior unchanged unless the same root cause affects it

Follow GSAP Draggable best practices and clean up all listeners/instances correctly.

Do not run browser tests or production build.

Run only:

`pnpm exec tsc --noEmit --incremental false`

Return the confirmed root cause, files changed, the mobile drag fix, whether Lenis was involved, and the TypeScript result.