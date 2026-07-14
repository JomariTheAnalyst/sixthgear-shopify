# Refactor the documentation into SixthGear Docs

## Role

Act as a senior technical documentation engineer specializing in Mintlify, Shopify, Sanity, Next.js, Vercel, and internal knowledge bases.

Refactor the existing Mintlify project into a direct, detailed, production-quality documentation portal named **SixthGear Docs**.

Do not modify the SixthGear storefront application.

---

# Current documentation

The Mintlify project currently exists at:

```text
C:\Users\Jomari\Documents\sixthgear\sixthgear-shopify\sixthgear-turnover-docs
```

It contains the validated Phase 1 documentation.

The audited storefront is a Next.js headless Shopify application with Sanity, still-active Strapi integrations, Upstash Redis, Vercel, and GitHub Actions. Preserve these verified architectural facts. Do not describe the project as a Shopify Liquid theme.

---

# Step 1 — Install the Mintlify documentation skill (skip this i already done this manually so you dont need to include this in your task)

From the documentation project, run:

```powershell
npx skills add https://mintlify.com/docs
```

This is the official Mintlify documentation skill referenced by the Mintlify Starter repository.

After installation:

* Report which AI-tool files or settings changed.
* Do not install or copy the entire Mintlify Starter repository.
* Do not replace the existing documentation with generic starter content.
* Use the starter and Maple repositories only as references for supported patterns.

---

# Step 2 — Rename the project

Rename the documentation directory to:

```text
sixthgear-docs
```

Use the displayed product name:

```text
SixthGear Docs
```

Update all references to:

```text
SixthGear Turnover Documentation
SixthGear Turnover Portal
Turnover Docs
```

Replace them with natural wording based on context:

```text
SixthGear Docs
SixthGear documentation
Internal documentation
Website administration guide
```

Do not use “turnover” as the main product name.

---

# Step 3 — Apply the Maple theme

Update `docs.json` to use:

```json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "maple",
  "name": "SixthGear Docs"
}
```

Do not blindly copy the complete Maple starter configuration.

Inspect the current SixthGear storefront and reuse its existing:

* Brand colors
* Logo
* Favicon
* Typography where supported
* Visual tone

Use actual project assets where suitable. Do not invent a new brand identity.

Configure separate light and dark logos when matching assets exist.

Set the logo link to the public SixthGear website only when the production URL is verified. Otherwise, keep the normal documentation-home behavior.

Do not enable external AI contextual actions such as:

```text
chatgpt
claude
perplexity
mcp
cursor
vscode
```

For now, either disable the contextual menu or limit it to safe actions such as copying or viewing the page source.

---

# Step 4 — Create persistent writing instructions

Create or update:

```text
AGENTS.md
STYLE_GUIDE.md
```

## `AGENTS.md`

Use the structure recommended by the Mintlify Starter repository, customized for SixthGear.

Include:

* This is a private internal documentation portal.
* Pages use MDX with YAML frontmatter.
* Global configuration lives in `docs.json`.
* The audience includes business owners, Shopify administrators, content editors, developers, and IT administrators.
* Never expose passwords, tokens, recovery codes, private keys, customer information, order information, or `.env` values.
* Read relevant source files before documenting technical behavior.
* Verify external dashboard settings instead of guessing.
* Use the installed Mintlify skill for current component and configuration guidance.

## `STYLE_GUIDE.md`

Require a natural, human-written tone.

### Voice

* Write directly to the reader using “you.”
* Use active voice.
* Sound like an experienced colleague explaining the system.
* Be professional, calm, practical, and specific.
* Explain technical terms when a non-developer may encounter them.
* Use the exact labels shown in Shopify, Sanity, Vercel, GitHub, and the SixthGear website.

### Avoid AI-style writing

Do not use phrases such as:

```text
seamlessly
effortlessly
robust
powerful solution
leverage
unlock
delve into
navigate the complexities
comprehensive suite
it is important to note
in order to
simply
as mentioned earlier
in conclusion
whether you are
this documentation aims to
```

Do not:

* Praise ordinary functionality
* Repeat the introduction in the conclusion
* Add generic summaries after every section
* Use vague marketing language
* Write dense paragraphs
* State obvious information
* Add content only to make a page longer

### Structure

