
# Fix Sitemap Accuracy Issues

Act as the senior Next.js technical SEO engineer for Sixthgear.

Inspect the current sitemap implementation before editing. Make only the smallest safe changes required to correct the confirmed issues in the uploaded sitemap. :contentReference[oaicite:0]{index=0}

## Required fixes

### 1. Correct service `lastModified`

The eight local service URLs currently receive the same sitemap-generation timestamp.

- Do not use `new Date()` as `lastModified`.
- Use a real stored content-update date only when one exists.
- For local fallback services without a trustworthy update date, omit `lastModified`.
- When Sanity service documents are introduced later, use their `_updatedAt`.

Do not invent dates.

### 2. Safely encode sitemap URLs

Ensure every generated `<loc>` is a valid absolute, percent-encoded URL.

The current sitemap contains product handles with a literal `™` character.

- Use a reusable URL builder based on the production origin:
  `https://www.sixthgearmoto.com`
- Encode non-ASCII path characters safely.
- Do not double-encode already encoded URLs.
- Do not rename Shopify product handles in this task.
- Do not manually edit the generated XML.

### 3. Preserve current correct behavior

Keep:

- `/ph/collections/helmet`
- `www` canonical host
- Shopify product and collection `updatedAt` values
- Sanity Rider Story `_updatedAt` values
- All valid main, service, collection, product and story URLs

Do not add:

- Redirect URLs
- `noindex` routes
- Query parameters
- `/ph/ph/`
- `/PH/`
- `/collections/helmets`
- Cart, account, search, Studio, preview or API routes

`changeFrequency` and `priority` may remain because they are not blocking correctness. Do not redesign or split the sitemap.

## Verification

Add or update focused sitemap tests that verify:

- Valid XML output
- Unique URLs
- Every URL starts with `https://www.sixthgearmoto.com/`
- No `/ph/ph/`, `/PH/`, query strings or plural Helmets route
- Non-ASCII URL characters are percent-encoded
- Local service URLs do not receive the current generation timestamp
- Product, collection and Rider Story dates still use real source dates
- All eight main pages and eight service pages remain present

Run:

```bash
pnpm exec tsc --noEmit --incremental false
pnpm build
git diff --check
````

Then generate or fetch the sitemap and report:

1. Exact files changed
2. How service dates are now handled
3. How URL encoding is handled
4. Sitemap URL count
5. Test and build results
6. Any URLs that still require manual review

Do not modify Shopify handles, Sanity content, routes, metadata, redirects or unrelated files.
Do not claim production or GSC verification unless the corrected version has been deployed and checked live.

```
```
