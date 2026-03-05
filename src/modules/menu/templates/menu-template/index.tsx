"use client"

import { useState, useEffect, useRef } from "react"
import { menuData } from "@lib/menu-data"
import type {
  MenuCategoryUI,
  MenuItemUI,
  MenuVariant,
} from "@lib/strapi/coffee-menu"

/**
 * First Gear Coffee Menu Template - Revamped
 * Professional, modern café menu with premium aesthetic
 * Card-based layout with images, horizontal scroll (mobile), prev/next buttons (desktop)
 * Now supports CMS content with fallback to hardcoded data
 */

// Helper function to convert legacy menu data to new format
function convertLegacyMenuData(): MenuCategoryUI[] {
  return menuData.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.id,
    items: category.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image || null,
      isPopular: item.popular || false,
      variants:
        item.sizes?.map((size, index) => ({
          id: index,
          label: size.size,
          price: size.price,
        })) || [],
    })),
  }))
}

// Hero Props Interface
interface MenuHeroProps {
  pageTitle?: string
  pageSubtitle?: string
  backgroundImage?: string | null
}

// Menu Item Card Component - Card with image, fixed height, no hover
const MenuItemCard = ({ item }: { item: MenuItemUI }) => {
  // Use existing image if available, otherwise use placeholder
  const imageUrl =
    item.image ||
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"

  return (
    <article className="flex-shrink-0 w-[280px] md:w-[320px] h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md h-[480px] md:h-[500px] flex flex-col">
        {/* Image - Fixed height */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {/* Popular badge */}
          {item.isPopular && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-900 shadow-lg">
                Popular
              </span>
            </div>
          )}
        </div>

        {/* Content - Flexible height with overflow handling */}
        <div className="p-5 md:p-6 flex-1 flex flex-col overflow-hidden">
          {/* Item name */}
          <h3
            className="text-gray-900 text-xl md:text-2xl font-bold mb-2 tracking-tight flex-shrink-0"
            style={{ fontFamily: "Tanker, sans-serif" }}
          >
            {item.name}
          </h3>

          {/* Description - Scrollable if too long */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 flex-1 overflow-y-auto">
            {item.description}
          </p>

          {/* Bottom section - Fixed at bottom */}
          <div className="flex-shrink-0">
            {/* Variant buttons (if available) */}
            {item.variants && item.variants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {item.variants.map((variant) => (
                  <span
                    key={variant.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {variant.label} - ₱{variant.price}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// Category Section Component with Carousel
const CategorySection = ({ category }: { category: MenuCategoryUI }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Card width + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="scroll-mt-32 mb-16 md:mb-20" id={category.id}>
      {/* Category Header */}
      <div className="mb-6 md:mb-8">
        <h2
          className="text-3xl md:text-4xl text-gray-900 mb-3 font-bold tracking-tight"
          style={{ fontFamily: "Tanker, sans-serif" }}
        >
          {category.name}
        </h2>
        <p className="text-gray-600 text-base md:text-lg font-light max-w-2xl">
          {category.description}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Desktop Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F16D34] transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Previous items"
        >
          <svg
            className="w-6 h-6"
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
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#F16D34] transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Next items"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Scrollable Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {category.items.map((item) => (
            <div key={item.id} className="snap-start">
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="md:hidden flex justify-center mt-4">
          <span className="text-xs text-gray-400 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Swipe to explore
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </section>
  )
}

export default function MenuTemplate({
  heroData,
  categories,
}: {
  heroData?: MenuHeroProps | null
  categories?: MenuCategoryUI[]
}) {
  // Log props on mount for debugging
  useEffect(() => {
    console.log("==========================================================")
    console.log("[MenuTemplate] CLIENT-SIDE PROPS RECEIVED:")
    console.log("[MenuTemplate] heroData:", heroData)
    console.log("[MenuTemplate] categories count:", categories?.length || 0)
    console.log("==========================================================")
  }, [heroData, categories])

  // Use CMS data if available, otherwise fallback to hardcoded data
  const menuCategories =
    categories && categories.length > 0 ? categories : convertLegacyMenuData()

  const [activeCategory, setActiveCategory] = useState<string>(
    menuCategories[0]?.id || "hot-coffee"
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuCategories.map((cat) => ({
        id: cat.id,
        element: document.getElementById(cat.id),
      }))

      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        if (section.element) {
          const { offsetTop, offsetHeight } = section.element
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveCategory(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [menuCategories])

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    setIsMobileMenuOpen(false)
    const element = document.getElementById(categoryId)
    if (element) {
      const offset = 120
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Hero Section — Contained Card with Background Image */}
      <div className="pt-20 md:pt-24 lg:pt-28 pb-8 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div
          className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[450px] md:min-h-[550px] lg:min-h-[650px] flex items-center bg-[#E1DBD1]"
          style={{
            backgroundImage: `url(${heroData?.backgroundImage || "/images/firstgear-coffee/menu-hero-bg.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        >
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E1DBD1] via-[#E1DBD1]/90 to-transparent w-full sm:w-4/5 md:w-3/4 lg:w-2/3 pointer-events-none"></div>

          {/* Content overlay on the left */}
          <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 py-10 md:py-16 max-w-2xl w-full">
            {/* Heading */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-[#3E2723] mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-inter), Georgia, 'Times New Roman', serif", fontWeight: 800 }}
            >
              {heroData?.pageTitle || (
                <>
                  Indulge in
                  <br />
                  Our <span className="text-[#E8910D]">Coffee</span>
                  <br />
                  Delights
                </>
              )}
            </h1>

            {/* Description */}
            <p
              className="text-[#3E2723] text-sm sm:text-base lg:text-[17px] leading-[1.6] sm:leading-[1.7] max-w-lg mb-6 sm:mb-8 md:mb-10 font-medium opacity-90"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {heroData?.pageSubtitle ||
                "At CafeBrew, we believe that every cup of coffee tells a story. From the rich aroma that tantalizes your senses to the smooth, velvety taste that lingers on your palate, each sip is an experience to be savored."}
            </p>

            {/* CTA Button */}
            <div>
              <button
                onClick={() => {
                  const el = document.getElementById(
                    menuCategories[0]?.id || "hot-coffee"
                  )
                  if (el) {
                    const offset = 120
                    const pos = el.getBoundingClientRect().top + window.pageYOffset - offset
                    window.scrollTo({ top: pos, behavior: "smooth" })
                  }
                }}
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#E8910D] hover:bg-[#D17E08] text-white text-[14px] sm:text-[15px] font-bold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#E8910D]/30 hover:-translate-y-1"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Explore Our Products
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 md:px-8 lg:px-12 pb-10 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6 py-8 md:py-12">
            <div className="text-center">
              <p
                className="text-[#5D4037] text-sm md:text-base lg:text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Our Products
              </p>
              <p
                className="text-[#3E2723] text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-inter), Georgia, serif" }}
              >
                +25
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-[#5D4037] text-sm md:text-base lg:text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Total Sales
              </p>
              <p
                className="text-[#3E2723] text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-inter), Georgia, serif" }}
              >
                +325k
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-[#5D4037] text-sm md:text-base lg:text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Happy Customer
              </p>
              <p
                className="text-[#3E2723] text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-inter), Georgia, serif" }}
              >
                +45k
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 py-12 md:py-16">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                      ${
                        activeCategory === category.id
                          ? "bg-[#F16D34] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span
                      className="font-semibold text-sm tracking-wide"
                      style={{ fontFamily: "Inter Display, sans-serif" }}
                    >
                      {category.name}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Category Dropdown */}
          <div className="lg:hidden sticky top-20 z-30 bg-white border-b border-gray-200 -mx-4 px-4 py-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span
                className="font-semibold text-gray-900"
                style={{ fontFamily: "Inter Display, sans-serif" }}
              >
                {menuCategories.find((cat) => cat.id === activeCategory)
                  ?.name || "Select Category"}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-40">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`
                      w-full text-left px-4 py-3 transition-colors
                      ${
                        activeCategory === category.id
                          ? "bg-[#F16D34] text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className="font-semibold text-sm"
                      style={{ fontFamily: "Inter Display, sans-serif" }}
                    >
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu Content */}
          <main className="flex-1 min-w-0">
            {menuCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}
