# 1. Executive verdict

No, all eight routes are not technically indexable.

- Seven routes return meaningful server-rendered HTML and have no `noindex` directive.
- `/ph/collections/helmets` is a soft 404: HTTP `200`, `title=404`, `noindex`, no canonical, no H1, and no collection content.
- The valid collection is `/ph/collections/helmet`—singular.
- Googlebot received `200` for all eight requests. No authentication or maintenance wall was active.
- `robots.txt` does not block any target route.
- Seven targets are in the sitemap; the plural Helmets URL is absent.
- Every valid target has a canonical-host conflict: production serves `www.sixthgearmoto.com`, while canonicals, JSON-LD and the sitemap use non-`www`. Non-`www` then redirects back to `www`.
- No redirect loops were found, but the preferred-host signals contradict one another.
- No route currently deserves an unconditional “Pass” until the preferred-host conflict is corrected.

Google decides sitelinks automatically. The current site provides moderate signals for Shop, Services, About, Contact and First Gear; Rider Stories is weak; the requested plural Helmets candidate is not ready.

This audit did not modify the repository or any external system.

## Live verification summary

- Standard clean requests: all eight returned `200`.
- Googlebot user agent: all eight returned `200`.
- No `X-Robots-Tag` was present on the targets.
- No authentication challenge or production maintenance rewrite appeared.
- Server-rendered HTML contains the main content for seven routes without requiring JavaScript.
- Geographic behavior was tested from the current Asia region. Worldwide geographic behavior cannot be conclusively verified from one location, but the repository contains no geographic blocking logic.
- No Vercel Preview URL was available, so preview-domain indexing controls remain unverified.

# 2. Route audit matrix

| Route | Status | Indexable | Canonical | Title | H1 | Sitemap | Internal links | Main issue | Verdict |
|---|---:|---:|---|---|---|---:|---|---|---|
| `/ph` | 200 | Yes, but conflicting canonical host | `https://sixthgearmoto.com/ph` | `SixthGearMoto \| Motorcycle Parts, Riding Gear & Service Center Makati` | Two: `SIXTHGEAR MOTO`; `CATEGORIES` | Yes | Strong | Canonical host conflict; two H1s; broken store link | Needs improvement |
| `/ph/store` | 200 | Yes, but conflicting canonical host | `https://sixthgearmoto.com/ph/store` | `Shop \| SixthGearMoto` | `All Products` | Yes | Strong | Generic title/H1; generic social metadata | Needs improvement |
| `/ph/collections/helmets` | 200 soft 404 | **No** | Missing | `404` | Missing | **No** | Target URL is not internally linked | Wrong Shopify collection handle; blank soft 404 | **Blocked** |
| `/ph/services` | 200 | Yes, but conflicting canonical host | `https://sixthgearmoto.com/ph/services` | `Motorcycle Services in Makati Philippines \| SixthGearMoto` | `Our Services` | Yes | Strong | Host conflict; generic social metadata; child-page CTA defects | Needs improvement |
| `/ph/about` | 200 | Yes, but conflicting canonical host | `https://sixthgearmoto.com/ph/about` | `About Us \| SixthGearMoto` | `About Us` | Yes | Strong | Host conflict; generic social metadata | Needs improvement |
| `/ph/contact` | 200 | Yes, but conflicting canonical host | `https://sixthgearmoto.com/ph/contact` | `Contact Us \| SixthGearMoto` | `Get in Touch with Us` | Yes | Strong | Host conflict; generic social metadata | Needs improvement |
| `/ph/rider-stories` | 200 | Yes, but conflicting canonical host | `https://sixthgearmoto.com/ph/rider-stories` | `Rider Stories \| SixthGearMoto` | `Stories, garage notes, and rider-led articles.` | Yes | Weak to index page | No primary-nav/footer/home index link or route-specific schema | Needs improvement |
| `/ph/first-gear` | 200 | Yes, but conflicting canonical host | `https://sixthgearmoto.com/ph/first-gear` | `First Gear Coffee \| SixthGearMoto` | `PRECISION IN EVERY POUR.` | Yes | Moderate | Metadata promises a menu that is not rendered; CTA does nothing | Needs improvement |

## Exact descriptions and social metadata

- `/ph`:  
  `Shop premium motorcycle parts, riding gear, Akrapovic exhausts, and big bike accessories at SixthGearMoto. Visit our motorcycle shop, service center, carwash, and coffee spot in Makati, Philippines.`  
  Open Graph and Twitter repeat the route title and description.

