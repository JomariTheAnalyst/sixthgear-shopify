The audit is complete. I made no code, configuration, or Sanity content changes because `new-prompt.md` explicitly required a read-only audit.

The most important findings are:

- First Gear’s menu is currently not rendered at all.
- Its menu prices are local-only, availability is not modeled, and no Loyverse/Shopify synchronization exists.
- All eight service pages currently show a Cal.com booking button, including the two intended Contact-only services.
- Sanity currently contains zero `service` documents.
- Service fields are merged individually with local content, not selected atomically per section.
- Creating one Sanity pilot document now would break the related-services list unless the resolver is fixed first.
- Service Presentation mappings, Visual Editing targets, safe slug migration, and correct webhook revalidation are missing.

## First Gear section matrix

Route: [first-gear/page.tsx](<C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/first-gear/page.tsx>)
Template: [menu-template/index.tsx](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/modules/menu/templates/menu-template/index.tsx)

| Order | Section | Component/source | Current source | Local fallback | Sanity support | Recommended owner |
|---:|---|---|---|---|---|---|
| 1 | Hero | `first-gear-hero` | Mostly hardcoded; only fetched subtitle is consumed | Hardcoded content and local image | None | Sanity editorial |
| 2 | Marquee | Shared `marquee` | Component defaults | Hardcoded messages | None | Sanity |
| 3 | About First Gear | `about-us-section` | Hardcoded copy, features and image | Entire section is local | None | Sanity |
| 4 | Why First Gear? | `why-choose-us-section` | Hardcoded heading and six cards | Entire section is local | None | Sanity |
| 5 | Gallery | `gallery-section` | Eight hardcoded Unsplash images | Third-party placeholder images | None | Sanity |
| 6 | Testimonials | `client-testimonials-section` | Ten hardcoded testimonials | Entire section is local | None | Sanity, with owner approval |
| 7 | FAQs | `faqs-section` | Six hardcoded question/answer pairs | Entire section is local | None | Sanity |
| 8 | Newsletter | `newsletter-section` | Hardcoded UI | Entire section is local | None | Sanity for text; external provider/API for submission |

The navigation and footer come from the shared main layout and are not First Gear-owned sections.

### First Gear field and editing requirements

| Section | Fields required by the current UI | `useSanityContent` | Validation | Visual Editing target | Media requirements |
|---|---|---|---|---|---|
| Hero | eyebrow, title, subtitle, badges, CTA label/anchor, image, image alt | Yes | Complete title, image and alt when enabled; CTA label and valid anchor paired | `firstGearPage.hero` | Current UI supports image only; use a portrait-safe 2:3 or 3:4 image |
| Marquee | messages, speed, pause-on-hover | Yes | At least three nonempty messages | `firstGearPage.marquee` | No media |
| About | heading, body, image, alt, feature title/body pairs | Yes | Image/alt pairing; complete feature pairs | `firstGearPage.about` | Landscape image; optimize the current 5.49 MB asset |
| Why | heading and feature cards containing title, body and icon | Yes | Recommended 3–6 complete cards | `firstGearPage.whyFirstGear` | Existing SVG icons can remain code-owned or become controlled icon choices |
| Gallery | keyed image array with alt text | Yes | At least three images; alt required | Keyed `firstGearPage.gallery.items[_key]` | Portrait 3:4 or 4:5; current component does not support video |
| Testimonials | keyed name, role and quote | Yes | All fields paired; authenticity approval required | Keyed `firstGearPage.testimonials.items[_key]` | No media currently |
| FAQs | keyed question and answer pairs | Yes | Recommended 3–8 complete, unique pairs | Keyed `firstGearPage.faqs.items[_key]` | No media |
| Newsletter | title, body, placeholder, button label and legal/supporting text | Yes for editorial text | Required labels when enabled | `firstGearPage.newsletter` | Submission endpoint belongs outside Sanity |

Every editorial section should have its own `useSanityContent` toggle. There should not be one master toggle controlling the whole page.

### First Gear confirmed defects

- `CategorySection` and `MenuItemCard` exist, but the template never renders `menuCategories.map(...)`.
- “SEE THE MENU” attempts to scroll to the first menu category, but no category element exists. The button currently does nothing.
- `showFeaturedMenu={false}` disables the featured menu.
- `CoffeeCategorySection`, ads, statistics and blog-related content are not rendered and therefore should not be included in the migration.
- The fetched hero title and background image are ignored. Only the fetched subtitle is used.
- The hero image is completely hidden on smaller screens.
- The About image is approximately 5.49 MB and should be optimized before production CMS use.
- Gallery content is generic Unsplash imagery rather than confirmed Sixthgear imagery.
- Newsletter submission only calls `preventDefault()`; it stores or sends nothing.
- An FAQ describes selecting variants and adding items to the cart even though the menu is not rendered.
- Metadata hardcodes the Philippines canonical path instead of using the route’s `countryCode`.
- The Strapi client is a migration stub that always returns `null`.
- If category rendering were restored without further work, flat-price menu items could still lose their displayed price because the conversion focuses on size variants.

