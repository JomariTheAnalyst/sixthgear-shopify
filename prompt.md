# Role
You are implementing a UI component in a Next.js 15 App Router project 
using GSAP for animation. Follow the exact technical constraints below — 
do not substitute your own approach for the looping or hover mechanics.

# Objective
Build an infinite horizontal marquee strip component to be placed directly 
under the homepage hero section, with zero vertical gap/margin between 
hero and marquee.

# Component Requirements

## Visual
- Full-width strip, orange background (use existing Tailwind theme 
  orange token if one exists — check `tailwind.config` first; otherwise 
  use a suitable orange e.g. `#F5841F` and flag it as placeholder)
- Single row of repeating text, looping infinitely left-to-right (or 
  right-to-left — default to left-to-right unless a project convention 
  exists)
- 4 text blocks repeating in sequence, separated by an icon divider:
  1. "THE BEST MOTOSUPPLY IN THE PHILIPPINES"
  2. "RIDE-READY GEAR FOR EVERY ROAD"
  3. "BUILT FOR RIDERS, BY RIDERS"
  4. "[PLACEHOLDER - CONFIRM WITH STAKEHOLDER]"
- Use existing site heading font (check global CSS/Tailwind config for 
  the current display font and reuse it — do not introduce a new font)
- Divider icon: check if `lucide-react` (already installed) has a 
  suitable icon matching brand tone (motorcycle/gear-related, or a 
  simple dot/star as fallback); use consistently between each phrase

## Animation Behavior (GSAP — mandatory technique)
- Use GSAP with `useGSAP()` from `@gsap/react` — do NOT use raw 
  `useEffect` for GSAP setup
- Build the loop using a duplicated content block (render the phrase 
  sequence twice inside the track, mark the second copy `aria-hidden="true"`) 
  translated via `xPercent` from `0` to `-50` in a `gsap.timeline({ 
  repeat: -1, ease: 'none' })` — this must be a seamless, non-jumping loop
- On mouse enter over the strip, tween the timeline's `timeScale` 
  smoothly down (e.g., to `0.25`) over ~0.5s using `gsap.to(tl, { 
  timeScale: 0.25, duration: 0.5, ease: 'power2.out' })`
- On mouse leave, tween `timeScale` back to `1` the same way
- Do NOT change `animation-duration` via CSS — this must be GSAP-driven 
  timeScale, not CSS keyframes, to achieve smooth deceleration
- Animate only `transform` (`xPercent`/`x`) — never animate `left`, 
  `margin`, or other layout-triggering properties

## Accessibility (mandatory)
- Wrap the component to respect `prefers-reduced-motion: reduce` — when 
  active, pause the GSAP timeline entirely (`tl.pause()`) or set an 
  extremely slow static state; do not force motion on these users
- The visible/primary text block should be readable by screen readers 
  once; the duplicated loop copy must have `aria-hidden="true"` so 
  screen readers don't read the repeated content twice
- Component must be a client component (`'use client'`) since it depends 
  on GSAP/DOM

## Layout Integration
- Place this component immediately after the hero section in the 
  homepage page file, with no wrapping div that introduces margin/padding 
  — it should sit flush against the hero with zero visual gap
- Confirm in your report which homepage file this was added to and show 
  the exact placement

# Constraints
- No Lenis integration needed for this component — it is not scroll-driven
- No ScrollTrigger needed — this is a continuous ticker animation, not 
  scroll-triggered
- Keep this as an isolated, reusable component (e.g., 
  `src/components/marquee-strip/index.tsx` or match existing project 
  conventions) so it can be reused elsewhere if needed

# Output
After implementation, report:
1. Final file path(s) created/modified
2. Confirmation of which font/color tokens were reused vs. newly added
3. Confirmation that `prefers-reduced-motion` handling was implemented 
   and how
4. Any placeholder content (e.g., the 4th tagline, orange color value) 
   that still needs stakeholder confirmation