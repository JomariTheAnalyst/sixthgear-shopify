# Sixthgear Frontend Architecture & File Structure

This document outlines the folder architecture for the `sixthgear-frontend` Next.js headless storefront, specifically reflecting the integration with Shopify Storefront API, Sanity CMS (with some Strapi legacy structures), and Upstash Redis for caching and rate-limiting.

> **Note:** Markdown (`.md`) documentation files are intentionally excluded from this structural diagram.

## Root Level

```text
sixthgear-frontend/
├── public/                 # Static assets (images, fonts, favicons) directly served by Next.js
├── sanity/                 # Sanity CMS configuration, schemas, and live preview settings
├── src/                    # Primary source code directory for all application logic
├── tests/                  # Playwright End-to-End tests and helpers
├── .env.local              # Local environment variables (Shopify tokens, Redis credentials)
├── next.config.js          # Next.js configuration (Asset host whitelisting, headers, ignoring specific build errors)
├── package.json            # Project dependencies and basic scripts
├── sanity.config.ts        # Sanity Studio configuration
├── sanity.cli.ts           # Sanity CLI configuration
├── tailwind.config.js      # Tailwind CSS theme, plugins, and custom utility classes
└── tsconfig.json           # TypeScript configuration and path aliases mapping
```

## `src/` Directory Details

The `src` folder strictly follows a split architecture, isolating business logic from React Server Components routing and feature-based UI modules.

```text
src/
├── app/                            # Next.js 15 App Router Core
│   ├── [countryCode]/              # Dynamic segment for Internationalization/Localization
│   │   ├── api/                    # Next.js Route Handlers (Serverless functions)
│   │   │   ├── health/             # Redis & System health check endpoint
│   │   │   ├── revalidate/         # Shopify Webhook handler for cache invalidation
│   │   │   └── test-shopify/       # Diagnostic endpoint for Storefront API testing
│   │   ├── (main)/                 # Main layout group (Navbar, Footer wrapper)
│   │   ├── (auth)/                 # Authentication layout group
│   │   ├── account/                # Protected user dashboard
│   │   ├── not-found.tsx           # Custom 404 handler
│   │   └── layout.tsx              # Country-code specific layout
│   └── studio/                     # Sanity Studio embedded route
│       └── [[...tool]]/            # Sanity Studio wildcard route
│
├── components/                     # Generic, reusable UI base elements
│
├── lib/                            # Business Logic, Data Access, and Configurations
│   ├── cache/                      # Application-level Caching Layer (Redis)
│   ├── cms/                        # Generalized CMS client and queries (Sanity abstractions)
│   ├── context/                    # React Context Providers
│   ├── data/                       # Unified data fetching interface layer (Server Actions)
│   ├── hooks/                      # Reusable custom React hooks
│   ├── shopify/                    # Shopify Storefront API & Admin API integration layer
│   ├── strapi/                     # Strapi CMS integration layer (Legacy/Alternative)
│   └── util/                       # Generic helper functions
│
├── modules/                        # Feature-Driven Design Folders (Isolates logic by business domain)
│   ├── about/                      # About page templates and sections
│   ├── account/                    # Customer account UI (login, register, profile)
│   ├── cart/                       # Cart UI elements (cart-drawer, items list)
│   ├── categories/                 # Category specific templates
│   ├── checkout/                   # Checkout flow UI and logic
│   ├── collections/                # Collection filtering and sorting templates
│   ├── common/                     # Common layout segments shared across modules
│   ├── contact/                    # Contact page components
│   ├── home/                       # Homepage unique sections
│   ├── layout/                     # Application framework shells (Navigation, Footer)
│   ├── marketing/                  # Marketing banners and popup ads
│   ├── menu/                       # Menu page templates and sections
│   ├── order/                      # Order status and details UI
│   ├── products/                   # Product Detail Page (PDP) UI
│   ├── search/                     # Predictive search UI
│   ├── services/                   # Services landing pages
│   ├── shipping/                   # Shipping nudges and visual feedback
│   ├── skeletons/                  # Loading skeleton components
│   ├── store/                      # Main Product Listing Page (PLP) components
│   └── wishlist/                   # Wishlist UI
│
├── styles/                         # Additional cascading style sheets outside global CSS
│
└── types/                          # Global TypeScript declarations and schemas
```

### Architectural Notes

- **App Router (`src/app/`):** Exclusively handles routing, URL parameters (`params`, `searchParams`), and generating static metadata or calling `generateStaticParams` for Incremental Static Regeneration (ISR). Includes an embedded Sanity Studio (`app/studio/`).
- **CMS Layer (`sanity/`, `src/lib/cms/`, `src/lib/strapi/`):** Codebase includes setup for Sanity CMS as the primary modern content source, managing schemas in the `sanity` root folder and providing abstraction wrappers in `src/lib/cms/`.
- **Caching Layer (`src/lib/cache/redis.ts`):** Upstash Redis handles heavy `getCached` wrapper data functions while keeping user data (cart, auth) entirely un-cached to ensure headless safety.
- **Data Fetching Layer (`src/lib/data/`):** Connects the API layer (`src/lib/shopify/`) to the React Server Actions. This layer provides a unified interface for server-side operations.
- **Modules (`src/modules/`):** Contains pure React logic, keeping the `app/` structure pristine. Modules remain uncoupled from hardcoded URL routing paths.
