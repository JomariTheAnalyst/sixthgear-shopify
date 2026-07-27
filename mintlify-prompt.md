
# Build the Shopify Products documentation foundation

## Role

Act as a senior documentation engineer specializing in Shopify Admin, headless Shopify storefronts, Next.js, and Mintlify MDX.

Prepare the complete documentation foundation for managing SixthGear products.

The Mintlify documentation skill is already installed in this workspace. Read and follow the installed skill before editing. Use only currently supported Mintlify components, frontmatter, navigation, and MDX syntax.

Do not write generic documentation or invent store settings.

---

# Project

Storefront project:

```text
C:\Users\Jomari\Documents\sixthgear\sixthgear-shopify
````

Mintlify documentation project:

```text
C:\Users\Jomari\Documents\sixthgear\sixthgear-shopify\sixthgear-docs
```

Existing Shopify Admin documentation:

```text
docs/shopify-admin/
```

Existing overview page:

```text
docs/shopify-admin/overview.mdx
```

Architecture:

* Shopify owns products, variants, prices, inventory, collections, customers, checkout, and commerce data.
* The customer-facing storefront is a headless Next.js application.
* The Shopify Horizon theme is not the live storefront.
* Storefront product data is fetched through Shopify APIs.
* Product and metafield documentation must match both Shopify Admin and the current Next.js consumer code.

---

# Goal

Create the Products documentation category and complete a read-only audit of:

* Shopify product fields
* Product organization
* Sales-channel publishing
* Variants and inventory
* Product media requirements
* SEO and URL handles
* Product metafield definitions
* Metafields consumed by the Next.js storefront
* App-managed metafields
* Bulk product workflows
* Common product visibility failures

Do not write the final detailed walkthroughs yet.

This phase creates the structure and gathers verified information so the later documentation is accurate.

---

# Step 1 — Read before writing

Read:

```text
sixthgear-docs/docs.json
sixthgear-docs/AGENTS.md
sixthgear-docs/STYLE_GUIDE.md
sixthgear-docs/docs/shopify-admin/overview.mdx
sixthgear-shopify/package.json
sixthgear-shopify/.env.example
sixthgear-shopify/src/lib/shopify/
sixthgear-shopify/src/lib/data/
sixthgear-shopify/src/modules/products/
sixthgear-shopify/src/modules/store/
sixthgear-shopify/src/app/[countryCode]/
```

Search the storefront repository for:

```text
metafield
metafields
namespace
productType
vendor
tags
availableForSale
compareAtPrice
selectedOptions
variants
inventoryQuantity
collections
Storefront API
productByHandle
productsQuery
```

Inspect the installed Mintlify skill before creating components or changing navigation.

Do not read or expose secret environment values.

---

# Step 2 — Create the Products navigation group

Under the existing **Shopify Admin** category, add:

```text
Products
├── Products overview
├── Add a product
├── Edit a product
├── Product media
├── Variants, pricing, and inventory
├── Organization and sales channels
├── SEO and URL handles
├── Product metafields
├── Bulk edit and import
└── Product troubleshooting
```

Use these files:

```text
docs/shopify-admin/products/overview.mdx
docs/shopify-admin/products/add-product.mdx
docs/shopify-admin/products/edit-product.mdx
docs/shopify-admin/products/product-media.mdx
docs/shopify-admin/products/variants-inventory.mdx
docs/shopify-admin/products/organization-publishing.mdx
docs/shopify-admin/products/product-seo.mdx
docs/shopify-admin/products/product-metafields.mdx
docs/shopify-admin/products/bulk-management.mdx
docs/shopify-admin/products/troubleshooting.mdx
```

Do not create duplicate pages if equivalent files already exist.

---

# Step 3 — Add frontmatter only to unfinished pages

Create each page with accurate frontmatter and one internal MDX status comment.

Do not fill these pages with generic prose.

## Products overview

```yaml
---
title: Products overview
description: Understand how SixthGear products are organized, published, and displayed on the headless storefront.
icon: boxes-stacked
---
```

## Add a product

```yaml
---
title: Add a product
description: Add a complete product to Shopify and verify that it appears correctly on the SixthGear storefront.
icon: square-plus
---
```

## Edit a product

```yaml
---
title: Edit a product
description: Update an existing product without disrupting pricing, inventory, variants, or storefront visibility.
icon: pen-to-square
---
```

## Product media

```yaml
---
title: Product media
description: Prepare, upload, arrange, and maintain product images, videos, and alternative text.
icon: images
---
```

## Variants, pricing, and inventory

```yaml
---
title: Variants, pricing, and inventory
description: Manage product options, SKUs, prices, stock, and location-level inventory.
icon: layer-group
---
```

## Organization and sales channels

```yaml
---
title: Organization and sales channels
description: Organize products and control where they are available for sale.
icon: share-nodes
---
```

## SEO and URL handles

```yaml
---
title: SEO and URL handles
description: Manage product search listings, URL handles, and redirects.
icon: magnifying-glass
---
```

## Product metafields

```yaml
---
title: Product metafields
description: Understand the custom, Shopify-standard, and app-managed data attached to SixthGear products.
icon: brackets-curly
---
```

## Bulk edit and import

```yaml
---
title: Bulk edit and import
description: Update multiple products safely through Shopify bulk editing and CSV workflows.
icon: file-csv
---
```

## Product troubleshooting

```yaml
---
title: Product troubleshooting
description: Resolve common product publishing, inventory, media, metafield, and storefront visibility problems.
icon: wrench
---
```

After the frontmatter, add only:

```mdx
{/* DOCUMENTATION STATUS
Detailed instructions will be written after the Shopify Products audit is approved.
Do not publish unverified store settings on this page.
*/}
```

The only page that may contain additional public content during this phase is `products/overview.mdx`.

---

# Step 4 — Create the Products overview page

Build:

```text
docs/shopify-admin/products/overview.mdx
```

Keep it concise and useful.

Include:

## What Products controls

Explain in no more than two short paragraphs:

* Shopify is the source of truth for products, variants, prices, inventory, and product availability.
* The headless Next.js storefront reads this information through Shopify APIs.
* Editing Horizon theme files does not update the live storefront.

## Open Products

Every URL must appear inside a Mintlify `<CodeGroup>`.

Use:

````mdx
{/* Component: CodeGroup */}
<CodeGroup>

```text Products List
https://sixthgearmoto.myshopify.com/admin/products
````

