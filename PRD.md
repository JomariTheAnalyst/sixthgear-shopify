# Product Requirements Document (PRD)

**Project**: Sixthgear Moto Headless Storefront
**Tech Stack**: Next.js 15, Shopify Storefront API, Strapi CMS, Tailwind CSS

---

## 1. Product Overview

Sixthgear Moto Supply & Café requires a premium, unified digital storefront. The platform must combine retail e-commerce (motorcycle parts/gear), service bookings (garage maintenance, repairs), and a café menu into a single, cohesive brand experience. By adopting a Headless Commerce architecture (Shopify backend + Next.js frontend), the project aims to deliver sub-second page loads and bespoke UI/UX animations that a standard Shopify theme cannot efficiently provide.

## 2. Target Audience

- Motorcycle enthusiasts and riders looking for premium retail parts.
- Existing customers needing to easily book maintenance/repair services.
- Local community members interested in the Sixthgear Café offerings.

## 3. Core Objectives

- **Performance**: Achieve 90+ Lighthouse scores for mobile and desktop indexing.
- **Conversion**: Provide a frictionless, bug-free add-to-cart and checkout flow.
- **Brand Identity**: Implement custom Framer-like animations and cinematic layouts.
- **Maintainability**: Ensure a strictly typed (TypeScript) and modular codebase.

## 4. Key Workflows & Features

### 4.1. Retail Commerce (Shopify Integrated)

- **Product Listing**: Fetch collections and products dynamically via Shopify GraphQL.
- **Product Details**: Handle complex variants (color, size) mapped accurately to Shopify Variant IDs.
- **Cart Management**:
  - Slide-out Cart Drawer.
  - Server-Action powered mutations (Add, Update, Remove).
  - Secure, format-validated cookie-based cart persistence.
- **Checkout**: Seamless handoff to Shopify's secure, hosted checkout page.

### 4.2. Services & Bookings (Strapi CMS Integrated)

- **Service Catalog**: Headless delivery of available garage services and pricing.
- **Dynamic Content**: Manage testimonials, team members, and FAQs flexibly via Strapi without redeploying code.

### 4.3. User Accounts

- **Profile Management**: Secure Login/Register flows.
- **Order Tracking**: Allow users to view past retail or service orders seamlessly.

## 5. Technical Requirements

- **Framework**: Next.js 15 (App Router).
- **Rendering**: Heavy use of React Server Components (RSC) to minimize Client JS bundles.
- **Content Delivery**: Edge networking for static assets integration.
- **State Management**: Zustand (Memory-only for UI state; stripped of persistence layers to avoid cookie collisions).
- **Styling**: Tailwind CSS v3 with Lucide React icons.

## 6. Testing & Quality Assurance

- **Type Checking**: Strict TypeScript validation (`npx tsc --noEmit`).
- **End-to-End**: Playwright test suites spanning critical conversion paths (Add to Cart -> Checkout Redirect).
- **Error Boundaries**: Graceful failure states engineered for expired carts, invalid JSON state dumps, or network timeouts.

## 7. Success Metrics

- 0 TypeScript errors on enterprise build configurations.
- 100% success rate on the Add-to-Cart -> Checkout redirect test flow.
- Seamless hydration with zero UI tearing or layout shift on initial page load.
