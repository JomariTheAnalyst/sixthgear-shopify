"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

import { montserrat, nationalCompressed } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import type { EditorialCard } from "./config"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

export type EditorialCardWithCount = EditorialCard & {
  /** "48" or "250+"; null hides the count. */
  count: string | null
}

// Same blend setup as the category card titles. The card's `isolate` keeps the
// difference blend inside the card.
const BLEND = "text-white mix-blend-difference"

// Inverse of brand orange #f15a24: under the difference blend it reads orange
// over the light studio backdrops.
const ACCENT = "text-[#0ea5db]"

const IMAGE_SIZES = "(max-width: 767px) 100vw, 50vw"

// Desktop-only slow zoom: hover-capable fine pointer with motion allowed.
const IMAGE_ZOOM =
  "transition-transform duration-[1200ms] ease-out [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover:scale-105"

function CornerText({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className={ACCENT}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

function EditorialCardLink({
  card,
  index,
}: {
  card: EditorialCardWithCount
  index: number
}) {
  const label = [
    `Shop ${card.title}`,
    card.tag,
    card.count && `${card.count} products`,
  ]
    .filter(Boolean)
    .join(", ")
  const isRight = index % 2 === 1

  return (
    <LocalizedClientLink
      href={`/collections/${card.handle}`}
      aria-label={label}
      data-rc-card
      className="group relative isolate block aspect-[878/909] w-full overflow-hidden bg-[#f1f1ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#111111]"
    >
      <Image
        src={card.image}
        alt={card.imageAlt}
        fill
        sizes={IMAGE_SIZES}
        draggable={false}
        className={`select-none object-cover object-center ${IMAGE_ZOOM}`}
      />

      {card.cornerText ? (
        <p
          data-rc-corner
          className={`${montserrat.className} pointer-events-none absolute top-4 max-w-[72%] text-[11px] font-extrabold uppercase leading-[1.12] [text-wrap:balance] md:top-[3.6%] md:max-w-[36%] md:text-[clamp(0.6875rem,0.82vw,1rem)] ${
            isRight
              ? "right-4 text-right md:right-[3.4%]"
              : "left-4 md:left-[3.4%]"
          } ${BLEND}`}
        >
          <CornerText text={card.cornerText} />
        </p>
      ) : null}

      <h3
        className={`${nationalCompressed.className} pointer-events-none absolute bottom-3 left-4 flex items-baseline uppercase leading-none md:bottom-[3.2%] md:left-[3.4%] ${BLEND}`}
      >
        <span data-rc-split className="text-[15vw] md:text-[6vw]">
          {card.title}
        </span>
        <span
          data-rc-split
          className="ml-[0.06em] text-[max(0.875rem,4.8vw)] md:text-[2vw]"
        >
          ({card.tag})
        </span>
      </h3>

      {card.count ? (
        <p
          className={`pointer-events-none absolute bottom-4 right-4 text-sm font-light tracking-[0.08em] md:bottom-[5.2%] md:right-[3.4%] md:text-[clamp(0.875rem,1vw,1.125rem)] ${BLEND}`}
        >
          [ {card.count} ]
        </p>
      ) : null}
    </LocalizedClientLink>
  )
}

/**
 * Torn paper strip over the seam between the two cards (desktop only).
 * Both edges wander independently but always cover the seam at x=20; the
 * filter adds fibrous roughness, faint paper fibres and a soft shadow.
 */
function TornEdge() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 40 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-y-0 left-[calc(50%-20px)] z-10 hidden h-full w-10 md:block"
    >
      <defs>
        <filter
          id="rc-torn-edge"
          x="-25%"
          y="-1%"
          width="150%"
          height="102%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.45 0.09"
            numOctaves={3}
            seed={7}
            result="edgeNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="edgeNoise"
            scale={2.4}
            xChannelSelector="R"
            yChannelSelector="G"
            result="paper"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1 0.05"
            numOctaves={2}
            seed={3}
            result="fibreNoise"
          />
          <feColorMatrix
            in="fibreNoise"
            type="matrix"
            values="0 0 0 0 0.55  0 0 0 0 0.54  0 0 0 0 0.52  1.6 0 0 0 -0.95"
            result="fibres"
          />
          <feComposite
            in="fibres"
            in2="paper"
            operator="in"
            result="paperFibres"
          />
          <feGaussianBlur in="paper" stdDeviation={0.9} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.42 0"
            result="shade"
          />
          <feOffset in="shade" dx={0.7} result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="paper" />
            <feMergeNode in="paperFibres" />
          </feMerge>
        </filter>
      </defs>
      <path fill="#fbfaf8" filter="url(#rc-torn-edge)" d="M15.0 0L15.4 5L14.8 10L14.9 15L14.7 20L14.6 25L15.0 30L15.1 35L14.7 40L14.9 45L14.9 50L15.4 55L14.8 60L15.4 65L15.4 70L15.4 75L15.3 80L15.8 85L15.9 90L16.0 95L15.8 100L15.6 105L16.1 110L16.2 115L15.3 120L15.7 125L15.3 130L15.4 135L15.3 140L16.0 145L15.6 150L15.9 155L14.9 160L15.5 165L14.7 170L15.1 175L15.2 180L15.3 185L15.3 190L15.3 195L15.1 200L15.7 205L15.5 210L16.0 215L15.8 220L15.7 225L15.2 230L15.1 235L14.9 240L15.6 245L14.8 250L14.7 255L15.1 260L14.4 265L14.3 270L14.8 275L14.7 280L14.5 285L14.4 290L14.3 295L14.7 300L14.3 305L14.5 310L14.2 315L14.3 320L14.3 325L15.2 330L14.7 335L15.2 340L15.1 345L15.4 350L15.7 355L16.0 360L15.6 365L15.8 370L15.5 375L15.6 380L15.7 385L15.7 390L15.5 395L16.1 400L15.6 405L16.1 410L15.5 415L16.2 420L15.5 425L16.0 430L15.6 435L15.3 440L15.3 445L15.1 450L15.2 455L15.3 460L15.0 465L14.8 470L14.8 475L14.2 480L13.8 485L14.1 490L13.9 495L13.3 500L14.2 505L13.5 510L13.6 515L13.8 520L14.3 525L14.2 530L14.4 535L14.3 540L14.3 545L14.5 550L14.4 555L14.2 560L14.0 565L13.7 570L14.0 575L13.7 580L14.0 585L13.9 590L14.2 595L14.3 600L14.0 605L13.5 610L13.9 615L13.6 620L13.3 625L13.3 630L13.6 635L13.3 640L13.1 645L13.7 650L13.1 655L13.4 660L13.6 665L13.6 670L13.3 675L13.4 680L13.7 685L13.4 690L13.3 695L13.7 700L13.2 705L13.8 710L13.7 715L13.8 720L13.0 725L13.8 730L13.2 735L13.8 740L13.5 745L13.4 750L13.9 755L13.7 760L13.3 765L13.9 770L13.7 775L14.3 780L13.6 785L14.3 790L14.0 795L14.9 800L14.4 805L14.3 810L14.6 815L14.1 820L14.0 825L13.9 830L14.4 835L14.0 840L13.5 845L13.9 850L13.4 855L14.0 860L13.5 865L13.7 870L13.8 875L13.8 880L14.3 885L14.2 890L14.3 895L14.5 900L14.3 905L14.5 910L14.2 915L13.7 920L13.7 925L13.7 930L13.8 935L13.7 940L13.3 945L13.0 950L13.3 955L12.6 960L12.7 965L12.6 970L12.6 975L12.5 980L12.4 985L12.6 990L12.7 995L13.0 1000L25.6 1000L25.2 995L26.2 990L24.8 985L26.2 980L25.6 975L25.4 970L25.0 965L26.1 960L25.9 955L25.7 950L26.6 945L27.0 940L26.2 935L27.0 930L27.7 925L28.2 920L28.3 915L28.6 910L27.7 905L27.8 900L27.7 895L27.5 890L28.1 885L27.6 880L28.3 875L28.9 870L28.4 865L28.6 860L29.8 855L29.7 850L30.3 845L30.2 840L29.7 835L30.7 830L29.5 825L30.8 820L30.7 815L29.6 810L30.9 805L30.0 800L29.2 795L30.0 790L28.8 785L28.9 780L27.1 775L27.9 770L25.8 765L26.1 760L26.1 755L26.6 750L25.9 745L26.1 740L25.3 735L24.9 730L25.8 725L25.8 720L25.1 715L25.5 710L26.0 705L26.7 700L27.1 695L26.1 690L26.7 685L26.3 680L26.8 675L27.1 670L26.5 665L25.2 660L26.3 655L26.0 650L25.9 645L26.0 640L26.5 635L24.1 630L24.9 625L23.5 620L23.2 615L23.1 610L23.6 605L23.1 600L23.6 595L23.6 590L23.6 585L23.9 580L23.8 575L24.8 570L24.4 565L25.5 560L25.3 555L25.8 550L25.7 545L26.0 540L26.2 535L26.3 530L26.3 525L25.8 520L25.5 515L26.4 510L26.5 505L26.0 500L26.5 495L25.2 490L25.5 485L24.9 480L27.8 475L24.7 470L24.3 465L24.5 460L25.1 455L24.8 450L24.8 445L24.7 440L26.0 435L25.5 430L26.2 425L26.3 420L26.1 415L26.7 410L25.3 405L24.6 400L24.8 395L24.4 390L24.5 385L24.6 380L24.6 375L23.9 370L24.7 365L23.9 360L25.2 355L24.4 350L23.9 345L24.4 340L25.2 335L26.0 330L25.3 325L25.8 320L26.1 315L27.3 310L27.1 305L28.0 300L27.2 295L27.1 290L27.5 285L29.6 280L28.0 275L29.1 270L29.5 265L28.7 260L29.1 255L29.5 250L28.6 245L27.8 240L28.6 235L27.9 230L27.8 225L27.7 220L28.0 215L28.5 210L28.9 205L29.1 200L30.4 195L29.9 190L30.7 185L30.7 180L30.1 175L30.0 170L30.1 165L29.3 160L28.5 155L29.6 150L28.8 145L29.0 140L29.0 135L29.4 130L29.4 125L29.6 120L28.8 115L28.4 110L28.8 105L28.9 100L30.2 95L30.0 90L30.3 85L32.7 80L29.1 75L28.7 70L29.1 65L27.5 60L28.2 55L26.4 50L26.7 45L25.9 40L25.5 35L26.4 30L26.2 25L26.3 20L25.5 15L25.0 10L26.2 5L26.9 0Z" />
    </svg>
  )
}

