"use client"

import { useState, useEffect, useRef } from "react"
import { menuData } from "@lib/menu-data"
import type { MenuCategoryUI, MenuItemUI } from "@lib/strapi/coffee-menu"
import Marquee from "@modules/common/components/marquee"
import AboutUsSection from "../../components/about-us-section"
import FeaturedMenuSection from "../../components/featured-menu-section"
import CoffeeCategorySection from "../../components/coffee-category-section"
import AdsSection from "../../components/ads-section"
import WhyChooseUsSection from "@modules/menu/components/why-choose-us-section"
import StatsSection from "../../components/stats-section"
import ClientTestimonialsSection from "../../components/client-testimonials-section"
import GallerySection from "../../components/gallery-section"
import BlogsSection from "../../components/blogs-section"
import FaqsSection from "../../components/faqs-section"
import NewsletterSection from "../../components/newsletter-section"

/**
 * First Gear Coffee Menu Template - Revamped
 * Professional, modern cafÃ© menu with premium aesthetic
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

const heroFeatureCards = [
  {
    title: "QUALITY FIRST",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M4 10h11a3 3 0 0 1 0 6H4v-6Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M15 11h2.5a2.5 2.5 0 0 1 0 5H15"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M7 6c0-1 1-1.5 1-3M11 6c0-1 1-1.5 1-3"
        />
      </svg>
    ),
  },
  {
    title: "QUALITY FIRST",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M12 3c3.5 0 6 2.3 6 5.4 0 3.8-3.2 6.2-6 12.6-2.8-6.4-6-8.8-6-12.6C6 5.3 8.5 3 12 3Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M12 6.5c1.2 1.2 1.2 3.8 0 5"
        />
      </svg>
    ),
  },
  {
    title: "COFFEE COMMUNITY",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M7 4h10"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M9 4v2M15 4v2M6 10h12"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M8 10v6.5A1.5 1.5 0 0 0 9.5 18h5A1.5 1.5 0 0 0 16 16.5V10"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.7}
          d="M10 13h4"
        />
      </svg>
    ),
  },
]

const heroFallbackCopy = {
  title: "START YOUR DAY RIGHT WITH FRESHLY BREWED COFFEE",
  description:
    "Start your day right with freshly brewed coffee made to energize your mornings and satisfy your senses.",
}

const heroFallbackImages = {
  portrait:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  polaroid:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
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
                    {variant.label} - â‚±{variant.price}
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

  const scrollToFirstCategory = () => {
    scrollToCategory(menuCategories[0]?.id || "hot-coffee")
  }

  const heroDescription = heroData?.pageSubtitle || heroFallbackCopy.description
  const heroPortraitImage =
    heroData?.backgroundImage || heroFallbackImages.portrait
  const heroPolaroidImage = heroFallbackImages.polaroid

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
        .menu-hero-badge {
          clip-path: polygon(
            50% 0%,
            61% 18%,
            82% 8%,
            77% 29%,
            100% 34%,
            83% 49%,
            94% 71%,
            70% 68%,
            67% 100%,
            50% 82%,
            33% 100%,
            30% 68%,
            6% 71%,
            17% 49%,
            0% 34%,
            23% 29%,
            18% 8%,
            39% 18%
          );
        }
      `}</style>

      {/* Hero Section — Light Design (White) */}
      <section className="relative bg-white pt-8 sm:pt-16 md:pt-24 lg:pt-32 pb-16 sm:pb-24 md:pb-40 overflow-hidden">
        {/* Torn paper bottom edge (Blends with white content area below, but kept for structure) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 text-white">
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-[calc(100%+1px)] h-[16px] sm:h-[24px] md:h-[40px] block" fill="currentColor">
            <path d="M1200,40H0V28l37,12l42-12l38,10l44-15l39,12l41-11l43,14l36-12l45,15l39-10l42,16l38-14l44,11l40-15l41,12l43-10l37,14l42-13l39,15l44-11l38,12l41-16l43,14l36-10l45,13l39-15l42,11l38-14l44,16l40-12l41,15l43-13l37,9V40z" />
          </svg>
        </div>

        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-8 items-center">
            
            {/* Left Column (Content) */}
            <div className="relative z-10 lg:pr-6 flex flex-col items-center text-center md:items-start md:text-left mt-8 lg:mt-0">
              
              {/* Brand Establishment Tagline */}
              <div 
                className="text-[#f16d34] text-[10px] sm:text-xs font-bold tracking-[2px] sm:tracking-[3px] uppercase mb-4 sm:mb-6"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                FIRST GEAR COFFEE. EST 2023 - MAKATI, PHILIPPINES
              </div>

              {/* Heading Container */}
              <div className="relative inline-block z-20">
                <h1 
                  className="text-[#222222] text-[44px] sm:text-[56px] md:text-[64px] lg:text-[70px] xl:text-[80px] leading-[1.05] tracking-tight uppercase"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: 900 }}
                >
                  PRECISION
                  <br />
                  <span className="text-[#f16d34]">IN EVERY</span>
                  <br />
                  POUR.
                </h1>
                
                {/* Overlapping "GOOD VIBES" Starburst Badge - Safely contained to avoid image overlap */}
                <div className="hidden md:block absolute top-[50%] -right-[8%] md:-right-[10%] lg:-right-[12%] transform rotate-[10deg] pointer-events-none drop-shadow-lg scale-90 lg:scale-100 h-fit w-fit">
                  <svg width="120" height="120" viewBox="-10 -10 120 120" className="overflow-visible">
                    <path
                      d="M50 0L56.1264 16.3533L72.8252 6.09673L74.0152 23.447L92.7441 19.3005L88.0827 37.8924L103.951 40.4074L93.2081 55.4338L103.012 73.1362L86.1366 77.2657L89.4312 95.8277L72.2605 92.5152L64.2127 108.318L50 96L35.7873 108.318L27.7395 92.5152L10.5688 95.8277L13.8634 77.2657L-3.01184 73.1362L6.79189 55.4338L-3.95115 40.4074L11.9173 37.8924L7.25595 19.3005L25.9848 23.447L27.1748 6.09673L43.8736 16.3533L50 0Z"
                      fill="#222222"
                      stroke="#f16d34"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <text x="50" y="47" fill="white" fontSize="14" fontWeight="800" fontFamily="var(--font-montserrat), sans-serif" textAnchor="middle" letterSpacing="1" transform="rotate(-5, 50, 50)">GOOD</text>
                    <text x="50" y="65" fill="white" fontSize="14" fontWeight="800" fontFamily="var(--font-montserrat), sans-serif" textAnchor="middle" letterSpacing="1" transform="rotate(-5, 50, 50)">VIBES</text>
                  </svg>
                </div>
              </div>

              {/* Subheading text */}
              <p 
                className="mt-6 md:mt-8 text-[#222222]/80 text-sm md:text-[15px] font-medium max-w-[420px] leading-relaxed" 
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {heroData?.pageSubtitle || "Start your day right with freshly brewed coffee made to energize your mornings and satisfy your senses."}
              </p>

              {/* CTA Button */}
              <div className="mt-8 md:mt-10">
                <button 
                  onClick={scrollToFirstCategory}
                  className="bg-[#f16d34] text-white text-xs md:text-[13px] font-bold tracking-wider uppercase px-8 py-3.5 rounded-xl border border-transparent hover:brightness-110 transition-all active:translate-y-1 w-full sm:w-auto"
                  style={{ 
                    fontFamily: "var(--font-montserrat), sans-serif",
                    boxShadow: '0 6px 0 0 rgba(0,0,0,0.15)'
                  }}
                >
                  SEE THE MENU
                </button>
              </div>

              {/* Features Boxes */}
              <div className="mt-12 md:mt-16 sm:mt-20 grid grid-cols-3 gap-2 sm:gap-4 max-w-[340px] w-full">
                {/* Box 1 - Quality */}
                <div className="border border-[#222222]/10 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-[#222222]/5 to-transparent flex flex-col items-center justify-center aspect-square shadow-sm">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#f16d34] mb-2 sm:mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                  </svg>
                  <span className="text-[9px] sm:text-[11px] font-bold text-center text-[#222222] leading-tight" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>QUALITY<br/>FIRST</span>
                </div>

                {/* Box 2 - Fresh Beans */}
                <div className="border border-[#222222]/10 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-[#222222]/5 to-transparent flex flex-col items-center justify-center aspect-square shadow-sm">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#f16d34] mb-2 sm:mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 4 13C4 8.6 7 5 11 5a7 7 0 0 1 7 7c0 4.4-3 8-7 8Z"></path><path d="M11 5v15"></path><path d="M11 13a4 4 0 0 0 4-4"></path>
                  </svg>
                  <span className="text-[9px] sm:text-[11px] font-bold text-center text-[#222222] leading-tight" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>FRESH<br/>BEANS</span>
                </div>

                {/* Box 3 - Community */}
                <div className="border border-[#222222]/10 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-[#222222]/5 to-transparent flex flex-col items-center justify-center aspect-square shadow-sm">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#f16d34] mb-2 sm:mb-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="text-[9px] sm:text-[11px] font-bold text-center text-[#222222] leading-tight" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>COFFEE<br/>COMMUNITY</span>
                </div>
              </div>
            </div>

            {/* Right Column (Offset Images) - Hidden on mobile, shown on md (tablet) and up */}
            <div className="hidden md:flex relative w-full h-[450px] md:h-[550px] lg:h-[700px] mt-2 lg:mt-0 items-center justify-center pointer-events-none drop-shadow-2xl">
              
              {/* Back Image (Large Barista Portrait) */}
              <div className="absolute top-[12%] right-[10%] lg:right-[4%] w-[65%] lg:w-[85%] aspect-[3/4] border-[12px] border-white rounded-[4px] shadow-lg transform rotate-[6deg] overflow-hidden bg-gray-200">
                <img 
                  src={heroPortraitImage || "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80"} 
                  alt="Barista brewing fresh coffee" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Front Image (Small Latte Square) */}
              <div className="absolute bottom-[10%] top-[50%] left-[10%] lg:left-[-33%] w-[45%] lg:w-[65%] aspect-square border-[12px] border-white rounded-[4px] shadow-[0_15px_40px_rgba(0,0,0,0.3)] transform -rotate-[22deg] overflow-hidden bg-gray-200">
                <img 
                  src={heroPolaroidImage || "/images/firstgear-coffee/hazelnut.png"} 
                  alt="Beautiful latte art" 
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Banner Divider */}
      <Marquee />

      {/* About Us Featured Section */}
      <AboutUsSection />

      {/* Featured Menu Selection Grid */}
      <FeaturedMenuSection />

      {/* Coffee Categories Grid */}
      <CoffeeCategorySection />

        {/* Why Choose Us Section */}
      <AdsSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Client Testimonials Section */}
      <ClientTestimonialsSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Blogs Section */}
      <BlogsSection />

      {/* FAQS Section */}
      <FaqsSection />

      {/* Newsletter Section */}
      <NewsletterSection />

    </div>
  )
}