* Use sentence case for headings.
* Do not add a manual H1 inside the page body; use the frontmatter title.
* Keep most sentences below 25 words.
* Keep paragraphs between two and four sentences.
* Cover one main task or reference subject per page.
* Use numbered steps for procedures.
* Use tables for reference information.
* Use code blocks only when readers need to copy code or inspect exact syntax.
* Put file names, paths, commands, environment variables, and code identifiers in backticks.
* Bold exact interface labels, such as **Products**, **Save**, and **Settings**.

### Page types

Choose the correct structure for each page:

#### How-to guide

Use for tasks such as adding a product or deploying the website.

Include:

```text
Purpose
Prerequisites
Steps
Verify the result
Common problems
Related tasks
```

#### Reference

Use for metafield definitions, environment variables, apps, schemas, and accounts.

Prioritize tables, exact values, ownership, dependencies, defaults, and edge cases.

#### Explanation

Use for architecture, collections, caching, revalidation, and the relationship between Shopify and Sanity.

Explain how and why the system works without turning the page into an unnecessary tutorial.

---

# Step 5 — Simplify the public navigation

Remove the Phase 1 or turnover-oriented navigation.

Use this direct information architecture:

```text
Home

Shopify
├── Shopify overview
├── Add and edit products
├── Manage variants and inventory
├── Understand collections
├── Manage product tags
├── Manage metafields
├── Bulk import products
├── Manage discounts and campaigns
└── Shopify apps

Sanity CMS
├── Sanity overview
├── Open SixthGear CMS
├── Edit and publish content
├── Manage images and media
├── Content types
└── CMS fields and validation

Website
├── System architecture
├── Source code overview
├── Important project files
├── Local development
├── Environment variables
├── Shopify integration
├── Sanity integration
├── Strapi integration
├── Caching and revalidation
└── Testing

Deployment
├── Deployment overview
├── Deploy through Vercel
├── Verify a deployment
└── Roll back a deployment

Systems and access
├── Account directory
├── Business email accounts
├── Domains and DNS
├── Roles and permissions
├── Credential security
└── Third-party services

Troubleshooting
├── Website troubleshooting
├── Shopify troubleshooting
├── Sanity troubleshooting
├── Deployment troubleshooting
└── Emergency recovery
```

Do not create every missing page with generic filler. Create the navigation entry only when the corresponding page contains useful content.

---

# Step 6 — Consolidate the old Phase 1 pages

Preserve useful verified information, but reduce unnecessary page fragmentation.

Apply these changes:

| Existing page                           | Action                                                                             |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| `start-here/overview.mdx`               | Merge useful content into `index.mdx`                                              |
| `start-here/how-to-use-this-portal.mdx` | Remove from public navigation and merge only essential guidance into the home page |
| `start-here/documentation-status.mdx`   | Move to internal maintenance notes                                                 |
| `architecture/system-overview.mdx`      | Keep and rename as the main architecture page                                      |
| `architecture/integrations.mdx`         | Split only when a detailed integration page is justified                           |
| `architecture/environments.mdx`         | Merge into local development, deployment, and environment-variable pages           |
| `access/account-register.mdx`           | Keep as the account directory                                                      |
| `access/roles-and-ownership.mdx`        | Merge into roles and permissions                                                   |
| `source-code/repository-overview.mdx`   | Keep and expand                                                                    |
| `source-code/important-file-paths.mdx`  | Merge into the source-code overview unless it becomes too large                    |
| `deployment/production-overview.mdx`    | Merge into deployment overview                                                     |
| `deployment/vercel-deployment.mdx`      | Keep and expand                                                                    |
| `deployment/rollback-overview.mdx`      | Keep and rename to an action-oriented title                                        |
| `recovery/emergency-response.mdx`       | Keep under Troubleshooting                                                         |
| `recovery/access-recovery.mdx`          | Merge into systems access or emergency recovery                                    |
| `turnover/missing-information.mdx`      | Move to internal maintenance notes                                                 |
| `turnover/phase-one-checklist.mdx`      | Remove from public documentation                                                   |

Do not immediately delete a page containing useful information.

First:

1. Identify useful content.
2. Move it to the correct new page.
3. Update internal links.
4. Remove the obsolete page.
5. Update `docs.json`.
6. Run broken-link validation.

