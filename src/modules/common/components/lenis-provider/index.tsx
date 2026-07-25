"use client"

import Lenis from "lenis"
import { usePathname } from "next/navigation"
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

type LenisInstance = InstanceType<typeof Lenis>

type LenisContextValue = {
  lenis: LenisInstance | null
  acquireScrollLock: () => () => void
}

const LenisContext = createContext<LenisContextValue | null>(null)

export function useLenis() {
  return useContext(LenisContext)?.lenis ?? null
}

export function useLenisScrollLock(active: boolean) {
  const acquireScrollLock = useContext(LenisContext)?.acquireScrollLock

  useEffect(() => {
    if (!active || !acquireScrollLock) return
    return acquireScrollLock()
  }, [active, acquireScrollLock])
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [lenis, setLenis] = useState<LenisInstance | null>(null)
  const lenisRef = useRef<LenisInstance | null>(null)
  const lockCountRef = useRef(0)
  const previousOverflowRef = useRef("")

  const acquireScrollLock = useCallback(() => {
    if (lockCountRef.current === 0) {
      previousOverflowRef.current = document.body.style.overflow
      document.body.style.overflow = "hidden"
      lenisRef.current?.stop()
    }

    lockCountRef.current += 1
    let released = false

    return () => {
      if (released) return
      released = true
      lockCountRef.current = Math.max(0, lockCountRef.current - 1)

      if (lockCountRef.current === 0) {
        document.body.style.overflow = previousOverflowRef.current
        lenisRef.current?.start()
        lenisRef.current?.resize()
      }
    }
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      return
    }

    const instance = new Lenis({
      duration: 1,
      smoothWheel: true,
      syncTouch: false,
      autoResize: true,
    })

    let rafId = 0

    const raf = (time: number) => {
      instance.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    lenisRef.current = instance
    if (lockCountRef.current > 0) {
      instance.stop()
    }
    setLenis(instance)
    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      instance.destroy()
      if (lenisRef.current === instance) {
        lenisRef.current = null
      }
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    if (!lenis) return

    const rafId = window.requestAnimationFrame(() => {
      lenis.resize()
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [lenis, pathname])

  return (
    <LenisContext.Provider value={{ lenis, acquireScrollLock }}>
      {children}
    </LenisContext.Provider>
  )
}
