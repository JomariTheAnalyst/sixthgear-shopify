"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"

import {
  ALL_OPTIONAL_CONSENT,
  applyGlobalPrivacyControl,
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_DAYS,
  createConsent,
  isConsentCurrent,
  NO_OPTIONAL_CONSENT,
  parseConsent,
  serializeConsent,
  type ConsentChoices,
} from "@lib/consent/consent"
import {
  OPTIONAL_CATEGORIES,
  type OptionalCategoryId,
} from "@lib/consent/registry"

/** "loading" until the browser has read the stored choice. */
export type ConsentStatus = "loading" | "unset" | "set"

type ConsentContextValue = {
  status: ConsentStatus
  categories: ConsentChoices
  /** Browser sends a Global Privacy Control signal. */
  gpc: boolean
  hasConsent: (category: OptionalCategoryId) => boolean
  acceptAll: () => void
  rejectAll: () => void
  save: (categories: ConsentChoices) => void
  /** Allow one category, keeping every other choice as it is. */
  grant: (category: OptionalCategoryId) => void
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const noop = () => undefined

const ConsentContext = createContext<ConsentContextValue>({
  status: "loading",
  categories: NO_OPTIONAL_CONSENT,
  gpc: false,
  hasConsent: () => false,
  acceptAll: noop,
  rejectAll: noop,
  save: noop,
  grant: noop,
  settingsOpen: false,
  openSettings: noop,
  closeSettings: noop,
})

export function useConsent() {
  return useContext(ConsentContext)
}

function readConsentCookie() {
  const prefix = `${CONSENT_COOKIE_NAME}=`
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(prefix))
  return match ? match.slice(prefix.length) : null
}

function writeConsentCookie(value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Max-Age=${
    CONSENT_MAX_AGE_DAYS * 24 * 60 * 60
  }; Path=/; SameSite=Lax${secure}`
}

export function ConsentProvider({
  children,
  ui,
}: {
  children: ReactNode
  /** Banner, settings panel, scripts; not rendered in Sanity Studio. */
  ui: ReactNode
}) {
  const pathname = usePathname()
  const isStudio = pathname === "/studio" || pathname?.startsWith("/studio/")
  const [status, setStatus] = useState<ConsentStatus>("loading")
  const [categories, setCategories] = useState<ConsentChoices>(NO_OPTIONAL_CONSENT)
  const [gpc, setGpc] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  // Categories that were on at some point in this page's life, so their
  // scripts may be running and need a reload to stop.
  const everEnabledRef = useRef(new Set<OptionalCategoryId>())

  useEffect(() => {
    const signal =
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl === true
    setGpc(signal)

    const stored = parseConsent(readConsentCookie())
    if (isConsentCurrent(stored)) {
      setCategories(applyGlobalPrivacyControl(stored.categories, signal))
      setStatus("set")
    } else {
      setStatus("unset")
    }
  }, [])

  useEffect(() => {
    OPTIONAL_CATEGORIES.forEach((id) => {
      if (categories[id]) everEnabledRef.current.add(id)
    })
  }, [categories])

  const save = useCallback(
    (next: ConsentChoices) => {
      const effective = applyGlobalPrivacyControl(next, gpc)
      writeConsentCookie(serializeConsent(createConsent(effective)))

      const withdrawn = OPTIONAL_CATEGORIES.filter(
        (id) => everEnabledRef.current.has(id) && !effective[id]
      )

      setCategories(effective)
      setStatus("set")
      setSettingsOpen(false)

      // Loaded third-party scripts cannot be unloaded; start a clean page.
      if (withdrawn.length > 0) {
        window.location.reload()
      }
    },
    [gpc]
  )

  const value = useMemo<ConsentContextValue>(
    () => ({
      status,
      categories,
      gpc,
      hasConsent: (category) => status === "set" && categories[category],
      acceptAll: () => save(ALL_OPTIONAL_CONSENT),
      rejectAll: () => save(NO_OPTIONAL_CONSENT),
      save,
      grant: (category) =>
        save({
          ...(status === "set" ? categories : NO_OPTIONAL_CONSENT),
          [category]: true,
        }),
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [status, categories, gpc, save, settingsOpen]
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {!isStudio && ui}
    </ConsentContext.Provider>
  )
}
