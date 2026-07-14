# SixthGear Docs authoring instructions

## Scope

This repository is a private internal documentation portal for the SixthGear website. Do not treat it as public marketing content.

Pages use MDX with YAML frontmatter. Global theme, branding, navigation, redirects, and integrations live in `docs.json`.

## Audience

Write for business owners, Shopify administrators, content editors, developers, and IT administrators. Explain technical terms when a non-developer may need to act on them.

## Security

Never add passwords, tokens, webhook secrets, OAuth secrets, recovery codes, private keys, customer information, order information, payment details, or `.env` values.

Reference a secret by its approved password-manager vault and item name. Do not copy the value into a page, screenshot, example, issue, or commit.

## Evidence

Read the relevant storefront source before documenting technical behavior. Include important file paths when they help a maintainer verify the statement.

Verify Shopify, Sanity, Vercel, GitHub, DNS, email, billing, and account settings in their external dashboards. Do not guess owners, IDs, domains, roles, scopes, webhook topics, or production settings.

Keep active Strapi usage visible until source usage and production migration are both verified complete.

## Mintlify

Use the installed Mintlify skill and current official Mintlify documentation for components and configuration. Use `docs.json`, never deprecated `mint.json`.

Every published MDX page needs `title` and `description` frontmatter. Use root-relative internal links without file extensions. Add only pages with useful content to navigation.

Run `mint validate`, `mint broken-links --check-anchors --check-redirects`, and `mint a11y` after structural changes.
