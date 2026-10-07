"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import type { AboutStatementSectionContent } from "@lib/cms/about-page-main"
import { inter } from "@lib/fonts"
import { ABOUT_CONTAINER, ABOUT_INK } from "@modules/about/constants"
import { MOTION_OK } from "@modules/about/motion"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const WORD_START_COLOR = "#c9c9c9"

/**
 * Statement words turn from light grey to ink as the text scrolls through
 * (top at 80% → bottom at 50% of the viewport). The markup renders ink words
 * and final numbers, so it reads correctly without JavaScript or motion.
 */
export default function AboutStatement({
  content,
}: {
  content: AboutStatementSectionContent
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const words = content.text.split(" ")

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const media = gsap.matchMedia()

      media.add(MOTION_OK, () => {
        const statement = section.querySelector("[data-statement]")
        const wordEls = gsap.utils.toArray<HTMLElement>("[data-word]", section)
        const statRow = section.querySelector("[data-stats]")
        const statEls = gsap.utils.toArray<HTMLElement>("[data-stat-value]", section)

        if (statement && wordEls.length) {
          gsap.fromTo(
            wordEls,
            { color: WORD_START_COLOR },
            {
              color: ABOUT_INK,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: {
                trigger: statement,
                start: "top 80%",
                end: "bottom 50%",
                scrub: 0.3,
                invalidateOnRefresh: true,
              },
            }
          )
        }

        if (statRow && statEls.length) {
          const counters = statEls.map((el) => ({
            el,
            value: Number(el.dataset.value) || 0,
            suffix: el.dataset.suffix ?? "",
            current: 0,
          }))
          const render = () =>
            counters.forEach((counter) => {
              counter.el.textContent = `${Math.round(counter.current)}${counter.suffix}`
            })

          ScrollTrigger.create({
            trigger: statRow,
            start: "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(counters, {
                current: (index: number) => counters[index].value,
                duration: 1.4,
                ease: "power2.out",
                stagger: 0.12,
                onStart: render,
                onUpdate: render,
              }),
          })
        }

        // Back to the server-rendered final numbers when motion is turned off.
        return () =>
          statEls.forEach((el) => {
            el.textContent = `${el.dataset.value}${el.dataset.suffix ?? ""}`
          })
      })

      return () => media.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      aria-label="About Sixth Gear"
      className={`${inter.className} bg-white py-20 text-[#1a1a1a] md:py-28 lg:py-32`}
    >
      <div className={ABOUT_CONTAINER}>
        <p
          data-statement
          className="mx-auto max-w-[36ch] text-center text-[clamp(1.5625rem,3.4vw,3.125rem)] font-medium leading-[1.22] tracking-[-0.02em]"
        >
          {words.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span data-word>{word}</span>
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
        </p>

        <ul
          data-stats
          className="mx-auto mt-16 grid max-w-[1200px] grid-cols-2 gap-x-6 gap-y-10 md:mt-20 lg:grid-cols-4"
        >
          {content.stats.map((stat) => (
            <li key={stat.key} className="flex flex-col items-center text-center">
              <strong
                data-stat-value
                data-value={stat.value}
                data-suffix={stat.suffix}
                className="text-[clamp(2.5rem,4.6vw,4.5rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums"
              >
                {stat.value}
                {stat.suffix}
              </strong>
              <span className="mt-3 text-sm text-black/60 md:text-base">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
