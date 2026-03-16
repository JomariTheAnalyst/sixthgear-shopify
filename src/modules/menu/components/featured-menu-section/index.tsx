"use client"

import React, { useState } from "react"

const CATEGORIES = ["Coffee Drinks", "Non-Coffee Drinks", "Snacks"]

const MENU_ITEMS = [
  // Coffee Drinks
  {
    id: 1,
    category: "Coffee Drinks",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    name: "ESPRESSO SHOT",
    description: "Rich, bold, and freshly extracted. Pure intensity in every concentrated sip.",
    price: "₱120.00"
  },
  {
    id: 2,
    category: "Coffee Drinks",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800",
    name: "CARAMEL LATTE",
    description: "Silky steamed milk with caramel sweetness. A creamy delight that warms every moment.",
    price: "₱160.00"
  },
  {
    id: 3,
    category: "Coffee Drinks",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800",
    name: "MOCHA BLISS",
    description: "Chocolate and coffee in perfect harmony. Smooth, sweet, and deeply satisfying.",
    price: "₱175.00"
  },
  {
    id: 4,
    category: "Coffee Drinks",
    image: "https://images.unsplash.com/photo-1517701604599-bb24b5e50741?q=80&w=800",
    name: "VIETNAMESE COFFEE",
    description: "Authentic dark roast with condensed milk. Strong, sweet, and incredibly bold.",
    price: "₱150.00"
  },
  // Non-Coffee Drinks
  {
    id: 5,
    category: "Non-Coffee Drinks",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800",
    name: "MATCHA LATTE",
    description: "Premium ceremonial grade matcha with creamy steamed milk. Earthy and soothing.",
    price: "₱165.00"
  },
  {
    id: 6,
    category: "Non-Coffee Drinks",
    image: "https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=800",
    name: "BERRY ICED TEA",
    description: "Freshly brewed tea infused with wild berries. Refreshing and naturally sweet.",
    price: "₱140.00"
  },
  {
    id: 7,
    category: "Non-Coffee Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    name: "ORANGE SUNRISE",
    description: "Freshly squeezed oranges with a hint of grenadine. A bright start to your day.",
    price: "₱155.00"
  },
  {
    id: 8,
    category: "Non-Coffee Drinks",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800",
    name: "CHOCOLATE FRAPPER",
    description: "Rich dark chocolate blended with ice and topped with whipped cream.",
    price: "₱180.00"
  },
  // Snacks
  {
    id: 9,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800",
    name: "BLUEBERRY MUFFIN",
    description: "Freshly baked muffin bursting with real blueberries and a crumbly top layer.",
    price: "₱95.00"
  },
  {
    id: 10,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800",
    name: "CHOCOLATE CROISSANT",
    description: "Flaky, buttery pastry filled with premium dark chocolate. Best served warm.",
    price: "₱110.00"
  },
  {
    id: 11,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=800",
    name: "AVOCADO TOAST",
    description: "Sourdough bread topped with mashed avocado, chili flakes, and a poached egg.",
    price: "₱220.00"
  },
  {
    id: 12,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800",
    name: "CHEESECAKE SLICE",
    description: "New York style creamy cheesecake with a graham cracker crust and berry coulis.",
    price: "₱145.00"
  }
]

const FeaturedMenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("Coffee Drinks")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollAmount = clientWidth
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="bg-[#222222] relative py-20 lg:py-28 overflow-hidden z-10 w-full">
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
              onClick={() => handleCategoryChange(category)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === category 
                  ? "bg-[#F3B748] text-[#222222] border-[#F3B748]" 
                  : "bg-transparent text-white border-white/20 hover:border-white/40"
              }`}
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Carousel */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 lg:gap-8 min-h-[400px] no-scrollbar scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {MENU_ITEMS.filter(item => item.category === activeCategory).map((item) => (
              <div 
                key={item.id} 
                className="flex-none w-[280px] sm:w-[320px] lg:w-[calc(33.333%-22px)] bg-white rounded-2xl overflow-hidden flex flex-col shadow-xl"
              >
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
                    className="text-[#222222] text-lg sm:text-xl font-black uppercase tracking-wide mb-3"
                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    {item.name}
                  </h3>
                  
                  <p 
                    className="text-[#222222]/70 text-sm leading-relaxed mb-6 font-medium mt-1 flex-1 px-2"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    {item.description}
                  </p>

                  {/* Price Row */}
                  <div className="flex items-center justify-center pt-4 border-t border-gray-100">
                    <span 
                      className="text-[#222222] text-2xl font-black"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        {/* Pagination / Navigation Footer */}
        <div className="flex justify-center items-center gap-3 mt-12 sm:mt-16">
          <button 
            onClick={() => scroll("left")}
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#222222] hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#222222] hover:bg-gray-100 transition-colors shadow-sm"
          >
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
