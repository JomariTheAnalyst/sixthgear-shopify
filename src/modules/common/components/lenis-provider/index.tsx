"use client"

import Lenis from "lenis"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type LenisInstance = InstanceType<typeof Lenis>

const LenisContext = createContext<LenisInstance | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<LenisInstance | null>(null)

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
    })

    let rafId = 0

    const raf = (time: number) => {
      instance.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    setLenis(instance)
    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  )
}
