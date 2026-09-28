/**
 * Cookie & tracking registry — the single source of truth for consent.
 *
 * The consent banner, the Cookie settings panel and the /cookies table all
 * read from here. To add a tool later (e.g. Google Analytics), add an entry
 * with its category; if it only needs a script tag, give it `script` and
 * ConsentScripts will load it once that category is allowed. Categories with
 * no entries are hidden automatically.
 *
 * Bump CONSENT_POLICY_VERSION whenever this list or the Cookie Policy changes
 * in a way visitors must re-confirm; everyone is asked again on next visit.
 */

export const CONSENT_POLICY_VERSION = "2026-10-01"
export const CONSENT_COOKIE_NAME = "sg_consent"
export const CONSENT_MAX_AGE_DAYS = 365

export type ConsentCategoryId =
  | "necessary"
  | "device"
  | "functional"
  | "marketing"
  | "analytics"

/** Categories a visitor can switch on or off. */
export type OptionalCategoryId = Extract<
  ConsentCategoryId,
  "functional" | "marketing" | "analytics"
>

export const OPTIONAL_CATEGORIES: OptionalCategoryId[] = [
  "functional",
  "analytics",
  "marketing",
]

export type ConsentCategory = {
  id: ConsentCategoryId
  label: string
  description: string
  alwaysOn: boolean
}

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: "necessary",
    label: "Necessary",
    description:
      "Keeps the website working: your cart, your login, your cookie choices, and security. Always on.",
    alwaysOn: true,
  },
  {
    id: "device",
    label: "Saved on your device only",
    description:
      "Remembers your wishlist, recent searches, recently viewed products, and closed notices. It stays in your browser and is never sent to us. Always on.",
    alwaysOn: true,
  },
  {
    id: "functional",
    label: "Functional",
    description:
      "Extra features from other companies: website chat (Tidio) and online booking (cal.com). Maps and product videos load only when you open them.",
    alwaysOn: false,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Counts visits to help us improve the website.",
    alwaysOn: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Shows our social media feed, which loads code from Meta (Facebook).",
    alwaysOn: false,
  },
]

export type RegistryEntry = {
  id: string
  /** Cookie or storage key, or the service name for third-party entries. */
  name: string
  vendor: string
  category: ConsentCategoryId
  type:
    | "Cookie"
    | "Local storage"
    | "Session storage"
    | "Third-party service"
    | "Server record"
  purpose: string
  duration: string
  /** When a third-party service loads, if it is not always on. */
  loads?: "With your consent" | "Only when you click to open it"
  policyUrl?: string
  /** Storage keys/prefixes to clear when the visitor withdraws consent. */
  clearStorage?: string[]
  /** Plain script that ConsentScripts loads once the category is allowed. */
  script?: { id: string; src: string }
}

const OWN_POLICY = "/privacy"
const tidioKey = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY

