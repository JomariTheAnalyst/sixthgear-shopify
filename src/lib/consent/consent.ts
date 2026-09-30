/**
 * Consent record helpers, shared by the browser (banner/provider) and the
 * server (checkout handoff). No React, no Next.js imports.
 */

import {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_POLICY_VERSION,
  OPTIONAL_CATEGORIES,
  type OptionalCategoryId,
} from "./registry"

export type ConsentChoices = Record<OptionalCategoryId, boolean>

export type StoredConsent = {
  v: 1
  policy: string
  /** ISO date the choice was made. */
  date: string
  categories: ConsentChoices
}

const MAX_AGE_MS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000

export const NO_OPTIONAL_CONSENT: ConsentChoices = {
  analytics: false,
  marketing: false,
}

export const ALL_OPTIONAL_CONSENT: ConsentChoices = {
  analytics: true,
  marketing: true,
}

export function parseConsent(raw?: string | null): StoredConsent | null {
  if (!raw) return null

  try {
    const value = JSON.parse(decodeURIComponent(raw))
    if (
      value?.v !== 1 ||
      typeof value.policy !== "string" ||
      typeof value.date !== "string" ||
      typeof value.categories !== "object" ||
      value.categories === null
    ) {
      return null
    }

    const categories = { ...NO_OPTIONAL_CONSENT }
    for (const id of OPTIONAL_CATEGORIES) {
      categories[id] = value.categories[id] === true
    }

    return { v: 1, policy: value.policy, date: value.date, categories }
  } catch {
    return null
  }
}

/** A stored choice counts only for the current policy and for 12 months. */
export function isConsentCurrent(
  consent: StoredConsent | null,
  now: number = Date.now()
): consent is StoredConsent {
  if (!consent || consent.policy !== CONSENT_POLICY_VERSION) return false

  const madeAt = Date.parse(consent.date)
  return Number.isFinite(madeAt) && now - madeAt < MAX_AGE_MS
}

export function createConsent(
  categories: ConsentChoices,
  now: Date = new Date()
): StoredConsent {
  return {
    v: 1,
    policy: CONSENT_POLICY_VERSION,
    date: now.toISOString(),
    categories: { ...categories },
  }
}

export function serializeConsent(consent: StoredConsent) {
  return encodeURIComponent(JSON.stringify(consent))
}

/** Global Privacy Control is a "no" to analytics and marketing. */
export function applyGlobalPrivacyControl(
  categories: ConsentChoices,
  gpc: boolean
): ConsentChoices {
  return gpc ? { ...categories, analytics: false, marketing: false } : categories
}

export type ShopifyVisitorConsent = {
  analytics: boolean
  marketing: boolean
  preferences: boolean
  saleOfData: boolean
}

/**
 * Maps our categories onto Shopify's VisitorConsent input. Returns null when
 * the visitor has made no choice and sends no GPC signal, so Shopify keeps
 * its own default instead of receiving a guess.
 */
export function toShopifyVisitorConsent(
  consent: StoredConsent | null,
  gpc: boolean
): ShopifyVisitorConsent | null {
  const current = isConsentCurrent(consent) ? consent.categories : null
  if (!current && !gpc) return null

  const categories = applyGlobalPrivacyControl(
    current ?? NO_OPTIONAL_CONSENT,
    gpc
  )

  return {
    analytics: categories.analytics,
    marketing: categories.marketing,
    // Features that load on use (chat, booking, maps) need no consent.
    preferences: true,
    saleOfData: categories.marketing,
  }
}

export { CONSENT_COOKIE_NAME, CONSENT_MAX_AGE_DAYS }