- `/ph/store`:  
  `Browse helmets, apparel, accessories, and motorcycle parts from SixthgearMoto.`

- `/ph/services`:  
  `Book motorcycle PMS, diagnostics, repairs, oil change, detailing, accessories installation, performance upgrades, towing, and rider support with SixthgearMoto in Makati.`

- `/ph/about`:  
  `Learn about SixthgearMoto, a rider-built motorcycle shop, workshop, and cafe hub in the Philippines.`

- `/ph/contact`:  
  `Contact SixthGearMoto for motorcycle parts, workshop bookings, carwash, coffee, and rider support from Makati for Metro Manila.`

- `/ph/rider-stories`:  
  `Read rider stories, garage notes, and workshop articles from the SixthgearMoto team and community.`

Store, Services, About, Contact, Rider Stories, and the invalid Helmets target inherit this generic social metadata:

- OG title: `SixthGearMoto`
- OG description: `Shop motorcycle gear and parts, book workshop services, and discover the rider hub experience of SixthGearMoto in the Philippines.`
- Twitter title: `SixthGearMoto`
- Twitter description: `SixthGearMoto is a rider-focused motorcycle parts shop, motorcycle service center, carwash, cafe, and lounge in Makati City, Metro Manila.`

First Gear has route-specific Open Graph text but still inherits the generic Twitter metadata.

## Structured data

All JSON-LD blocks inspected were valid JSON.

| Route | Current types |
|---|---|
| `/ph` | `Organization`, `LocalBusiness`, `AutoRepair`, `WebSite` |
| `/ph/store` | Global types plus `BreadcrumbList` |
| `/ph/collections/helmets` | Global types only |
| Valid `/ph/collections/helmet` | Global types, `BreadcrumbList`, `ItemList` |
| `/ph/services` | Global types plus `BreadcrumbList` |
| `/ph/about` | Global types plus `BreadcrumbList` |
| `/ph/contact` | Global types plus `BreadcrumbList` |
| `/ph/rider-stories` | Global types only |
| `/ph/first-gear` | Global types only |

All structured-data URLs use the conflicting non-`www` host.

# 3. Navigation and internal-link matrix

| Target page | Desktop nav | Mobile nav | Footer | Homepage link | Anchor labels | Click depth | Recommendation |
|---|---:|---:|---:|---:|---|---:|---|
| Home | Yes | Yes | Yes | Self | Home, logo | 0 | Keep |
| Shop | Yes | Yes | Yes | Yes | Shop, Shop Now, Start Shopping, Parts/Accessories | 1 | Keep “Shop” as the main label; fix malformed link |
| Helmets | No | No | No | Yes, but to singular URL | Generic `Shop Now` | 1 to valid page | Use `/ph/collections/helmet`; make anchor label descriptive |
| Services | Yes | Yes through expanded menu | Yes | Yes | Services, Motorcycle Service & Diagnostics | 1 | Keep “Services” consistently |
| About | Yes | Yes | Yes | Yes | About, About Us, More About Us | 1 | Standardize primary label to “About Us” |
| Contact | Yes | Yes | Yes | Yes | Contact, Contact Us | 1 | Standardize primary label to “Contact Us” |
| Rider Stories | No | No | No | Only individual articles | Read article | At least 2 to index | Add a crawlable index-page link |
| First Gear | Yes | Yes | No | Yes | First Gear Coffee, Explore Our Product, Cafe & Rider Lounge | 1 | Use “First Gear Coffee” for primary links |

Homepage links also include unlocalized `/store`, `/services`, `/contact`, and `/first-gear` paths. They are crawlable but incur a temporary redirect to `/ph/...`.

A confirmed homepage link is malformed:

```text
/ph/ph/store?tag=new-arrival
```

It returns a real HTTP `404` with `noindex`.

# 4. Sitelink candidate matrix

