# Sixthgear Frontend Architecture & File Structure

This document outlines the folder architecture for the `sixthgear-frontend` Next.js headless storefront, specifically reflecting the migration from a monolithic Medusa architecture to a Shopify Storefront API + Payload CMS stack.

## Root Level

```text
sixthgear-frontend/
├── public/                 # Static assets (images, fonts, favicons) directly served by Next.js
├── src/                    # Primary source code directory for all application logic
├── .env.local              # Local environment variables (Shopify tokens, public keys)
├── next.config.js          # Next.js configuration (Asset host whitelisting, headers)
├── package.json            # Project dependencies and basic scripts
├── tailwind.config.js      # Tailwind CSS theme, plugins, and custom utility classes
└── tsconfig.json           # TypeScript configuration and path aliases mapping
```

## `src/` Directory Details

The `src` folder strictly follows a split architecture, isolating business logic from React Server Components routing and feature-based UI modules.

```text
src/
├── app/                    # Next.js 13+ App Router Core
│   ├── [countryCode]/      # Dynamic segment for Internationalization/Localization
│   │   ├── (main)/         # Main layout group (Navbar, Footer wrapper)
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── products/[handle]/  # Product Detail Page (PDP) Route
│   │   │   ├── store/              # Main Product Listing Page Route
│   │   │   ├── cart/               # Full Cart Page Route
│   │   │   └── collections/        # Specific Collection/Category Route
│   │   └── (checkout)/     # Isolated layour group specifically for checkout flow
│   ├── api/                # Next.js Route Handlers (Serverless functions endpoints)
│   ├── favicon.ico         # App-level favicon routing
│   ├── globals.css         # Global Tailwind directives and base CSS
│   └── layout.tsx          # Root HTML layout and global providers configuration
│
├── components/             # Generic, reusable UI elements unattached to a specific module
│
├── lib/                    # Business Logic, Data Access, and Configurations
│   ├── config.ts           # Global configuration toggles
│   ├── context/            # React Context Providers (Cart Limit, Cart Drawer visibility)
│   ├── data/               # Unified data fetching interface layer
│   │   ├── products.ts     # Products data handlers (Mapped from Shopify)
│   │   ├── cart.ts         # Cart data handlers (Mapped from Shopify)
│   │   └── ...             # Categories, brands, regions stubs
│   ├── hooks/              # Reusable React hooks (e.g., useIntersection)
│   ├── shopify/            # The core Shopify Storefront API layer
│   │   ├── client.ts       # Shopify connection initialization using server/client getters
│   │   ├── fragments.ts    # Reusable GraphQL query fragments (Image, Money, SEO)
│   │   ├── queries/        # Specialized GraphQL queries (product.ts, collection.ts, search.ts)
│   │   └── types.ts        # TypeScript declarations mapped strictly to Shopify API returns
│   └── util/               # Generic helper functions (price formatters, variant helpers)
│
├── modules/                # Feature-Driven Design Folders (Isolates logic by business domain)
│   ├── cart/               # Cart drawer component, cart items, totals review
│   ├── checkout/           # Checkout form, payment elements, shipping address
│   ├── collections/        # Collection filtering, header, and sorting templates
│   ├── home/               # Homepage unique sections (Hero banner, featured products wrapper)
│   ├── layout/             # Application framework shells (Navigation bar, Fullscreen menu, Footer)
│   ├── products/           # All product-specific visual UI
│   │   ├── components/     # Specialized product UI (Image Gallery, Variants Swatch, You-May-Like)
│   │   └── templates/      # Main PDP architecture and wrappers (Product Actions, Product Info tabs)
│   └── store/              # PLP components (Product grids, pagination logic, search views)
│
├── shims/                  # Temporary Fallback Components
│   ├── medusa-icons.tsx    # SVG icons mimicking old UI library exports
│   └── medusa-ui.tsx       # Replaces strict Medusa UI components (e.g. Button wrapper)
│                           # to prevent crashes while migrating to custom interface components
│
├── styles/                 # Additional cascading style sheets outside global CSS
│
└── types/                  # Global TypeScript Overrides
    ├── global.ts           # Top-level custom types
    └── medusa-shim.ts      # Temporary mock structures matching HttpTypes so old components don't crash
```

### Architectural Notes

- **App Router (`src/app/`):** Exclusively handles routing, URL parameters (`params`, `searchParams`), and generating static metadata or calling `generateStaticParams` for Incremental Static Regeneration (ISR).
- **Data Fetching Layer (`src/lib/data/`):** Connects the API layer (`src/lib/shopify/`) to the components. The objective of this folder during the migration is to securely interface with Shopify and convert (`mapShopifyToMedusa()`) the data into the legacy shapes.
- **Modifiers (`src/modules/`):** Contains pure React logic, keeping the `app/` structure pristine. Modules should remain completely uncoupled from URL routing paths whenever possible.
