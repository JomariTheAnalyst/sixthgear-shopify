import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * About page motion helpers. Call them inside a gsap.matchMedia() branch for
 * MOTION_OK so every tween and ScrollTrigger is reverted with that branch
 * (unmount, breakpoint or reduced-motion change). Reduced motion gets nothing:
 * the markup already renders the final state.
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

/** Frame opens from a slightly inset clip; the image drifts a little inside it. */
export function revealFrame(frame: Element, drift?: Element | null) {
  gsap.fromTo(
    frame,
    { clipPath: "inset(7% 5% 7% 5% round 20px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 20px)",
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: frame, start: "top 88%", once: true },
    }
  )

  if (drift) {
    // Scaled up so the drift never shows the frame edge.
    gsap.fromTo(
      drift,
      { yPercent: -4, scale: 1.1 },
      {
        yPercent: 4,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    )
  }
}

/** Slides targets up from a visible start (opacity 0.2), one after another. */
export function riseIn(
  targets: gsap.TweenTarget,
  trigger: Element,
  stagger = 0.1
) {
  gsap.fromTo(
    targets,
    { y: 28, opacity: 0.2 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger,
      scrollTrigger: { trigger, start: "top 85%", once: true },
    }
  )
}
