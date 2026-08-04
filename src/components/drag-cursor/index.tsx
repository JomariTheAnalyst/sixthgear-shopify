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

type CursorRuntime = {
  enter: (clientX: number, clientY: number) => void
  move: (clientX: number, clientY: number) => void
  leave: () => void
  press: () => void
  release: () => void
}

export type DragCursorHandle = {
  enter: (clientX: number, clientY: number) => boolean
  move: (clientX: number, clientY: number) => void
  leave: () => void
  press: () => void
  release: () => void
}

const DragCursor = forwardRef<DragCursorHandle>(function DragCursor(_, ref) {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const runtimeRef = useRef<CursorRuntime | null>(null)
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
      if (!enabled || !cursor || !contextSafe) return

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

      const positionImmediately = (clientX: number, clientY: number) => {
        gsap.set(cursor, { x: clientX, y: clientY })
      }

      const enter = contextSafe((clientX: number, clientY: number) => {
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

      runtimeRef.current = { enter, move, leave, press, release }

      return () => {
        runtimeRef.current = null
        xTo?.tween.kill()
        yTo?.tween.kill()
        gsap.killTweensOf(cursor)
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
    }),
    []
  )

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`${montserrat.className} pointer-events-none fixed left-0 top-0 z-[100] flex select-none items-center gap-3 rounded-full border-[3px] border-[#111111] bg-white px-6 py-3 text-[13px] font-black uppercase tracking-[0.14em] text-[#111111] opacity-0 shadow-[0_5px_18px_rgba(0,0,0,0.22)] will-change-transform`}
    >
      <span aria-hidden="true">{"\u2190"}</span>
      <span>DRAG</span>
      <span aria-hidden="true">{"\u2192"}</span>
    </div>
  )
})

DragCursor.displayName = "DragCursor"

export default DragCursor
