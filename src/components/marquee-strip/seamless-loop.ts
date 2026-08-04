import gsap from "gsap"

export type SeamlessLoop = {
  timeline: gsap.core.Timeline
  readonly totalWidth: number
  refresh: () => void
  kill: () => void
}

type SeamlessLoopConfig = {
  durationSeconds: number
  paddingRight?: number | (() => number)
  paused?: boolean
  repeat?: number
}

/**
 * Responsive adaptation of GSAP's official seamless horizontalLoop helper.
 * Each item wraps independently, so the track itself never jumps back to zero.
 */
export function createSeamlessLoop(
  items: HTMLElement[],
  {
    durationSeconds,
    paddingRight = 0,
    paused = false,
    repeat = -1,
  }: SeamlessLoopConfig
): SeamlessLoop {
  let totalWidth = 0
  let timeline: gsap.core.Timeline
  const snap = gsap.utils.snap(0.01)

  timeline = gsap.timeline({
    paused,
    repeat,
    defaults: { ease: "none" },
    onReverseComplete: () =>
      timeline.totalTime(timeline.rawTime() + timeline.duration() * 100),
  })

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
    const lastItem = items[items.length - 1]
    totalWidth =
      lastItem.offsetLeft -
      startX +
      lastItem.offsetWidth +
      resolvedPaddingRight

    const pixelsPerSecond =
      totalWidth / Math.max(durationSeconds, Number.EPSILON)

    items.forEach((item) => {
      const width = item.offsetWidth
      const distanceToStart = item.offsetLeft - startX
      const distanceToLoop = distanceToStart + width

      timeline
        .to(
          item,
          {
            xPercent: snap((-distanceToLoop / width) * 100),
            duration: distanceToLoop / pixelsPerSecond,
          },
          0
        )
        .fromTo(
          item,
          {
            xPercent: snap(
              ((totalWidth - distanceToLoop) / width) * 100
            ),
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
