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
import FeaturedCollectionBanner from "@modules/home/components/featured-collection-banner"
import PromoBanner from "@modules/home/components/promo-banner"
import PopupAd from "@modules/home/components/popup-ad"
import HomepageCollectionRail from "@modules/home/components/product-sections/homepage-collection-rail"
import type {
  HomepageCollectionSection,
  SanityFeaturedCollectionItem,
  SanityPromoBanner,
} from "@lib/cms/types"
import { ProductSection } from "@modules/home/components/product-sections"
import { getRegion } from "@lib/data/regions"
import { getCollection, getProducts, getCollections } from "@lib/shopify"
import type { ShopifyProductCard } from "@lib/shopify/types"
import { HttpTypes } from "@medusajs/types"

import { getMarketingForPath } from "@lib/data/marketing"
import { BannerSlot, PopupAds } from "@modules/marketing"
import { fetchHomeContent } from "@lib/strapi/home"
import {
  getAboutWithFallbacks,
} from "@lib/strapi/home-with-fallbacks"
import { getShopByBrandsWithFallbacks } from "@lib/strapi/shop-by-brands"
import { getClientStoriesWithFallbacks } from "@lib/strapi/client-stories"
import {
  getHomepageAbout,
  getHomepageCategories,
  getHomepageHero,
  getHomepageServices,
  getHomepageShopByBrands,
  getCoffeeShowcase,
  getSpaceExperiences,
  getServiceBrandsSection,
  getSatisfiedCustomers,
  getFranchiseSection,
  getOurTeamSection,
  getClientTestimonials,
  getStoreLocation,
  getCtaBanner,
  getHomepageCollectionSections,
  getMarketingData,
} from "@lib/cms/client"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Motorcycle Gear, Parts, Services & Coffee",
  description:
    "Explore motorcycle gear, parts, workshop services, and the rider cafe experience at SixthgearMoto in the Philippines.",
}

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

  const [
    homepageHero,
    homepageShopByBrands,
    homepageAbout,
    homepageCategories,
    homepageServices,
    coffeeShowcase,
    spaceExperiences,
    serviceBrandsSection,
    satisfiedCustomers,
    franchiseSection,
    ourTeamSection,
    clientTestimonialsData,
    storeLocation,
    ctaBanner,
    marketingData,
    collectionSections,
    featuredProductsResp,
    collections,
    newArrivalsResp,
  ] = await Promise.all([
    getHomepageHero(),
    getHomepageShopByBrands(),
    getHomepageAbout(),
    getHomepageCategories(),
    getHomepageServices(),
    getCoffeeShowcase(),
    getSpaceExperiences(),
    getServiceBrandsSection(),
    getSatisfiedCustomers(),
    getFranchiseSection(),
    getOurTeamSection(),
    getClientTestimonials(),
    getStoreLocation(),
    getCtaBanner(),
    getMarketingData(),
    getHomepageCollectionSections(),
    getProducts({ first: 8, query: 'tag:featured' }),
    getCollections(8),
    getProducts({ first: 4, sortKey: 'CREATED_AT', reverse: true }),
  ])

  const featuredProducts = featuredProductsResp.products
  const newArrivals = newArrivalsResp.products

  const mapShopifyToMedusa = (
    p: ShopifyProductCard
  ): HttpTypes.StoreProduct => {
    const images =
      p.images?.edges?.map((edge) => ({ url: edge.node.url })) || []

    if (images.length === 0 && p.featuredImage) {
      images.push({ url: p.featuredImage.url })
    }

    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      thumbnail: p.featuredImage?.url || images[0]?.url,
      images,
      collection: { title: p.vendor },
      variants: [
        {
          id: p.id,
          allow_backorder: false,
          manage_inventory: true,
          inventory_quantity: p.availableForSale ? 10 : 0,
          calculated_price: {
            calculated_amount: p.priceRange?.minVariantPrice
              ? parseFloat(p.priceRange.minVariantPrice.amount)
              : null,
            original_amount: p.compareAtPriceRange?.minVariantPrice
              ? parseFloat(p.compareAtPriceRange.minVariantPrice.amount)
              : null,
            currency_code: p.priceRange?.minVariantPrice?.currencyCode || "php",
          },
        },
      ],
    } as any
  }

  type HomepageCollectionRailData = {
    section: HomepageCollectionSection
    title: string
    buttonLabel?: string
    products: HttpTypes.StoreProduct[]
  }

  const collectionRailResults: Array<HomepageCollectionRailData | null> =
    await Promise.all(
      collectionSections.map(async (section) => {
        const collection = await getCollection(section.collectionHandle, {
          first: 11,
        })

        const products =
          collection?.products?.edges?.map((edge) => mapShopifyToMedusa(edge.node)) ?? []

        if (!collection || products.length === 0) {
          return null
        }

        return {
          section,
          title: section.sectionTitle || collection.title || section.collectionHandle,
          buttonLabel: section.buttonLabel,
          products,
        }
      })
    )

  const collectionRailData = collectionRailResults.filter(
    (item): item is HomepageCollectionRailData => item !== null
  )

  const marketing = await getMarketingForPath("/")

  const homeContent = await fetchHomeContent()
  const aboutContent = await getAboutWithFallbacks(homeContent)
  const shopByBrandsContent = getShopByBrandsWithFallbacks(homeContent)
  const clientStoriesContent = getClientStoriesWithFallbacks(homeContent)


  const getFeatured = (position: string): SanityFeaturedCollectionItem | null =>
    marketingData.featuredCollections.find(
      (f) => f.isActive && f.position === position
    ) ?? null

  const getPromo = (position: string): SanityPromoBanner | null =>
    marketingData.promoBanners.find(
      (b) => b.isActive && b.position === position
    ) ?? null

  return (
    <>
      {marketingData.activePopup && (
        <PopupAd data={marketingData.activePopup} />
      )}

      <Hero data={homepageHero} />
      <FeaturedCollectionBanner data={getFeatured("after_hero")} />
      <PromoBanner data={getPromo("after_hero")} />

      <ShopByBrands
        data={homepageShopByBrands}
        sectionTitle={shopByBrandsContent.sectionTitle}
        brands={shopByBrandsContent.brands}
        showNavDesktop={shopByBrandsContent.showNavDesktop}
      />

      <BannerSlot
        banners={marketing.banners}
        placement="home_hero_below"
        className="px-4 md:px-8 lg:px-16 py-4 max-w-7xl mx-auto"
      />

      <AboutSection
        data={homepageAbout}
        kicker={aboutContent.kicker}
        title={aboutContent.title}
        description={aboutContent.description}
        highlights={aboutContent.highlights}
        primaryCta={aboutContent.primaryCta}
        imageTop={aboutContent.imageTop}
        imageBottom={aboutContent.imageBottom}
        videoUrl={aboutContent.videoUrl}
      />
      <FeaturedCollectionBanner data={getFeatured("after_about")} />
      <PromoBanner data={getPromo("after_about")} />

      <ShopByCategories data={homepageCategories} />
      <FeaturedCollectionBanner data={getFeatured("after_categories")} />
      <PromoBanner data={getPromo("after_categories")} />

      {collectionRailData.map((item) => (
        <HomepageCollectionRail
          key={item.section.collectionHandle}
          title={item.title}
          collectionHandle={item.section.collectionHandle}
          buttonLabel={item.buttonLabel}
          products={item.products}
        />
      ))}

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

      <BannerSlot
        banners={marketing.banners}
        placement="home_mid"
        className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto"
      />

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

      <CoffeeShowcase
        sectionHeading={
          coffeeShowcase?.sectionHeading ?? undefined
        }
        coffeeIconUrl={
          coffeeShowcase?.coffeeIconUrl ?? undefined
        }
        descriptionText={
          coffeeShowcase?.descriptionText ?? undefined
        }
        buttonText={
          coffeeShowcase?.buttonText ?? undefined
        }
        buttonLink={
          coffeeShowcase?.buttonLink ?? undefined
        }
        coffeeItems={
          coffeeShowcase?.coffeeItems?.map((item, index) => ({
            image: item.imageUrl,
            imageAlt: item.imageAlt ?? null,
          })) ?? undefined
        }
      />
      <FeaturedCollectionBanner data={getFeatured("after_coffee")} />
      <PromoBanner data={getPromo("after_coffee")} />

      <OurServices data={homepageServices} />
      <FeaturedCollectionBanner data={getFeatured("after_services")} />
      <PromoBanner data={getPromo("after_services")} />

      <ProjectsSection
        sectionTitle={
          spaceExperiences?.sectionTitle ?? undefined
        }
        sectionDescription={
          spaceExperiences?.sectionDescription ?? undefined
        }
        items={
          spaceExperiences?.items
            ?.filter((item) => item.isEnabled)
            ?.map((item, index) => ({
              id: index + 1,
              title: item.title,
              description: item.description,
              imageUrl:
                item.imageUrl ??
                "/images/homepage/projects/coffee.jpg",
              isEnabled: item.isEnabled,
            })) ?? undefined
        }
      />
      <FeaturedCollectionBanner data={getFeatured("after_projects")} />
      <PromoBanner data={getPromo("after_projects")} />

      <Brands
        sectionTitle={
          serviceBrandsSection?.sectionTitle 
          ?? undefined}
        sectionDescription={
          serviceBrandsSection?.sectionDescription 
          ?? undefined}
        brands={
          serviceBrandsSection?.brands
            ?.map(brand => ({
              name: brand.name,
              logo: brand.logoUrl ?? 
                "/images/brands/brand1.png",
              link: brand.link ?? null,
            })) ?? undefined}
      />
      <FeaturedCollectionBanner data={getFeatured("after_brands")} />
      <PromoBanner data={getPromo("after_brands")} />

      <SatisfiedCustomers
        sectionTitle={
          satisfiedCustomers?.sectionTitle 
          ?? undefined}
        row1={(() => {
          const all = satisfiedCustomers
            ?.customers
          if (!all || all.length === 0) 
            return undefined
          const mid = Math.ceil(all.length / 2)
          return all.slice(0, mid).map(
            (c, i) => ({
              id: i + 1,
              name: c.name ?? 
                "Sixth Gear Rider",
              imageUrl: c.photoUrl ?? 
                "/images/polaroid-marquee/satisfied-customers/002.jpg",
            })
          )
        })()}
        row2={(() => {
          const all = satisfiedCustomers
            ?.customers
          if (!all || all.length === 0) 
            return undefined
          const mid = Math.ceil(all.length / 2)
          return all.slice(mid).map(
            (c, i) => ({
              id: mid + i + 1,
              name: c.name ?? 
                "Sixth Gear Rider",
              imageUrl: c.photoUrl ?? 
                "/images/polaroid-marquee/satisfied-customers/011fg.jpg",
            })
          )
        })()}
      />
      <FeaturedCollectionBanner data={getFeatured("after_satisfied")} />
      <PromoBanner data={getPromo("after_satisfied")} />

      <Franchise
        mainTitle={
          franchiseSection?.mainTitle 
          ?? undefined}
        subtitle={
          franchiseSection?.subtitle 
          ?? undefined}
        badge1Text={
          franchiseSection?.badge1Text 
          ?? undefined}
        badge2Text={
          franchiseSection?.badge2Text 
          ?? undefined}
        ctaLabel={
          franchiseSection?.ctaLabel 
          ?? undefined}
        ctaLink={
          franchiseSection?.ctaLink 
          ?? undefined}
        leftImageUrl={
          franchiseSection?.leftImageUrl 
          ?? undefined}
        rightImageUrl={
          franchiseSection?.rightImageUrl 
          ?? undefined}
      />
      <FeaturedCollectionBanner data={getFeatured("after_franchise")} />
      <PromoBanner data={getPromo("after_franchise")} />

      <OurTeam
        sectionTitle={
          ourTeamSection?.sectionTitle 
          ?? undefined}
        sectionDescription={
          ourTeamSection?.sectionDescription 
          ?? undefined}
        teamMembers={
          ourTeamSection?.teamMembers
            ?.map((member, index) => ({
              id: index + 1,
              name: member.name,
              role: member.role,
              title: member.title ?? "",
              description: 
                member.description ?? "",
              image: member.photoUrl ?? 
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
              socialLinks: {
                facebook: 
                  member.socialLinks
                    ?.facebook ?? undefined,
                instagram: 
                  member.socialLinks
                    ?.instagram ?? undefined,
                tiktok: 
                  member.socialLinks
                    ?.tiktok ?? undefined,
              },
            })) ?? undefined}
      />
      <FeaturedCollectionBanner data={getFeatured("after_team")} />
      <PromoBanner data={getPromo("after_team")} />

      <ClientTestimonials
        sectionTitle={
          clientTestimonialsData
            ?.sectionTitle 
          ?? undefined}
        sectionDescription={
          clientTestimonialsData
            ?.sectionDescription 
          ?? undefined}
        testimonials={
          clientTestimonialsData
            ?.testimonials
            ?.map((t, index) => ({
              id: index + 1,
              name: t.name,
              role: t.role ?? 
                "Verified Rider",
              quote: t.quote,
              avatar: "",
            })) ?? undefined}
      />
      <FeaturedCollectionBanner data={getFeatured("after_testimonials")} />
      <PromoBanner data={getPromo("after_testimonials")} />

      <ClientStories
        sectionTitle={clientStoriesContent.sectionTitle}
        sectionDescription={clientStoriesContent.sectionDescription}
        stories={clientStoriesContent.stories}
      />

      <CTABanner
        preTitle={
          ctaBanner?.preTitle
          ?? undefined}
        headline={
          ctaBanner?.headline
          ?? undefined}
        headlineHighlight={
          ctaBanner?.headlineHighlight
          ?? undefined}
        buttonLabel={
          ctaBanner?.buttonLabel
          ?? undefined}
        buttonLink={
          ctaBanner?.buttonLink
          ?? undefined}
        footerTagline={
          ctaBanner?.footerTagline
          ?? undefined}
        socialLinks={
          ctaBanner?.socialLinks
            ? {
                instagram:
                  ctaBanner.socialLinks
                    .instagram ?? undefined,
                facebook:
                  ctaBanner.socialLinks
                    .facebook ?? undefined,
                tiktok:
                  ctaBanner.socialLinks
                    .tiktok ?? undefined,
              }
            : undefined}
      />

      <StoreLocation
        storeName={
          storeLocation?.storeName 
          ?? undefined}
        address={
          storeLocation?.address 
          ?? undefined}
        phone={
          storeLocation?.phone 
          ?? undefined}
        hours={
          storeLocation?.hours 
          ?? undefined}
        googleMapsUrl={
          storeLocation?.googleMapsUrl 
          ?? undefined}
      />

      <PopupAds popups={marketing.popups} />
    </>
  )
}
