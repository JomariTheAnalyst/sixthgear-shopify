"use client"

import Image from "next/image"
import {
  useCallback,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import { InertiaPlugin } from "gsap/InertiaPlugin"

import DragCursor, {
  type DragCursorHandle,
} from "components/drag-cursor"
import { montserrat } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { createHorizontalLoop, type HorizontalLoop } from "./horizontal-loop"

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin)

export type BrandCardItem = {
  id: string
  name: string
  imageUrl: string
  imageAlt: string
  link: string
  decorativeImage: boolean
}

const DRAG_THRESHOLD_PX = 8
const PARALLAX_MAX_PERCENT = 7

type ParallaxMetric = {
  left: number
  width: number
}

function CardArtwork({
  brand,
  onImageLoad,
}: {
  brand: BrandCardItem
  onImageLoad: () => void
}) {
  return (
    <>
      <div
        data-brand-parallax
        className="absolute inset-y-0 -left-[8%] w-[116%] will-change-transform"
      >
        <Image
          src={brand.imageUrl}
          alt={brand.decorativeImage ? "" : brand.imageAlt}
          fill
          draggable={false}
          onLoad={onImageLoad}
          className="select-none object-cover"
          sizes="(max-width: 639px) 72vw, (max-width: 767px) 48vw, (max-width: 1023px) 34vw, (max-width: 1279px) 26vw, (max-width: 1535px) 22vw, 19vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 md:p-6">
        <h3
          className={`${montserrat.className} text-[20px] font-black uppercase leading-[1.05] tracking-[0.045em] text-white sm:text-[22px] lg:text-[25px]`}
        >
          {brand.name}
        </h3>

        <span
          className={`${montserrat.className} mt-3 hidden w-fit bg-black px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white md:inline-flex`}
        >
          SHOP NOW
        </span>
      </div>
    </>
  )
}

