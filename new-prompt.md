Fix the Shop by Brands drag interaction and custom cursor. Inspect the current GSAP implementation before editing and correct the root causes rather than layering another workaround.

## 1. Fix the sticky carousel drag

The current horizontal infinite carousel feels resistant/sticky and sometimes opens a collection while dragging.

Update the GSAP Draggable integration so that:

- Dragging follows the pointer/finger directly and smoothly
- Remove excessive `dragResistance`, forced snapping, delayed progress updates, or heavy easing during active drag
- Map drag distance directly to the seamless-loop timeline progress
- Keep the infinite loop continuous in both directions
- Preserve the existing single visual set of brand cards
- Do not create a visible second track or separate duplicated group
- Keep the subtle image parallax, but ensure it does not fight the main track transform
- The parallax must affect only the image inside each card, never the card/slide wrapper
- Recalculate measurements correctly after resize and image loading

Use GSAP Draggable best practices and the existing seamless-loop timeline. Do not run another carousel library against the same track.

## 2. Prevent drag from triggering collection navigation

Each brand card remains a link, but a real drag must never navigate.

Implement a reliable click-versus-drag rule:

- Configure an intentional Draggable `minimumMovement` threshold
- Record whether meaningful horizontal movement occurred during the current pointer interaction
- On the card link’s click-capture event, call `preventDefault()` and stop navigation only when that interaction was a drag
- Reset the drag state after release/click handling
- A normal click or tap without meaningful movement must still open the collection
- Do not rely only on a timeout
- Verify this on mouse, trackpad, and touch

## 3. Create a reusable drag-cursor component

Create a separate component under the shared components folder, following the repository’s naming structure, for example:

`src/components/drag-cursor/index.tsx`

Do not keep the cursor markup inside the carousel component.

The component must render a larger pill-shaped pointer containing:

`←  DRAG  →`

Design:

- White background
- Strong/heavy dark outline
- Larger than the current cursor
- Fully rounded pill
- Clear bold label and arrows
- High enough z-index to remain visible above card images
- `pointer-events: none`
- `aria-hidden="true"`

## 4. Cursor behavior

The custom pill must replace the native pointer only while hovering a brand image/card.

Requirements:

- Apply `cursor: none` only to the interactive brand-card area
- Do not hide the pointer over the entire carousel section or page
- On pointer enter:
  - position the pill at the actual pointer coordinates immediately
  - fade and scale it in smoothly
- On pointer move:
  - follow the real pointer position
  - use GSAP `quickTo()` or `quickSetter()` for performant `x` and `y` updates
  - use `position: fixed` with viewport `clientX/clientY` coordinates, or use correctly converted local coordinates—do not mix both coordinate systems
- On pointer leave:
  - fade and scale it out
  - restore the normal native cursor
- While pressing/dragging:
  - slightly scale down or visually strengthen the pill
- On release:
  - return to the hover state
- The pill must stay under the actual pointer; it must never remain centered in the viewport

Enable it only for:

`(hover: hover) and (pointer: fine)`

Do not render or activate the custom cursor on touch/mobile devices.

## 5. Smooth transition

The transition between the native pointer and pill must feel seamless:

- Position the pill before making it visible
- Avoid the pill appearing briefly at `0,0` or in the viewport center
- Use short opacity/scale transitions
- Use a subtle following delay, but keep it close enough to behave like the actual pointer
- Do not add a long elastic or floaty lag
- Preserve visible keyboard focus states because keyboard users will not use the custom pointer

For reduced-motion users:

- Remove the delayed follower motion
- Either track the pointer directly or keep the native cursor
- Do not remove carousel functionality

## 6. GSAP lifecycle

Use the project’s React GSAP pattern:

- Scope animations and selectors to component refs
- Use `useGSAP()` or `gsap.context()`
- Clean up Draggable instances, timelines, quick setters/tweens, media-query contexts, and pointer listeners
- Avoid duplicate listeners during React Strict Mode remounts
- Do not trigger React state updates on every pointer movement

## Verify

Verify all of the following:

- Carousel drag feels direct and smooth, not sticky
- Image parallax remains subtle and does not resist dragging
- Infinite looping works in both directions
- No visible duplicated group or large seam
- Dragging never opens a collection
- Normal clicks still open the correct collection
- The pill appears only over brand cards
- The native cursor changes smoothly into the pill
- The pill follows the actual pointer instead of staying at viewport center
- The pill has a larger white body and strong dark outline
- Touch/mobile receives no custom cursor
- Keyboard focus remains visible
- No listener leaks, hydration warnings, TypeScript errors, or build failures

## Deliverables

Return:

1. Root cause of the sticky drag
2. Root cause of the centered cursor
3. Exact files modified and created
4. Drag-versus-click solution
5. GSAP cursor-follow implementation
6. Commands run and results