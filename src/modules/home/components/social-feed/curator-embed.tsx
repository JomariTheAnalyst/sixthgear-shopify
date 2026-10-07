"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

import { clientEnv } from "@lib/env"
import styles from "./curator-embed.module.css"

const CURATOR_SCRIPT_ELEMENT_ID = "sixthgear-homepage-curator-embed"

// Curator owns the nodes inside its container. Preserve those nodes across
// client navigation so the published bootstrap never initializes twice.
let preservedWidgetContent: DocumentFragment | null = null

function enableMouseDragging(scroller: HTMLElement) {
  let activePointerId: number | null = null
  let startX = 0
  let startScrollLeft = 0
  let dragged = false

  const handlePointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return

    activePointerId = event.pointerId
    startX = event.clientX
    startScrollLeft = scroller.scrollLeft
    dragged = false
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (activePointerId !== event.pointerId) return

    const distance = event.clientX - startX
    if (Math.abs(distance) <= 4) return

    if (!dragged) {
      dragged = true
      scroller.dataset.curatorDragging = "true"
      scroller.setPointerCapture(event.pointerId)
    }

    scroller.scrollLeft = startScrollLeft - distance
    event.preventDefault()
  }

  const finishDragging = (event: PointerEvent) => {
    if (activePointerId !== event.pointerId) return

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId)
    }
    activePointerId = null
    delete scroller.dataset.curatorDragging
  }

  const handleClick = (event: MouseEvent) => {
    if (!dragged) return

    event.preventDefault()
    event.stopPropagation()
    dragged = false
  }

  const preventNativeDrag = (event: DragEvent) => event.preventDefault()

  scroller.addEventListener("pointerdown", handlePointerDown)
  scroller.addEventListener("pointermove", handlePointerMove)
  window.addEventListener("pointerup", finishDragging)
  window.addEventListener("pointercancel", finishDragging)
  scroller.addEventListener("click", handleClick, true)
  scroller.addEventListener("dragstart", preventNativeDrag)

  return () => {
    scroller.removeEventListener("pointerdown", handlePointerDown)
    scroller.removeEventListener("pointermove", handlePointerMove)
    window.removeEventListener("pointerup", finishDragging)
    window.removeEventListener("pointercancel", finishDragging)
    scroller.removeEventListener("click", handleClick, true)
    scroller.removeEventListener("dragstart", preventNativeDrag)
    delete scroller.dataset.curatorDragging
  }
}

export default function CuratorEmbed() {
  const embedRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isNearScreen, setIsNearScreen] = useState(false)
  const containerId = clientEnv.NEXT_PUBLIC_CURATOR_CONTAINER_ID
  const scriptUrl = clientEnv.NEXT_PUBLIC_CURATOR_EMBED_SCRIPT_URL

  // The feed sits near the footer: load Curator only within about one screen.
  useEffect(() => {
    const embed = embedRef.current
    if (!embed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsNearScreen(true)
        observer.disconnect()
      },
      { rootMargin: "100% 0px" }
    )
    observer.observe(embed)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (preservedWidgetContent?.hasChildNodes()) {
      container.appendChild(preservedWidgetContent)
      preservedWidgetContent = null
    }

    let activeScroller: HTMLElement | null = null
    let removeMouseDragging: (() => void) | null = null

    const attachCarouselBehavior = () => {
      const scroller = container.querySelector<HTMLElement>(".crt-feed")
      if (!scroller || scroller === activeScroller) return

      removeMouseDragging?.()
      activeScroller = scroller
      removeMouseDragging = enableMouseDragging(scroller)
    }

    attachCarouselBehavior()

    const observer = new MutationObserver(attachCarouselBehavior)
    observer.observe(container, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      removeMouseDragging?.()

      if (!container.hasChildNodes()) return

      const fragment = document.createDocumentFragment()
      while (container.firstChild) {
        fragment.appendChild(container.firstChild)
      }
      preservedWidgetContent = fragment
    }
  }, [])

  return (
    <div ref={embedRef} className={styles.embed}>
      <div
        ref={containerRef}
        id={containerId}
        className={styles.container}
        aria-label="Sixth Gear social media carousel"
      />
      {isNearScreen && (
        <Script
          id={CURATOR_SCRIPT_ELEMENT_ID}
          src={scriptUrl}
          strategy="afterInteractive"
          async
        />
      )}
    </div>
  )
}
