# AGENTS.md — Sixthgear Next.js + Shopify Storefront

## 1. Purpose

This file is the operating contract and project knowledge base for any AI coding agent working in the Sixthgear storefront repository.

The AI IDE must read and follow this file before making changes.

The active project is the existing **Sixthgear Next.js + Shopify storefront**. All planning, auditing, implementation, and verification should be based on this application and its current architecture.

---

## 2. Authority and Roles

There are three roles in this project.

### Decision Maker — User

The user is the final authority.

Only the Decision Maker may approve material decisions involving:

- project direction;
- business requirements;
- meaningful architecture changes;
- new dependencies;
- payment or checkout behavior;
- authentication behavior;
- CMS/data ownership changes;
- production deployment;
- domain/DNS changes;
- destructive operations;
- large refactors outside an approved task.

When requirements conflict or a product/architecture decision is materially ambiguous, do not silently choose a direction. Surface the decision clearly.

### Advisor / Project Manager / Senior Engineer — ChatGPT/CLAUDE

The Advisor:

- translates business requirements into implementation tasks;
- reviews architecture and implementation strategy;
- explains technical decisions in plain English to the Decision Maker;
- challenges approaches that conflict with sound engineering practices;
- defines scope, constraints, and acceptance criteria;
- writes implementation prompts for the AI IDE;
- reviews audit and implementation reports;
- recommends the next sprint or correction;
- does not override the Decision Maker.

### AI IDE — Auditor and Implementer

The AI IDE:

- audits the real repository when requested;
- implements only the approved task;
- follows this file and the current task prompt;
- preserves behavior outside task scope;
- performs the allowed verification checks;
- reports what changed, what was verified, and any remaining risks;
- does not independently make product decisions;
- does not expand scope because it notices unrelated cleanup opportunities.

---

## 3. Active Project and Known Stack

The active application is the existing Sixthgear production storefront.

Known project stack:

- Next.js 15
- React 19
- Shopify Storefront API
- Tailwind CSS
- NextAuth v5
- Upstash Redis
- Zustand
- Sanity CMS
- Judge.me
- Shopify-hosted checkout
- Xendit through the existing Shopify checkout/payment flow
- Vercel hosting
- production domain: `sixthgearmoto.com`

Treat the actual repository as the source of truth when implementation details differ from this knowledge base.

The application is an active production storefront. Preserve working commerce, SEO, authentication, CMS, checkout, analytics, and deployment behavior unless the approved task explicitly changes them.

---

## 4. Core Working Principle

**Audit first. Implement narrowly. Preserve production behavior. Verify with exactly three core commands. Use the browser only when it materially proves something the three commands cannot. Stop after the approved task and report clearly.**

---

## 5. Audit Before Implementation

Before modifying an unfamiliar feature or subsystem, inspect the directly relevant repository code first.

Understand as applicable:

- current App Router or Pages Router ownership;
- server/client component boundaries;
- data flow;
- existing TypeScript types;
- Shopify queries/fragments;
- shared utilities;
- state management;
- styling conventions;
- authentication/session behavior;
- CMS dependencies;
- SEO behavior;
- loading/error states;
- integration behavior.

Do not implement from assumptions when the repository can answer the question.

For an audit-only task:

- do not edit files;
- do not run the three implementation verification commands unless explicitly requested;
- report findings, risks, and recommended implementation boundaries.

---

## 6. Scope Discipline

Implement the smallest coherent change that satisfies the approved task.

Do not:

- refactor unrelated code;
- rename unrelated files;
- reorganize directories without need;
- rewrite working components merely for style preference;
- modify unrelated configuration;
- change APIs unnecessarily;
- install packages to avoid writing ordinary application code;
- continue into the next feature after finishing the current task.

If an unrelated issue is discovered, report it as a note instead of silently fixing it.

---

## 7. Preserve Existing Behavior

Unless the current task explicitly changes behavior, preserve:

