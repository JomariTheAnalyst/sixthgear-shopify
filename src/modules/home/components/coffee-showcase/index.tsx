"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { interDisplay, lato } from "@lib/fonts"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CoffeeItem {
  image: string | null
  imageAlt?: string | null
}

interface CoffeeShowcaseProps {
  sectionHeading?: string | null
  coffeeIconUrl?: string | null
  descriptionText?: string
  buttonText?: string
  buttonLink?: string
  coffeeItems?: CoffeeItem[]
}

export default function CoffeeShowcase({
  sectionHeading,
  coffeeIconUrl,
  descriptionText,
  buttonText = "Explore Our Product",
  buttonLink = "/first-gear",
  coffeeItems,
}: CoffeeShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleImage, setVisibleImage] = useState(0)
  const [isImageVisible, setIsImageVisible] = useState(true)

  const activeHeading =
    sectionHeading?.trim() ||
    "More Than Riding Gear\nWe Serve Great Coffee Too"

  const topDescription =
    descriptionText ||
    "Sixthgear Moto is built around motorcycle culture, and our coffee offering is part of that experience, powered by First Gear Coffee. Drop in for trusted gear, then stay for a properly made cup in a space designed for riders and friends."

  const galleryImages = useMemo(() => {
    const cmsImages =
      coffeeItems
        ?.map((item) => item.image)
        .filter((image): image is string => Boolean(image)) || []

    if (cmsImages.length > 0) {
      return cmsImages
    }

    return [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1200",
    ]
  }, [coffeeItems])

  const rearStack = [2, 1].map((offset) => {
    const index = (activeIndex - offset + galleryImages.length) % galleryImages.length
    return galleryImages[index]
  })

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length)
  }

  useEffect(() => {
    setIsImageVisible(false)

    const swapTimer = window.setTimeout(() => {
      setVisibleImage(activeIndex)
      setIsImageVisible(true)
    }, 120)

    return () => window.clearTimeout(swapTimer)
  }, [activeIndex])

  return (
    <section className="relative">
      <div className="w-full -mb-1 relative z-10">
        <Image
          src="/images/firstgear-coffee/imgi_13_691aef1ff3fe8593c72c20e1_Frame 2147239539.svg"
          alt=""
          width={1600}
          height={120}
          className="w-full h-auto"
        />
      </div>

      <div className="bg-[#47271f] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] gap-14 lg:gap-16 items-center">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative w-full max-w-[640px] aspect-[4/4.35] sm:aspect-square lg:aspect-[1/1.08]">
                {rearStack.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="absolute top-6 bottom-6 w-[84%] rounded-2xl overflow-hidden border-2 border-[#dd7a53] bg-white shadow-[0_18px_35px_rgba(0,0,0,0.2)]"
                    style={{
                      left: `${index * 5 + 1}%`,
                      transform: `scale(${0.93 + index * 0.03})`,
                      zIndex: index + 1,
                    }}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 54vw, 420px"
                      className="object-cover"
                    />
                  </div>
                ))}

                <div className="absolute inset-y-0 left-[10%] right-0 rounded-2xl overflow-hidden border-2 border-[#dd7a53] bg-white shadow-[0_30px_70px_rgba(0,0,0,0.24)] z-10">
                  <Image
                    src={galleryImages[visibleImage % galleryImages.length]}
                    alt="Coffee showcase"
                    fill
                    sizes="(max-width: 1024px) 72vw, 560px"
                    className={`w-full h-full object-cover transition-all duration-500 ease-out ${
                      isImageVisible
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-[1.02]"
                    }`}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label="Previous coffee image"
                  className="w-11 h-11 rounded-full border-2 border-[#f3be9f] text-[#f8dfd2] flex items-center justify-center transition-colors hover:bg-[#5a3226]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next coffee image"
                  className="w-11 h-11 rounded-full border-2 border-[#f3be9f] text-[#f8dfd2] flex items-center justify-center transition-colors hover:bg-[#5a3226]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center text-center lg:px-8">
              <Image
                src={coffeeIconUrl || "/images/firstgear-coffee/download.svg"}
                alt="First Gear Coffee icon"
                width={160}
                height={160}
                className="w-32 md:w-40 mb-8"
                style={{ height: "auto" }}
              />

              <h2
                className={`${lato.className} text-[#fff6ef] text-2xl md:text-3xl lg:text-[38px] font-bold uppercase tracking-[0.05em] leading-[1.18] whitespace-pre-line max-w-md mb-6`}
              >
                {activeHeading}
              </h2>

              <p
                className={`${interDisplay.className} text-[#ead7cc] text-sm md:text-base font-medium leading-[1.75] max-w-md`}
              >
                {topDescription}
              </p>

              {buttonText ? (
                <Link
                  href={buttonLink}
                  className={`${lato.className} mt-8 inline-flex items-center gap-2 text-[#f4a787] text-sm md:text-base font-semibold uppercase tracking-[0.06em] border-b-2 border-[#f4a787] pb-1 hover:opacity-75 transition-opacity`}
                >
                  {buttonText}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full -mt-1 relative z-10">
        <Image
          src="/images/firstgear-coffee/imgi_16_691c021fe5be5a70061df439_Frame 2147239540.svg"
          alt=""
          width={1600}
          height={120}
          className="w-full h-auto block"
        />
      </div>
    </section>
  )
}
