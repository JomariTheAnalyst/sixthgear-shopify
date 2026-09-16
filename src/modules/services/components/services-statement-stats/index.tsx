"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { outfit } from "@lib/fonts"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type ServicesStatementStatsData = {
  categoryCount: number
  brandCount: number
  optionCount: number
}

type ServicesStatementStatsProps = {
  stats: ServicesStatementStatsData
}

const STAT_DEFINITIONS = [
  {
    key: "categoryCount",
    label: "Service Categories",
    description: "Core maintenance, repair, and upgrade areas.",
    suffix: "+",
  },
  {
    key: "brandCount",
    label: "Brands Serviced",
    description: "Motorcycle makes supported by the workshop.",
    suffix: "+",
  },
  {
    key: "optionCount",
    label: "Service Options",
    description: "Individual services available across all categories.",
    suffix: "+",
  },
] as const

const STATEMENT_TEXT =
  "From routine maintenance to performance upgrades, Sixthgear keeps every ride ready for what’s next."
const STATEMENT_WORDS = STATEMENT_TEXT.split(" ")

export default function ServicesStatementStats({
  stats,
}: ServicesStatementStatsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const statement = statementRef.current

      if (!section || !statement) return

      const statItems = gsap.utils.toArray<HTMLElement>(
        "[data-service-stat]",
        section
      )
      const statValues = gsap.utils.toArray<HTMLElement>(
        "[data-service-stat-value]",
        section
      )
      const statementWords = gsap.utils.toArray<HTMLElement>(
        "[data-statement-word]",
        statement
      )

      if (statValues.length === 0 || statementWords.length === 0) return

      const displayStats = STAT_DEFINITIONS.map((definition) => ({
        ...definition,
        value: stats[definition.key],
      }))
      const renderFinalValues = () => {
        statValues.forEach((element, index) => {
          const stat = displayStats[index]
          if (stat) element.textContent = `${stat.value}${stat.suffix}`
        })
      }
      const media = gsap.matchMedia()

      media.add(
        {
          canAnimate: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const canAnimate = Boolean(context.conditions?.canAnimate)

          if (!canAnimate) {
            gsap.set(statementWords, { color: "#000000" })
            gsap.set(statItems, { autoAlpha: 1, y: 0 })
            renderFinalValues()
            return
          }

          const wordTween = gsap.fromTo(
            statementWords,
            { color: "#b5b5b5" },
            {
              color: "#000000",
              duration: 0.7,
              stagger: { each: 0.18 },
              ease: "none",
              scrollTrigger: {
                trigger: statement,
                start: "top 78%",
                end: "bottom 30%",
                scrub: 0.35,
                invalidateOnRefresh: true,
              },
            }
          )

          statValues.forEach((element, index) => {
            const stat = displayStats[index]
            if (stat) element.textContent = `0${stat.suffix}`
          })

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: statItems[0] ?? section,
              start: "top 86%",
              once: true,
            },
          })

          timeline.fromTo(
            statItems,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.12,
              ease: "power2.out",
            }
          )

          displayStats.forEach((stat, index) => {
            const counter = { value: 0 }

            timeline.to(
              counter,
              {
                value: stat.value,
                duration: 1,
                ease: "power2.out",
                onUpdate: () => {
                  const element = statValues[index]
                  if (element) {
                    element.textContent = `${Math.round(counter.value)}${stat.suffix}`
                  }
                },
                onComplete: () => {
                  const element = statValues[index]
                  if (element) {
                    element.textContent = `${stat.value}${stat.suffix}`
                  }
                },
              },
              0.12 + index * 0.12
            )
          })

          return () => {
            wordTween.scrollTrigger?.kill()
            wordTween.kill()
            timeline.scrollTrigger?.kill()
            timeline.kill()
          }
        }
      )

      return () => media.revert()
    },
    {
      scope: sectionRef,
      dependencies: [
        stats.categoryCount,
        stats.brandCount,
        stats.optionCount,
      ],
    }
  )

  const displayStats = STAT_DEFINITIONS.map((definition) => ({
    ...definition,
    value: stats[definition.key],
  }))

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-statement-heading"
      className={`${outfit.className} overflow-hidden bg-white px-5 py-20 text-black sm:px-8 md:py-28 lg:px-12 lg:py-36`}
    >
      <div className="mx-auto max-w-[1320px]">
        <h2
          ref={statementRef}
          id="services-statement-heading"
          aria-label={STATEMENT_TEXT}
          className="mx-auto max-w-[1100px] text-center text-[clamp(2rem,3.8vw,4.5rem)] font-bold leading-[1.03] tracking-[-0.035em]"
        >
          {STATEMENT_WORDS.map((word, index) => (
            <span key={`${word}-${index}`} aria-hidden="true">
              <span
                data-statement-word
                className="inline-block text-[#b5b5b5]"
              >
                {word}
              </span>
              {index < STATEMENT_WORDS.length - 1 ? " " : null}
            </span>
          ))}
        </h2>

        <div className="mt-20 grid border-y border-black/[0.12] md:mt-28 md:grid-cols-3">
          {displayStats.map((stat, index) => (
            <article
              key={stat.key}
              data-service-stat
              className={`flex min-w-0 flex-col items-center justify-center px-5 py-9 text-center md:min-h-[190px] md:py-10 ${
                index > 0
                  ? "border-t border-black/[0.12] md:border-l md:border-t-0"
                  : ""
              }`}
            >
              <strong
                data-service-stat-value
                className="inline-block min-w-[4ch] text-[clamp(3.25rem,5vw,5.75rem)] font-bold leading-none tracking-[-0.045em] tabular-nums"
              >
                {stat.value}
                {stat.suffix}
              </strong>
              <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-black/[0.55] sm:text-xs">
                {stat.label}
              </span>
              <p className="mt-2 max-w-[28ch] text-xs leading-5 text-black/[0.48] sm:text-[13px]">
                {stat.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