| Candidate | Target URL | Strength | Supporting signals | Main weakness | Recommendation |
|---|---|---|---|---|---|
| Shop | `/ph/store` | Moderate | Primary nav, mobile nav, footer, homepage, sitemap | Generic title/H1; canonical host conflict | Improve title/H1 and repair malformed links |
| Helmets | `/ph/collections/helmets` | Not ready | Homepage has a Helmets category | Target is a soft 404; valid URL is singular | Redirect plural to `/ph/collections/helmet` and use the singular URL |
| Services | `/ph/services` | Moderate | Strong title, nav, footer, homepage, sitemap, breadcrumbs | Host conflict; service CTA trust problems | Correct host and child-page booking behavior |
| About Us | `/ph/about` | Moderate | Nav, footer, homepage, sitemap, breadcrumbs | Label varies between About and About Us | Standardize the primary label |
| Contact Us | `/ph/contact` | Moderate | Nav, footer, homepage, sitemap, contact details | Label varies; generic social metadata | Standardize label and social metadata |
| Rider Stories | `/ph/rider-stories` | Weak | Unique content, sitemap, published article links | No direct nav/footer/home link; no Blog/ItemList schema | Add a visible index link and relevant schema |
| First Gear Coffee | `/ph/first-gear` | Moderate | Primary nav, homepage section, sitemap, distinct brand | Menu claims do not match page; broken CTA | Repair content/UI mismatch before promoting |

# 5. Canonical and duplicate URL audit

| Variant | Current behavior | Assessment |
|---|---|---|
| `/`, `/store`, `/services`, etc. | `307` temporary redirect to `/ph...` | Crawlable, but permanent normalization should use `308` |
| Trailing slash | `308` to non-trailing slash | Correct |
| HTTP `www` | `308` to HTTPS `www` | Correct |
| HTTPS non-`www` | `307` to HTTPS `www` | Preferred host is apparently `www` |
| Canonical URLs | Point to non-`www` | Contradicts the actual host redirect |
| Sitemap/robots URLs | Non-`www` | Each URL redirects before reaching its canonical page |
| `/PH/services` | Indexable `200`, uppercase self-canonical | Duplicate locale casing |
| `/ph/Services` | `404` | Does not compete |
| Query parameters | Canonicalize to the clean route | Good |
| Homepage, Store, Services, Rider Stories query variants | Also emit `noindex, follow` | Good |
| About, Contact, First Gear query variants | Canonical only; no explicit noindex | Acceptable, though inconsistent |
| `/us`, `/sg`, `/my` variants | Return the same Philippines-focused English pages with mostly self-canonicals | Duplicate/localization strategy unresolved |
| `/us|sg|my/first-gear` | Canonicalizes to `/ph/first-gear` | Inconsistent with other routes |
| `hreflang` | None | No locale relationship is declared |
| Vercel preview URLs | Not supplied | Unverified |

The middleware treats any two-character first segment as a country code. It does not validate against an approved set or redirect uppercase country codes to lowercase.

# 6. Confirmed defects

## High — Canonical host contradicts production host

- Route: All indexable targets.
- Reproduction: Open `https://www.sixthgearmoto.com/ph/services`; inspect the canonical.
- Expected: Canonical host returns the final preferred URL directly.
- Actual: Canonical points to `https://sixthgearmoto.com/...`; that URL redirects to `www`.
- Root cause: `getBaseURL()` is producing non-`www`, while domain routing prefers `www`.
- Evidence: [env.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/util/env.ts:19), [seo.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/seo.ts:24), [sitemap.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/sitemap.ts:70).
- Repair boundary: Decide the preferred host, then align Vercel redirects, base URL, metadata, JSON-LD, sitemap and robots.

## High — Helmets target is a soft 404

- Route: `/ph/collections/helmets`.
- Reproduction: Clean GET request.
- Expected: Real Helmets collection or permanent redirect to the approved collection.
- Actual: HTTP `200`, `404` title, `noindex`, no canonical, no H1, blank shared shell.
- Root cause: The Shopify handle is `helmet`, not `helmets`. The route calls `notFound()` after asynchronous collection lookup. The `200` response appears to be caused by the response shell beginning before the streamed not-found result—this part is an inference from the live response and route structure.
- Evidence: [collection route](<C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/collections/[handle]/page.tsx:35>).
- Repair boundary: Add an explicit permanent redirect from plural to singular and use the singular URL everywhere.

## High — Broken double-localized homepage store link

