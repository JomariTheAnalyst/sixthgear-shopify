/**
 * Cookie & tracking registry — the single source of truth for privacy.
 *
 * The consent banner, the Cookie settings panel and the /cookies table all
 * read from here. Categories with no entries are hidden automatically.
 *
 * How things load:
 * - "necessary" and "device": always on.
 * - "withPage": third-party services that load with the page (chat, booking,
 *   maps, product videos, the homepage social feed). Listed for transparency;
 *   no prompt.
 * - "analytics" and "marketing": optional, need consent. The banner asks on
 *   the first visit even while these have no entries; the switches are always
 *   in Cookie settings. To add e.g. Google Analytics, add an entry here with
 *   category "analytics" (and `script` if it is a plain script tag;
 *   ConsentScripts loads it once allowed) AND bump CONSENT_POLICY_VERSION so
 *   everyone is asked again, including visitors who chose before.
 */

export const CONSENT_POLICY_VERSION = "2026-10-08"
export const CONSENT_COOKIE_NAME = "sg_consent"
export const CONSENT_MAX_AGE_DAYS = 365

export type ConsentCategoryId =
  | "necessary"
  | "device"
  | "withPage"
  | "analytics"
  | "marketing"

/** Categories that need the visitor's consent (banner + switches). */
export type OptionalCategoryId = Extract<
  ConsentCategoryId,
  "analytics" | "marketing"
>

export const OPTIONAL_CATEGORIES: OptionalCategoryId[] = [
  "analytics",
  "marketing",
]

export type ConsentCategory = {
  id: ConsentCategoryId
  label: string
  description: string
  /** How the settings panel shows a category without a switch. */
  status?: "Always on" | "Loads with the page"
}

export const CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: "necessary",
    label: "Essential",
    description:
      "Keeps the website working: your cart, your login, your cookie choice, security, and spam protection on our forms.",
    status: "Always on",
  },
  {
    id: "device",
    label: "Saved on your device only",
    description:
      "Remembers your wishlist, recent searches, recently viewed products, and closed notices. It stays in your browser and is never sent to us.",
    status: "Always on",
  },
  {
    id: "withPage",
    label: "Loads with the page",
    description:
      "Services from other companies that load for every visitor, whatever you choose: live chat (Tidio), our social media feed (Curator, which loads code from Meta), online booking (cal.com), maps (Google), and product videos (YouTube, Vimeo). They set their own cookies. You can block third-party cookies in your browser settings.",
    status: "Loads with the page",
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Counts visits and shows which pages people use, so we can improve the website (for example Google Analytics).",
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Measures our ads and shows them to people who visited this website (for example a Meta pixel).",
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
  /** What makes a third-party service load. */
  loads?: string
  policyUrl?: string
  /** Plain script that ConsentScripts loads once its category is allowed. */
  script?: { id: string; src: string }
}

const OWN_POLICY = "/privacy"

export const CONSENT_REGISTRY: RegistryEntry[] = [
  // ── Necessary ───────────────────────────────────────────────────────────
  {
    id: "sg-consent",
    name: CONSENT_COOKIE_NAME,
    vendor: "SixthGear",
    category: "necessary",
    type: "Cookie",
    purpose:
      "Remembers your cookie choice (set when you choose in the banner or in Cookie settings)",
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
    purpose: "Blocks repeated login, sign-up, password and contact-form abuse",
    duration: "Up to 60 minutes",
    policyUrl: "https://upstash.com/trust/privacy.pdf",
  },
  {
    id: "turnstile",
    name: "Cloudflare Turnstile",
    vendor: "Cloudflare",
    category: "necessary",
    type: "Third-party service",
    purpose:
      "Security: checks that a person, not a bot, is sending the form. It looks at information about your browser",
    duration: "Set by Cloudflare",
    loads: "On the contact, sign-up and password reset forms",
    policyUrl: "https://www.cloudflare.com/privacypolicy/",
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

  // ── Loads with the page ─────────────────────────────────────────────────
  {
    id: "tidio",
    name: "Tidio chat (tidio_state_*)",
    vendor: "Tidio",
    category: "withPage",
    type: "Third-party service",
    purpose:
      "Live chat. Tidio sets its own cookies and stores your visitor ID and the messages you send in the chat",
    duration: "Until cleared",
    loads: "On every page",
    policyUrl: "https://www.tidio.com/privacy-policy/",
  },
  {
    id: "cal",
    name: "cal.com booking",
    vendor: "cal.com",
    category: "withPage",
    type: "Third-party service",
    purpose:
      "Online service booking. The booking form and the details you enter are handled by cal.com",
    duration: "Set by cal.com",
    loads: "On every page",
    policyUrl: "https://cal.com/privacy",
  },
  {
    id: "google-maps",
    name: "Google Maps",
    vendor: "Google",
    category: "withPage",
    type: "Third-party service",
    purpose: "Interactive store map. Google may set its own cookies, such as NID",
    duration: "Set by Google",
    loads: "On the homepage and Contact page",
    policyUrl: "https://policies.google.com/privacy",
  },
  {
    id: "product-video",
    name: "Product videos (YouTube, Vimeo)",
    vendor: "Google (YouTube), Vimeo",
    category: "withPage",
    type: "Third-party service",
    purpose:
      "Plays product videos. YouTube runs in privacy-enhanced mode; YouTube and Vimeo may set their own cookies",
    duration: "Set by YouTube or Vimeo",
    loads: "On product pages with a video",
    policyUrl: "https://policies.google.com/privacy",
  },
  {
    id: "curator",
    name: "Social media feed",
    vendor: "Curator.io",
    category: "withPage",
    type: "Third-party service",
    purpose:
      "Shows our latest Facebook and Instagram posts on the homepage. It loads code from Meta (Facebook)",
    duration: "Set by Curator",
    loads: "On the homepage",
    policyUrl: "https://curator.io/privacy-policy",
  },
  {
    id: "facebook-sdk",
    name: "Facebook cookies",
    vendor: "Meta",
    category: "withPage",
    type: "Third-party service",
    purpose:
      "Loaded by the social media feed. Meta may set its own cookies, including for advertising",
    duration: "Set by Meta",
    loads: "On the homepage",
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

/**
 * Consent categories (analytics, marketing) that have entries. Empty means no
 * analytics or marketing tool runs yet; Cookie settings then says so.
 */
export function getVisibleOptionalCategories(): OptionalCategoryId[] {
  const visible = new Set(getVisibleCategories().map((category) => category.id))
  return OPTIONAL_CATEGORIES.filter((id) => visible.has(id))
}

/**
 * Rows for the Cookie settings panel: always-on categories that have entries,
 * plus the analytics and marketing switches, which are always shown.
 */
export function getSettingsCategories() {
  return CONSENT_CATEGORIES.filter(
    (category) =>
      OPTIONAL_CATEGORIES.includes(category.id as OptionalCategoryId) ||
      getRegistryEntries(category.id).length > 0
  )
}