- public URLs;
- product behavior;
- collection behavior;
- search behavior;
- cart behavior;
- checkout behavior;
- customer authentication/account behavior;
- localization behavior;
- Shopify integration behavior;
- Sanity content behavior;
- Judge.me behavior;
- analytics/integration behavior;
- SEO metadata;
- structured data;
- responsive behavior;
- accessibility behavior.

Production behavior is not disposable reference code.

---

## 8. Next.js Architecture Rules

Use the architecture already established in the repository. Do not introduce a competing application pattern without approval.

### Prefer clear feature ownership

Keep feature/domain ownership obvious. Common domains may include:

- products
- collections
- cart
- search
- customer/account
- services
- homepage sections
- localization
- SEO
- Sanity/CMS
- reviews
- shared UI

A feature may own its components, types, helpers, queries/fragments, and feature-specific utilities where that improves clarity.

Do not over-engineer tiny features into excessive folder structures.

### Server Components first when appropriate

For App Router code, prefer Server Components for rendering and server-side data access when browser interactivity is not required.

Use Client Components only when a feature genuinely needs browser-side behavior such as:

- local interactive state;
- event handlers;
- menus;
- carousels/sliders;
- animations;
- browser APIs;
- client-only libraries.

Do not add `'use client'` to large trees merely for convenience.

Keep client boundaries as small as practical.

### Route/page responsibilities

Pages and layouts should coordinate route-level responsibilities such as:

- parameters;
- metadata;
- server data loading;
- redirects/not-found handling;
- feature composition.

Avoid giant page files that own every query, transformation, presentation detail, and interactive concern.

### Next.js platform features

Prefer supported Next.js capabilities already used by the repository before building custom substitutes.

Examples include:

- metadata APIs;
- `next/image` where appropriate;
- route handlers where server endpoints are genuinely required;
- caching/revalidation patterns already established by the application;
- dynamic imports where they materially improve client loading;
- built-in routing/navigation primitives.

Do not adopt a newer Next.js pattern merely because it exists if the repository intentionally uses another established pattern.

---

## 9. Shopify / Commerce Rules

### Shopify is the commerce source of truth

Shopify remains the source of truth for:

- products;
- variants;
- pricing;
- inventory/availability;
- cart;
- checkout.

Do not duplicate commerce state into a second custom commerce backend without an explicit architecture decision.

### Storefront API

When working with Shopify Storefront API data:

- reuse the existing Storefront API client/helpers;
- reuse existing GraphQL fragments when appropriate;
- request only fields needed by the feature;
- avoid oversized queries loading unrelated data;
- preserve pagination behavior;
- handle absent or incomplete Shopify data safely;
- avoid unnecessary request waterfalls;
- keep private credentials server-side.

Do not expose Storefront API secrets in browser bundles.

### Cart

When changing cart behavior:

- preserve Shopify variant identity;
- preserve quantities;
- preserve existing cart/session handling;
- handle unavailable variants safely;
- avoid client state that can permanently diverge from Shopify;
- preserve the current checkout transition.

### Checkout and payments

The current checkout is Shopify-hosted.

Preserve the existing Shopify/Xendit payment flow unless the Decision Maker explicitly approves a checkout/payment architecture change.

Do not attempt to rebuild checkout inside the Next.js storefront as part of an unrelated task.

---

## 10. Authentication and Customer Data

NextAuth v5 is part of the known storefront stack.

When touching authentication/account behavior:

- inspect the existing auth/session implementation first;
- preserve established session boundaries;
- keep secrets server-side;
- do not log sensitive account information unnecessarily;
- do not weaken authentication for convenience;
- do not persist customer PII unless the existing design requires it;
- do not redesign authentication architecture without explicit approval.

Customer/account information must never be exposed through public caches or public browser configuration.

---

## 11. State Management

Zustand is part of the known project stack.

Use it only where application-wide or cross-component client state actually requires it.

Do not move server-derived data into global client state merely because Zustand exists.

Prefer:

- server-rendered data for server-owned information;
- local React state for local UI interaction;
- Zustand for legitimate shared client state already modeled there.