Create an internal directory:

```text
_internal/
```

Move authoring notes, missing-information registers, review checklists, and screenshot plans there.

Exclude `_internal/` from publishing through `.mintignore`.

---

# Step 7 — Redesign the home page

Make `index.mdx` a practical landing page, not a generic welcome page.

Use Maple-compatible components.

Include:

* A short description of SixthGear Docs
* Audience-based entry points
* Quick links to Shopify, Sanity CMS, deployment, and troubleshooting
* A security notice stating that passwords and secrets are stored in the approved password manager
* A concise system summary
* A “common tasks” section

Use components such as:

```mdx
<CardGroup cols={2}>
  <Card title="Manage Shopify" icon="shop">
    Add products, manage collections, update metafields, and review apps.
  </Card>

  <Card title="Manage Sanity CMS" icon="pen-to-square">
    Edit homepage content, banners, services, articles, and other CMS content.
  </Card>

  <Card title="Work on the website" icon="code">
    Set up the project locally, review integrations, and understand the source code.
  </Card>

  <Card title="Deploy and recover" icon="rocket">
    Deploy through Vercel, verify production, and roll back a failed release.
  </Card>
</CardGroup>
```

Use icons confirmed to be supported by the installed Mintlify skill.

Do not include decorative cards that do not lead to useful pages.

---

# Step 8 — Add a structured image system

Create:

```text
images/
├── brand/
├── overview/
├── shopify/
├── sanity/
├── website/
├── deployment/
└── troubleshooting/
```

Create an internal image plan:

```text
_internal/image-capture-guide.md
```

For every page that would benefit from an image, add an entry with:

```text
Target page
Proposed filename
Where to capture the image
What the image must show
What must be hidden or blurred
Recommended crop
Required caption
Required alt text
Whether light and dark versions are needed
```

## Initial image plan

### Home page hero

```text
Filename: /images/overview/sixthgear-storefront-home.webp
Capture: SixthGear production or verified local homepage
Show: recognizable SixthGear storefront hero and navigation
Hide: personal account information, preview toolbars, development overlays
Crop: wide 16:9 or approximately 1200 × 675
Purpose: visually identify the website covered by the documentation
```

### System architecture

```text
Filename: /images/overview/system-architecture.png
Create: Mermaid diagram or exported diagram
Show: browser, Next.js, Shopify, Sanity, Strapi, Redis, Vercel
Purpose: explain how the main services connect
```

### Add a Shopify product

```text
Filename: /images/shopify/add-product.png
Capture: Shopify Admin → Products → Add product
Show: title, description, media, pricing, inventory, variants, and metafields
Hide: account avatar, private store details, billing information, tokens
Crop: only the product editor area relevant to the steps
```

### Collections

```text
Filename: /images/shopify/collections-list.png
Capture: Shopify Admin → Products → Collections
Show: collection list and manual or smart collection controls
Hide: unrelated store information
```

### Metafield definitions

```text
Filename: /images/shopify/metafield-definitions.png
Capture: Shopify Admin → Settings → Custom data → Products
Show: SixthGear product metafield definitions
Hide: any secret values or unrelated account information
```

### Bulk import

```text
Filename: /images/shopify/product-import-dialog.png
Capture: Shopify Admin product import workflow
Show: CSV upload and import review interface
Hide: local file paths containing personal information
```

### Sanity Studio

```text
Filename: /images/sanity/studio-navigation.png
Capture: SixthGear CMS at `/studio`
Show: main document types and navigation structure
Hide: personal account menu and private project identifiers when unnecessary
```

### Sanity content editor

```text
Filename: /images/sanity/edit-homepage-content.png
Capture: one representative homepage content document
Show: editable fields, image field, validation, and publish control
Hide: unpublished confidential campaign content when applicable
```

### Vercel deployment

```text
Filename: /images/deployment/vercel-deployments.png
Capture: Vercel project deployment list
Show: Production and Preview deployment status
Hide: account email, team billing, environment values, and private URLs when necessary
```

## Image implementation rules

