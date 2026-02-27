# Sixthgear Frontend Architecture & File Structure

This document outlines the folder architecture for the `sixthgear-frontend` Next.js headless storefront, specifically reflecting the migration to the Shopify Storefront API + Payload CMS stack and the recent integration of Upstash Redis for caching and rate-limiting.

> **Note:** Markdown (`.md`) documentation files are intentionally excluded from this structural diagram.

## Root Level

```text
sixthgear-frontend/
├── public/                 # Static assets (images, fonts, favicons) directly served by Next.js
├── src/                    # Primary source code directory for all application logic
├── .env.local              # Local environment variables (Shopify tokens, Redis credentials)
├── next.config.js          # Next.js configuration (Asset host whitelisting, headers, ignoring specific build errors)
├── package.json            # Project dependencies and basic scripts
├── tailwind.config.js      # Tailwind CSS theme, plugins, and custom utility classes
└── tsconfig.json           # TypeScript configuration and path aliases mapping
```

## `src/` Directory Details

The `src` folder strictly follows a split architecture, isolating business logic from React Server Components routing and feature-based UI modules.

```text
src/
├── app/                            # Next.js 15 App Router Core
│   ├── [countryCode]/              # Dynamic segment for Internationalization/Localization
│   │   ├── (main)/                 # Main layout group (Navbar, Footer wrapper)
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── products/           # Product Detail Page (PDP) Route
│   │   │   ├── store/              # Main Product Listing Page Route
│   │   │   ├── cart/               # Full Cart Page Route
│   │   │   ├── collections/        # Specific Collection/Category Route
│   │   │   └── categories/         # Categories nested routing
│   │   ├── (auth)/                 # Authentication layout group
│   │   │   ├── login/              # Login page Route
│   │   │   ├── register/           # Registration page Route
│   │   │   ├── reset-password/     # Password reset Route
│   │   │   └── forgot-password/    # Forgot password request Route
│   │   ├── account/                # Protected user dashboard
│   │   │   ├── addresses/          # Address book CRUD operations
│   │   │   ├── orders/             # Order history
│   │   │   └── profile/            # Customer profile management
│   │   ├── not-found.tsx           # Custom 404 handler
│   │   └── layout.tsx              # Country-code specific layout
│   ├── api/                        # Next.js Route Handlers (Serverless functions)
│   │   ├── health/                 # Redis & System health check endpoint
│   │   ├── revalidate/             # Shopify Webhook handler for cache invalidation
│   │   └── test-shopify/           # Diagnostic endpoint for Storefront API testing
│   ├── favicon.ico                 # App-level favicon routing
│   └── globals.css                 # Global Tailwind directives and base CSS
│
├── components/                     # Generic, reusable UI base elements (Buttons, Inputs, Modals) unattached to a specific module
│
├── lib/                            # Business Logic, Data Access, and Configurations
│   ├── cache/                      # Application-level Caching Layer
│   │   └── redis.ts                # Upstash Redis client singleton, generic cache wrappers, and atomic invalidation/rate-limit logic
│   ├── config.ts                   # Global configuration toggles
│   ├── context/                    # React Context Providers (Cart Limit, Cart Drawer visibility)
│   ├── data/                       # Unified data fetching interface layer (Server Actions)
│   │   ├── cart.ts                 # Cart mutations mapping to Shopify (addToCart, updateLines)
│   │   ├── collections.ts          # Collection and Category fetching via Shopify API
│   │   ├── customer.ts             # Authentication actions (login, signup) and Profile/Address mutations
│   │   ├── products.ts             # Product data handlers mapped from Shopify
│   │   └── search.ts               # Predictive search and queries
│   ├── env.ts                      # Zod validation schema for environment variables ensuring runtime safety
│   ├── hooks/                      # Reusable custom React hooks (e.g., useIntersection)
│   ├── shopify/                    # The core Shopify Storefront API layer
│   │   ├── client.ts               # Shopify GraphQL connection initialization
│   │   ├── fragments.ts            # Reusable GraphQL query fragments (Image, Money, SEO)
│   │   ├── mutations/              # Extracted GraphQL mutation strings (cart, customer, etc.)
│   │   ├── queries/                # Specialized GraphQL query strings
│   │   └── types.ts                # TypeScript declarations mapped strictly to Shopify API returns
│   └── util/                       # Generic helper functions
│       └── rate-limit.ts           # Exports instantiated Upstash rate limiters (login, register, reset)
│
├── modules/                        # Feature-Driven Design Folders (Isolates logic by business domain)
│   ├── account/                    # Customer account UI
│   │   ├── components/             # Sub-components (address-card, address-form, login, register, profile-form)
│   │   └── templates/              # Page wrappers (account-layout, addresses-template, profile-template)
│   ├── cart/                       # Cart UI elements (cart-drawer, cart items list, summary)
│   ├── collections/                # Collection filtering, header, and sorting templates
│   ├── common/                     # Common layout segments shared across modules (e.g., interactive links)
│   ├── home/                       # Homepage unique sections (Hero banner, featured products, vision statement wrapper)
│   ├── layout/                     # Application framework shells (Navigation bar, Fullscreen menu, Footer)
│   ├── products/                   # All product-specific visual UI (Image Gallery, Variants Swatch, You-May-Like)
│   ├── search/                     # Predictive search UI, mobile search modal, hit display
│   ├── services/                   # Services landing pages and CMS-driven service components
│   ├── shipping/                   # Shipping nudges and visual feedback
│   ├── skeletons/                  # Loading skeleton components indicating data fetching states
│   ├── store/                      # PLP components (Product grids, pagination logic, active filters)
│   └── wishlist/                   # Wishlist UI and client-side interactions
│
├── shims/                          # Temporary Fallback Components
│   ├── medusa-icons.tsx            # SVG icons mimicking old UI library exports
│   └── medusa-ui.tsx               # Replaces strict Medusa UI components to prevent crashes while cleaning up remaining tech debt
│
├── styles/                         # Additional cascading style sheets outside global CSS
│
└── types/                          # Global TypeScript Overrides
    ├── global.ts                   # Top-level custom types
    ├── icon.ts                     # Icon sizing and prop types
    ├── marketing.ts                # Types for homepage marketing content
    └── medusa-shim.ts              # Temporary mock structures matching old API shapes to preserve UI stability
```

### Architectural Notes

- **App Router (`src/app/`):** Exclusively handles routing, URL parameters (`params`, `searchParams`), and generating static metadata or calling `generateStaticParams` for Incremental Static Regeneration (ISR). The auth flows the old monolithic email loops have been removed in favor of standard active session redirects.
- **Caching Layer (`src/lib/cache/redis.ts`):** Upstash Redis handles heavy `getCached` wrapper data functions while keeping user data (cart, auth) entirely un-cached to ensure headless safety.
- **Data Fetching Layer (`src/lib/data/`):** Connects the API layer (`src/lib/shopify/`) to the React Server Actions. This layer has been rigorously refactored to eliminate Medusa footprints.
- **Modifiers (`src/modules/`):** Contains pure React logic, keeping the `app/` structure pristine. Modules remain uncoupled from hardcoded URL routing paths. The `checkout` module has been completely excised, as we delegate secure payment to Shopify Hosted Checkout.
