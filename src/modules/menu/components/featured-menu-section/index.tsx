"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"

import ProductCard from "./product-card"
import ProductModal from "./product-modal"
import type { FeaturedMenuProduct } from "./types"

const ALL_PRODUCTS_FILTER = "All Products"
const PREFERRED_CATEGORIES = [
  ALL_PRODUCTS_FILTER,
  "Coffee Drinks",
  "Non-Coffee Drinks",
  "Snacks",
]

export type { FeaturedMenuProduct } from "./types"

const FALLBACK_MENU_ITEMS: FeaturedMenuProduct[] = [
  // Coffee Drinks
  {
    id: 1,
    category: "Coffee Drinks",
    handle: "espresso-shot",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    name: "ESPRESSO SHOT",
    description: "Rich, bold, and freshly extracted. Pure intensity in every concentrated sip.",
    price: "₱120.00"
  },
  {
    id: 2,
    category: "Coffee Drinks",
    handle: "caramel-latte",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800",
    name: "CARAMEL LATTE",
    description: "Silky steamed milk with caramel sweetness. A creamy delight that warms every moment.",
    price: "₱160.00"
  },
  {
    id: 3,
    category: "Coffee Drinks",
    handle: "mocha-bliss",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800",
    name: "MOCHA BLISS",
    description: "Chocolate and coffee in perfect harmony. Smooth, sweet, and deeply satisfying.",
    price: "₱175.00"
  },
  {
    id: 4,
    category: "Coffee Drinks",
    handle: "vietnamese-coffee",
    image: "https://images.unsplash.com/photo-1517701604599-bb24b5e50741?q=80&w=800",
    name: "VIETNAMESE COFFEE",
    description: "Authentic dark roast with condensed milk. Strong, sweet, and incredibly bold.",
    price: "₱150.00"
  },
  // Non-Coffee Drinks
  {
    id: 5,
    category: "Non-Coffee Drinks",
    handle: "matcha-latte",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800",
    name: "MATCHA LATTE",
    description: "Premium ceremonial grade matcha with creamy steamed milk. Earthy and soothing.",
    price: "₱165.00"
  },
  {
    id: 6,
    category: "Non-Coffee Drinks",
    handle: "berry-iced-tea",
    image: "https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=800",
    name: "BERRY ICED TEA",
    description: "Freshly brewed tea infused with wild berries. Refreshing and naturally sweet.",
    price: "₱140.00"
  },
  {
    id: 7,
    category: "Non-Coffee Drinks",
    handle: "orange-sunrise",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    name: "ORANGE SUNRISE",
    description: "Freshly squeezed oranges with a hint of grenadine. A bright start to your day.",
    price: "₱155.00"
  },
  {
    id: 8,
    category: "Non-Coffee Drinks",
    handle: "chocolate-frapper",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800",
    name: "CHOCOLATE FRAPPER",
    description: "Rich dark chocolate blended with ice and topped with whipped cream.",
    price: "₱180.00"
  },
  // Snacks
  {
    id: 9,
    category: "Snacks",
    handle: "blueberry-muffin",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=800",
    name: "BLUEBERRY MUFFIN",
    description: "Freshly baked muffin bursting with real blueberries and a crumbly top layer.",
    price: "₱95.00"
  },
  {
    id: 10,
    category: "Snacks",
    handle: "chocolate-croissant",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800",
    name: "CHOCOLATE CROISSANT",
    description: "Flaky, buttery pastry filled with premium dark chocolate. Best served warm.",
    price: "₱110.00"
  },
  {
    id: 11,
    category: "Snacks",
    handle: "avocado-toast",
    image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=800",
    name: "AVOCADO TOAST",
    description: "Sourdough bread topped with mashed avocado, chili flakes, and a poached egg.",
    price: "₱220.00"
  },
  {
    id: 12,
    category: "Snacks",
    handle: "cheesecake-slice",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800",
    name: "CHEESECAKE SLICE",
    description: "New York style creamy cheesecake with a graham cracker crust and berry coulis.",
    price: "₱145.00"
  }
]

type FeaturedMenuSectionProps = {
  items?: FeaturedMenuProduct[]
}

const FeaturedMenuSection = ({ items }: FeaturedMenuSectionProps) => {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "ph"
  const menuItems = items && items.length > 0 ? items : FALLBACK_MENU_ITEMS
  const itemCategories = new Set(
    menuItems.map((item) => item.category).filter(Boolean)
  )
  const categoriesFromProducts = Array.from(itemCategories)
  const preferredAvailableCategories = PREFERRED_CATEGORIES.filter(
    (category) => category === ALL_PRODUCTS_FILTER || itemCategories.has(category)
  )
  const extraCategories = categoriesFromProducts.filter(
    (category) => !PREFERRED_CATEGORIES.includes(category)
  )
  const activeCategories = [...preferredAvailableCategories, ...extraCategories]
  const [activeCategory, setActiveCategory] = useState(activeCategories[0])
  const [selectedProduct, setSelectedProduct] = useState<FeaturedMenuProduct | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const visibleMenuItems =
    activeCategory === ALL_PRODUCTS_FILTER
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory)

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
    <section className="relative z-10 w-full overflow-hidden bg-[#f5f1e8] py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <h2 
            className="mx-auto max-w-4xl text-[38px] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#111] sm:text-[58px] md:text-[72px]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Best Products
          </h2>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3">
          {activeCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 sm:px-6 ${
                activeCategory === category 
                  ? "border-[#111] bg-[#111] text-white" 
                  : "border-[#111]/15 bg-white/70 text-[#111] hover:border-[#111]/40"
              }`}
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative group -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
          <div 
            ref={scrollRef}
            className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2 sm:gap-5 lg:gap-6"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {visibleMenuItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddClick={setSelectedProduct}
              />
            ))}
          </div>
          
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button 
            onClick={() => scroll("left")}
            className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#111] text-white transition-colors hover:bg-[#f16d34]"
            aria-label="Previous menu products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll("right")}
            className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#111] text-white transition-colors hover:bg-[#f16d34]"
            aria-label="Next menu products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <ProductModal
        product={selectedProduct}
        countryCode={countryCode}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}

export default FeaturedMenuSection
