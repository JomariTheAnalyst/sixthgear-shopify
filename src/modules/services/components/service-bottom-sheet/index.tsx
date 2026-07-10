"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useLenis } from "@modules/common/components/lenis-provider"
import { completeRouteProgress } from "@modules/common/components/route-progress"

interface ServiceBottomSheetProps {
  children: React.ReactNode
}

const CLOSE_ANIMATION_MS = 260

export default function ServiceBottomSheet({
  children,
}: ServiceBottomSheetProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  const closeSheet = useCallback(() => {
    completeRouteProgress()
    setIsOpen(false)

    window.setTimeout(() => {
      router.back()
      completeRouteProgress()
    }, CLOSE_ANIMATION_MS)
  }, [router])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    lenis?.stop()
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeSheet()
        return
      }

      if (event.key !== "Tab" || !sheetRef.current) {
        return
      }

      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )

      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [closeSheet, lenis])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[140]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <button
            type="button"
            aria-label="Close service details"
            className="absolute inset-0 bg-black/45"
            onClick={closeSheet}
          />

          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.14 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 160 || info.velocity.y > 700) {
                  closeSheet()
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
                mass: 0.9,
              }}
              className="pointer-events-auto absolute inset-x-0 bottom-0 top-12 md:top-14 lg:top-16 w-full rounded-t-2xl bg-white shadow-[0_-18px_60px_rgba(0,0,0,0.22)] overflow-hidden"
            >
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close service details"
                onClick={closeSheet}
                className="absolute right-0 top-0 z-20 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-bl-2xl bg-[#262322] text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-colors hover:bg-[#1d1a19] focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              <div className="h-full overflow-y-auto overscroll-contain">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
