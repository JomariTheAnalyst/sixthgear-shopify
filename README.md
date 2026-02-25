# Sixthgear Moto Supply & Café — Headless E-Commerce Storefront

> A high-performance, enterprise-grade Next.js storefront integrated with the Shopify Storefront API.

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Shopify](https://img.shields.io/badge/Shopify-Storefront_API-95BF47?style=flat-square&logo=shopify)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)

## 📌 Executive Summary

The Sixthgear Moto Frontend is a premium, headless e-commerce experience designed to merge retail motorcycle parts, service bookings, and café orders into a single, unified digital presence. By decoupling the frontend from the e-commerce engine, this architecture delivers unparalleled loading speeds, granular SEO control, and a fluid, app-like user experience.

## 🏗️ Architecture Overview

Our storefront utilizes a **Headless Commerce Architecture**, interacting with multiple modern backend services while serving a heavily optimized React frontend:

- **Frontend Framework:** Next.js 15 (App Router) leveraging React Server Components (RSC) limits client-side JavaScript, boosting Core Web Vitals.
- **E-Commerce Engine:** Shopify Storefront GraphQL API handles all product catalog, inventory, cart mutations, and checkout processing.
- **Content Management:** Strapi CMS dynamically manages our custom service offerings and dynamic page content.
- **State Management:** Strict separation of concerns where UI state is optimized via Zustand, but critical session data (like Cart IDs) is securely managed via `HttpOnly` server-side cookies and Next.js Server Actions.

---

## ✨ Core Features

### 🛒 Seamless Shopping & Checkout

- **Instant Add-to-Cart:** Powered by Next.js Server Actions, allowing secure, JS-free cart creation and item mutations.
- **Real-Time Drawer:** Fluid cart drawer UI synced with Shopify’s real-time inventory and pricing.
- **Secure Direct Checkout:** Hands-off redirect to Shopify’s PCI-compliant hosted checkout (integrating Xendit for local payments like GCash/Maya).

### ⚡ Performance & SEO

- **Server-Side Rendering (SSR) & Static Generation:** High-priority pages are statically generated with ISR (Incremental Static Regeneration) for instant TTFB.
- **Image Optimization:** Automated WebP/AVIF generation and lazy loading.
- **SEO-Ready:** Deep metadata integration, semantic HTML, and dynamic OpenGraph image generation.

### 🎨 Premium UI/UX

- **Dynamic Framer-like Animations:** Cinematic page transitions, sliding reveals, and scroll-triggered animations.
- **Responsive Design:** Mobile-first approach scaling beautifully up to ultra-wide desktop monitors.
- **Accessible Components:** Built on Radix UI primitives ensuring screen-reader and keyboard navigation compliance.

---

## 💻 Tech Stack Breakdown

| Layer                | Technology              | Purpose                                           |
| :------------------- | :---------------------- | :------------------------------------------------ |
| **Core Framework**   | Next.js 15 (App Router) | Server/Client routing, SSR, ISR, Server Actions   |
| **Logic/UI**         | React 19 / TypeScript   | Strict type-safe UI components                    |
| **Styling**          | Tailwind CSS 3          | Utility-first responsive styling system           |
| **API/Commerce**     | Shopify Storefront API  | GraphQL endpoint for all commerce capabilities    |
| **State Management** | Zustand + React Context | Client-side UI state (side-drawers, mobile menus) |
| **Testing**          | Playwright              | End-to-End visual and flow testing                |

---

## 🚀 Local Development Setup

### 1. Prerequisites

- **Node.js**: v20.x or higher
- **Package Manager**: npm or yarn
- **Shopify Access Tokens**: Storefront API Public Token & Shopify Domain

### 2. Environment Variables

Create a `.env.local` based on `.env.template`:

```env
# Server-side overrides (Server Actions)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxx
SHOPIFY_API_VERSION=2025-01

# Client-side configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_public_token
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Navigate to `http://localhost:7000`.

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (Routes, Layouts, Server Pages)
├── lib/                  # Core Business Logic
│   ├── shopify/          # GraphQL Queries, Mutations, and Types for Shopify
│   ├── data/             # Next.js Server Actions (Cart, Customers)
│   └── context/          # React Providers (UI state, Modals)
├── modules/              # Domain-Driven Feature Components
│   ├── cart/             # Cart Drawer, Item Rows, Checkout Button
│   ├── products/         # Product Gallery, Variance Selectors
│   ├── layout/           # Navigations, Footers, Dropdowns
│   └── home/             # Homepage Specific Sections
└── styles/               # Global CSS & Tailwind layers
```

---

## 🛡️ Security & Operations

- **Token Safety:** Private API tokens are never exposed to the client. Only Next.js Server Components query sensitive data.
- **Session Protection:** Shopify Cart IDs are secured behind `SameSite=Lax` cookies to prevent CSRF attacks. State is intelligently self-healing if a cart expires.
- **Safe Type Enforcement:** Strict TypeScript compilation with forced `#NoEmit` checks before builds.

---

_Engineered for performance, designed for riders. © 2026 Sixthgear Moto Supply & Café._
