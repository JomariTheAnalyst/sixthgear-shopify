I understand the prompt as: audit whether global Lenis can be safely added, but do not implement it yet. I did not make code changes for this audit.

**Key Finding**
Global Lenis is feasible, but not plug-and-play. The biggest risks are native `window.scrollY`, native `window.scrollTo`, native `scrollIntoView`, CSS-only body scroll locks, and route-change scroll reset.

**1. GSAP / ScrollTrigger**
No real app usage found.

Search result:
```txt
rg "ScrollTrigger|gsap.ticker|gsap.registerPlugin|scrollTrigger"
```

Only `prompt.md` matched. No `ScrollTrigger`, no `gsap.ticker.add()`, no GSAP convention currently exists in app code. So there are no existing ScrollTrigger instances to sync today.

**2. Fixed / Sticky Elements**
Important fixed/sticky files found:

- [src/app/[countryCode]/(main)/layout.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/app/[countryCode]/(main)/layout.tsx:65) sticky header wrapper:
```tsx
<div className="sticky top-0 z-[60] bg-white">
```

- [src/modules/layout/templates/nav/nav-client.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/layout/templates/nav/nav-client.tsx:63) uses native scroll:
```ts
const scrollPosition = window.scrollY
window.addEventListener("scroll", handleScroll)
```

This is a Lenis risk. Header shadow state should use Lenis scroll state or Lenis scroll event.

Other fixed/sticky components include cart drawer, mobile menu, collection filter drawer, product mobile add-to-cart, account mobile nav, popup ads, quick shop modal, search modal, route progress, Tidio adjustments, product image sticky column, product reviews sticky sidebar.

**3. Route Scroll Restoration**
Root layout: [src/app/layout.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/app/layout.tsx:67)

```tsx
<RouteProgress />
<main className="relative">{props.children}</main>
```

Main country layout: [src/app/[countryCode]/(main)/layout.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/app/[countryCode]/(main)/layout.tsx:42)

```tsx
<CartDrawerWrapper cart={cart}>
  ...
  <MarketingProvider marketing={marketing}>
    <div className="sticky top-0 z-[60] bg-white">
      <AnnouncementBar />
      <Nav />
    </div>
    {props.children}
    {props.overlay}
    <Footer />
  </MarketingProvider>
</CartDrawerWrapper>
```

Existing route progress watches pathname/search changes, but does not reset scroll:

[src/modules/common/components/route-progress/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/common/components/route-progress/index.tsx:140)
```ts
useEffect(() => {
  completeRouteProgress()
}, [pathname, searchParams])
```

A global Lenis provider would need route-change reset:
```ts
lenis.scrollTo(0, { immediate: true })
```

Best wrap point: a client `LenisProvider` inside `body`, likely around `<main>{children}</main>` in root layout. Keep `RouteProgress`, `Toaster`, and scripts outside or unaffected.

**4. Anchor / Hash Navigation**
Found native hash navigation:

[src/modules/products/templates/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/products/templates/index.tsx:109)
```tsx
href="#reviews"
```

Target:
```tsx
id="reviews"
```

Also product size guide uses native `scrollIntoView`:

[src/modules/products/components/product-actions/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/products/components/product-actions/index.tsx:123)
```ts
document
  .getElementById("details-tab")
  ?.scrollIntoView({ behavior: "smooth", block: "start" })
```

First Gear page uses native scroll math:

[src/modules/menu/templates/menu-template/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/menu/templates/menu-template/index.tsx:279)
```ts
const scrollPosition = window.scrollY + 200
```

and:

```ts
window.scrollTo({
  top: offsetPosition,
  behavior: "smooth",
})
```

These should use `lenis.scrollTo()`.

**5. Modals / Drawers / Body Scroll Lock**
CSS-only body locks found:

Cart drawer:
[src/modules/cart/components/cart-drawer/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/cart/components/cart-drawer/index.tsx:68)
```ts
document.body.style.overflow = "hidden"
```

Mobile filters:
[src/modules/collections/components/MobileFilterDrawer.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/collections/components/MobileFilterDrawer.tsx:43)
```ts
document.body.style.overflow = "hidden";
```

Quick shop:
[src/modules/common/components/quick-shop-modal/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/common/components/quick-shop-modal/index.tsx:92)
```ts
document.body.style.overflow = "hidden"
```

Service bottom sheet:
[src/modules/services/components/service-bottom-sheet/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/services/components/service-bottom-sheet/index.tsx:33)
```ts
const previousOverflow = document.body.style.overflow
document.body.style.overflow = "hidden"
```

These need `lenis.stop()` on open and `lenis.start()` on close. CSS overflow alone will not reliably stop virtual scroll.

**6. Third-Party Embeds**
Tidio chat is loaded globally:

[src/app/layout.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/app/layout.tsx:76)
```tsx
<Script
  src={`https://code.tidio.co/${clientEnv.NEXT_PUBLIC_TIDIO_PUBLIC_KEY}.js`}
  strategy="afterInteractive"
/>
```

Google Maps iframe:
[src/modules/home/components/store-location/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/home/components/store-location/index.tsx:64)

Product video iframe:
[src/modules/products/components/product-tabs/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/products/components/product-tabs/index.tsx:560)

Store drawer map iframe:
[src/modules/products/components/store-info-drawer/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/products/components/store-info-drawer/index.tsx:75)

These are likely okay, but test wheel/touch behavior over iframes after Lenis.

**7. Infinite Scroll / Pagination**
No collection infinite scroll found. Product collections use cursor pagination buttons:

[src/modules/collections/templates/index.tsx](C:/Users/Public/sixthgearmoto/sixthgear-shopify/src/modules/collections/templates/index.tsx:204)
```ts
router.push(buildCursorUrl(direction, cursor))
```

So product grid does not need Lenis scroll-state for load-more triggers.

There are `IntersectionObserver` uses, but not for PLP infinite loading.

**8. Form Validation Scroll-To-Error**
No validation-focused `scrollIntoView()` found. The only `scrollIntoView()` hit is product size guide. Contact/account forms show errors inline.

**9. Reduced Motion**
No `prefers-reduced-motion`, `useReducedMotion`, `motion-safe`, or `motion-reduce` usage found.

Lenis should be disabled or set instant for reduced-motion users.

**10. What Must Change Before Global Lenis**
Required before safe global Lenis:

- Add client `LenisProvider`.
- On route changes, call `lenis.scrollTo(0, { immediate: true })`.
- Replace header `window.scrollY` listener with Lenis scroll state.
- Replace product `scrollIntoView()` with `lenis.scrollTo(element)`.
- Replace First Gear `window.scrollY` and `window.scrollTo()` logic with Lenis-aware logic.
- On modal/drawer open, call `lenis.stop()`.
- On modal/drawer close, call `lenis.start()`.
- Add reduced-motion guard.
- Test Tidio, Google Maps, product video iframe, cart drawer, mobile filters, product sticky add-to-cart, and hash link to reviews.

Bottom line: do not add Lenis globally until these native scroll dependencies are wrapped or migrated.