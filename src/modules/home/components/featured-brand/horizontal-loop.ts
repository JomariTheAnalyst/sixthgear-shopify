import gsap from "gsap"

export type HorizontalLoop = {
  timeline: gsap.core.Timeline
  totalWidth: number
  refresh: () => void
  kill: () => void
}

type HorizontalLoopConfig = {
  paddingRight?: number | (() => number)
  speed?: number
}

/**
 * A one-set adaptation of GSAP's official horizontalLoop helper pattern.
 * Each item wraps independently when it leaves the viewport, so the DOM only
 * needs one real collection of cards and never exposes a duplicated track.
 */
export function createHorizontalLoop(
  items: HTMLElement[],
  { paddingRight = 0, speed = 1 }: HorizontalLoopConfig = {}
): HorizontalLoop {
  let totalWidth = 0
  let timeline: gsap.core.Timeline

  timeline = gsap.timeline({
    paused: true,
    repeat: -1,
    defaults: { ease: "none" },
    onReverseComplete: () =>
      timeline.totalTime(timeline.rawTime() + timeline.duration() * 100),
  })

  const pixelsPerSecond = Math.max(speed, 0.01) * 100

  const rebuild = () => {
    const previousProgress = timeline.progress()
    const resolvedPaddingRight =
      typeof paddingRight === "function" ? paddingRight() : paddingRight

    timeline.clear()
    gsap.set(items, { x: 0, xPercent: 0 })

    if (items.length === 0) {
      totalWidth = 0
      return
    }

    const startX = items[0].offsetLeft
    const finalItem = items[items.length - 1]
    totalWidth =
      finalItem.offsetLeft -
      startX +
      finalItem.offsetWidth +
      resolvedPaddingRight

    items.forEach((item) => {
      const width = item.offsetWidth
      const distanceToStart = item.offsetLeft - startX
      const distanceToLoop = distanceToStart + width

      timeline
        .to(
          item,
          {
            xPercent: (-distanceToLoop / width) * 100,
            duration: distanceToLoop / pixelsPerSecond,
          },
          0
        )
        .fromTo(
          item,
          {
            xPercent: ((totalWidth - distanceToLoop) / width) * 100,
          },
          {
            xPercent: 0,
            duration: (totalWidth - distanceToLoop) / pixelsPerSecond,
            immediateRender: false,
          },
          distanceToLoop / pixelsPerSecond
        )
    })

    timeline.progress(1, true).progress(previousProgress, true)
  }

  rebuild()

  return {
    timeline,
    get totalWidth() {
      return totalWidth
    },
    refresh: rebuild,
    kill: () => timeline.kill(),
  }
}
