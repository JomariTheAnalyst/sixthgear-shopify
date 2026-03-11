"use client"

import React from "react"

const COFFEE_CATEGORIES = [
  {
    id: 1,
    name: "ESPRESSO",
    // Placeholder - replacing with a clean isolated cup image 
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&q=80", 
  },
  {
    id: 2,
    name: "CAPPUCCINO",
    image: "https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=500&q=80",
  },
  {
    id: 3,
    name: "ICED COFFEE",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80",
  },
  {
    id: 4,
    name: "COLD BREW",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80",
  },
  {
    id: 5,
    name: "MACCHIATO",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&q=80",
  },
  {
    id: 6,
    name: "FLAT WHITE",
    image: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=500&q=80",
  }
]

const CoffeeCategorySection = () => {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="text-left">
            <span 
              className="text-[#f16d34] text-lg sm:text-xl block mb-2"
              style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
            >
              Coffee Category
            </span>
            <h2 
              className="text-[#222222] text-[32px] sm:text-[40px] md:text-[48px] leading-[1.1] font-black uppercase tracking-tight"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              OUR COFFEE,<br /> YOUR EXPERIENCE
            </h2>
          </div>

          <div className="flex-shrink-0">
            <button 
              className="bg-[#222222] text-white text-[11px] sm:text-xs font-bold tracking-widest uppercase px-6 sm:px-8 py-3.5 rounded-lg hover:brightness-110 active:translate-y-1 transition-all shadow-[0_4px_0_0_rgba(17,17,17,1)]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              OUR PRODUCTS
            </button>
          </div>
        </div>

        {/* 3x2 Grid for Desktop, 2x3 for tablet, 1x6 for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {COFFEE_CATEGORIES.map((category) => (
            <div 
              key={category.id} 
              className="bg-[#f0f0f0] rounded-[16px] aspect-square flex flex-col items-center justify-between p-8 hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
            >
              {/* Product Image (mix-blend-multiply makes white backgrounds transparent) */}
              <div className="w-full h-[65%] flex items-center justify-center -mt-4">
                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 relative group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-lg"
                  />
                </div>
              </div>

              {/* Category Title */}
              <h3 
                className="text-[#222222] text-[20px] sm:text-[24px] md:text-[28px] font-black uppercase tracking-tight mt-auto"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoffeeCategorySection
