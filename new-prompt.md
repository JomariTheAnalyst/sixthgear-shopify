Use this prompt:

````markdown
# Implement SEO and Sitelink Readiness Fixes

Act as the senior Next.js SEO engineer for Sixthgear.

Implement only the confirmed issues from the latest audit. Preserve the current design, Shopify logic, Sanity integration, Cal.com integration, and routing behavior. :contentReference[oaicite:0]{index=0}

## Required fixes

1. Standardize the preferred production host to:

```text
https://www.sixthgearmoto.com
````

Align:

* Canonical URLs
* Sitemap URLs
* robots sitemap URL
* JSON-LD URLs
* Open Graph URLs
* Base URL helpers

Do not create redirect loops or hardcode preview domains.

2. Add a permanent redirect:

```text
/[countryCode]/collections/helmets
→
/[countryCode]/collections/helmet
```

Update internal Helmets links to use the singular collection handle while keeping the visible label `Helmets`.

3. Fix the broken double-localized link:

```text
/ph/ph/store?tag=new-arrival
```

The localized-link component must receive:

```text
/store?tag=new-arrival
```

Audit other `LocalizedClientLink` callers for the same pre-localized-path mistake.

4. Fix service-detail CTA behavior:

* Six regular workshop services → Cal.com booking
* `roadside-assistance` → Contact
* `rider-support` → Contact

Use existing service data or a reusable CTA action model. Do not hardcode Cal.com for every service.

5. Keep only one H1 on the homepage.

Preserve the Hero H1 and change the decorative `CATEGORIES` heading to an appropriate non-H1 element.

6. Add a crawlable link to:

```text
/[countryCode]/rider-stories
```

Prefer a `View All Rider Stories` CTA in the homepage Rider Stories section or a footer link. Reuse existing styling.

## Out of scope

* Full locale or `hreflang` redesign
* First Gear Coffee CMS migration
* First Gear menu implementation
* Metadata rewriting beyond host consistency
* Curator.io
* Sanity content migration
* Visual redesign

## Verification

Run:

```bash
pnpm test
pnpm exec tsc --noEmit --incremental false
pnpm build
git diff --check
```

Verify locally and in production:

* Canonicals, sitemap, robots and JSON-LD use `www`
* `/ph/collections/helmets` permanently redirects to `/ph/collections/helmet`
* No `/ph/ph/` links remain
* All internal audited links return valid pages
* Roadside Assistance and Rider Support are Contact-only
* Other service pages still open Cal.com
* Homepage has exactly one H1
* Rider Stories index has a crawlable link
* No hydration, redirect, SEO metadata or console errors

Report exact files changed, redirects added, link corrections, CTA behavior, command results and browser checks actually completed.

```
```