- Route: Homepage → `/ph/ph/store?tag=new-arrival`.
- Expected: `/ph/store?tag=new-arrival`.
- Actual: HTTP `404`, `title=404 | SixthGearMoto`, `noindex`.
- Root cause: The page passes an already localized path to `LocalizedClientLink`, which prepends the country code again.
- Evidence: [homepage](<C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/page.tsx:408>), [ProductSection](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/home/components/product-sections/product-section/index.tsx:51), [LocalizedClientLink](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/common/components/localized-client-link/index.tsx:29).
- Repair boundary: Pass `/store?...` into localized link components consistently.

## Medium — Uppercase and unrestricted locale duplicates

- Route: `/PH/...`, `/us/...`, `/sg/...`, `/my/...`.
- Expected: Validated supported locale, lowercase normalization, and genuine localized content or a permanent redirect.
- Actual: `/PH/services` is an indexable duplicate with an uppercase self-canonical. Other configured countries return substantially identical Philippines-focused content without `hreflang`.
- Root cause: Middleware accepts any two-character prefix and does not normalize the visible URL.
- Evidence: [middleware.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/middleware.ts:55).
- Repair boundary: Approve the supported-market strategy, validate codes, normalize casing, then add genuine localization plus `hreflang` or redirect unsupported markets.

## Medium — First Gear search snippet does not match the page

- Route: `/ph/first-gear`.
- Expected: A visible menu matching the title/description, or metadata that accurately describes the editorial page.
- Actual: Metadata advertises a full menu, while categories, items and prices are not rendered. “SEE THE MENU” has no rendered category target. The FAQ describes selecting variants and adding to cart.
- Root cause: Featured menu is disabled and the template never renders its prepared category array.
- Evidence: [First Gear route](<C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/first-gear/page.tsx:50>), [menu template](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/menu/templates/menu-template/index.tsx:387), [hero CTA](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/menu/components/first-gear-hero/index.tsx:121), [FAQ](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/menu/components/faqs-section/index.tsx:32).
- Repair boundary: Align metadata/content and implement or remove the unusable menu CTA—after menu ownership is decided.

## Medium — Contact-only service pages show booking

- Routes: `/ph/services/roadside-assistance` and `/ph/services/rider-support`.
- Expected: Contact action.
- Actual: Every service-detail hero hardcodes “Book This Service” and opens Cal.com.
- Root cause: Queried `ctaLabel` and `ctaLink` are not consumed by the hero.
- Evidence: [service hero](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/services/components/service-detail-hero/index.tsx:62), [service resolver](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/data/service-detail.ts:89), [service data](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/services-data.ts:630).
- Repair boundary: Add an explicit booking/contact CTA action model.

## Medium — Rider Stories index has weak internal discovery

- Route: `/ph/rider-stories`.
- Expected: Direct descriptive links from strong sitewide or homepage surfaces.
- Actual: No desktop nav, mobile nav, or footer index link. Homepage links only individual stories.
- Root cause: It is absent from `navLinks` and footer arrays; the homepage story component only renders detail links.
- Evidence: [desktop nav](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/layout/templates/nav/nav-client.tsx:19), [footer](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/layout/templates/footer/index.tsx:13), [homepage stories](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/home/components/client-stories/index.tsx:178).
- Repair boundary: Add one descriptive index link to an approved navigation/footer/home location.

## Medium — Homepage has two H1 elements

- Route: `/ph`.
- Expected: One primary H1.
- Actual: `SIXTHGEAR MOTO` and decorative `CATEGORIES` are both H1.
- Root cause: Categories watermark is implemented as an H1.
- Evidence: [homepage hero](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/home/components/hero/index.tsx:154), [categories](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/home/components/categories/index.tsx:219).
- Repair boundary: Keep the page hero H1; make the decorative categories label non-H1.

## Low — Shared icon controls lack accessible names

- Routes: Shared across all targets.
- Actual: The login/account icon links, mobile search icon, and cart buttons lack consistent accessible names.
- Evidence: [nav-client.tsx](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/layout/templates/nav/nav-client.tsx:144), [mobile search](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/search/components/mobile-search-button/index.tsx:6).
- Repair boundary: Add stable `aria-label` or visible text to icon-only controls.

# 7. Improvements, not confirmed blockers

- Improve Store metadata from generic `Shop` and `All Products` to wording such as “Motorcycle Parts & Riding Gear Shop | SixthGearMoto.”
- Consider `Our Services` → `Motorcycle Services in Makati`.
- Include “First Gear Coffee” in its H1 while preserving the tagline.
- Add route-specific Open Graph and Twitter metadata instead of inheriting generic brand text.
- Add route-appropriate structured data:
  - Store: `CollectionPage`/`ItemList` if it accurately represents visible products.
  - Rider Stories: `Blog` or `CollectionPage` plus `ItemList`.
  - First Gear: `WebPage` or an appropriate local food-service subtype only if the visible business information supports it.
