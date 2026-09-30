"use client"

import Script from "next/script"

import {
  CONSENT_REGISTRY,
  OPTIONAL_CATEGORIES,
  type OptionalCategoryId,
} from "@lib/consent/registry"
import { useConsent } from "./consent-provider"

const isOptional = (category: string): category is OptionalCategoryId =>
  OPTIONAL_CATEGORIES.includes(category as OptionalCategoryId)

/** Loads every registry script whose category the visitor has allowed. */
export default function ConsentScripts() {
  const { hasConsent } = useConsent()

  return (
    <>
      {CONSENT_REGISTRY.map((entry) =>
        entry.script &&
        isOptional(entry.category) &&
        hasConsent(entry.category) ? (
          <Script
            key={entry.id}
            id={entry.script.id}
            src={entry.script.src}
            strategy="afterInteractive"
          />
        ) : null
      )}
    </>
  )
}
