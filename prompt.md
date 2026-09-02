Yep — the layout is clear: **latest Rider Story becomes the large featured article on the left**, while the **next 3 most recent stories stack vertically on the right**, all sourced from Sanity.

````markdown
# SixthGear — Revamp Rider Stories Section

## Context

SixthGear is a Next.js 15 + React 19 + TypeScript storefront using Shopify for commerce and Sanity as the editorial CMS.

The existing Rider Stories/blog content already comes from Sanity `blogPost` documents. Preserve the existing Rider Story routes, slugs, SEO, and Sanity data flow.

## Task

Revamp the homepage **Rider Stories** section to match the attached reference layout.

## Layout

Desktop:

- Use the project standard **233px left and right page margin**.
- Two-column editorial layout.
- Left column = the **latest published Rider Story**.
- Right column = the **next 3 most recent Rider Stories**, stacked vertically.

### Featured / Latest Story

Display:

- Large landscape image
- Title
- Short excerpt/description
- Read time
- Published date
- `Learn More` CTA

The entire featured story should link to its Rider Story detail page.

### Right-side Stories

Each card should contain:

- Landscape thumbnail on the left
- Title on the right
- Read time
- Published date

Keep spacing and proportions close to the reference image.

## Sanity Data

Do not hardcode article content.

Inspect and reuse the existing:

- `blogPost` Sanity schema
- Rider Story GROQ queries
- CMS types/mappers
- existing homepage Rider Stories component
- Rider Story detail route

Sort by published date descending:

1. newest post → featured story
2. next 3 posts → right-side list

If the existing query already provides the required fields, reuse it instead of creating duplicate CMS logic.

If `read time` is not currently stored, first inspect whether it can be calculated safely from the article body. Do not add a new Sanity field unless necessary.

## Design

- Match the clean editorial appearance of the reference.
- Use the project's existing Outfit typography.
- White background.
- Rounded article images.
- Strong title hierarchy.
- Subtle secondary metadata text.
- No unnecessary shadows, gradients, cards, or decorative effects.
- Keep image aspect ratios consistent and prevent layout shift.
- Use `next/image` and existing Sanity image utilities.

## Responsive

Desktop should follow the reference closely.

For tablet/mobile:

- Remove the fixed 233px margin and use the project's responsive page padding.
- Stack the featured story above the remaining stories.
- Keep thumbnails and text readable without horizontal overflow.

## Scope

Inspect relevant files under:

- `src/modules/home/components`
- `src/app/[countryCode]/(main)/page.tsx`
- `src/lib/cms/queries.ts`
- `src/lib/cms`
- `sanity/schemaTypes`
- Rider Stories route/components

Do not change Shopify logic, unrelated homepage sections, or the Rider Story URL structure.

Preserve existing CMS fallback/error handling unless it conflicts with this section.

## Verify

Run only:

```bash
npx tsc --noEmit
npm run lint
npm run build
```
````

## Report

Return:

1. Files changed
2. Existing Sanity fields/query reused
3. How latest + next 3 stories are selected
4. Responsive behavior
5. Verification results
6. Any missing CMS field or limitation discovered

```

One important detail I included: the AI IDE should **reuse your existing Sanity `blogPost` pipeline rather than creating a second blog system**, because Rider Stories are already connected to Sanity in the current architecture.
```
