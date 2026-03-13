"use client"

import Image from "next/image"

const ALL_BRANDS = [
  { name: "BMW", logo: "/images/brands/brands-logo/bmw-logo.svg" },
  { name: "KTM", logo: "/images/brands/brands-logo/ktm-logo.svg" },
  { name: "Suzuki", logo: "/images/brands/brands-logo/suzuki-logo.svg" },
  { name: "Kawasaki", logo: "/images/brands/brands-logo/kawasaki-logo.svg" },
  { name: "Royal Enfield", logo: "/images/brands/brands-logo/royal-enfield-logo.svg" },
  { name: "Yamaha", logo: "/images/brands/brands-logo/yamaha.svg" },
]

export default function BrandsWeService() {
  return (
    <section className="bg-white py-16 md:py-24 border-b border-[#F5F5F7] w-full overflow-hidden">
      <div className="w-full mx-auto px-6 md:px-12 lg:px-20 max-w-[1400px]">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h3 
            className="text-3xl md:text-4xl lg:text-5xl text-[#111] font-semibold tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Inter Display', sans-serif" }}
          >
            Brands We Service
          </h3>
        </div>

        {/* Static One-Row Logo Layout */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {ALL_BRANDS.map((brand) => (
            <div 
              key={brand.name}
              className="w-24 md:w-28 lg:w-32 h-10 md:h-12 lg:h-16 relative grayscale opacity-40 cursor-default flex-shrink-0"
            >
              <Image 
                src={brand.logo} 
                alt={brand.name} 
                fill 
                className="object-contain" 
                priority={brand.name === "BMW" || brand.name === "KTM" || brand.name === "Suzuki"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
