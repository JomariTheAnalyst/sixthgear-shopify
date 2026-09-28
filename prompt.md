TASK: cookie consent and privacy setup for the Data Privacy Act of 2012. Storefront repo. Follow AGENTS.md.
Branch: feat/cookie-consent from the latest main.
PLAN FIRST: reply with your plan (files, approach, test list) and wait for my OK before writing code.

Hard rule: no feature may break. Test every flow in step 9 before and after.

1. One cookie registry file: every cookie, browser storage item, and third-party service, with name, vendor, category, purpose, duration, and policy link. The banner, the Cookie settings panel, and the /cookies table all read from it. Adding a tool later (for example Google Analytics) must only need a new registry entry.

2. Categories:
   - Necessary (always on): cart, login, consent choice, security.
   - Saved on device (always on, no consent needed, never leaves the browser): wishlist, recent searches, recently viewed, preloader, closed notices. Do not change how these work.
   - Functional: Tidio, cal.com.
   - Marketing: Curator feed (Facebook).
   - Analytics: empty for now. Hide any category that has no entries.

3. Consent:
   - Store the choice in a first-party cookie sg_consent (categories, date, policy version). It lasts 12 months. Ask again after 12 months or when the policy version changes.
   - Treat a Global Privacy Control signal as No to Analytics and Marketing.
   - Nothing non-essential loads before a choice.

4. Banner and settings:
   - A bottom bar that does not block browsing, with three equal buttons: Accept all, Reject non-essential, Customize. Nothing pre-ticked.
   - Customize opens a panel with a switch per category.
   - A "Cookie settings" link in the footer reopens the panel.
   - Keyboard and screen-reader accessible, works on mobile, and never covers the cart or checkout buttons. Not shown on /studio.

5. Delay the third-party services:
   - Tidio: load only with Functional consent. Otherwise show a "Chat with us" button that asks for consent, then loads and opens the chat.
   - cal.com: load embed.js only on the first click of a booking button. Show a loading state, then open the booking as today.
   - Curator: with no Marketing consent, show a placeholder with a "Show our social feed" button that asks for consent, then loads.
   - Google Maps (Home, Contact): a placeholder with an "Open map" button that loads the iframe on click, plus a normal "View on Google Maps" link.
   - Product videos: use youtube-nocookie.com and load on click, on mobile too.

6. Shopify: pass the visitor's choice to Shopify with the Customer Privacy API, following Shopify's current docs for headless storefronts, so the checkout respects it. If you cannot verify it end to end, tell me.

7. Legal pages:
   - /privacy and /terms: read the text from Shopify's store policies through the Storefront API, with caching. If a policy is empty in Shopify, keep showing the current page text as a fallback.
   - New /cookies page: an intro (I will send the text), plus the table generated from the registry.
   - Contact and booking form: add one line under the submit button: "We use your details only to answer your request. See our Privacy Policy."
   - Register: keep the privacy and terms links. No marketing checkbox for now.
   - /returns-warranty: leave it as it is. The refund process is still being decided.
   - Fix the /terms link to /returns-warranty (missing country prefix) and add its canonical tag.
   - Export the current text of /terms, /returns-warranty, /shipping and /faqs to scratchpad/legal-current.md so I can review it. Do not change those pages.

8. Cleanups from the audit:
   - shopify_cart_id: add the secure flag in production only, so local development still works. Fix the wrong HttpOnly comment.
   - Judge.me: stop keeping reviewer email, phone and IP in the server cache. Keep only what the page shows.
   - Remove leftover code: _medusa_* cookie code, checkoutSelectedItems, the unused marketing popup and announcement strip, review-modal.tsx, and the newsletter form on /first-gear.

9. Tests:
   - Run the existing Playwright smoke tests.
   - Add tests: first visit shows the banner; Reject makes no requests to Tidio, cal.com, Curator, Facebook, or Google Maps; Accept loads them; the choice persists after reload; Cookie settings reopens the panel.
   - Check by hand, before and after: add to cart, cart persists, checkout handoff as guest and logged in, register, login, password reset, wishlist, recent searches, recently viewed, contact form sends, booking opens and completes, chat opens, map opens, product video plays on desktop and mobile, announcement and popup dismiss, Sanity Studio and preview mode.

Report: files changed, the test results, anything you could not verify, and screenshots of the banner and settings panel on desktop and mobile.