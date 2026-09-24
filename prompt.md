Task: Roll out the hover image slide to all product category cards, remove the side fade, and add a new "Oil" category card. Nothing else on the site may break.

BEFORE EDITING:
- Read the category card component, its styles, the category data, and how the cards get their links (hardcoded data, or fetched from Shopify collections). Do not overwrite my existing edits.
- Tell me which files you will change, and how the category links currently work, before changing anything.

1. REMOVE THE SIDE FADE
- Find what creates the white/light fade on the edges of the category card images (e.g. mask-image, a linear-gradient overlay, or ::before / ::after pseudo-elements).
- Remove it for all category cards so both the default and hover images show edge to edge with no fade.
- Tell me exactly what you removed.

2. CATEGORY IMAGES
Set `image` (default) and `hoverImage` for each category, using these files in public/images/product-categories/:
- Bags & Luggages: bags-and-luggages.jpeg → hover: bags-and-luggages2.jpeg (already set, keep it)
- Helmets: helmets1.png → hover: helmets2.png
- Communications / Intercoms: intercoms1.png → hover: intercoms2.png
- Parts & Accessories: parts-and-accessories1.png → hover: parts-and-accessories2.png
- Riding Gear: ridinggear1.png → hover: ridinggear2.png
Use public-relative paths like /images/product-categories/helmets1.png, with forward slashes.
If the category names in the data don't exactly match these (e.g. "Communications" vs "Intercoms"), match by meaning and tell me which name you used.
Verify every file exists before referencing it. If any file is missing, stop and tell me; don't reference a missing file.

3. NEW CATEGORY: OIL
- Add a new category card titled "OIL", following exactly the same data shape, component, and styling as the existing category cards.
- Shopify collection handle: motorcycle-oil. Build its link using the SAME URL pattern the other category cards use (including the country code prefix if the others have one), e.g. /[countryCode]/collections/motorcycle-oil. Don't invent a new routing pattern.
- If the category cards are fetched from Shopify collections instead of hardcoded data, add Oil the same way the others are wired, and tell me if the collection needs any Shopify setting to show up.
- Default image: /images/product-categories/oil1.png
- Hover image: use /images/product-categories/oil2.png ONLY if that file exists. If it doesn't, leave hoverImage empty so the Oil card shows the static image with no slide. The card must still work normally.
- Place the Oil card at the END of the category list for now.
- Check that the grid/carousel layout still looks correct with one more card on desktop, tablet, and mobile (no overflow, no broken rows, no squeezed cards). Tell me if the layout needed any change.
- If categories are also listed anywhere else (header menu, footer, mobile menu, sitemap), do NOT change those. Just list where they are, and I'll decide.

4. FIT
- Set hoverFit: "cover" (object-fit: cover, object-position: center center) for ALL category cards, including Oil, applied to BOTH the default and hover images so the slide stays aligned.

5. REMOVE THE OLD VIDEOS
- Remove the hoverVideo / hoverPoster data from Riding Gear, Parts & Accessories, and Helmets, so these cards use the image slide.
- Do NOT delete the hover video component or its code yet. If nothing uses it anymore, tell me and I'll decide whether to remove it.

6. KEEP THE EXISTING SLIDE BEHAVIOR
- The same slide as Bags & Luggages: the hover image pushes in from the left to the right, 600ms, cubic-bezier(0.22, 1, 0.36, 1), transform only, reverses smoothly on mouse leave, and also triggers on :focus-visible.
- A card with no hoverImage shows its default image only, with no slide and no errors.
- Mobile / touch devices and prefers-reduced-motion: default image only, and the hover image is not rendered.
- The vertical category title stays above the images during and after the slide.

7. IMAGE PERFORMANCE
- The images are large PNGs. Make sure every category image is rendered with next/image (fill + a proper `sizes` value) so Next.js serves resized WebP/AVIF instead of the full PNG. Don't convert or edit the original files.
- Give every image meaningful alt text (e.g. "Motorcycle engine oil bottles with a golden oil splash").

8. SAFETY CHECKS (required before you report done)
- Only touch files related to the category cards and their data. Don't refactor or restyle anything else.
- Run the project's lint and TypeScript type check, and fix only errors caused by this change.
- Stop any running dev server first, then run `npm run build`. It must finish successfully. Do not run build while a dev server is running.
- Confirm that every category card link opens the correct collection page, including /collections/motorcycle-oil.

WHEN DONE:
- List every file changed and what changed in each.
- Report the lint, type check, and build results.
- Tell me how to test: hover each card on desktop, check that there's no side fade, click every card to confirm its link, and check mobile in Chrome DevTools, where only default images load in the Network tab.