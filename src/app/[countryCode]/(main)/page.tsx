import { Metadata } from "next"
import { Suspense } from "react"

import Hero from "@modules/home/components/hero"
import AboutSection from "@modules/home/components/about"
import OurServices from "@modules/home/components/our-services"
import ShopByCategories from "@modules/home/components/categories"
import SatisfiedCustomers from "@modules/home/components/satisfied-customers"
import CoffeeShowcase from "@modules/home/components/coffee-showcase"
import ClientTestimonials from "@modules/home/components/client-testimonials"
import CTABanner from "@modules/home/components/cta-banner"
import Franchise from "@modules/home/components/franchise"
import OurTeam from "@modules/home/components/our-team"
import Stats from "@modules/home/components/stats"
import ProjectsSection from "@modules/home/components/projects"
import Brands from "@modules/home/components/brands"
import ClientStories from "@modules/home/components/client-stories"
import StoreLocation from "@modules/home/components/store-location"
import ShopByBrands from "@modules/home/components/shop-by-brands"
import { ProductSection } from "@modules/home/components/product-sections"
import { getRegion } from "@lib/data/regions"
import { getProducts, getCollections } from "@lib/shopify"

import { getMarketingForPath } from "@lib/data/marketing"
import { BannerSlot, PopupAds } from "@modules/marketing"
import { fetchHomeContent } from "@lib/strapi/home"
import {
  getHeroWithFallbacks,
  getAboutWithFallbacks,
  getCoffeeWithFallbacks,
  getServicesWithFallbacks,
} from "@lib/strapi/home-with-fallbacks"
import { getShopByBrandsWithFallbacks } from "@lib/strapi/shop-by-brands"
import { getSpaceAndExperienceWithFallbacks } from "@lib/strapi/space-and-experience"
import { getSatisfiedCustomersWithFallbacks } from "@lib/strapi/satisfied-customers"
import { getClientTestimonialsWithFallbacks } from "@lib/strapi/client-testimonials"
import { getClientStoriesWithFallbacks } from "@lib/strapi/client-stories"
import { getOurTeamWithFallbacks } from "@lib/strapi/our-team"
import { getCTABannerWithFallbacks } from "@lib/strapi/cta-banner"

// Use ISR with revalidation for better performance
// This allows Strapi content changes to appear within 60 seconds
export const revalidate = 60

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your one-stop shop for motorcycle gear, parts, and great coffee in the Philippines.",
}

