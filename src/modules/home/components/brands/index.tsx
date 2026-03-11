"use client"

import Image from "next/image"
import Link from "next/link"

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

const defaultBrands: BrandItem[] = [
  { name: "Suzuki", logo: "/images/brands/brand1.png", link: null },
  { name: "Yamaha", logo: "/images/brands/brand2.png", link: null },
  { name: "KTM", logo: "/images/brands/brand3.png", link: null },
  { name: "Kawasaki", logo: "/images/brands/brand4.png", link: null },
  { name: "BMW", logo: "/images/brands/brand5.png", link: null },
  { name: "Royal Enfield", logo: "/images/brands/brand6.png", link: null },
]

export default function Brands({
  sectionTitle,
  sectionDescription,
  brands,
}: BrandsSectionProps) {
  const activeTitle = sectionTitle || "Motorcycle Brands We Service & Support"
  const activeDescription =
    sectionDescription ||
    "Experienced in servicing Japanese, American, and European motorcycles with proper tools, care, and attention to detail."
  const activeBrands = brands && brands.length > 0 ? brands : defaultBrands

  const BrandWrapper = ({
    brand,
    children,
    className,
  }: {
    brand: BrandItem
    children: React.ReactNode
    className: string
  }) => {
    if (brand.link) {
      return (
        <Link
          href={brand.link}
          className={`${className} cursor-pointer hover:opacity-80 transition-opacity duration-200`}
        >
          {children}
        </Link>
      )
    }
    return <div className={className}>{children}</div>
  }

  const gridColsMap: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-6",
    8: "lg:grid-cols-8",
  }
  const gridCols = gridColsMap[Math.min(activeBrands.length, 8)] ?? "lg:grid-cols-6"

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8">
          <h2
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {activeTitle}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto">
            {activeDescription}
          </p>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll */}
        <div className="lg:hidden">
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-8"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {activeBrands.map((brand, index) => (
              <BrandWrapper
                key={index}
                brand={brand}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] flex flex-col items-center justify-center gap-3 snap-center"
              >
                {/* Logo */}
                <div className="bg-gray-50 rounded-2xl p-4 w-full aspect-square flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={100}
                    height={100}
                    className="object-contain max-h-16 w-auto"
                  />
                </div>
                {/* Brand Name */}
                <span className="text-gray-700 font-medium text-sm">
                  {brand.name}
                </span>
              </BrandWrapper>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className={`hidden lg:grid ${gridCols} gap-8 px-4 md:px-8`}>
          {activeBrands.map((brand, index) => (
            <BrandWrapper
              key={index}
              brand={brand}
              className="flex flex-col items-center justify-center gap-4"
            >
              {/* Logo */}
              <div className="bg-gray-50 rounded-2xl p-6 w-full aspect-square flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={120}
                  className="object-contain max-h-24 w-auto"
                />
              </div>
              {/* Brand Name */}
              <span className="text-gray-700 font-medium text-base">
                {brand.name}
              </span>
            </BrandWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}