export const CONSENT_REGISTRY: RegistryEntry[] = [
  // ── Necessary ───────────────────────────────────────────────────────────
  {
    id: "sg-consent",
    name: CONSENT_COOKIE_NAME,
    vendor: "SixthGear",
    category: "necessary",
    type: "Cookie",
    purpose: "Remembers your cookie choices",
    duration: "12 months",
    policyUrl: OWN_POLICY,
  },
  {
    id: "cart",
    name: "shopify_cart_id",
    vendor: "SixthGear",
    category: "necessary",
    type: "Cookie",
    purpose: "Remembers your cart",
    duration: "7 days",
    policyUrl: OWN_POLICY,
  },
  {
    id: "customer-session",
    name: "shopify_customer_token",
    vendor: "SixthGear",
    category: "necessary",
    type: "Cookie",
    purpose: "Keeps you logged in",
    duration: "Until you log out or it expires",
    policyUrl: OWN_POLICY,
  },
  {
    id: "selected-cart-items",
    name: "selectedCartItems",
    vendor: "SixthGear",
    category: "necessary",
    type: "Local storage",
    purpose: "Remembers which cart items you selected for checkout",
    duration: "Until cleared",
    policyUrl: OWN_POLICY,
  },
  {
    id: "preview",
    name: "__prerender_bypass, __next_preview_data",
    vendor: "SixthGear",
    category: "necessary",
    type: "Cookie",
    purpose: "Content preview for our editors only; never set for visitors",
    duration: "Until the browser is closed",
    policyUrl: OWN_POLICY,
  },
  {
    id: "rate-limit",
    name: "Security rate limit (IP address)",
    vendor: "Upstash",
    category: "necessary",
    type: "Server record",
    purpose:
      "Blocks repeated login, sign-up, password and contact-form abuse",
    duration: "Up to 60 minutes",
    policyUrl: "https://upstash.com/trust/privacy.pdf",
  },
  {
    id: "shopify-checkout",
    name: "Shopify checkout cookies",
    vendor: "Shopify",
    category: "necessary",
    type: "Third-party service",
    purpose:
      "Checkout and fraud prevention, set on Shopify's checkout page. Your cookie choices are passed to it",
    duration: "Set by Shopify",
    policyUrl: "https://www.shopify.com/legal/privacy",
  },

  // ── Saved on your device only ───────────────────────────────────────────
  {
    id: "wishlist",
    name: "wishlist",
    vendor: "SixthGear",
    category: "device",
    type: "Local storage",
    purpose: "Your saved products",
    duration: "Until cleared",
  },
  {
    id: "recent-searches",
    name: "sixthgear_recent_searches",
    vendor: "SixthGear",
    category: "device",
    type: "Local storage",
    purpose: "Your last 8 searches",
    duration: "Until cleared",
  },
  {
    id: "recently-viewed",
    name: "sg_recently_viewed",
    vendor: "SixthGear",
    category: "device",
    type: "Local storage",
    purpose: "Your last 8 viewed products",
    duration: "Until cleared",
  },
  {
    id: "preloader",
    name: "sg-preloader-seen-at",
    vendor: "SixthGear",
    category: "device",
    type: "Local storage",
    purpose: "Skips the intro animation for 1 hour",
    duration: "Until cleared",
  },
  {
    id: "closed-notices",
    name: "sg_bar_dismissed, sg_popup_*",
    vendor: "SixthGear",
    category: "device",
    type: "Session storage",
    purpose: "Remembers notices you closed",
    duration: "Until you close the tab",
  },

  // ── Functional ──────────────────────────────────────────────────────────
  {
    id: "tidio",
    name: "Tidio chat (tidio_state_*)",
    vendor: "Tidio",
    category: "functional",
    type: "Third-party service",
    purpose: "Website chat: visitor ID and conversation",
    duration: "Until cleared",
    loads: "With your consent",
    policyUrl: "https://www.tidio.com/privacy-policy/",
    clearStorage: ["tidio_state_"],
    script: tidioKey
      ? { id: "tidio-chat-script", src: `https://code.tidio.co/${tidioKey}.js` }
      : undefined,
  },
  {
    id: "cal",
    name: "cal.com booking",
    vendor: "cal.com",
    category: "functional",
    type: "Third-party service",
    purpose: "Online service booking",
    duration: "Set by cal.com",
    loads: "Only when you click to open it",
    policyUrl: "https://cal.com/privacy",
  },
  {
    id: "google-maps",
    name: "Google Maps",
    vendor: "Google",
    category: "functional",
    type: "Third-party service",
    purpose: "Map display (for example the NID cookie)",
    duration: "Set by Google",
    loads: "Only when you click to open it",
    policyUrl: "https://policies.google.com/privacy",
  },
  {
    id: "product-video",
    name: "Product videos (YouTube, Vimeo)",
    vendor: "Google (YouTube), Vimeo",
    category: "functional",
    type: "Third-party service",
    purpose: "Plays product videos (YouTube in privacy-enhanced mode)",
    duration: "Set by YouTube or Vimeo",
    loads: "Only when you click to open it",
    policyUrl: "https://policies.google.com/privacy",
  },

  // ── Marketing ───────────────────────────────────────────────────────────
  {
    id: "curator",
    name: "Social media feed",
    vendor: "Curator.io",
    category: "marketing",
    type: "Third-party service",
    purpose: "Shows our Instagram and Facebook posts on the homepage",
    duration: "Set by Curator",
    loads: "With your consent",
    policyUrl: "https://curator.io/privacy-policy",
  },
  {
    id: "facebook-sdk",
    name: "Facebook cookies",
    vendor: "Meta",
    category: "marketing",
    type: "Third-party service",
    purpose: "Loaded by the social media feed",
    duration: "Set by Meta",
    loads: "With your consent",
    policyUrl: "https://www.facebook.com/privacy/policy/",
  },
]

export function getRegistryEntries(category: ConsentCategoryId) {
  return CONSENT_REGISTRY.filter((entry) => entry.category === category)
}

/** Categories that have at least one registry entry, in display order. */
export function getVisibleCategories() {
  return CONSENT_CATEGORIES.filter(
    (category) => getRegistryEntries(category.id).length > 0
  )
}

export function getVisibleOptionalCategories(): OptionalCategoryId[] {
  const visible = new Set(getVisibleCategories().map((category) => category.id))
  return OPTIONAL_CATEGORIES.filter((id) => visible.has(id))
}