// Loading skeleton for product sections
function ProductSectionSkeleton() {
  return (
    <div className="py-12 md:py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl aspect-square" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion()

  if (!region) {
    return null
  }

  // Fetch multiple data sources in parallel using Promise.all
  const [featuredProductsResp, collections, newArrivalsResp] = await Promise.all([
    getProducts({ first: 8, query: 'tag:featured' }),
    getCollections(8),
    getProducts({ first: 4, sortKey: 'CREATED_AT', reverse: true })
  ])

  // Get products
  const featuredProducts = featuredProductsResp.products
  const newArrivals = newArrivalsResp.products

  // Map helper
  const mapShopifyToMedusa = (p: any) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.featuredImage?.url,
    images: p.featuredImage ? [{ url: p.featuredImage.url }] : [],
    collection: { title: p.vendor },
    variants: [
      {
        id: p.id, 
        allow_backorder: false,
        manage_inventory: true,
        inventory_quantity: p.availableForSale ? 10 : 0,
        calculated_price: {
          calculated_amount: p.priceRange?.minVariantPrice ? parseFloat(p.priceRange.minVariantPrice.amount) : null,
          original_amount: p.compareAtPriceRange?.minVariantPrice ? parseFloat(p.compareAtPriceRange.minVariantPrice.amount) : null,
          currency_code: p.priceRange?.minVariantPrice?.currencyCode || "php"
        }
      }
    ]
  } as any);

  // Fetch marketing content for homepage
  const marketing = await getMarketingForPath("/")

  // Fetch home content from Strapi CMS with field-level fallbacks
  const homeContent = await fetchHomeContent()
  const heroContent = await getHeroWithFallbacks()
  const aboutContent = await getAboutWithFallbacks(homeContent)
  const coffeeContent = await getCoffeeWithFallbacks(homeContent)
  const servicesContent = await getServicesWithFallbacks(homeContent)
  const shopByBrandsContent = getShopByBrandsWithFallbacks(homeContent)
  const spaceAndExperienceContent =
    getSpaceAndExperienceWithFallbacks(homeContent)
  const satisfiedCustomersContent =
    getSatisfiedCustomersWithFallbacks(homeContent)
  const clientTestimonialsContent =
    getClientTestimonialsWithFallbacks(homeContent)
  const clientStoriesContent = getClientStoriesWithFallbacks(homeContent)
  const ourTeamContent = getOurTeamWithFallbacks(homeContent)
  const ctaBannerContent = getCTABannerWithFallbacks(homeContent)

  // Debug logging
  console.log("[HomePage] Hero content with fallbacks:", heroContent)
  console.log("[HomePage] About content with fallbacks:", aboutContent)
  console.log("[HomePage] Coffee content with fallbacks:", coffeeContent)
  console.log("[HomePage] Services content with fallbacks:", servicesContent)
  console.log(
    "[HomePage] Shop by brands content with fallbacks:",
    shopByBrandsContent
  )
  console.log(
    "[HomePage] Space and experience content with fallbacks:",
    spaceAndExperienceContent
  )

  return (
    <>
      {/* Hero Section */}
      <Hero
        trustBadge={heroContent.trustBadge}
        title={heroContent.title}
        description={heroContent.description}
        primaryCta={heroContent.primaryCta}
        secondaryCta={heroContent.secondaryCta}
        backgroundImage={heroContent.backgroundImage}
      />

      {/* Shop By Brands Section */}
      <ShopByBrands
        sectionTitle={shopByBrandsContent.sectionTitle}
        brands={shopByBrandsContent.brands}
        showNavDesktop={shopByBrandsContent.showNavDesktop}
      />

      {/* Top Banner Slot */}
      <BannerSlot
        banners={marketing.banners}
        placement="home_hero_below"
        className="px-4 md:px-8 lg:px-16 py-4 max-w-7xl mx-auto"
      />

      {/* About Section */}
      <AboutSection
        kicker={aboutContent.kicker}
        title={aboutContent.title}
        description={aboutContent.description}
        highlights={aboutContent.highlights}
        primaryCta={aboutContent.primaryCta}
        imageTop={aboutContent.imageTop}
        imageBottom={aboutContent.imageBottom}
        videoUrl={aboutContent.videoUrl}
      />

      {/* Shop By Categories */}
      <ShopByCategories />

      {/* Hot Deals / Featured */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        {featuredProducts.length > 0 && (
          <ProductSection
            title="Featured"
            products={featuredProducts.map(mapShopifyToMedusa)}
            region={region}
            viewAllLink={`/${countryCode}/store?tag=featured`}
            maxItems={8}
          />
        )}
      </Suspense>

      {/* Mid-page Banner Slot */}
      <BannerSlot
        banners={marketing.banners}
        placement="home_mid"
        className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto"
      />

      {/* Best Sellers */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        {featuredProducts.length > 0 && (
          <ProductSection
            title="Best Sellers"
            products={featuredProducts.map(mapShopifyToMedusa)}
            region={region}
            viewAllLink={`/${countryCode}/store?tag=best-seller`}
            maxItems={4}
          />
        )}
      </Suspense>

      {/* New Arrivals */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        {newArrivals.length > 0 && (
          <ProductSection
            title="New Arrivals"
            products={newArrivals.map(mapShopifyToMedusa)}
            region={region}
            viewAllLink={`/${countryCode}/store?tag=new-arrival`}
            maxItems={4}
          />
        )}
      </Suspense>

      {/* Coffee Showcase */}

      <CoffeeShowcase
        mainHeadingLine1={coffeeContent.mainHeadingLine1}
        highlightedWord={coffeeContent.highlightedWord}
        mainHeadingLine2={coffeeContent.mainHeadingLine2}
        descriptionText={coffeeContent.descriptionText}
        buttonText={coffeeContent.buttonText}
        buttonLink={coffeeContent.buttonLink}
        coffeeItems={coffeeContent.coffeeItems}
      />

      {/* Our Services */}
      <OurServices
        sectionTitle={servicesContent.sectionTitle}
        sectionDescription={servicesContent.sectionDescription}
        services={servicesContent.services}
      />

      {/* Project Section */}
      <ProjectsSection
        sectionTitle={spaceAndExperienceContent.sectionTitle}
        sectionDescription={spaceAndExperienceContent.sectionDescription}
        items={spaceAndExperienceContent.items as any}
      />

      {/* <Stats/> */}

      <Brands />

      {/* satisfied customers */}
      <SatisfiedCustomers
        sectionTitle={satisfiedCustomersContent.sectionTitle}
        row1={satisfiedCustomersContent.row1}
        row2={satisfiedCustomersContent.row2}
      />

      {/* Franchise Section */}
      <Franchise />

      {/* Our Team Section */}
      <OurTeam
        sectionTitle={ourTeamContent.sectionTitle}
        sectionDescription={ourTeamContent.sectionDescription}
        teamMembers={ourTeamContent.teamMembers}
      />

      {/* Client Testimonials */}
      <ClientTestimonials
        sectionTitle={clientTestimonialsContent.sectionTitle}
        sectionDescription={clientTestimonialsContent.sectionDescription}
        testimonials={clientTestimonialsContent.testimonials}
      />

      {/* Client Stories */}
      <ClientStories
        sectionTitle={clientStoriesContent.sectionTitle}
        sectionDescription={clientStoriesContent.sectionDescription}
        stories={clientStoriesContent.stories}
      />

      {/* CTA Banner - Opening Hours */}
      {ctaBannerContent.isEnabled && (
        <CTABanner
          title={ctaBannerContent.title}
          description={ctaBannerContent.description}
          backgroundImage={ctaBannerContent.backgroundImage}
          openingHours={ctaBannerContent.openingHours}
          socialLinks={ctaBannerContent.socialLinks}
        />
      )}

      {/* Store Location */}
      <StoreLocation />

      {/* Popup Ads - Shows after page load */}
      <PopupAds popups={marketing.popups} />
    </>
  )
}