```text Add New Product
https://sixthgearmoto.myshopify.com/admin/products/new
```

</CodeGroup>
```

## Product workflow

Use a supported Mintlify Steps component to show:

1. Create or locate the product.
2. Complete the core product information.
3. Upload and arrange media.
4. Configure variants, prices, and inventory.
5. Add organization fields and metafields.
6. Choose status and sales-channel availability.
7. Save the product.
8. Verify it on the live SixthGear storefront.

## Products guide

Use a `<CardGroup>` linking to the nine supporting Products pages.

Do not create links to files that are not included in the final navigation.

## Important publishing rule

Use a `<Warning>` explaining:

* An Active product may still be missing from the storefront if it is unavailable to the required sales channel.
* Staff must verify both product status and publishing availability.
* The exact required headless sales channel must be confirmed in the Shopify dashboard before the detailed publishing guide is finalized.

## Screenshot placeholder

Use the shared placeholder:

```text
/images/placeholders/screenshot-reserved.svg
```

Wrap it in a `<Frame>`.

Add:

```mdx
{/* REPLACE SCREENSHOT
Final file: /images/shopify/products/products-list.png
Capture: Shopify Admin → Products
Show: Product list, status, inventory summary, vendor, and product type where visible
Hide: Personal account information, customer information, notifications, and unrelated browser content
Crop: Main Products workspace only
*/}
```

---

# Step 5 — Create the internal Products audit

Create:

```text
_internal/shopify-products-audit.md
```

Ensure `_internal/` remains excluded through `.mintignore`.

The audit is not public documentation.

Use these sections.

---

## A. Product editor field inventory

Document every field visible or represented in the current Shopify product model.

Include:

| Field                      | Shopify location | Data type | Required | Used by Next.js | Notes |
| -------------------------- | ---------------- | --------- | -------: | --------------: | ----- |
| Title                      |                  |           |          |                 |       |
| Description                |                  |           |          |                 |       |
| Media                      |                  |           |          |                 |       |
| Category                   |                  |           |          |                 |       |
| Product type               |                  |           |          |                 |       |
| Vendor                     |                  |           |          |                 |       |
| Tags                       |                  |           |          |                 |       |
| Collections                |                  |           |          |                 |       |
| Status                     |                  |           |          |                 |       |
| Sales-channel availability |                  |           |          |                 |       |
| SEO title                  |                  |           |          |                 |       |
| SEO description            |                  |           |          |                 |       |
| URL handle                 |                  |           |          |                 |       |

Do not mark a field required unless confirmed by Shopify behavior, the storefront, or an approved SixthGear business rule.

---

## B. Variant and inventory audit

Document:

* Product options used by current products
* Variant fields requested by the storefront
* SKU usage
* Barcode usage
* Price
* Compare-at price
* Availability
* Inventory quantity
* Inventory policy
* Location names requiring dashboard verification
* Variant-specific media
* Weight and shipping fields
* Current out-of-stock behavior

Do not invent an SKU convention.

Do not claim SKU uniqueness is enforced unless verified.

---

## C. Product media audit

Inspect the frontend components and document:

* Product-card image aspect ratio
* Product-detail gallery aspect ratio
* Image container dimensions
* `object-fit` or cropping behavior
* Thumbnail behavior
* Mobile behavior
* Supported video behavior
* Alternative-text usage
* Fallback image behavior
* Recommended image dimensions based on actual layout evidence

Distinguish:

```text
Verified frontend requirement
Recommended editorial standard
Unverified dashboard setting
```

Do not invent fixed image dimensions.

---

## D. Sales-channel audit

Record every sales channel provided by the user:

```text
Online Store
Point of Sale
Sixthgear Moto
Sixthgear Moto Headless 02
Inbox
Facebook & Instagram
```

For each channel, document:

| Channel | Visible in dashboard | Intended use | Required for live Next.js storefront | Publishing rule | Verification status |
| ------- | -------------------: | ------------ | -----------------------------------: | --------------- | ------------------- |

Do not assume:

* `Sixthgear Moto Headless 02` is required
* Inbox needs every product
* Facebook and Instagram should receive every product
* Online Store controls the live headless storefront

Mark all dashboard-dependent claims as requiring verification.

---

## E. Metafield definition audit

Record the proposed custom definitions from the earlier plan:

```text
custom.size_chart
custom.size_chart_data
custom.what_is_in_the_box
custom.product_video_url
custom.specifications
custom.shipping
```

Record proposed Shopify-standard and app-managed definitions separately.

For every definition, verify:

| Display name | Namespace and key | Shopify type | Definition exists | Storefront API access | Used in code | Managed by | Safe to edit |
| ------------ | ----------------- | ------------ | ----------------: | --------------------: | -----------: | ---------- | -----------: |

Search the Next.js codebase for each namespace and key.

Do not publish a definition simply because it exists in Shopify Admin.

Identify whether the storefront:

* Requests it
* Renders it
* Ignores it
* Uses it only through an app
* Requires Storefront API access configuration

Flag suspicious or inconsistent casing, including:

```text
shopify.proTECTIVE-GEAR-FEATURES
```

Do not correct its spelling without dashboard evidence. Mark it for verification.

Do not state that Goodchart manages a field unless its installation and ownership are confirmed.

---

## F. App-managed metafield audit

Investigate these proposed owners:

```text
Judge.me
Shopify Search & Discovery
Goodchart
```

Record:

* Whether the app is referenced in code
* Whether environment variables exist
* Whether the metafield is consumed by the storefront
* Whether staff should avoid manual editing
* What requires dashboard verification

The current repository includes Judge.me-related environment variable names, but do not treat that alone as proof of the live app configuration.

---

## G. Safe example product

Record the proposed example product from the earlier draft:

```text
AKRAPOVIC EVOLUTION TITANIUM&CARBON YZF-R1 15 FULLSYSTEM
```

Proposed values requiring verification:

```text
Product ID: 8233171058762
Vendor: AKRAPOVIC
Product type: Parts and Accessories
SKU: S-Y10E2-HX2C
Price: ₱138,000.00
Inventory: 1
```

Do not put these values in public documentation until confirmed in Shopify Admin.

The audit must state which values were:

```text
Verified
User-provided but unverified
Not found
Outdated
```

Do not expose supplier-sensitive, cost, or customer information.

---

## H. Product count and store snapshot

Record these user-provided values:

```text
Products: 364
Collections: 19
User accounts: 2
Location: Shop location — 1 active
```

Treat these as dashboard snapshots, not permanent documentation rules.

Add the date of verification when they are confirmed.

Do not display changing totals prominently in the Products guides unless the user explicitly approves a dated store snapshot.

---

## I. Required screenshots

Create an image capture plan for:

```text
Products list
Add product button
Product title and description
Product media
Category and organization
Pricing
Inventory
Variants
Shipping
Metafields
Search engine listing
Status
Sales-channel publishing
Bulk editor
CSV import
Product storefront verification
```

For every image, record:

```text
Target page
Final filename
Where to capture it
What to show
What to hide
Recommended crop
Caption
Alt text
```

Use the shared placeholder in public documentation until real screenshots are supplied.

---

# Step 6 — Determine frontend product usage

Create a source mapping inside the internal audit.

For each storefront product field, document:

| Shopify field | GraphQL query or fragment | Type mapping | React consumer | Website location | Fallback |
| ------------- | ------------------------- | ------------ | -------------- | ---------------- | -------- |

At minimum inspect:

```text
Product title
Handle
Description
Description HTML or rich text
Featured image
Gallery images
Price
Compare-at price
Currency
Variants
Selected options
Availability
Vendor
Product type
Tags
Collections
SEO
Metafields
Recommendations
```

Use exact file paths.

Do not paste complete source files into the audit.

---

# Step 7 — Record open decisions

Add an **Owner decisions required** section.

Include:

```text
Which headless sales channel is the production source?
Is Sixthgear Moto Headless 02 still required?
Should every product publish to Online Store?
Should every product publish to Inbox?
Which products may publish to Facebook & Instagram?
What is the approved SKU convention?
What is the approved tag naming convention?
What product image dimensions should staff follow?
Which metafields are mandatory?
Is the AKRAPOVIC product approved as the documentation example?
Should dynamic counts appear in public documentation?
```

Do not choose answers on behalf of the owner.

---

# Documentation style

Follow the installed Mintlify skill and project style guide.

Use:

* Direct language
* Active voice
* Short paragraphs
* Exact Shopify labels
* Sentence-case headings
* Tables for audit data
* Components only when useful
* MDX comments identifying every Mintlify component

Every visible URL must appear inside a `<CodeGroup>`.

Do not use:

* Raw URLs
* Generic filler
* Marketing language
* Open-ended statements
* Unverified dashboard claims
* Placeholder instructions visible to normal readers
* Unsupported Mintlify components
* AI-style wording

---

# Scope restrictions

Do not:

* Write the final detailed `Add a product` guide
* Write the final metafields guide
* Write the Collections category
* Modify Shopify data
* Modify product records
* Modify metafield definitions
* Modify sales-channel configuration
* Modify the Next.js application
* Modify Sanity
* Read secret values
* Add real account emails
* Add tokens or credentials
* Delete existing documentation
* Rewrite the completed Shopify Admin overview

This phase is documentation structure plus read-only investigation only.

---

# Verification

Run:

```powershell
mint validate
mint broken-links --check-anchors --check-redirects
mint a11y
mint dev --port 3333
```

Also run the existing non-destructive project checks needed to confirm source inspection did not break the storefront.

Verify:

```text
[ ] Products navigation group exists
[ ] All ten Products pages exist
[ ] Unfinished pages contain frontmatter and status comments only
[ ] Products overview contains useful public content
[ ] Every public URL is inside a CodeGroup
[ ] Every Mintlify component has an inline component comment
[ ] Shared placeholder image renders
[ ] Internal audit is excluded from publishing
[ ] No unverified metafield is stated as fact
[ ] No unverified sales-channel rule is stated as fact
[ ] No storefront file was modified
[ ] No Shopify data was changed
[ ] No secrets were read or exposed
[ ] Mintlify validation passes
[ ] Broken-link validation passes
[ ] Accessibility validation passes
[ ] Local preview returns HTTP 200
```

---

# Required completion report

Return the following.

## Files created

List every Products documentation file.

## Files modified

List every existing file changed, including `docs.json` when applicable.

## Products navigation

Show the final navigation tree.

## Public overview

Summarize the completed `products/overview.mdx` sections and components.

## Frontend findings

Summarize which Shopify product fields the Next.js storefront currently consumes.

## Metafield findings

Separate findings into:

```text
Verified and consumed
Verified but not consumed
App-managed
User-provided but unverified
Not found
Requires dashboard verification
```

## Sales-channel findings

State what can be confirmed from the repository and what still requires Shopify Admin verification.

## Image findings

Report:

* Frontend image behavior
* Recommended dimensions supported by evidence
* Every required screenshot
* Placeholder usage

## Owner decisions required

List all unresolved operational decisions without choosing an answer.

## Validation

Report:

```text
Mintlify validation
Broken links
Accessibility
Local preview
Missing assets
Secret scan
```

## Application integrity

Confirm that:

* No storefront source file was modified
* No Shopify product was changed
* No Shopify setting was changed
* No Sanity file was modified
* No secret value was read or exposed

```

After this phase is approved, the next implementation task should be the complete **Add a product** walkthrough using the verified audit results.
```
