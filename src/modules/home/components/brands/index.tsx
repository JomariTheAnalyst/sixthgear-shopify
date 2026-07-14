"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { inter, lato, montserrat } from "@lib/fonts"

interface BrandItem {
  name: string
  logo: string
  link?: string | null
}

interface BrandsSectionProps {
  sectionTitle?: string | null
  sectionDescription?: string | null
  brands?: BrandItem[] | null
}

const brandLogoMap: Record<string, string> = {
  Suzuki: "/images/brands/brands-logo/suzuki-logo.svg",
  Yamaha: "/images/brands/brands-logo/yamaha.svg",
  KTM: "/images/brands/brands-logo/ktm-logo.svg",
  Kawasaki: "/images/brands/brands-logo/kawasaki-logo.svg",
  BMW: "/images/brands/brands-logo/bmw-logo.svg",
  "Royal Enfield": "/images/brands/brands-logo/royal-enfield-logo.svg",
  CFMOTO: "/images/brands/brands-logo/cfmoto.png",
  "CF Moto": "/images/brands/brands-logo/cfmoto.png",
  "CF Motor": "/images/brands/brands-logo/cfmoto.png",
  Benda: "/images/brands/brands-logo/benda.jpg",
}

const brandImageMap: Record<string, string> = {
  Suzuki: "/images/brands/motorcycle-images/motosm.png",
  Yamaha: "/images/brands/motorcycle-images/yamaha.webp",
  KTM: "/images/brands/motorcycle-images/ktm.png",
  Kawasaki: "/images/brands/motorcycle-images/kawasaki.png",
  BMW: "/images/brands/motorcycle-images/BMW.png",
  "Royal Enfield": "/images/brands/motorcycle-images/royal-enfield.png",
  CFMOTO: "/images/brands/motorcycle-images/cf moto.png",
  "CF Moto": "/images/brands/motorcycle-images/cf moto.png",
  "CF Motor": "/images/brands/motorcycle-images/cf moto.png",
  Benda: "/images/brands/motorcycle-images/benda.png",
}

const defaultBrands: BrandItem[] = [
  {
    name: "Suzuki",
    logo: "/images/brands/brand1.png",
    link: null,
  },
  { name: "Yamaha", logo: "/images/brands/brand2.png", link: null },
  { name: "KTM", logo: "/images/brands/brand3.png", link: null },
  { name: "Kawasaki", logo: "/images/brands/brand4.png", link: null },
  { name: "BMW", logo: "/images/brands/brand5.png", link: null },
  { name: "Royal Enfield", logo: "/images/brands/brand6.png", link: null },
  {
    name: "CFMOTO",
    logo: "/images/brands/brands-logo/cfmoto.png",
    link: null,
  },
  {
    name: "Benda",
    logo: "/images/brands/brands-logo/benda.jpg",
    link: null,
  },
]

const requiredBrandAdditions: BrandItem[] = [
  {
    name: "CFMOTO",
    logo: "/images/brands/brands-logo/cfmoto.png",
    link: null,
  },
  {
    name: "Benda",
    logo: "/images/brands/brands-logo/benda.jpg",
    link: null,
  },
]

const brandDetailMap: Record<
  string,
  {
    overview: string
    keySentences: string[]
  }