- Add visible breadcrumbs where useful; current index-page breadcrumbs are JSON-LD only.
- Make the Helmets homepage anchor descriptive instead of only “Shop Now.”
- Replace temporary `307` redirects from bare routes with permanent normalization if `/ph` is permanently preferred.
- Stop assigning `new Date()` to local service sitemap entries; it fabricates a new modification date every regeneration.
- All inspected `<img>` elements had an `alt` attribute. Empty alts were mainly shared decorative images; no missing `alt` attributes were found.

# 8. Recommended implementation scope

## P0

1. Decide whether `www` or non-`www` is canonical; align all hosting and metadata signals.
2. Redirect `/ph/collections/helmets` permanently to `/ph/collections/helmet`.
3. Fix `/ph/ph/store?...` and audit every `LocalizedClientLink` caller for pre-localized paths.
4. Retest all eight targets for status, canonical and sitemap consistency.

## P1

1. Validate and lowercase supported country codes.
2. Decide whether `us`, `sg`, and `my` are genuine markets or unsupported duplicate routes.
3. Add Rider Stories index discovery.
4. Fix First Gear’s menu/metadata/CTA mismatch.
5. Correct Contact-only service actions.
6. Reduce the homepage to one H1.
7. Standardize labels: Shop, Services, About Us, Contact Us, Rider Stories, First Gear Coffee.
8. Add route-specific social metadata.

## P2

1. Improve structured data.
2. Correct sitemap `lastModified`.
3. Add accessible names to icon controls.
4. Add visible breadcrumbs where they improve navigation.
5. Review title/H1 wording after technical defects are resolved.

Likely affected files include:

- [env.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/util/env.ts)
- [middleware.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/middleware.ts)
- [seo.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/seo.ts)
- [sitemap.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/sitemap.ts)
- [robots.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/robots.ts)
- [homepage route](<C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/page.tsx>)
- [collection route](<C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/collections/[handle]/page.tsx>)
- [navigation](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/layout/templates/nav/nav-client.tsx)
- [mobile navigation](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/layout/templates/nav/mobile-menu.tsx)
- [footer](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/layout/templates/footer/index.tsx)
- First Gear and service-detail files cited above

Required business decisions:

- Preferred host: `www` or non-`www`.
- Approved locale/market list.
- Whether Helmets permanently uses the singular Shopify handle.
- Whether Rider Stories belongs in primary navigation or the footer.
- Whether First Gear should expose a real menu/cart experience.

# 9. Search Console actions after deployment

1. Verify the Domain property or both relevant URL-prefix properties.
2. Submit the corrected `www` sitemap.
3. Inspect all eight approved URLs.
4. Request indexing for the corrected Helmets destination and other repaired pages.
5. Confirm Google-selected canonical matches the declared canonical.
6. Monitor Page Indexing for soft 404, duplicate and alternate-canonical classifications.
7. Validate redirects for the old Helmets URL.
8. Monitor internal-link discovery and Performance reports.

Google sitelinks cannot be manually requested or guaranteed.

# 10. Verification plan

Locally:

- Run tests, TypeScript, build and `git diff --check`.
- Verify statuses with a production build, not only `next dev`.
- Assert exact title, description, robots, canonical, one H1 and JSON-LD.
- Crawl every internal homepage/nav/footer link and fail on 4xx or double-localized paths.

Vercel Preview:

- Confirm Preview itself is `noindex`.
- Ensure its page canonicals point to the approved production host.
- Test desktop/mobile navigation and JavaScript hydration.
- Verify the Helmets redirect and Contact-only service CTAs.
- Run Rich Results validation against preview-accessible HTML where possible.

Production:

- Repeat clean and Googlebot-style requests.
- Verify `www`/non-`www`, HTTP/HTTPS, trailing slash, uppercase locale and bare-path redirects.
- Confirm robots and sitemap use the final host.
- Check rendered content, canonical, robots, H1 and structured data.
- Use Search Console URL Inspection after deployment.

Repository status remained unchanged by this audit. The working tree already contained unrelated modified and untracked files; I did not touch them.