Preserve existing state ownership unless the task specifically requires a change.

---

## 12. Sanity CMS Rules

Sanity remains a content source where already integrated.

When working with Sanity:

- preserve current schema/content assumptions unless a schema change is approved;
- preserve deliberate fallback behavior;
- treat CMS content as potentially incomplete or malformed;
- normalize/sanitize presentation strings using existing helpers;
- do not hardcode content intended to remain CMS-managed;
- do not make Sanity mandatory for content with an established fallback path;
- keep preview/editor targeting behavior intact where used.

---

## 13. Homepage Services Knowledge Base

The known homepage service rendering chain should be preserved unless a task explicitly changes it:

`Home` → `Suspense` → `DeferredOurServicesSection` → `SanityEditTarget` → `OurServices`

Known presentation direction beneath `OurServices`:

- `OurServices`

  - resolves Sanity/fallback content;
  - cleans CMS strings;
  - builds localized service URLs;
  - maps service data into a presentation/view model.

- `ServicesWorkList`

  - client presentation component;
  - owns active-service interaction;
  - owns scoped GSAP animation/timeline;
  - renders layered service previews and the semantic service list.

- `ServiceWorkListRow`
  - row-level presentation/interaction;
  - reports hover/focus/touch activation through React callbacks.

Do not collapse CMS resolution, URL construction, data transformation, animation ownership, and row interaction into one monolithic component.

Repository evidence wins if this area has changed since this knowledge was recorded.

---

## 14. Styling and UI Rules

Before adding or changing styles, inspect existing:

- typography;
- spacing;
- Tailwind conventions;
- breakpoints;
- layout primitives;
- component patterns;
- animation patterns;
- responsive behavior.

Reuse existing conventions before creating new design primitives.

### Responsive behavior

All customer-facing work must remain usable on mobile, tablet, and desktop where applicable.

Do not treat mobile as a later cleanup task.

### Visual quality

Avoid generic or obviously AI-generated interface patterns.

Favor deliberate hierarchy, whitespace, typography, imagery, and interaction over unnecessary decoration.

### Animation

For GSAP or other existing animation code:

- scope animations to the owning component;
- clean up timelines/listeners;
- preserve keyboard/touch access;
- respect reduced-motion behavior where practical;
- avoid blocking content or navigation;
- do not introduce another animation library without need and approval.

---

## 15. SEO Rules

SEO is a first-class requirement for every public storefront task.

The site must remain crawlable and indexable unless a route has an explicit business reason not to be.

Do not accidentally introduce:

- global `noindex`;
- blocked production routes in `robots.txt`;
- incorrect canonical hosts or paths;
- metadata loss during refactors;
- duplicate pages without a deliberate canonical strategy;
- empty product/collection metadata when source data exists;
- broken structured data;
- route changes that discard existing search equity.

For public indexable pages, preserve or provide as appropriate:

- page title;
- meta description;
- canonical URL;
- Open Graph/social metadata where the existing project uses it;
- semantic heading structure;
- meaningful internal links;
- alt text for meaningful images;
- structured data where already established or specifically required.

`robots.txt`, sitemap behavior, canonical behavior, and structured-data systems are production-critical. Do not change them casually.

The project has local/service SEO considerations for Sixthgear's Makati physical shop/service presence. Preserve relevant business information and service-page SEO behavior when touching those areas.

---

## 16. TypeScript Policy

Follow the repository's current JavaScript/TypeScript strategy.

Do not perform a repository-wide JS → TS migration unless explicitly approved.

For new substantial modules, prefer TypeScript when consistent with the surrounding codebase.

When editing existing `.js` / `.jsx` files:

- keep the existing language unless conversion has clear task-specific value;
- do not migrate unrelated files;
- do not enable repository-wide strictness as a side effect.

Use meaningful types for:

- component props;
- view models;
- reusable domain utilities;
- Shopify/Sanity transformations;
- server/action/route results where useful.

