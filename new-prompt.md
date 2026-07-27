# Implement Cal.com Popup Across Confirmed Booking CTAs

## Project

```text
C:/Users/Jomari/Documents/sixthgear/sixthgear-shopify
````

## Role

Act as the senior Next.js frontend implementation engineer.

Implement Cal.com’s official element-click popup using the completed CTA audit. Reuse existing buttons and styling wherever possible.

Do not build a custom modal.

## Existing Booking Page

Preserve the localized inline booking page:

```text
/[countryCode]/book-service
```

It must remain:

* The shareable booking URL
* The fallback when the popup script fails
* The direct booking experience for users who prefer a full page

Do not remove or redesign it.

## Critical Namespace Separation

The inline page and popup use different themes. Do not initialize both with the same Cal namespace.

Use:

```text
Inline namespace: pms-inline
Popup namespace: pms-popup
Public Cal link: sixthgear-moto-supply-wvfnxi/pms
Origin: https://app.cal.com
```

Both namespaces may share the same public Cal event link.

## Popup Configuration

```text
Namespace: pms-popup
Origin: https://app.cal.com
Cal link: sixthgear-moto-supply-wvfnxi/pms
Layout: month_view
Mobile slots view: true
Theme: dark
Light brand: #fca704
Dark brand: #222222
Hide event details: false
Forward query parameters: true
```

The resulting trigger attributes should be equivalent to:

```tsx
data-cal-link="sixthgear-moto-supply-wvfnxi/pms"
data-cal-namespace="pms-popup"
data-cal-config={JSON.stringify({
  layout: "month_view",
  useSlotsViewOnSmallScreen: true,
  theme: "dark",
})}
```

## Step 1 — Shared Cal Infrastructure

Review:

```text
src/modules/booking/components/cal-inline-embed/index.tsx
```

Extract or reuse its script-loading and initialization logic so that:

* `https://app.cal.com/embed/embed.js` loads only once.
* `pms-inline` initializes only once.
* `pms-popup` initializes only once.
* Navigating between the inline page and popup triggers does not create duplicate scripts, namespaces, listeners, or iframes.
* Hot reload and React remounts do not duplicate initialization.
* `Cal.config.forwardQueryParams = true` remains enabled.
* No API key, OAuth credential, webhook secret, or public environment variable is introduced.

A small shared module may be created under:

```text
src/modules/booking/lib/
```

Do not duplicate the full Cal loader across multiple components.

## Step 2 — Shared Popup Trigger

Create:

```text
src/modules/booking/components/cal-booking-trigger/index.tsx
```

The component must:

* Use Cal.com’s official element-click popup.
* Render an accessible anchor, not a button with no fallback destination.
* Keep a real localized fallback URL:

```text
/[countryCode]/book-service
```

* Include `aria-haspopup="dialog"`.
* Preserve the child CTA’s existing styling and layout.
* Support an optional callback for closing the mobile menu before the popup opens.
* Avoid manual body-scroll locking.
* Avoid modifying global Lenis behavior.
* Avoid wrapping Cal.com inside any existing Sixthgear modal.
* Fall back to the localized booking page when JavaScript or the Cal script is unavailable.

Use the project’s existing localized navigation utilities where safe. Confirm that Next.js link handling does not navigate before Cal.com intercepts the click. If it conflicts, use a normal anchor with the fully localized fallback URL.

## Step 3 — Convert Existing Booking CTAs

### Desktop Services dropdown

Update:

```text
src/modules/layout/components/services-dropdown/index.tsx
```

Convert the existing `Book Now` action into the shared Cal popup trigger.

Preserve:

* Existing text
* Existing styles
* Existing dropdown behavior
* `/book-service` fallback

Do not change service-name links or View All links.

### Services landing gallery

Update:

```text
src/modules/services/components/services-gallery/index.tsx
```

Convert the existing `Book Now` CTA into the shared popup trigger.

Do not change Learn More, Contact, product, or Shop Now actions.

### Existing service-detail booking CTA

Update:

```text
src/modules/services/templates/service-local-content/index.tsx
```

Where the existing service CTA destination resolves to `/book-service`, render the shared popup trigger.

Preserve the service-specific labels already defined in:

```text
src/lib/services-data.ts
```

Examples include:

* Book a PMS at our Makati service center
* Book a diagnostic at our Makati shop
* Book a motorcycle detail in Makati
* Book a performance upgrade consultation

Do not modify the service data merely to implement popup behavior.

