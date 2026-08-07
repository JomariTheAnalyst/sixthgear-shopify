Revamp the existing homepage **Product Categories** section only.

## Design direction

Use the attached reference only for layout inspiration.

Implement:

- full-width horizontal category slider
- **not** infinite loop
- draggable on desktop and swipeable on mobile
- subtle **parallax slider** effect
- white section background
- category cards in minimal light gray
- small gaps only between cards
- card ratio: **9:16**
- clean modern editorial look
- do **not** copy the reference color palette exactly
- add section title in the very left side similar to shop by brand section top of category cards.
- dont add any cta button or description inside the card
- dont add border radius. 
- since we implement mouse pointer changing when hovering in the shop by brand section why dont we apply it there. instead of "drag" make it "click" 
-use gsap skills and follow best practices 

## Categories

Use these homepage categories and keep them in this order:

1. Helmets
2. Bags and Luggages
3. Parts and Accessories
4. Communications
5. Riding Gear

## Card behavior

Each card should:

- use a 9:16 portrait layout
- show the category image clearly
- keep the content readable and clean
- have subtle parallax image movement while dragging/scrolling
- remain clickable to the correct category destination
- avoid infinite looping
- avoid oversized empty space at the end of the track

## Layout behavior

- full-width section
- horizontal draggable track
- desktop: multiple cards visible
- mobile: one card plus part of the next is acceptable
- keep spacing tight and visually balanced
- no masonry or stacked layout

## Requirements

- update the existing homepage product categories section only
- inspect current component, data source, and links before editing
- preserve existing CMS/fallback/data behavior unless a small scoped adjustment is required
- do not modify unrelated homepage sections
- do not run browser tests or production build

Run only:

`pnpm exec tsc --noEmit --incremental false`

Return:

1. summary of the final design
2. exact files changed
3. parallax/drag implementation approach
4. responsive behavior
5. TypeScript result