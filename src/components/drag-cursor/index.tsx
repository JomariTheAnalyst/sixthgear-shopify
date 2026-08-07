"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { montserrat } from "@lib/fonts"

gsap.registerPlugin(useGSAP)

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)"

export type DragCursorMode = "drag" | "explore"

type CursorRuntime = {
  enter: (clientX: number, clientY: number) => void
  move: (clientX: number, clientY: number) => void
  leave: () => void
  press: () => void
  release: () => void
  setMode: (mode: DragCursorMode) => void
}

export type DragCursorHandle = {
  enter: (clientX: number, clientY: number) => boolean
  move: (clientX: number, clientY: number) => void
  leave: () => void
  press: () => void
  release: () => void
  setMode: (mode: DragCursorMode) => void
}

type DragCursorProps = {
  primaryLabel?: string
}

const DragCursor = forwardRef<DragCursorHandle, DragCursorProps>(function DragCursor(
  { primaryLabel = "DRAG" },
  ref
) {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const dragContentRef = useRef<HTMLDivElement | null>(null)
  const exploreContentRef = useRef<HTMLSpanElement | null>(null)
  const runtimeRef = useRef<CursorRuntime | null>(null)
  const modeRef = useRef<DragCursorMode>("drag")
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const pointerQuery = window.matchMedia(FINE_POINTER_QUERY)
    const syncEnabled = () => setEnabled(pointerQuery.matches)

    syncEnabled()
    pointerQuery.addEventListener("change", syncEnabled)

    return () => pointerQuery.removeEventListener("change", syncEnabled)
  }, [])

  useGSAP(
    (_context, contextSafe) => {
      const cursor = cursorRef.current
      const dragContent = dragContentRef.current
      const exploreContent = exploreContentRef.current
      if (
        !enabled ||
        !cursor ||
        !dragContent ||
        !exploreContent ||
        !contextSafe
      ) {
        return
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      const xTo = reducedMotion
        ? null
        : gsap.quickTo(cursor, "x", {
            duration: 0.14,
            ease: "power2.out",
          })
      const yTo = reducedMotion
        ? null
        : gsap.quickTo(cursor, "y", {
            duration: 0.14,
            ease: "power2.out",
          })

      gsap.set(cursor, {
        autoAlpha: 0,
        scale: 0.86,
        xPercent: -50,
        yPercent: -50,
      })
      gsap.set(dragContent, { autoAlpha: 1, y: 0 })
      gsap.set(exploreContent, { autoAlpha: 0, y: 4 })

      const setMode = contextSafe((mode: DragCursorMode) => {
        if (modeRef.current === mode) return
        modeRef.current = mode

        gsap.to(dragContent, {
          autoAlpha: mode === "drag" ? 1 : 0,
          y: mode === "drag" ? 0 : -4,
          duration: reducedMotion ? 0 : 0.14,
          ease: "power2.out",
          overwrite: "auto",
        })
        gsap.to(exploreContent, {
          autoAlpha: mode === "explore" ? 1 : 0,
          y: mode === "explore" ? 0 : 4,
          duration: reducedMotion ? 0 : 0.14,
          ease: "power2.out",
          overwrite: "auto",
        })
      })

      const positionImmediately = (clientX: number, clientY: number) => {
        gsap.set(cursor, { x: clientX, y: clientY })
      }

      const enter = contextSafe((clientX: number, clientY: number) => {
        setMode("drag")
        positionImmediately(clientX, clientY)
        gsap.to(cursor, {
          autoAlpha: 1,
          scale: 1,
          duration: reducedMotion ? 0 : 0.14,
          ease: "power2.out",
          overwrite: "auto",
        })
      })

      const move = (clientX: number, clientY: number) => {
        if (reducedMotion) {
          positionImmediately(clientX, clientY)
          return
        }

        xTo?.(clientX)
        yTo?.(clientY)
      }

      const leave = contextSafe(() => {
        gsap.to(cursor, {
          autoAlpha: 0,
          scale: 0.86,
          duration: reducedMotion ? 0 : 0.12,
          ease: "power1.out",
          overwrite: "auto",
        })
      })

      const press = contextSafe(() => {
        gsap.to(cursor, {
          scale: 0.9,
          duration: reducedMotion ? 0 : 0.1,
          ease: "power1.out",
          overwrite: "auto",
        })
      })

      const release = contextSafe(() => {
        gsap.to(cursor, {
          scale: 1,
          duration: reducedMotion ? 0 : 0.12,
          ease: "power1.out",
          overwrite: "auto",
        })
      })

      runtimeRef.current = { enter, move, leave, press, release, setMode }

      return () => {
        runtimeRef.current = null
        xTo?.tween.kill()
        yTo?.tween.kill()
        gsap.killTweensOf(cursor)
        gsap.killTweensOf([dragContent, exploreContent])
        modeRef.current = "drag"
      }
    },
    {
      scope: cursorRef,
      dependencies: [enabled],
      revertOnUpdate: true,
    }
  )

  useImperativeHandle(
    ref,
    () => ({
      enter(clientX, clientY) {
        const runtime = runtimeRef.current
        if (!runtime) return false

        runtime.enter(clientX, clientY)
        return true
      },
      move(clientX, clientY) {
        runtimeRef.current?.move(clientX, clientY)
      },
      leave() {
        runtimeRef.current?.leave()
      },
      press() {
        runtimeRef.current?.press()
      },
      release() {
        runtimeRef.current?.release()
      },
      setMode(mode) {
        runtimeRef.current?.setMode(mode)
      },
    }),
    []
  )

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`${montserrat.className} pointer-events-none fixed left-0 top-0 z-[100] flex min-w-[144px] select-none items-center justify-center rounded-full border-[3px] border-[#111111] bg-white px-6 py-3 text-[13px] font-black uppercase tracking-[0.14em] text-[#111111] opacity-0 shadow-[0_5px_18px_rgba(0,0,0,0.22)] will-change-transform`}
    >
      <div ref={dragContentRef} className="flex items-center gap-3">
        <span aria-hidden="true">{"\u2190"}</span>
        <span>{primaryLabel}</span>
        <span aria-hidden="true">{"\u2192"}</span>
      </div>
      <span
        ref={exploreContentRef}
        className="invisible absolute inset-0 flex items-center justify-center opacity-0"
      >
        EXPLORE
      </span>
    </div>
  )
})

DragCursor.displayName = "DragCursor"

export default DragCursor
