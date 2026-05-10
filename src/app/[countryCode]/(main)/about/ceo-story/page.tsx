import type { Metadata } from "next"
import Image from "next/image"

import { inter, montserrat } from "@lib/fonts"
import { getLocalizedCanonicalPath } from "@lib/seo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ countryCode: string }>
}

const paragraphs = [
  "Sixth Gear Moto Supply Cafe + Lounge was built by riders, for riders. It brings together a professional motorcycle workshop, a comfortable rider lounge, and First Gear Coffee in one place where riders can take care of their bikes and enjoy the stop along the way.",
  "The workshop handles routine PMS, diagnostics, repairs, and performance upgrades for big bikes and premium motorcycles. Every job is approached with care because proper maintenance is not just about fixing a problem. It is about helping riders feel safe, prepared, and confident every time they head out.",
  "Sixth Gear also offers selected motorcycle accessories, riding gear, helmets, and performance parts for riders who want their bikes and gear to fit the way they ride. The team also provides bike wash, detailing, and cosmetic restoration to help keep motorcycles clean, protected, and ready for the road.",
  "More than a shop, Sixth Gear is a rider's space. It is a place to wrench, ride, refuel, and connect. Whether you are here for service, upgrades, coffee, or a good conversation with people who understand the ride, you are always welcome at Sixth Gear.",
]

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return {
    title: "The Sixth Gear Story | About",
    description:
      "Read the story behind Sixth Gear Moto Supply Cafe + Lounge, a rider-built space for motorcycle care, gear, coffee, and community.",
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode, "/about/ceo-story"),
    },
  }
}

export default function CeoStoryPage() {
  return (
    <main className="bg-white text-black">
      <section>
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-14 lg:pt-10">
          <LocalizedClientLink
            href="/about"
            className={`${inter.className} inline-flex items-center gap-2 text-sm font-medium text-black/45 transition-colors hover:text-black`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to About
          </LocalizedClientLink>

          <div className="mx-auto mt-10 max-w-[1320px] text-center">
            <div
              className={`${inter.className} flex flex-wrap items-center justify-center gap-3 text-sm text-black/45`}
            >
              <span className="font-medium text-[#F16D34]">Sixth Gear</span>
              <span>/</span>
              <span>Story</span>
            </div>

            <h1
              className={`${montserrat.className} mx-auto mt-10 max-w-[1320px] text-[3.2rem] font-extrabold uppercase leading-[0.88] tracking-[-0.075em] text-[#191b22] sm:text-[5.4rem] lg:text-[8.35rem]`}
            >
              Built by riders, for riders.
            </h1>

            <p
              className={`${inter.className} mx-auto mt-10 max-w-[660px] text-[15px] font-medium leading-7 text-black/70 sm:text-[16px]`}
            >
              A motorcycle service hub, rider lounge, gear stop, and coffee
              space made for people who live around the ride.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-[1080px]">
            <div className="relative overflow-hidden rounded-[22px] bg-black/[0.03]">
              <div className="relative aspect-[16/11] sm:aspect-[16/9.2]">
                <Image
                  src="/images/sixthgear-workshop.jpg"
                  alt="Sixth Gear workshop"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 1080px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-2 sm:px-6 lg:px-10 lg:pb-24">
        <article className="mx-auto max-w-[860px]">
          <div
            className={`${inter.className} space-y-9 text-[1.02rem] leading-[1.85] text-[#252525] sm:text-[1.08rem]`}
          >
            <p className="font-semibold text-black">
              We offer complete diagnostics and care for your motorcycle.
            </p>

            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <LocalizedClientLink
              href="/services"
              className={`${inter.className} inline-flex items-center justify-center rounded-full bg-[#191b22] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#F16D34]`}
            >
              Explore Services
            </LocalizedClientLink>
          </div>
        </article>
      </section>
    </main>
  )
}
