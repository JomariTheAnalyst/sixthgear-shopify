TITLE: Homepage Lighthouse Performance and Accessibility Issues

STATUS:
Open — for later audit and implementation

SUMMARY:
The latest Lighthouse review shows that the homepage has a strong SEO baseline but still has performance, accessibility, image-loading, animation, and third-party script issues.

The SEO score is 100 and Best Practices is 96. Accessibility is 84. The Performance score was not visible in the screenshots, but Lighthouse reported several significant performance warnings.

CURRENT LIGHTHOUSE FINDINGS:

Performance:
- Initial document request latency
  Estimated possible saving: 910 ms

- Render-blocking requests
  Estimated possible saving: 530 ms

- Image delivery needs improvement
  Estimated possible saving: 532 KiB

- Legacy JavaScript
  Estimated possible saving: 12 KiB

- Main-thread work
  Total reported work: 2.0 seconds

- Unused JavaScript
  Estimated possible saving: 202 KiB

- Unused CSS
  Estimated possible saving: 15 KiB

- Large total network payload
  Total reported size: 5,374 KiB

- Two long main-thread tasks were detected

- One non-composited animated element was detected

- Forced reflow was detected

- LCP request discovery and LCP loading need investigation

- Some images do not have explicit width and height

Accessibility:
- Accessibility score: 84

- Some buttons do not have accessible names

- Some links do not have discernible names

- Some foreground and background color combinations do not meet the required contrast ratio

Best Practices:
- Best Practices score: 96

- Browser console errors were detected from Tidio

- Tidio WebSocket connections to socket.tidio.co failed with:
  ERR_NAME_NOT_RESOLVED

SEO:
- SEO score: 100

- Structured data passed Lighthouse’s basic validation

IMPORTANT:
The SEO score of 100 does not mean all pages will automatically be indexed or receive Google sitelinks. Search Console indexing and canonical issues must continue to be reviewed separately.

LIKELY AREAS TO AUDIT:

1. Initial server response
- Check Shopify and Sanity server-side queries
- Check cache misses
- Check middleware processing
- Check unnecessary redirects
- Check Vercel response latency

2. Largest Contentful Paint
- Identify the exact LCP element
- Check whether the hero image is loaded too late
- Check whether the hero depends on JavaScript or slider hydration
- Check image dimensions, priority, preload, sizes, and compression
- Check whether animation delays the hero from becoming visible

3. Images
- Identify images served larger than their displayed dimensions
- Add explicit width and height or stable aspect ratios
- Use responsive image sizes
- Optimize Sanity and local assets
- Convert appropriate assets to WebP or AVIF
- Lazy-load below-the-fold images
- Do not lazy-load the actual LCP image

4. JavaScript
- Identify the owners of the reported 202 KiB unused JavaScript
- Review GSAP, Lenis, Cal.com, Tidio, sliders, modal code, and below-the-fold client components
- Lazy-load noncritical scripts and components
- Avoid removing interaction code only because Lighthouse marks it unused during the initial load

5. Render-blocking resources
- Identify the exact blocking CSS, fonts, and scripts
- Avoid loading noncritical third-party scripts before primary content
- Review global CSS and font configuration

6. Animation and layout
- Locate the forced reflow source
- Locate the non-composited animation
- Prefer transform and opacity for animations
- Avoid repeatedly animating width, height, top, left, margin, or layout-dependent properties
- Preserve the current approved Lenis and GSAP behavior unless evidence shows a specific defect

7. Accessibility
- Add accessible names to icon-only buttons
- Add accessible names to icon-only and image-only links
- Verify cart, account, search, menu, carousel, close, and social controls
- Correct insufficient contrast without unnecessarily redesigning the interface

8. Tidio
- Confirm whether the Tidio account and widget configuration are valid
- Test whether the failure occurs outside Lighthouse
- Ensure Tidio failure does not affect critical page behavior
- Consider lazy-loading Tidio after the main page becomes interactive
- Avoid repeated console errors when the connection is unavailable

RECOMMENDED IMPLEMENTATION ORDER:

1. Audit and identify exact affected files, resources, and DOM elements
2. Fix unnamed buttons and links
3. Add stable image dimensions
4. Optimize oversized images
5. Improve the LCP hero loading path
6. Reduce initial document latency
7. Lazy-load noncritical JavaScript and third-party scripts
8. Fix forced reflow and non-composited animation
9. Correct contrast failures
10. Investigate and isolate Tidio connection failures

OUT OF SCOPE FOR THE FIRST FIX:
- Visual redesign
- Removing GSAP or Lenis without confirmed evidence
- Curator.io implementation
- First Gear CMS migration
- Broad component rewrites
- Unrelated Shopify, Sanity, booking, or SEO changes

ACCEPTANCE CRITERIA:

- Exact LCP element and request chain are documented
- No important image lacks stable dimensions
- Image payload is measurably reduced
- Critical hero content is discoverable from the initial server-rendered HTML
- No unnecessary third-party script blocks initial rendering
- Buttons and links have valid accessible names
- Confirmed contrast failures are corrected
- Forced reflow source is removed or measurably reduced
- Non-composited animation is corrected
- Tidio failure is handled without disrupting the page
- No hydration or browser-console errors are introduced
- Existing animations, Shopify behavior, Sanity content, and Cal.com booking continue working
- Desktop and mobile Lighthouse results are recorded before and after the changes
- TypeScript, production build, focused browser tests, and git diff checks pass