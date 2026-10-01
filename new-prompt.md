Read CLAUDE.md first and follow it.

TASK: build the new homepage About section exactly like the approved design preview.
If feat/home-about-section is not merged yet, continue on that branch and update its PR (this replaces the earlier version with the video button and the Happy Riders badge). If it is merged, create feat/home-about-redesign from the latest main.

Testing rule: verify ONLY with the type check and pnpm build. Do not start the dev server, open a browser, take screenshots, or run Playwright or smoke tests. I will test it myself.

THE REFERENCE DESIGN (source of truth)
C:\Users\UPRHT-PC10-2025\Desktop\sixthgear-shopify\sixthgear-frontend\scratchpad\SixthGear About section preview.html
- Read the whole file before writing code. Copy its layout, sizes, shapes, colors, shadows, animation timings, easing, and behavior as closely as possible.
- Only preview parts to leave out: the intro block at the top, the "End of preview" block, and the "Replay animation" button.
- The preview uses stand-in fonts (Anton and Manrope). Use the site's own heading and body fonts instead, in the same roles.
- The preview's embedded photos are old test photos. Use the two new photos below instead.
- Do not commit the preview file.

WHAT TO BUILD (all of it is in the preview)
1. Two cards side by side from 1024px up, 20px gap, section side padding 24px (16px on phones). Stacked below 1024px: gray card first, black card second.
2. LEFT, gray card: 7 rows of moving text "SIXTHGEAR MOTORCYCLE." filling the card from top to bottom.
   - Odd rows: outlined letters, moving left. Even rows: solid light gray letters, moving right.
   - Idle speed 18px per second. While scrolling, speed rises with scroll speed: even rows by up to 7x, odd rows by up to 2x, then ease back to idle. Copy the exact formula from the preview.
   - Seamless loop, a soft light in the center of the card, rows paused when the section is off screen, and rows still when prefers-reduced-motion is on.
3. On top of the gray card: the two interlocking photos, built as ONE inline SVG with viewBox 0 0 1000 1000, exactly as in the preview.
   - Copy both clipPath path values exactly. The top photo is the "axe" shape, the bottom photo is the trapezoid.
   - Top image box: x 234, y 0, width 766, height 660. Bottom image box: x 0, y 430, width 700, height 570.
   - Same drop shadows, hover zoom (1.03), and scroll parallax (up to 22px, opposite directions).
4. RIGHT, black card: the same text, label, checklist, and button as now, with the same styles as the preview.
5. The reveal sequence when the section scrolls into view, exactly as the preview: the cards open, the top photo unmasks from the right, the bottom photo from below, the heading rises word by word, the check marks draw in, the button comes last. Everything shows instantly with prefers-reduced-motion.

PHOTOS (from Cloudinary; use these URLs with the smart-crop settings shown)
- Top photo (axe shape):
  https://res.cloudinary.com/djn9ubf6a/image/upload/c_fill,g_auto,ar_766:660,w_1600,f_auto,q_auto/v1790752600/_LIZ7077_edited_e6t9ry.jpg
- Bottom photo (trapezoid):
  https://res.cloudinary.com/djn9ubf6a/image/upload/c_fill,g_auto,ar_700:570,w_1500,f_auto,q_auto/v1790752587/_LIZ7064_edited_w5w05h.jpg
- Download and look at both photos. Check that no face, hands at work, or logo gets cut by a slanted edge or the gap between the shapes. If something important is cut, adjust the crop (for example g_face, or a different g_ position) and tell me what you changed.
- Write clear alt text for each photo based on what it shows.
- If f_auto does not display inside the SVG image element in any major browser, switch to f_jpg and tell me.

CODE STRUCTURE
- A client component for the animated parts (text rows, reveal, parallax). Use IntersectionObserver and requestAnimationFrame with proper cleanup on unmount. No new dependencies.
- Keep all text, the button link, the photo URLs, and the alt text in the section's config file. Add a short comment that the content moves to Sanity in the later Sanity task. Do not change Sanity schemas.
- Remove the video button, the video pop-up, the "Happy Riders" badge, their config fields, and the homepage About video from the YouTube entry in src/lib/consent/registry.ts.
- No horizontal scrolling at 320px wide.

PART B, still open: moving the old About section to the About Us page
- If you have not sent me your placement proposal yet, include it in the report. Do not move it until I say OK.

Then run the type check and pnpm build, commit, push, update or open the PR, and report: files changed, the final photo URLs and crop settings, the alt text, and anything that differs from the preview.