Perfect audit. Everything needed is already in the query except SKU. Here's what to tell your IDE:

---

**"Implement Product JSON-LD on the product page. Use the existing `JsonLd` component and the existing `seo.ts` file — add a new exported function called `getProductStructuredData` to `seo.ts` following the same pattern as `getOrganizationStructuredData`, `getWebsiteStructuredData`, and `getBreadcrumbStructuredData`. Then call it from the product page and render it using `JsonLd` alongside the existing `BreadcrumbList` script.**

**The function must produce a valid Schema.org `Product` type with these fields:**

**Required:**
- `@context` set to `https://schema.org`
- `@type` set to `Product`
- `name` from `product.title`
- `description` from `product.description`
- `image` as an array from `product.images` — include all image URLs, not just the featured image
- `brand` as a `Brand` object with `name` from `product.vendor`
- `url` constructed from the base URL plus countryCode plus `/products/` plus `product.handle`
- `offers` as an `Offer` object with:
  - `@type` set to `Offer`
  - `priceCurrency` from `priceRange.minVariantPrice.currencyCode`
  - `price` from `priceRange.minVariantPrice.amount`
  - `availability` mapped from `product.availableForSale` — if true use `https://schema.org/InStock`, if false use `https://schema.org/OutOfStock`
  - `url` same as the product URL above
  - `seller` as an `Organization` object with `name` set to `Sixthgear Moto`

**Do not include SKU — the field is not in the current query and we are not updating the query in this task.**

**Do not include `AggregateRating` — we have no review data.**

**After implementing, run `npx tsc --noEmit` and confirm zero errors. Then show me the exact JSON object that `getProductStructuredData` would return for the `airoh-commander-2` product using the data we already know from the earlier audit. I want to see the resolved JSON, not the function code."**

---

Here is why these exact constraints matter.

**Adding to `seo.ts` instead of inline on the page** keeps all structured data logic in one place. Your IDE already knows this pattern from `getBreadcrumbStructuredData`. Consistency here means a future developer knows exactly where to look when structured data needs updating.

**All images not just `featuredImage`** is important for Google's rich results. Google can pick any image from the array for Shopping results and image search. More images give it more options to match different search contexts.

**Mapping `availableForSale` to the full Schema.org URL** is required for Google to recognize the availability field. Passing `true` or `"InStock"` without the full URL is technically invalid Schema.org and Google may ignore it.

**Not adding SKU now** is intentional. Adding SKU requires a query change, a type change, and a data change in the same PR. That's three layers of risk for one field. Do it cleanly in a separate task after this is verified working.

Share the resolved JSON output for the Airoh Commander 2 when your IDE produces it and I'll verify it's correct before you ship it.