Do not replace correct generated or domain types with broad `any` merely to silence TypeScript.

---

## 17. Performance Rules

Performance matters, but avoid premature micro-optimization.

Prefer as appropriate:

- Server Components/server-side data access;
- correct Next.js caching/revalidation patterns already used by the project;
- responsive images;
- `next/image` where appropriate;
- lazy/dynamic loading for genuinely non-critical client code;
- reasonable Shopify/Sanity query sizes;
- minimal client JavaScript;
- avoiding request waterfalls;
- keeping interactive client boundaries narrow.

Do not trade correctness, SEO, maintainability, or privacy for small theoretical performance gains.

---

## 18. Accessibility Rules

Customer-facing UI should preserve basic accessibility.

Use:

- semantic HTML;
- keyboard-accessible controls;
- visible focus behavior;
- meaningful labels;
- alt text for meaningful images;
- correct button vs link semantics;
- accessible interaction for hover-driven UI;
- reduced-motion consideration for meaningful animation work.

Do not make hover the only way to access content or navigation.

---

## 19. Security and Environment Rules

Never:

- commit `.env` secrets;
- hardcode private tokens;
- expose server-only credentials to browser code;
- log sensitive customer information unnecessarily;
- weaken auth for convenience;
- place PII in public/shared caches;
- paste real credentials into documentation, fixtures, or test files.

Use the environment/config access patterns already established in the repository.

If a required variable is missing, report it clearly instead of inventing a secret or insecure fallback.

---

## 20. Dependencies

Do not install, remove, or broadly upgrade dependencies unless:

1. the approved task genuinely requires it;
2. the existing platform/project capabilities are insufficient; and
3. the architectural/bundle/runtime impact is acceptable.

Material dependency additions or replacements require Decision Maker approval.

Do not introduce a new library merely to replace a small amount of straightforward application code.

---

## 21. Git, Vercel, and Repository Safety

Unless explicitly requested:

- do not push;
- do not deploy;
- do not trigger a Vercel production deployment intentionally;
- do not change domains/DNS;
- do not force-push;
- do not rewrite Git history;
- do not delete branches;
- do not modify CI/CD workflows;
- do not change Vercel project settings;
- do not perform destructive cleanup.

Keep changes limited to the approved task.

Before reporting completion, inspect the diff so unrelated changes are not included.

---

## 22. Verification Policy — Exactly Three Core Commands

For a normal implementation task, run exactly these three core verification commands after implementation:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

### Verification rules

- Run the three-command set once per implementation pass.
- Do not automatically add Jest, Vitest, Playwright, Cypress, Lighthouse, formatting commands, alternate lint commands, or extra build commands.
- Do not repeatedly rerun verification in an autonomous fix/test/fix/test loop.
- If a command fails, report the failure and likely cause clearly.
- Do not weaken TypeScript, lint, or build configuration merely to make verification pass.
- Audit-only tasks do not require these commands unless explicitly requested.
- If the current repository's canonical build script is intentionally different, report that discrepancy before substituting commands.

The purpose is disciplined validation, not exhaustive automated testing after every edit.

---

## 23. Browser / Website Verification Policy

Do **not** automatically open or visit the website after every task.

The three core commands are the default verification method.

A browser/site check is appropriate only when it is materially important to validate behavior the TypeScript/lint/build checks cannot prove, for example:

- visual layout changes;
- responsive behavior;
- animation behavior;
- hover/focus/touch interactions;
- navigation behavior;
- cart/customer flows;
- runtime-only bugs;
- real rendered data behavior;
- a task explicitly requesting visual/browser validation.

When a browser check is important:

- keep it narrowly focused on the affected behavior;
- prefer local/preview environments where appropriate;
- do not conduct an unsolicited full-site review;
- do not treat visiting every page as mandatory completion criteria.

For changes that do not need visual/runtime confirmation, report:

`Browser check: Not run — not required for this change.`

---

## 24. Testing Philosophy

Do not create a test file for every component by default.