Keep Roadside Assistance and Rider Support as Contact actions.

## Step 4 — Add Confirmed Missing CTAs

### Mobile Services menu

Update:

```text
src/modules/layout/templates/nav/mobile-menu.tsx
```

Add one distinct action below `View All Services`:

```text
Book Service
```

Requirements:

* Use the shared popup trigger.
* Close the Headless UI mobile drawer before opening Cal.com.
* Prevent competing focus traps and scroll locks.
* Preserve the localized booking-page fallback.
* Do not replace existing service links or Contact.

### Contact page

Update the main Contact page presentation, likely:

```text
src/modules/contact/index.tsx
```

Add a secondary CTA:

```text
Book Service Online
```

Place it where it naturally complements the existing contact information or form.

Do not:

* Replace the Contact form
* Change `/api/contact`
* Change the Service Booking form subject
* Convert email, phone, address, or store-hours cards into popup triggers

### Service-detail hero

Update:

```text
src/modules/services/components/service-detail-hero/index.tsx
```

Add a prominent:

```text
Book This Service
```

trigger only for services already identified as bookable.

Derive bookability from the existing service content or CTA destination already used by `service-local-content`.

Do not create a separate duplicated slug list unless the existing data provides no usable signal.

Do not show this booking trigger for:

* Roadside Assistance
* Rider Support
* Any service whose existing primary action is Contact rather than `/book-service`

Avoid showing two visually competing booking buttons in the same viewport. Reuse the current design language and spacing.

## Step 5 — Preserve Unrelated CTAs

Do not change:

* Navbar Contact
* Contact Us buttons
* Roadside Assistance contact actions
* Rider Support contact actions
* Service Learn More links
* View All Services links
* Shop Now links
* Product links
* Footer CTA links

The discovered double-localized Services hero Contact URL is a separate bug and is outside this popup task. Report it but do not mix its repair into this implementation.

## Mobile Requirements

The Cal.com popup must:

* Fit within the mobile viewport
* Use slot view on small screens
* Allow the booking form and motorcycle questions to scroll
* Keep the close control accessible
* Avoid horizontal overflow
* Avoid double body scroll
* Avoid conflicts with Lenis
* Avoid conflicts with the mobile menu focus trap
* Restore usable page focus after closing

Do not force fixed desktop width or height values around Cal.com’s official popup.

## Verification

Stop any active development server before the production build.

Remove stale generated output if necessary:

```bash
rm -rf .next
```

On Windows, use the equivalent safe command.

Run:

```bash
npx tsc --noEmit --incremental false
npm run build
git diff --check
```

Manually verify:

1. Desktop Services dropdown `Book Now` opens the popup.
2. Services gallery CTA opens the popup.
3. Existing bookable service-detail CTAs open the popup.
4. The new service-detail hero CTA appears only on bookable services.
5. Roadside Assistance and Rider Support remain Contact-only.
6. Mobile menu includes `Book Service`.
7. Mobile menu closes before the popup becomes interactive.
8. Contact page includes `Book Service Online`.
9. Popup works on desktop and a real mobile viewport.
10. Motorcycle booking questions appear.
11. Philippine/Manila booking times are correct.
12. The popup can be closed and reopened without duplicate embeds.
13. Escape and keyboard navigation work.
14. `/ph/book-service` still works independently.
15. The fallback URL works when the Cal script is blocked.
16. Navigating between the inline route and popup pages does not cause theme or namespace conflicts.
17. No hydration, focus, Lenis, console, CORS, `401`, or `403` errors occur.
18. Submit one test booking and verify confirmation.

## Deliverables

Report:

1. Exact files changed
2. Shared Cal loader structure
3. Popup trigger API
4. Existing CTAs converted
5. New CTAs added
6. Services intentionally excluded
7. TypeScript, build, and diff-check results
8. Manual desktop and mobile results
9. Test-booking result
10. Remaining issues or unverified behavior

## Constraints

* No custom modal
* No custom booking interface
* No API key
* No Cal.com API calls
* No OAuth
* No webhook
* No Sanity changes
* No unrelated redesign
* No unrelated refactoring
* Preserve existing logic and styling
* Do not claim browser tests that were not actually completed

```

The correct scope is now:

- Reuse the three existing booking-entry points.
- Add one mobile CTA.
- Add one Contact-page CTA.
- Add a conditional service-detail hero CTA.
- Keep urgent services Contact-only.
- Keep the inline booking page as the fallback.
- Separate inline and popup namespaces to prevent theme collisions.
```
