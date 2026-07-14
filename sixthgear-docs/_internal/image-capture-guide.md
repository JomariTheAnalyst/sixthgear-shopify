# Image capture guide

This file is excluded from publishing. Add an image to MDX only after the reviewed file exists.

## Storefront home

- **Target page:** `index.mdx`
- **Proposed filename:** `/images/overview/sixthgear-storefront-home.webp`
- **Capture:** Verified production or local SixthGear homepage
- **Show:** Recognizable hero and main navigation
- **Hide or blur:** Personal account information, preview toolbars and development overlays
- **Crop:** Wide 16:9, approximately 1200 x 675
- **Caption:** "SixthGear storefront homepage covered by this guide."
- **Alt text:** "SixthGear storefront homepage with the main hero and navigation."
- **Light/dark versions:** No; use one representative storefront capture

## System architecture

- **Target page:** `website/system-architecture.mdx`
- **Proposed filename:** `/images/overview/system-architecture.png`
- **Create:** Export the reviewed Mermaid diagram if a static asset is needed
- **Show:** Browser, Next.js, Shopify, hosted checkout, Sanity, Strapi, Redis, Vercel and GitHub
- **Hide or blur:** No account or environment identifiers
- **Crop:** Tight landscape diagram with readable labels
- **Caption:** "How SixthGear storefront services connect."
- **Alt text:** "Architecture diagram connecting the customer browser to Next.js, Shopify, Sanity, Strapi, Redis and Vercel."
- **Light/dark versions:** Consider both if the exported background is not transparent

## Add a Shopify product

- **Target page:** `shopify/add-edit-products.mdx`
- **Proposed filename:** `/images/shopify/add-product.png`
- **Capture:** Shopify Admin > **Products** > **Add product**
- **Show:** Title, description, media, pricing, inventory, variants and metafields
- **Hide or blur:** Account avatar, store identifiers, billing information, tokens and private product data
- **Crop:** Product editor area used by the procedure
- **Caption:** "The Shopify product editor contains product, variant and metafield data."
- **Alt text:** "Shopify product editor with product details, pricing, inventory, variants and metafields."
- **Light/dark versions:** No

## Collections

- **Target page:** `shopify/collections.mdx`
- **Proposed filename:** `/images/shopify/collections-list.png`
- **Capture:** Shopify Admin > **Products** > **Collections**
- **Show:** Collection list and manual or automatic collection controls
- **Hide or blur:** Unrelated store information and account controls
- **Crop:** Collection list and type or condition area
- **Caption:** "Collections control product groupings used by the storefront."
- **Alt text:** "Shopify Collections page showing collection records and collection controls."
- **Light/dark versions:** No

## Metafield definitions

- **Target page:** `shopify/metafields.mdx`
- **Proposed filename:** `/images/shopify/metafield-definitions.png`
- **Capture:** Shopify Admin > **Settings** > **Custom data** > **Products**
- **Show:** SixthGear product metafield definitions and namespace/key information
- **Hide or blur:** Secret values, unrelated accounts and private store information
- **Crop:** Definition list and selected definition fields
- **Caption:** "Product metafield definitions must match the namespaces and keys used by code."
- **Alt text:** "Shopify product metafield definitions with field names, namespaces and keys."
- **Light/dark versions:** No

## Product import

- **Target page:** `shopify/bulk-import.mdx`
- **Proposed filename:** `/images/shopify/product-import-dialog.png`
- **Capture:** Shopify Admin product import workflow
- **Show:** CSV upload and import review interface
- **Hide or blur:** Local file paths with personal information, emails and store identifiers
- **Crop:** Import dialog and review controls
- **Caption:** "Review the CSV import summary before starting a bulk product import."
- **Alt text:** "Shopify product CSV import dialog with upload and review controls."
- **Light/dark versions:** No

## Sanity Studio navigation

- **Target page:** `sanity/open-cms.mdx`
- **Proposed filename:** `/images/sanity/studio-navigation.png`
- **Capture:** SixthGear CMS at `/studio`
- **Show:** Blog, Homepage Settings, Marketing, Services Page, About Page and Services
- **Hide or blur:** Personal account menu and unnecessary project identifiers
- **Crop:** Studio navigation and document workspace
- **Caption:** "SixthGear CMS organizes core singletons and content lists in Studio."
- **Alt text:** "Sanity Studio navigation for SixthGear CMS."
- **Light/dark versions:** Only if both Studio modes are part of the standard workflow

## Sanity content editor

- **Target page:** `sanity/edit-publish-content.mdx`
- **Proposed filename:** `/images/sanity/edit-homepage-content.png`
- **Capture:** A representative homepage document
- **Show:** Editable fields, image field, validation and **Publish** control
- **Hide or blur:** Personal account menu, private project IDs and confidential campaign content
- **Crop:** Fields used by the procedure and publish status
- **Caption:** "Review fields and validation before publishing a Sanity document."
- **Alt text:** "Sanity document editor with homepage fields, validation and Publish control."
- **Light/dark versions:** No

## Vercel deployments

- **Target page:** `deployment/deploy-through-vercel.mdx`
- **Proposed filename:** `/images/deployment/vercel-deployments.png`
- **Capture:** Verified Vercel project deployment list
- **Show:** Production and Preview status, commit reference and deployment state
- **Hide or blur:** Account email, team billing, environment values and private URLs when required
- **Crop:** Deployment list and relevant status controls
- **Caption:** "Use the Vercel deployment list to confirm environment and release status."
- **Alt text:** "Vercel deployment list showing Production and Preview deployment states."
- **Light/dark versions:** No
