"use client"

import { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import type { SanityAboutSection } from "@lib/cms/types"
import { nationalCompressed, inter } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

gsap.registerPlugin(useGSAP)

const FALLBACK_ABOUT_SECTION: SanityAboutSection = {
  useCustomAbout: false,
  kicker: "About Us",
  title: "We Offer Complete Diagnostics for Your Motorcycle",
  description:
    "Sixth Gear Moto Supply Café + Lounge is a rider-built motorcycle hub combining professional workshop service, premium accessories, riding gear, detailing, performance upgrades, and a relaxed café experience powered by First Gear Coffee.",
  highlights: [
    "Motorcycle Service and Advanced Diagnostics",
    "Parts Accessories Luggage and Communications",
    "Helmets Riding Gear and Apparel",
    "Café Lounge and Rider Community",
  ],
  primaryCta: {
    text: "More About Us",
    link: "/about",
  },
  imageTop: "/images/homepage/about/about_bg.png",
  imageBottom: "/images/homepage/about/about-small.png",
  videoUrl: "#",
}

interface AboutSectionProps {
  data?: SanityAboutSection | null
  kicker?: string
  title?: string
  description?: string
  highlights?: string[]
  primaryCta?: {
    text: string
    link: string
  }
  imageTop?: string | null
  imageBottom?: string | null
  videoUrl?: string | null
}

const AboutSection = ({ data, ...legacyProps }: AboutSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null)
  const isCMSDisabled = data?.useCustomAbout === false

  // Merge precedence: Sanity -> legacy source -> local fallback.
  const mergedContent = {
    kicker: isCMSDisabled
      ? legacyProps.kicker || FALLBACK_ABOUT_SECTION.kicker
      : data?.kicker || legacyProps.kicker || FALLBACK_ABOUT_SECTION.kicker,
    title: isCMSDisabled
      ? legacyProps.title || FALLBACK_ABOUT_SECTION.title
      : data?.title || legacyProps.title || FALLBACK_ABOUT_SECTION.title,
    description: isCMSDisabled
      ? legacyProps.description || FALLBACK_ABOUT_SECTION.description
      : data?.description ||
        legacyProps.description ||
        FALLBACK_ABOUT_SECTION.description,
    imageTop: isCMSDisabled
      ? legacyProps.imageTop || FALLBACK_ABOUT_SECTION.imageTop
      : data?.imageTop ||
        legacyProps.imageTop ||
        FALLBACK_ABOUT_SECTION.imageTop,
    imageBottom: isCMSDisabled
      ? legacyProps.imageBottom || FALLBACK_ABOUT_SECTION.imageBottom
      : data?.imageBottom ||
        legacyProps.imageBottom ||
        FALLBACK_ABOUT_SECTION.imageBottom,
  }

  useGSAP(
    () => {
      const media = gsap.matchMedia()

      media.add(
        {
          canAnimate: "(prefers-reduced-motion: no-preference)",
          canHover: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { canAnimate, canHover } = context.conditions as {
            canAnimate: boolean
            canHover: boolean
          }

          if (!canAnimate) return

          const section = sectionRef.current
          const cards = gsap.utils.toArray<HTMLElement>("[data-about-card]")

          if (!section || cards.length === 0) return

          gsap.set(cards, { autoAlpha: 0, y: 18 })

          const observer = new IntersectionObserver(
            ([entry]) => {
              if (!entry?.isIntersecting) return

              gsap.to(cards, {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                ease: "power2.out",
                stagger: 0.1,
                overwrite: "auto",
              })
              observer.disconnect()
            },
            { threshold: 0.2 }
          )

          observer.observe(section)

          const cleanups: Array<() => void> = []

          if (canHover) {
            cards.forEach((card) => {
              const handlePointerEnter = () => {
                gsap.to(card, {
                  y: -7,
                  scale: 1.012,
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: "auto",
                })
              }
              const handlePointerLeave = () => {
                gsap.to(card, {
                  y: 0,
                  scale: 1,
                  duration: 0.4,
                  ease: "power2.out",
                  overwrite: "auto",
                })
              }

              card.addEventListener("pointerenter", handlePointerEnter)
              card.addEventListener("pointerleave", handlePointerLeave)
              cleanups.push(() => {
                card.removeEventListener("pointerenter", handlePointerEnter)
                card.removeEventListener("pointerleave", handlePointerLeave)
              })
            })
          }

          return () => {
            observer.disconnect()
            cleanups.forEach((cleanup) => cleanup())
          }
        }
      )

      return () => media.revert()
    },
    { scope: sectionRef }
  )

  const collageImages = [
    {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/v1779693482/contact-us-banner-image_gfuev1.jpg",
      alt: "Sixth Gear motorcycle community",
      cardClassName: "z-10 rotate-[3deg]",
      imageClassName: "object-cover object-center",
    },
    {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/v1786004697/team_btoj73.jpg",
      alt: "Sixth Gear team",
      cardClassName:
        "z-20 -ml-[0.5%] -rotate-[3deg] sm:-ml-[0.4%]",
      imageClassName: "object-cover object-center",
    },
    {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/v1786004548/teamsixthgear_frmvmt.jpg",
      alt: "Sixth Gear team members",
      cardClassName:
        "z-30 -ml-[0.5%] rotate-[3deg] sm:-ml-[0.4%]",
      imageClassName: "object-cover object-center",
    },
    {
      src: "https://res.cloudinary.com/djn9ubf6a/image/upload/v1786005983/teans3_vmurt6.jpg",
      alt: "Sixth Gear team gathering",
      cardClassName:
        "z-40 -ml-[0.5%] -rotate-[3deg] sm:-ml-[0.4%]",
      imageClassName: "object-cover object-center",
    },
  ]

  return (
    <section
      ref={sectionRef}
      aria-labelledby="homepage-about-heading"
      className="overflow-hidden bg-white px-4 py-10 text-[#111111] sm:px-6 sm:py-14 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-[1440px]">
        <h2
          id="homepage-about-heading"
          className={`${nationalCompressed.className} text-center text-[clamp(4.5rem,12vw,11rem)] uppercase leading-[0.75] tracking-[-0.025em]`}
        >
          Who we are
        </h2>

        <div className="relative mx-auto mt-4 flex max-w-[1380px] items-center justify-center px-1 py-7 sm:mt-5 sm:px-4 sm:py-10 lg:mt-6 lg:px-6 lg:py-12">
          {collageImages.map((image) => (
            <figure
              key={image.src}
              data-about-card
              className={`relative aspect-square w-[25%] flex-none border-[4px] border-white bg-white shadow-[0_16px_35px_rgba(0,0,0,0.16)] will-change-transform sm:w-[24.5%] sm:border-[6px] lg:w-[24%] lg:border-[8px] ${image.cardClassName}`}
            >
              <div className="absolute inset-0 overflow-hidden bg-neutral-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={image.imageClassName}
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 24.5vw, 331px"
                />
              </div>
            </figure>
          ))}
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p
            className={`${inter.className} text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8`}
          >
            {mergedContent.description}
          </p>

          <LocalizedClientLink
            href="/about"
            className={`${inter.className} mt-7 inline-flex min-h-12 items-center justify-center bg-[#111111] px-9 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:bg-[#f15a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] sm:mt-8`}
          >
            Learn more
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