### Menu ownership determination

There is no Loyverse client, API configuration, package, webhook, scheduled synchronization, or source reference in the repository. The First Gear route also does not fetch Shopify products.

The current local dataset contains:

- 4 categories
- 29 menu items
- Local Philippine-peso prices
- No usable availability model

Recommended ownership:

| Data | Recommended source |
|---|---|
| Menu names, sellable variants, prices and live availability | Loyverse, if it is the operational POS |
| Packaged coffee or merchandise sold online | Shopify |
| Page headings, descriptions, gallery, FAQs and other marketing content | Sanity |
| Temporary emergency menu snapshot | Code, clearly marked and timestamped |
| Page structure and behavior | Code |

Do not copy live prices into Sanity as a second authoritative source. The owner must confirm that Loyverse is the operational system before an integration is built.

## Service-detail section matrix

Route: [services/[slug]/page.tsx](<C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/app/[countryCode]/(main)/services/[slug]/page.tsx>)
Resolver: [service-detail.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/src/lib/data/service-detail.ts)
Schema: [service.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity/schemaTypes/service.ts)

| Order | Section | Current source | Schema/query field | Consumer | Fallback | Defect or gap |
|---:|---|---|---|---|---|---|
| 1 | Hero | Merged CMS/local data | `title`, `heroImage` | `ServiceDetailHero` | Local service title/image | No image alt; CMS CTA ignored; booking button hardcoded |
| 2 | Overview | Description plus generated text | `fullDescription`, `shortDescription` | Hero component | Local description | No independent section selector; generated prose mixed with CMS content |
| 3 | Included work | Service item array | `features[]` | `ServiceItems` | Local items | Entire array fallback; item detail copy is generated |
| 4 | Local content | Editorial sections | `localContent[]` | `ServiceLocalContent` | Local sections | No per-section toggle or atomic source selection |
| 5 | Helpful links | Internal-link array | `internalLinks[]` | Local-content sidebar | Local links | Paths are not safely validated; hardcoded slugs can break |
| 6 | FAQs | FAQ array | `faqItems[]` | Local-content sidebar and JSON-LD | Local FAQs | `_key` omitted from GROQ; no Visual Editing targeting |
| 7 | Other services | All service records | `allServicesQuery` | `OtherServices` | Local data only while CMS is empty | One CMS pilot causes incomplete related-service results |
| 8 | Final CTA | Generic banner defaults | `ctaLabel`, `ctaLink` are queried | `CTABanner` receives no service CTA props | Generic “Shop Now” | Both CMS CTA fields are ignored |

Benefits, Process and Gallery are not currently rendered on service-detail pages. They should not be added to the CMS until there is a real component consuming them.

## Current service slugs and booking classification

| Slug | Intended action from local content | Actual current behavior |
|---|---|---|
| `preventive-maintenance` | Book service | Cal.com booking shown |
| `repairs-diagnostics` | Book service | Cal.com booking shown |
| `accessories-installation` | Book service | Cal.com booking shown |
| `wheels-drivetrain` | Book service | Cal.com booking shown |
| `detailing-protection` | Book service | Cal.com booking shown |
| `performance-upgrades` | Book service | Cal.com booking shown |
| `roadside-assistance` | Contact-only | Incorrectly shows Cal.com booking |
| `rider-support` | Contact-only | Incorrectly shows Cal.com booking |

The hero hardcodes `CalBookingTrigger` with “Book This Service” for every service. Therefore, all eight appear bookable in the current UI even though `roadside-assistance` and `rider-support` are intended to remain Contact-only.

## Service data and Sanity findings

- A read-only Sanity query confirmed:
  - Published `service` documents: **0**
  - Draft `service` documents: **0**
- The resolver merges CMS and local fields individually.
- Sections are not selected atomically.
- An empty CMS array cannot intentionally hide a section because it falls back to local content.
- `shortTitle` prefers local content even when CMS content exists.
- `ctaLabel` and `ctaLink` are queried and mapped but ignored by both the hero and final CTA.
- Related-service cards prefer local images for known slugs, potentially ignoring CMS images.
- Adding the first CMS pilot document causes `OtherServices` to be calculated from only the CMS collection. The pilot could show no related services, while local pages could show only the pilot.

## Missing Presentation and Visual Editing support

[locations.ts](C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify/sanity/presentation/locations.ts) has no `service` document resolver.

Required additions:

- A `service` Presentation resolver selecting `title` and `slug.current`.
- A safe preview location such as `/ph/services/{encodedSlug}`.
- Visual Editing targets for:
  - title
  - hero image
  - descriptions/overview
  - features
  - local-content sections
  - internal links
  - FAQs
  - CTA
- `_key` in every array projection.
- Key-based targets such as `features[_key]` and `faqItems[_key]`.
- Section-level source selectors so a section comes entirely from Sanity or entirely from local fallback.

## Slugs, sitemap and revalidation