export default function EditorialCards({
  cards,
}: {
  cards: EditorialCardWithCount[]
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      // Everything created here (splits, tweens, this section's triggers) is
      // reverted with the matchMedia/useGSAP context. Reduced motion: no split.
      const media = gsap.matchMedia()
      media.add("(prefers-reduced-motion: no-preference)", () => {
        root
          .querySelectorAll<HTMLElement>("[data-rc-card]")
          .forEach((card, index) => {
            const split = SplitText.create(
              card.querySelectorAll("[data-rc-split]"),
              { type: "chars", mask: "chars" }
            )
            const corner = card.querySelector("[data-rc-corner]")

            const timeline = gsap.timeline({
              delay: index * 0.15,
              scrollTrigger: { trigger: card, start: "top 80%", once: true },
            })

            timeline.from(
              split.chars,
              {
                yPercent: 100,
                duration: 0.9,
                stagger: 0.03,
                ease: "power4.out",
              },
              0
            )

            if (corner) {
              timeline.from(
                corner,
                { autoAlpha: 0, y: 12, duration: 0.8, ease: "power3.out" },
                0.1
              )
            }
          })

        // Deferred sections above stream in after hydration and push this one
        // down; recompute start positions when the page height changes.
        const refresh = gsap
          .delayedCall(0.2, () => ScrollTrigger.refresh())
          .pause()
        const observer = new ResizeObserver(() => refresh.restart(true))
        observer.observe(document.body)

        return () => {
          observer.disconnect()
          refresh.kill()
        }
      })

      return () => media.revert()
    },
    { scope: rootRef }
  )

  return (
    <div
      ref={rootRef}
      className="relative grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-0"
    >
      {cards.map((card, index) => (
        <EditorialCardLink key={card.key} card={card} index={index} />
      ))}
      <TornEdge />
    </div>
  )
}