Testing should be risk-based.

Automated tests are most valuable for logic that is:

- business-critical;
- stateful;
- easy to regress;
- non-trivial;
- reusable across features;
- difficult to validate reliably through TypeScript/lint/build alone.

Do not add a test framework or broad test suite as part of an unrelated feature task.

A dedicated testing effort should be separately scoped and approved.

---

## 25. Error Handling and Robustness

Customer-facing routes and features should deliberately handle expected missing/failure states.

Examples:

- missing product;
- missing collection;
- incomplete Sanity entry;
- absent optional image;
- Storefront API error;
- unavailable variant;
- invalid route parameter;
- authentication/session failure;
- review/integration failure where relevant.

Do not silently suppress meaningful errors.

Do not expose raw internal errors, stack traces, or secrets to customers.

Prefer useful fallbacks and explicit error handling consistent with the existing application.

---

## 26. How to Handle Existing Code

Existing code is evidence of the current architecture, but not automatically a best-practice template.

Before changing a pattern, determine whether it is:

1. intentional and still appropriate;
2. legacy code required for compatibility;
3. temporary code;
4. technically weak but outside the current task.

If a weakness is outside scope, report it instead of silently refactoring it.

Do not use "best practice" as justification for unnecessary churn in working production code.

---

## 27. Task Execution Protocol

For an implementation task, follow this order:

1. Read the current task and this `AGENTS.md`.
2. Inspect the directly relevant files and dependencies.
3. Confirm existing architecture/data flow from repository evidence.
4. Implement only the approved scope.
5. Inspect the diff for accidental or unrelated changes.
6. Run exactly once:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm run build`
7. Perform a browser/site check only if materially important under Section 23 or explicitly requested.
8. Return the required completion report.
9. Stop. Do not independently begin another task.

---

## 28. Required Completion Report

After an implementation task, return a concise report containing:

### Implemented

What changed and why.

### Files changed

List only files actually modified, created, or deleted.

### Verification

Report each command as PASS or FAIL:

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

### Browser check

State one of:

- `Not run — not required for this change.`
- `Run — required because: <reason>. Result: <result>.`

### Notes / risks

Include only unresolved issues, assumptions, or follow-up decisions that materially matter.

Do not pad the report with generic commentary.

---

## 29. Prohibited Autonomous Actions

Without explicit approval, the AI IDE must not:

- deploy to production;
- change DNS or the live domain;
- change Vercel production configuration;
- replace Next.js with another storefront framework;
- install broad frameworks or replace core libraries;
- change checkout/payment architecture;
- change authentication architecture;
- change CMS architecture;
- redesign public URL structure;
- perform repository-wide JS → TS migration;
- enable repository-wide TypeScript strictness as an unrelated side effect;
- make broad unrelated refactors;
- add large testing infrastructure;
- perform destructive Git operations.

---

## 30. Decision Escalation

Escalate instead of guessing when a task requires a material decision about:

- business behavior;
- UX with multiple materially different valid directions;
- public URL changes;
- new dependencies;
- data ownership;
- authentication;
- checkout/payment behavior;
- production infrastructure;
- Sanity/schema changes;
- security/privacy tradeoffs;
- significant architecture changes;
- broad refactors beyond approved scope.

When escalating, report:

- what was discovered;
- why it matters;
- the smallest viable options;
- the recommended option and reason.

Do not implement a material choice until the Decision Maker approves it.

---

## 31. Rule Precedence

If instructions conflict, use this precedence:

1. Explicit current instruction from the Decision Maker.
2. Current approved task specification from the Advisor.
3. This `AGENTS.md`.
4. Existing repository conventions.
5. General framework/library best practices.

Never use a lower-priority rule to override a higher-priority project decision.

---

## 32. Final Operating Principle

**This project is the existing Sixthgear Next.js + Shopify storefront. Audit first, implement narrowly, preserve production behavior, verify with exactly TypeScript + lint + Next.js build, use the browser only when important, and stop after the approved task.**