export default function BrandCards({ brands }: { brands: BrandCardItem[] }) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const dragCursorRef = useRef<DragCursorHandle | null>(null)
  const refreshLoopRef = useRef<(() => void) | null>(null)
  const draggedRef = useRef(false)

  useGSAP(
    () => {
      const viewport = viewportRef.current
      const track = trackRef.current

      if (!viewport || !track || brands.length <= 1) return

      const slides = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-brand-slide]")
      )
      const parallaxImages = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-brand-parallax]")
      )
      const wrapProgress = gsap.utils.wrap(0, 1)
      const parallaxSetters = parallaxImages.map((image) =>
        gsap.quickSetter(image, "xPercent")
      )

      let reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      let loop: HorizontalLoop
      let draggable: Draggable | null = null
      let parallaxMetrics: ParallaxMetric[] = []
      let viewportWidth = 0
      let dragOriginX = 0
      let dragStartProgress = 0

      const getGap = () => {
        const styles = window.getComputedStyle(track)
        return Number.parseFloat(styles.columnGap || styles.gap) || 0
      }

      const measureParallax = () => {
        const startX = slides[0]?.offsetLeft ?? 0
        viewportWidth = viewport.clientWidth
        parallaxMetrics = slides.map((slide) => ({
          left: slide.offsetLeft - startX,
          width: slide.offsetWidth,
        }))
      }

      const updateParallax = () => {
        if (reducedMotion) {
          parallaxSetters.forEach((setX) => setX(0))
          return
        }

        const totalWidth = loop.totalWidth
        if (totalWidth <= 0 || viewportWidth <= 0) return

        const travelled = loop.timeline.progress() * totalWidth
        const viewportCenter = viewportWidth / 2

        parallaxMetrics.forEach(({ left, width }, index) => {
          const wrappedLeft = gsap.utils.wrap(
            -width,
            totalWidth - width,
            left - travelled
          )
          const slideCenter = wrappedLeft + width / 2
          const normalizedDistance = gsap.utils.clamp(
            -1,
            1,
            (slideCenter - viewportCenter) / (viewportCenter + width / 2)
          )

          parallaxSetters[index](-normalizedDistance * PARALLAX_MAX_PERCENT)
        })
      }

      const setLoopProgress = (progress: number) => {
        loop.timeline.progress(wrapProgress(progress), true)
        updateParallax()
      }

      const refreshMeasurements = () => {
        draggable?.tween?.kill()
        loop.refresh()
        measureParallax()
        updateParallax()
      }

      const updateFromProxy = (proxyX: number) => {
        if (loop.totalWidth <= 0) return

        const dragDistance = proxyX - dragOriginX
        if (Math.abs(dragDistance) >= DRAG_THRESHOLD_PX) {
          draggedRef.current = true
        }

        setLoopProgress(dragStartProgress - dragDistance / loop.totalWidth)
      }

      loop = createHorizontalLoop(slides, {
        paddingRight: getGap,
        speed: 1,
      })
      measureParallax()
      updateParallax()

      const proxy = document.createElement("div")
      ;[draggable] = Draggable.create(proxy, {
        trigger: viewport,
        type: "x",
        inertia: !reducedMotion,
        dragClickables: true,
        minimumMovement: DRAG_THRESHOLD_PX,
        allowNativeTouchScrolling: true,
        onPressInit() {
          this.tween?.kill()
          dragOriginX = this.x
          dragStartProgress = loop.timeline.progress()
          draggedRef.current = false
          dragCursorRef.current?.press()
        },
        onDragStart() {
          draggedRef.current = true
        },
        onDrag() {
          updateFromProxy(this.x)
        },
        onThrowUpdate() {
          updateFromProxy(this.x)
        },
        onRelease() {
          dragCursorRef.current?.release()
        },
      })

      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: reduce)", () => {
        reducedMotion = true
        if (draggable) draggable.vars.inertia = false
        parallaxSetters.forEach((setX) => setX(0))

        return () => {
          reducedMotion = false
          if (draggable) draggable.vars.inertia = true
        }
      })

      const handleWheel = (event: WheelEvent) => {
        if (
          loop.totalWidth <= 0 ||
          Math.abs(event.deltaX) <= Math.abs(event.deltaY)
        ) {
          return
        }

        event.preventDefault()
        draggable?.tween?.kill()
        setLoopProgress(
          loop.timeline.progress() + event.deltaX / loop.totalWidth
        )
      }

      viewport.addEventListener("wheel", handleWheel, { passive: false })

      const resizeCall = gsap.delayedCall(0.12, refreshMeasurements).pause()
      refreshLoopRef.current = () => resizeCall.restart(true)
      const resizeObserver = new ResizeObserver(() => {
        resizeCall.restart(true)
      })
      resizeObserver.observe(viewport)

      return () => {
        resizeObserver.disconnect()
        resizeCall.kill()
        draggable?.tween?.kill()
        draggable?.kill()
        loop.kill()
        media.revert()
        viewport.removeEventListener("wheel", handleWheel)
        refreshLoopRef.current = null
      }
    },
    {
      scope: carouselRef,
      dependencies: [brands.length],
      revertOnUpdate: true,
    }
  )

  const handleCardClickCapture = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      const interactionWasDrag = draggedRef.current
      draggedRef.current = false

      if (interactionWasDrag) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    []
  )

  const handlePointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      const cursorActivated = dragCursorRef.current?.enter(
        event.clientX,
        event.clientY
      )

      if (cursorActivated) event.currentTarget.style.cursor = "none"
    },
    []
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      dragCursorRef.current?.move(event.clientX, event.clientY)
    },
    []
  )

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      event.currentTarget.style.cursor = ""
      dragCursorRef.current?.leave()
    },
    []
  )

  const handlePointerDown = useCallback(() => {
    draggedRef.current = false
    dragCursorRef.current?.press()
  }, [])

  const handlePointerUp = useCallback(() => {
    dragCursorRef.current?.release()
  }, [])

  const handleImageLoad = useCallback(() => {
    refreshLoopRef.current?.()
  }, [])

  if (brands.length === 0) return null

  return (
    <div ref={carouselRef} className="relative w-full overflow-hidden">
      <div
        ref={viewportRef}
        className="w-full overflow-hidden touch-pan-y"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured brands"
      >
        <div ref={trackRef} className="flex w-max gap-1.5" role="list">
          {brands.map((brand, sourceIndex) => (
            <div
              key={brand.id}
              data-brand-slide
              className="relative aspect-[4/5] w-[72vw] shrink-0 will-change-transform sm:w-[48vw] md:w-[34vw] lg:w-[26vw] xl:w-[22vw] 2xl:w-[19vw]"
              role="listitem"
              aria-roledescription="slide"
              aria-label={`${sourceIndex + 1} of ${brands.length}`}
            >
              <LocalizedClientLink
                href={brand.link}
                draggable={false}
                onClickCapture={handleCardClickCapture}
                onPointerEnter={handlePointerEnter}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerLeave}
                className="group relative block h-full w-full overflow-hidden bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
              >
                <CardArtwork brand={brand} onImageLoad={handleImageLoad} />
              </LocalizedClientLink>
            </div>
          ))}
        </div>
      </div>

      <DragCursor ref={dragCursorRef} />
    </div>
  )
}