> = {
  Suzuki: {
    overview:
      "Suzuki motorcycles are known for practical performance, reliability, and everyday rideability across commuter, sport, touring, and adventure platforms. The brand has a strong reputation among riders who want machines that are easy to live with, honest to maintain, and capable of handling regular use without unnecessary complexity.",
    keySentences: [
      "Well-balanced engines make Suzuki bikes approachable for both daily riders and weekend riders.",
      "The brand's parts ecosystem and broad model range make service planning straightforward.",
      "Best suited for riders who value dependable performance, clean maintenance, and long-term usability.",
    ],
  },
  Yamaha: {
    overview:
      "Yamaha blends responsive engineering with rider-focused design, from urban commuters to high-performance machines. Its motorcycles often feel sharp, refined, and predictable, giving riders confidence whether they are navigating city traffic, carving open roads, or maintaining a sport-oriented bike.",
    keySentences: [
      "Yamaha platforms reward precise setup, especially in suspension, braking, and throttle response.",
      "The brand is popular because it balances performance character with everyday practicality.",
      "A careful service approach helps preserve the smoothness and responsiveness Yamaha riders expect.",
    ],
  },
  KTM: {
    overview:
      "KTM brings aggressive styling, sharp handling, and performance-first engineering built for riders who want a more energetic machine. The brand has a strong identity in lightweight performance, off-road influence, and bikes that feel direct, lively, and eager when properly maintained.",
    keySentences: [
      "KTM motorcycles benefit from close attention to fluids, cooling, chain care, and electronic diagnostics.",
      "Their performance character makes correct setup more noticeable than on many softer commuter platforms.",
      "Ideal for riders who enjoy a responsive motorcycle and want it maintained with precision.",
    ],
  },
  Kawasaki: {
    overview:
      "Kawasaki motorcycles are recognized for strong road presence, balanced power delivery, and dependable versatility across segments. From approachable commuters to larger displacement sport and touring bikes, the brand appeals to riders who want confident acceleration, solid engineering, and a machine with personality.",
    keySentences: [
      "Kawasaki bikes often respond well to consistent preventive maintenance and correct drivetrain care.",
      "The brand's broad lineup makes accurate model-specific inspection important.",
      "A good service routine keeps the bike feeling strong, stable, and ready for longer rides.",
    ],
  },
  BMW: {
    overview:
      "BMW motorcycles combine premium engineering, touring comfort, and advanced rider technology for long-distance confidence and everyday refinement. Their platforms can include sophisticated electronics, braking systems, suspension features, and service requirements that need a careful, methodical workshop approach.",
    keySentences: [
      "BMW service work should respect both mechanical condition and electronic system health.",
      "Comfort, stability, and safety features depend on proper inspection and calibrated maintenance.",
      "Best for riders who expect premium road manners and want details handled correctly.",
    ],
  },
  "Royal Enfield": {
    overview:
      "Royal Enfield focuses on timeless styling, relaxed character, and mechanical simplicity that suits both city and open-road riding. These motorcycles carry a classic feel, but they still benefit from disciplined checks on fasteners, fluids, brakes, tires, and drivetrain condition.",
    keySentences: [
      "Royal Enfield bikes reward steady, thoughtful maintenance rather than rushed servicing.",
      "The ownership experience is about character, comfort, and confidence over outright speed.",
      "A clean service routine helps preserve the relaxed feel that makes the brand appealing.",
    ],
  },
  CFMOTO: {
    overview:
      "CFMOTO is a modern powersports manufacturer founded in 1989 and headquartered in Hangzhou, China, with motorcycles and off-road vehicles sold across more than 100 countries and regions. The brand is known for bringing strong equipment levels, contemporary styling, and accessible performance to riders who want value without giving up technology.",
    keySentences: [
      "CFMOTO motorcycles often combine modern electronics, sharp design, and practical everyday usability.",
      "Because many models are feature-rich, service should include mechanical checks and attention to sensors, controls, and rider-assist systems.",
      "A good fit for riders who want a fresh, technology-forward motorcycle with sensible ownership costs.",
    ],
  },
  "CF Moto": {
    overview:
      "CFMOTO is a modern powersports manufacturer founded in 1989 and headquartered in Hangzhou, China, with motorcycles and off-road vehicles sold across more than 100 countries and regions. The brand is known for bringing strong equipment levels, contemporary styling, and accessible performance to riders who want value without giving up technology.",
    keySentences: [
      "CFMOTO motorcycles often combine modern electronics, sharp design, and practical everyday usability.",
      "Because many models are feature-rich, service should include mechanical checks and attention to sensors, controls, and rider-assist systems.",
      "A good fit for riders who want a fresh, technology-forward motorcycle with sensible ownership costs.",
    ],
  },
  "CF Motor": {
    overview:
      "CFMOTO is a modern powersports manufacturer founded in 1989 and headquartered in Hangzhou, China, with motorcycles and off-road vehicles sold across more than 100 countries and regions. The brand is known for bringing strong equipment levels, contemporary styling, and accessible performance to riders who want value without giving up technology.",
    keySentences: [
      "CFMOTO motorcycles often combine modern electronics, sharp design, and practical everyday usability.",
      "Because many models are feature-rich, service should include mechanical checks and attention to sensors, controls, and rider-assist systems.",
      "A good fit for riders who want a fresh, technology-forward motorcycle with sensible ownership costs.",
    ],
  },
  Benda: {
    overview:
      "Benda is a design-led motorcycle brand from China with a strong focus on cruisers, distinctive silhouettes, and a more expressive riding personality. The brand stands out through bold styling, modern presentation, and motorcycles built for riders who want something less ordinary on the road.",
    keySentences: [
      "Benda bikes deserve careful setup because fit, finish, comfort, and visual details are a big part of the ownership experience.",
      "Their cruiser-oriented character makes drivetrain smoothness, brake feel, tire condition, and ergonomics especially important.",
      "Best for riders who want presence, style, and a motorcycle that feels personal rather than generic.",
    ],
  },
}

function normalizeBrandName(name: string) {
  return name.trim().toLowerCase().replace(/[\s_-]+/g, "")
}

function withRequiredBrandAdditions(inputBrands: BrandItem[]) {
  const seen = new Set(inputBrands.map((brand) => normalizeBrandName(brand.name)))
  const additions = requiredBrandAdditions.filter(
    (brand) => !seen.has(normalizeBrandName(brand.name))
  )

  return [...inputBrands, ...additions]
}

