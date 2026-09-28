import { useEffect, useState } from "react"

// Push-slide layer: transform-only CSS transition, so leaving mid-slide
// reverses from the current position. Shared by category and product cards.
export const HOVER_SLIDE_LAYER =
  "pointer-events-none absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"

const HOVER_SLIDE_QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

/**
 * True only on hover-capable, fine-pointer devices without reduced motion.
 * Starts false so server and first client render match (first image only).
 */
export function useHoverSlideEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(HOVER_SLIDE_QUERY)
    const update = () => setEnabled(media.matches)

    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return enabled
}