Slug changes are not safe today:

- Renaming a published slug makes the previous URL return 404.
- There is no redirect or legacy-slug history.
- Local internal links can continue pointing to the old slug.
- The schema only warns editors not to rename it.
- During migration, the sitemap can contain both the local old slug and the new CMS slug.

Required protections:

- Treat published slugs as immutable, or add `legacySlugs`.
- Validate unique, URL-safe slugs.
- Add redirects from legacy slugs.
- Update internal references as part of an approved migration.

Sitemap gaps:

- Only `/ph` service URLs are emitted.
- Local and Sanity slugs are merged without migration ownership rules.
- Local services receive `new Date()` as `lastModified` on every sitemap generation.
- Stable modification dates and locale policy are required.

Webhook gaps:

- The webhook currently revalidates dynamic documents as `/ph/rider-stories/{slug}` regardless of document type.
- Service changes need type-aware revalidation for:
  - `/[countryCode]/services`
  - `/[countryCode]/services/[slug]`
  - old and new slug paths after an approved rename
  - sitemap data
- A future First Gear singleton needs `/[countryCode]/first-gear` revalidation.

## Recommended pilot

Use `preventive-maintenance`.

It is the safest pilot because it:

- Matches the existing Cal.com PMS booking event.
- Is a core, clearly bookable service.
- Has 14 included-work items, three editorial sections and five FAQs.
- Exercises nearly every existing service field.
- Avoids the additional Contact-only behavior needed by roadside assistance and rider support.

Before creating the pilot document, fix the related-services migration cliff and introduce the CTA action model.

## Recommended implementation plans

### Phase A — First Gear Coffee

1. Create a canonical `firstGearPage` singleton.
2. Add independent section objects and `useSanityContent` toggles for the eight currently rendered sections.
3. Connect only content that the current components consume.
4. Correct the hero mapping so the CMS title, image and CTA are actually used.
5. Add keyed arrays and Visual Editing targets.
6. Keep the local editorial content as a complete section-level fallback.
7. Decide and integrate the operational menu source separately.
8. Render the menu only after names, prices and availability have one authoritative source.
9. Add a timestamped local snapshot only as a controlled outage fallback.

### Phase B — Service pilot

1. Preserve one reusable `service` document type.
2. Add section-level selectors instead of field-by-field mixing.
3. Add a CTA action enum:
   - `booking`
   - `contact`
   - `internalLink`
   - `externalLink`
   - `none`
4. Conditionally validate the label, URL and booking configuration.
5. Fix related services to use the union of migrated CMS services and remaining local services.
6. Include `_key` in queries and add Visual Editing targets.
7. Add the Presentation resolver and correct webhook routing.
8. Create only the `preventive-maintenance` pilot document.
9. Verify fallback, booking, metadata, JSON-LD, related services, sitemap and Visual Editing.
10. Migrate remaining services one at a time.
11. Migrate Contact-only services only after the CTA model is verified.

The safest execution order remains:

1. Repair the reusable service plumbing.
2. Migrate `preventive-maintenance`.
3. Verify the pilot.
4. Migrate remaining services.
5. Connect First Gear editorial sections.
6. Connect the First Gear menu only after price ownership is approved.

## Exact principal files involved

First Gear:

- `src/app/[countryCode]/(main)/first-gear/page.tsx`
- `src/modules/menu/templates/menu-template/index.tsx`
- `src/modules/menu/components/first-gear-hero/index.tsx`
- `src/modules/menu/components/about-us-section/index.tsx`
- `src/modules/menu/components/why-choose-us-section/index.tsx`
- `src/modules/menu/components/gallery-section/index.tsx`
- `src/modules/menu/components/client-testimonials-section/index.tsx`
- `src/modules/menu/components/faqs-section/index.tsx`
- `src/modules/menu/components/newsletter-section/index.tsx`
- `src/lib/strapi/coffee-menu.ts`
- `src/lib/strapi.ts`
- `src/lib/menu-data.ts`

Services:

- `src/app/[countryCode]/(main)/services/[slug]/page.tsx`
- `src/modules/services/templates/service-detail/index.tsx`
- `src/modules/services/components/service-detail-hero/index.tsx`
- `src/modules/services/components/service-items/index.tsx`
- `src/modules/services/components/service-local-content/index.tsx`
- `src/modules/services/components/other-services/index.tsx`
- `src/modules/home/components/cta-banner/index.tsx`
- `src/lib/data/service-detail.ts`
- `src/lib/services-data.ts`
- `src/lib/strapi/services.ts`
- `sanity/schemaTypes/service.ts`
- `src/lib/cms/queries.ts`
- `src/lib/cms/client.ts`
- `sanity/presentation/locations.ts`
- `src/app/sitemap.ts`
- `src/app/api/revalidate-sanity/route.ts`

## Audit integrity

No source files, Sanity documents, configuration, or remote content were modified. The working tree already contained numerous unrelated modified and untracked files before/during this audit; I left all of them untouched. No secret values were printed or exposed.
