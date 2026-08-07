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
const TOUCH_DRAG_THRESHOLD_PX = 2
const TOUCH_THROW_RESISTANCE = 650
const DEFAULT_THROW_RESISTANCE = 1000
const PARALLAX_MAX_PERCENT = 7

type ParallaxMetric = {
  left: number
  width: number
}

function CardArtwork({
  brand,
  onImageLoad,
  onLinkClickCapture,
  onActionPointerEnter,
  onActionPointerLeave,
}: {
  brand: BrandCardItem
  onImageLoad: () => void
  onLinkClickCapture: (event: ReactMouseEvent<HTMLAnchorElement>) => void
  onActionPointerEnter: (
    event: ReactPointerEvent<HTMLAnchorElement>
  ) => void
  onActionPointerLeave: (
    event: ReactPointerEvent<HTMLAnchorElement>
  ) => void
}) {
  return (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f2f2ef] md:absolute md:inset-0 md:aspect-auto">
        <div
          data-brand-parallax
          className="absolute inset-0 will-change-transform"
        >
          <div
            data-brand-image-zoom
            className="absolute inset-0 will-change-transform"
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
        </div>
      </div>

      <div className="hidden md:absolute md:inset-x-0 md:top-0 md:z-10 md:block md:p-6">
        <h3
          className={`${montserrat.className} text-[22px] font-black uppercase leading-[1.05] tracking-[0.045em] text-white [text-shadow:0_1px_5px_rgba(0,0,0,0.7)] lg:text-[25px]`}
        >
          {brand.name}
        </h3>
      </div>

      <div className="hidden md:absolute md:inset-x-0 md:bottom-0 md:z-10 md:flex md:justify-center md:p-6">
        <LocalizedClientLink
          href={brand.link}
          draggable={false}
          onClickCapture={onLinkClickCapture}
          onPointerEnter={onActionPointerEnter}
          onPointerLeave={onActionPointerLeave}
          className={`${montserrat.className} inline-flex min-h-11 w-full max-w-[230px] cursor-none items-center justify-center rounded-full bg-[#0874d1] px-6 py-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_7px_18px_rgba(8,116,209,0.24)] will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white`}
        >
          SHOP NOW
        </LocalizedClientLink>
      </div>

      <div className="flex min-h-12 items-center justify-center bg-[#f2f2ef] px-3 py-3 text-center md:hidden">
        <h3
          className={`${montserrat.className} text-[13px] font-semibold uppercase leading-tight tracking-[0.04em] text-[#161616]`}
        >
          {brand.name}
        </h3>
      </div>

      <LocalizedClientLink
        href={brand.link}
        draggable={false}
        aria-label={`Shop ${brand.name}`}
        onClickCapture={onLinkClickCapture}
        className="absolute inset-0 z-20 md:hidden"
      />
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
  const { contextSafe } = useGSAP({ scope: carouselRef })

  const animateCardImage = contextSafe(
    (card: HTMLElement, scale: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return
      }

      const imageLayer = card.querySelector<HTMLElement>(
        "[data-brand-image-zoom]"
      )
      if (!imageLayer) return

      gsap.to(imageLayer, {
        scale,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      })
    }
  )

  const animateActionButton = contextSafe(
    (button: HTMLAnchorElement, active: boolean) => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      gsap.to(button, {
        scale: reducedMotion ? 1 : active ? 1.045 : 1,
        y: reducedMotion ? 0 : active ? -2 : 0,
        backgroundColor: active ? "#005fb8" : "#0874d1",
        duration: reducedMotion ? 0 : 0.2,
        ease: "power2.out",
        overwrite: "auto",
      })
    }
  )

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
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches
      const dragThreshold = coarsePointer
        ? TOUCH_DRAG_THRESHOLD_PX
        : DRAG_THRESHOLD_PX

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
        if (Math.abs(dragDistance) >= dragThreshold) {
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
        minimumMovement: dragThreshold,
        throwResistance: coarsePointer
          ? TOUCH_THROW_RESISTANCE
          : DEFAULT_THROW_RESISTANCE,
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
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const cursorActivated = dragCursorRef.current?.enter(
        event.clientX,
        event.clientY
      )

      if (cursorActivated) event.currentTarget.style.cursor = "none"
      animateCardImage(event.currentTarget, 1.035)
    },
    [animateCardImage]
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      dragCursorRef.current?.move(event.clientX, event.clientY)
    },
    []
  )

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.currentTarget.style.cursor = ""
      animateCardImage(event.currentTarget, 1)
      dragCursorRef.current?.setMode("drag")
      dragCursorRef.current?.leave()
    },
    [animateCardImage]
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

  const handleActionPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      dragCursorRef.current?.setMode("explore")
      animateActionButton(event.currentTarget, true)
    },
    [animateActionButton]
  )

  const handleActionPointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      dragCursorRef.current?.setMode("drag")
      animateActionButton(event.currentTarget, false)
    },
    [animateActionButton]
  )

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
              className="relative w-[72vw] shrink-0 will-change-transform sm:w-[48vw] md:aspect-[4/5] md:w-[34vw] lg:w-[26vw] xl:w-[22vw] 2xl:w-[19vw]"
              role="listitem"
              aria-roledescription="slide"
              aria-label={`${sourceIndex + 1} of ${brands.length}`}
              onPointerEnter={handlePointerEnter}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerLeave}
            >
              <div className="group relative block w-full overflow-hidden bg-[#f2f2ef] md:h-full">
                <CardArtwork
                  brand={brand}
                  onImageLoad={handleImageLoad}
                  onLinkClickCapture={handleCardClickCapture}
                  onActionPointerEnter={handleActionPointerEnter}
                  onActionPointerLeave={handleActionPointerLeave}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <DragCursor ref={dragCursorRef} />
    </div>
  )
}
