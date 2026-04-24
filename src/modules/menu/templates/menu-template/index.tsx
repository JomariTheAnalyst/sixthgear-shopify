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
import FirstGearHero, {
  type FirstGearHeroData,
} from "../../components/first-gear-hero"
import type { FeaturedMenuProduct } from "../../components/featured-menu-section"

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
  featuredMenuItems,
}: {
  heroData?: FirstGearHeroData | null
  categories?: MenuCategoryUI[]
  featuredMenuItems?: FeaturedMenuProduct[]
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

      <FirstGearHero heroData={heroData} onMenuClick={scrollToFirstCategory} />

      {/* Infinite Marquee Banner Divider */}
      <Marquee />

      {/* About Us Featured Section */}
      <AboutUsSection />

      {/* Featured Menu Selection Grid */}
      <FeaturedMenuSection items={featuredMenuItems} />

      {/* Coffee Categories Grid */}
      {/* <CoffeeCategorySection /> */}

        {/* Why Choose Us Section */}
      {/* <AdsSection /> */}

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Stats Section */}
      {/* <StatsSection /> */}

      

      {/* Gallery Section */}
      <GallerySection />

      {/* Client Testimonials Section */}
      <ClientTestimonialsSection />


      {/* FAQS Section */}
      <FaqsSection />

      {/* Newsletter Section */}
      <NewsletterSection />

    </div>
  )
}