* Do not reference an image in MDX until the file exists.
* Use root-relative paths such as `/images/shopify/add-product.png`.
* Use PNG for screenshots and diagrams.
* Use WebP for photographs or storefront hero images.
* Use descriptive kebab-case filenames.
* Crop screenshots tightly.
* Do not scale screenshots above their native resolution.
* Include meaningful alt text.
* Use text instructions as the primary explanation; images supplement the steps.
* Wrap instructional screenshots in `<Frame>` with a concise caption.
* Keep every image below Mintlify’s supported file-size limit.
* Never include passwords, tokens, customer data, order details, recovery codes, billing information, or `.env` values.

When an image is not yet available, add an MDX comment such as:

```mdx
{/* IMAGE NEEDED
File: /images/shopify/add-product.png
See: _internal/image-capture-guide.md
*/}
```

Do not add a broken image path or visible “placeholder image” to the published page.

---

# Step 9 — Use Mintlify components intentionally

Use components only when they improve comprehension.

Recommended uses:

* `<Steps>` for Shopify, Sanity, deployment, and recovery procedures
* `<Frame>` for screenshots and diagrams
* `<Warning>` for destructive or security-sensitive actions
* `<Tip>` for practical shortcuts
* `<Info>` for definitions and contextual notes
* `<Accordion>` for optional details and edge cases
* `<Tabs>` only for real alternatives such as local versus production
* `<CardGroup>` for landing-page navigation
* Mermaid for architecture and workflow diagrams
* Markdown tables for accounts, metafields, environment variables, and apps
* Code blocks for exact commands, JSON, GraphQL, GROQ, environment-variable names, and file structures

Do not:

* Put every paragraph inside a component
* Use accordions to hide essential instructions
* Use tabs when there is only one supported workflow
* Add decorative callouts
* Turn normal prose into excessive cards
* Copy sample content from the Maple or Starter repositories

---

# Step 10 — Start the actual detailed documentation

Expand the documentation using verified repository evidence.

Prioritize these pages:

```text
1. Home
2. System architecture
3. Shopify overview
4. Sanity overview
5. Source code overview
6. Local development
7. Environment variables
8. Deployment overview
9. Deploy through Vercel
10. Account directory
11. Credential security
12. Emergency recovery
```

For operational pages that require Shopify, Sanity, Vercel, GitHub, DNS, or other external dashboard access:

* Write only what can be verified.
* Add exact image-capture instructions.
* Mark missing external information in `_internal/`.
* Do not publish large verification tables to normal readers.
* Do not invent interface settings, account emails, owners, IDs, apps, webhook topics, domains, or billing details.

The public documentation must feel like a finished working manual, not an audit report.

---

# Security boundaries

Never add:

```text
Passwords
API token values
Webhook secret values
OAuth secrets
Recovery codes
Private keys
Customer data
Order data
Payment information
Full environment-file contents
Personal phone numbers
Unnecessary personal email addresses
```

Account login emails may be added later only when the user explicitly supplies and approves them.

Use password-manager references instead of secret values.

Do not enable public AI-sharing features without explicit approval.

---

# Verification

Run:

```powershell
mint validate
mint broken-links --check-anchors --check-redirects
mint a11y
mint dev --port 3333
```

Also verify:

* The displayed name is **SixthGear Docs**.
* The Maple theme loads.
* Branding matches the existing SixthGear website.
* Old turnover wording is removed.
* Obsolete pages are removed only after useful content is migrated.
* `_internal/` is excluded from publication.
* No missing image produces a broken page.
* Every published navigation item contains useful content.
* No storefront source file was modified.
* No secrets or private account data were added.
* All pages follow `AGENTS.md` and `STYLE_GUIDE.md`.
* The writing sounds natural and specific, not generated or promotional.

---

# Required completion summary

Return:

## Documentation location

Show the final renamed path.

## Skill installation

Report the installation result and files changed.

## Branding changes

Report the title, theme, colors, logos, favicon, and contextual-menu configuration.

## Navigation changes

Show the final public navigation.

## Consolidated and removed pages

Explain where useful content was moved before deletion.

## Images

List:

* Existing images added
* Images still needed
* The capture instructions created for each missing image

## Writing standards

Confirm that `AGENTS.md` and `STYLE_GUIDE.md` were created and applied.

## Validation

Report results for:

* Mintlify validation
* Broken links
* Accessibility
* Local preview
* Missing assets
* Secret scanning

## Application integrity

Confirm that no storefront application files were modified.