export default function Brands({
  sectionTitle,
  sectionDescription,
  brands,
}: BrandsSectionProps) {
  const activeTitle = sectionTitle || "Motorcycle Brands We Service & Support"
  const activeDescription =
    sectionDescription ||
    "Experienced in servicing Japanese, American, and European motorcycles with proper tools, care, and attention to detail."
  const activeBrands = withRequiredBrandAdditions(
    brands && brands.length > 0 ? brands : defaultBrands
  )

  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const activeBrand = useMemo(
    () =>
      activeIndex !== null
        ? activeBrands[activeIndex] || activeBrands[0]
        : activeBrands[0],
    [activeBrands, activeIndex]
  )
  const activeBrandImage =
    brandImageMap[activeBrand?.name] ||
    activeBrand?.logo ||
    "/images/brands/motorcycle-images/motosm.png"
  const activeBrandLogo =
    brandLogoMap[activeBrand?.name] ||
    activeBrand?.logo ||
    "/images/brands/brands-logo/suzuki-logo.svg"

  if (!activeBrand) {
    return null
  }

  return (
    <section className="py-14 md:py-18 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="mb-10 text-center md:mb-14 lg:mb-16">
          <div className="mx-auto w-full max-w-[1200px] text-center">
          <h2
            className={`${montserrat.className} whitespace-normal text-center text-[clamp(1.45rem,3.7vw,3.35rem)] font-black leading-[0.9] tracking-[-0.05em] text-[#191b22] mb-3 md:mb-4 md:whitespace-nowrap`}
          >
            {activeTitle}
          </h2>
          <p
            className={`${inter.className} mx-auto max-w-[760px] text-base font-medium leading-[1.35] tracking-[-0.02em] text-black/70 md:text-xl lg:text-2xl`}
          >
            {activeDescription}
          </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] gap-8 lg:gap-12 items-start">
          <div className="order-2 lg:order-1 rounded-[28px] border border-gray-200 overflow-hidden bg-white">
            {activeBrands.map((brand, index) => {
              const isActive = index === activeIndex
              const detail = brandDetailMap[brand.name] || {
                overview:
                  "We support this brand with careful servicing, diagnostics, maintenance, and workshop experience tailored to its platform.",
                keySentences: [
                  "Every service starts with clear inspection and practical recommendations.",
                  "The goal is to keep the motorcycle reliable, safe, and enjoyable to ride.",
                ],
              }

              return (
                <div
                  key={`${brand.name}-${index}`}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() =>
                      setActiveIndex((current) =>
                        current === index ? null : index
                      )
                    }
                    className="w-full flex items-center justify-between gap-4 px-5 md:px-7 py-5 md:py-6 text-left transition-colors hover:bg-gray-50"
                  >
                    <span
                      className={`${lato.className} text-black text-xl md:text-2xl lg:text-[30px] leading-none tracking-[0.03em]`}
                    >
                      {brand.name}
                    </span>
                    <span
                      className={`flex items-center justify-center transition-colors ${
                        isActive ? "text-black" : "text-gray-700"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? "rotate-45" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 md:px-7 pb-5 md:pb-6">
                        <p
                          className={`${inter.className} text-sm md:text-base text-gray-600 leading-relaxed max-w-[52ch]`}
                        >
                          {detail.overview}
                        </p>
                        <ul
                          className={`${inter.className} mt-4 space-y-2 text-sm md:text-base text-gray-700 leading-relaxed`}
                        >
                          {detail.keySentences.map((sentence) => (
                            <li key={sentence} className="flex gap-2">
                              <span
                                className="mt-[0.62em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F16D34]"
                                aria-hidden="true"
                              />
                              <span>{sentence}</span>
                            </li>
                          ))}
                        </ul>
                        {brand.link ? (
                          <Link
                            href={brand.link}
                            className={`${montserrat.className} inline-flex items-center mt-4 text-xs md:text-sm font-semibold uppercase tracking-[0.06em] text-black border-b border-black pb-1 hover:opacity-70 transition-opacity`}
                          >
                            Explore Brand
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="order-1 lg:order-2">
            <div className="group relative aspect-[4/4.6] sm:aspect-[4/3] lg:aspect-[5/4] rounded-[28px] overflow-hidden bg-gray-50 border border-gray-200">
              <Image
                key={`${activeBrand.name}-${activeBrandLogo}-logo`}
                src={activeBrandLogo}
                alt={`${activeBrand.name} logo`}
                fill
                className="object-contain p-8 md:p-10 lg:p-12 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <Image
                key={`${activeBrand.name}-${activeBrandImage}-motorcycle`}
                src={activeBrandImage}
                alt={`${activeBrand.name} motorcycle`}
                fill
                className="object-contain p-6 md:p-8 lg:p-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
