import { getCalApi } from "@calcom/embed-react"

export const CAL_LINK = "sixthgear-moto-supply-wvfnxi/pms"
export const CAL_POPUP_NAMESPACE = "pms"
export const CAL_DIRECT_URL = `https://cal.com/${CAL_LINK}`

export const CAL_POPUP_CONFIG = {
  layout: "month_view",
  useSlotsViewOnSmallScreen: "true",
  theme: "light",
} as const

const BACKDROP_STYLE_ID = "sixthgear-cal-backdrop"
const BACKDROP_STYLE = `
  .my-backdrop {
    background-color: rgba(15, 23, 42, 0.24) !important;
    backdrop-filter: blur(1px);
  }
`

type CalApi = Awaited<ReturnType<typeof getCalApi>>

type CalPopupRuntime = {
  apiPromise?: Promise<CalApi>
  openPromise?: Promise<void>
  backdropObserver?: MutationObserver
  idleScheduled?: boolean
}

type CalWindow = Window & {
  __sixthgearCalPopup?: CalPopupRuntime
}

function getRuntime() {
  const calWindow = window as CalWindow
  calWindow.__sixthgearCalPopup ??= {}
  return calWindow.__sixthgearCalPopup
}

function applyBackdropStyle() {
  document.querySelectorAll("cal-modal-box").forEach((modal) => {
    const shadowRoot = modal.shadowRoot

    if (!shadowRoot || shadowRoot.getElementById(BACKDROP_STYLE_ID)) {
      return
    }

    const style = document.createElement("style")
    style.id = BACKDROP_STYLE_ID
    style.textContent = BACKDROP_STYLE
    shadowRoot.appendChild(style)
  })
}

function observeCalModals(runtime: CalPopupRuntime) {
  if (runtime.backdropObserver) {
    return
  }

  applyBackdropStyle()
  runtime.backdropObserver = new MutationObserver(applyBackdropStyle)
  runtime.backdropObserver.observe(document.body, {
    childList: true,
  })
}

export function initializePopupCal() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("The Cal.com popup can only initialize in the browser")
    )
  }

  const runtime = getRuntime()
  observeCalModals(runtime)

  if (!runtime.apiPromise) {
    runtime.apiPromise = getCalApi({
      namespace: CAL_POPUP_NAMESPACE,
    })
      .then((cal) => {
        cal("ui", {
          theme: "light",
          cssVarsPerTheme: {
            light: { "cal-brand": "#222222" },
            dark: { "cal-brand": "#fafafa" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        })

        return cal
      })
      .catch((error) => {
        runtime.apiPromise = undefined
        throw error
      })
  }

  return runtime.apiPromise
}

/**
 * Warms the embed once the browser is idle after page load, so it never
 * competes with first paint. Triggers also warm it on hover/focus/touch, and
 * openCalPopup() initializes it on demand, so the first click always opens.
 */
export function scheduleIdleCalInit() {
  if (typeof window === "undefined") return

  const runtime = getRuntime()
  if (runtime.idleScheduled) return
  runtime.idleScheduled = true

  const init = () => {
    initializePopupCal().catch(() => undefined)
  }
  const whenIdle = () => {
    // Safari has no requestIdleCallback: fall back to a short delay.
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(init, { timeout: 5000 })
    } else {
      setTimeout(init, 2000)
    }
  }

  if (document.readyState === "complete") {
    whenIdle()
  } else {
    window.addEventListener("load", whenIdle, { once: true })
  }
}

export function openCalPopup() {
  const runtime = getRuntime()

  if (runtime.openPromise) {
    return runtime.openPromise
  }

  runtime.openPromise = initializePopupCal()
    .then((cal) => {
      cal("modal", {
        calLink: CAL_LINK,
        config: CAL_POPUP_CONFIG,
      })
      applyBackdropStyle()
    })
    .finally(() => {
      window.setTimeout(() => {
        runtime.openPromise = undefined
      }, 500)
    })

  return runtime.openPromise
}

export function isBookServiceHref(href: string) {
  if (href === CAL_DIRECT_URL) {
    return true
  }

  const pathname = href.split(/[?#]/, 1)[0]?.replace(/\/+$/, "") || "/"
  return pathname === "/book-service" || /\/book-service$/.test(pathname)
}

