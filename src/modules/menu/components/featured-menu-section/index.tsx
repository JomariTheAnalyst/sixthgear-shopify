"use client"

import React, { useState } from "react"

const CATEGORIES = ["Mexican", "Japanese", "Italian", "Drinks"]

const MENU_ITEMS = [
  {
    id: 1,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    name: "ESPRESSO SHOT",
    rating: 5,
    description: "Rich, bold, and freshly extracted. Pure intensity in every concentrated sip.",
    price: "$35.00"
  },
  {
    id: 2,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800",
    name: "CARAMEL LATTE",
    rating: 5,
    description: "Silky steamed milk with caramel sweetness. A creamy delight that warms every moment.",
    price: "$40.00"
  },
  {
    id: 3,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800",
    name: "MOCHA BLISS",
    rating: 5,
    description: "Chocolate and coffee in perfect harmony. Smooth, sweet, and deeply satisfying.",
    price: "$30.00"
  }
]

const StarRating = ({ count }: { count: number }) => {
  return (
    <div className="flex justify-center gap-1 my-3">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-[#F3B748]" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const FeaturedMenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("Italian")

  return (
    <section className="bg-[#1A422D] relative py-20 lg:py-28 overflow-hidden z-10 w-full">
      {/* Torn Paper Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 text-white transform rotate-180">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[12px] sm:h-[18px] md:h-[24px] block" fill="currentColor">
          <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
        </svg>
      </div>

      <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-[1240px]">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-14 pt-8">
          <span 
            className="text-[#F3B748] text-xl sm:text-2xl block mb-2"
            style={{ fontFamily: "'Brush Script MT', 'Alex Brush', cursive", fontStyle: "italic" }}
          >
            Our Menu
          </span>
          <h2 
            className="text-white text-[28px] sm:text-[36px] md:text-[44px] leading-[1.1] font-black uppercase tracking-tight max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            YOUR FAVORITE BREWS AND BITES,<br className="hidden md:block" /> ALL IN ONE MENU
          </h2>
        </div>

        {/* Categories Pill Navigation */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === category 
                  ? "bg-[#F3B748] text-[#1A422D] border-[#F3B748]" 
                  : "bg-transparent text-white border-white/20 hover:border-white/40"
              }`}
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {MENU_ITEMS.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-xl">
              {/* Product Image */}
              <div className="relative h-[250px] w-full bg-gray-200">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Product Details */}
              <div className="p-6 flex flex-col flex-1 text-center bg-white">
                <h3 
                  className="text-[#1A422D] text-lg sm:text-xl font-black uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {item.name}
                </h3>
                
                <StarRating count={item.rating} />
                
                <p 
                  className="text-[#1A422D]/70 text-sm leading-relaxed mb-6 font-medium mt-1 flex-1 px-2"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {item.description}
                </p>

                {/* Price & Action Row */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span 
                    className="text-[#1A422D] text-xl font-black"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {item.price}
                  </span>
                  
                  <button 
                    className="bg-[#F3B748] text-[#1A422D] text-[11px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg border-2 border-[#1A422D] hover:bg-[#1A422D] hover:text-[#F3B748] transition-colors"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots / Arrows */}
        <div className="flex justify-center items-center gap-3 mt-12 sm:mt-16">
          <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1A422D] hover:bg-gray-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1A422D] hover:bg-gray-100 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Torn Paper Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-white">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[12px] sm:h-[18px] md:h-[24px] block" fill="currentColor">
          <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
        </svg>
      </div>
    </section>
  )
}

export default FeaturedMenuSection
