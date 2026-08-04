import { Metadata } from "next"
import { Suspense } from "react"

import MarqueeStrip from "components/marquee-strip"
import VideoFeature from "@modules/home/components/video-feature"
import Hero from "@modules/home/components/hero"
import AboutSection from "@modules/home/components/about"
import ShopByCategories from "@modules/home/components/categories"
import SatisfiedCustomers from "@modules/home/components/satisfied-customers"
import CoffeeShowcase from "@modules/home/components/coffee-showcase"
import CTABanner from "@modules/home/components/cta-banner"
import Franchise from "@modules/home/components/franchise"
import Stats from "@modules/home/components/stats"
import Brands from "@modules/home/components/brands"
import ClientStories from "@modules/home/components/client-stories"
import StoreLocation from "@modules/home/components/store-location"
import WhatWeOffer from "@modules/home/components/what-we-offer"
import FeaturedBrand, {
  type BrandCardItem,
} from "@modules/home/components/featured-brand"
import FeaturedCollectionBanner from "@modules/home/components/featured-collection-banner"
import PromoBanner from "@modules/home/components/promo-banner"
import PopupAd from "@modules/home/components/popup-ad"
import HomepageCollectionRail from "@modules/home/components/product-sections/homepage-collection-rail"
import type {
  HomepageCollectionSection,
  SanityBlogPostListItem,
  SanityFeaturedCollectionItem,
  SanityPromoBanner,
} from "@lib/cms/types"
import { ProductSection } from "@modules/home/components/product-sections"
import { getRegion } from "@lib/data/regions"
import { getBrandCollections, getCollection, getProducts } from "@lib/shopify"
import type { ShopifyProductCard } from "@lib/shopify/types"
import { HttpTypes } from "@medusajs/types"
import {
  selectFeaturedCollectionForPosition,
  type FeaturedCollectionPosition,
} from "@lib/cms/featured-collection"

import {
  selectCtaBannerContent,
  selectFranchiseContent,
  selectHomepageAboutContent,
  selectSatisfiedCustomersContent,
  selectStoreLocationContent,
} from "@lib/cms/homepage-editorial"
import {
  getHomepageAbout,
  getHomepageBlogPosts,
  getHomepageCategories,
  getHomepageHero,
  getHomepageVideoFeature,
  getHomepageWhatWeOffer,
  getCoffeeShowcase,
  getServiceBrandsSection,
  getSatisfiedCustomers,
  getFranchiseSection,
  getStoreLocation,
  getCtaBanner,
  getHomepageCollectionSections,
  getMarketingData,
} from "@lib/cms/client"
import { selectVideoFeatureContent } from "@lib/cms/video-feature"
import {
  getAbsoluteSiteUrl,
  getDefaultOpenGraphImageUrl,
  getLocalizedCanonicalPath,
  getMetadataImageUrl,
  getNoindexFollowRobots,
  getSiteName,
  hasNonCanonicalSearchParams,
} from "@lib/seo"
import {
  DeferredClientTestimonialsSection,
  DeferredOurServicesSection,
  DeferredOurTeamSection,
} from "@modules/home/components/deferred-homepage-sections"
import {
  ServicesSectionSkeleton,
  TeamSectionSkeleton,
  TestimonialsSectionSkeleton,
} from "@modules/home/components/homepage-section-skeletons"
import { SanityEditTarget } from "components/sanity/visual-editing-provider"
import { cleanSanityString } from "@lib/cms/visual-editing"

export const revalidate = 60

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { countryCode } = await params
  const rawSearchParams = await searchParams
  const homepageHero = await getHomepageHero()
  const heroImageUrl =
    homepageHero?.slides?.find((slide) => slide.imageUrl)?.imageUrl ?? null
  const imageUrl = getMetadataImageUrl(heroImageUrl ? cleanSanityString(heroImageUrl) : null) || getDefaultOpenGraphImageUrl()
  const title =
    "SixthGearMoto | Motorcycle Parts, Riding Gear & Service Center Makati"
  const description =
    "Shop premium motorcycle parts, riding gear, Akrapovic exhausts, and big bike accessories at SixthGearMoto. Visit our motorcycle shop, service center, carwash, and coffee spot in Makati, Philippines."
  const canonicalUrl = getAbsoluteSiteUrl(countryCode)
  const shouldNoindex = hasNonCanonicalSearchParams(rawSearchParams, {
    allowPaginationParams: true,
  })

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: getLocalizedCanonicalPath(countryCode),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: getSiteName(),
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    ...(shouldNoindex ? { robots: getNoindexFollowRobots() } : {}),
  }
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

const BRAND_COLLECTION_PLACEHOLDER =
  "/images/placeholders/brand-collection.svg"

async function getShopifyBrandCards(): Promise<BrandCardItem[]> {
  try {
    const collections = await getBrandCollections()

    return collections.map((collection) => {
      const image = collection.image

      return {
        id: collection.id,
        name: collection.title,
        imageUrl: image?.url ?? BRAND_COLLECTION_PLACEHOLDER,
        imageAlt: image?.altText?.trim() || (image ? collection.title : ""),
        link: `/collections/${collection.handle}`,
        decorativeImage: image === null,
      }
    })
  } catch (error) {
    console.error(
      "[homepage] Unable to load Shopify brand collections.",
      error
    )
    return []
  }
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
    homepageVideoFeature,
    shopifyBrandCards,
    homepageAbout,
    homepageCategories,
    homepageWhatWeOffer,
    coffeeShowcase,
    serviceBrandsSection,
    satisfiedCustomers,
    franchiseSection,
    storeLocation,
    ctaBanner,
    marketingData,
    homepageBlogPosts,
    collectionSections,
    featuredProductsResp,
    newArrivalsResp,
  ] = await Promise.all([
    getHomepageHero(),
    getHomepageVideoFeature(),
    getShopifyBrandCards(),
    getHomepageAbout(),
    getHomepageCategories(),
    getHomepageWhatWeOffer(),
    getCoffeeShowcase(),
    getServiceBrandsSection(),
    getSatisfiedCustomers(),
    getFranchiseSection(),
    getStoreLocation(),
    getCtaBanner(),
    getMarketingData(),
    getHomepageBlogPosts(),
    getHomepageCollectionSections(),
    getProducts({ first: 8, query: 'tag:featured' }),
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
        const collection = await getCollection(cleanSanityString(section.collectionHandle), {
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

  const homepageAboutContent = selectHomepageAboutContent(homepageAbout)
  const videoFeatureContent = selectVideoFeatureContent(homepageVideoFeature)
  const satisfiedCustomersContent =
    selectSatisfiedCustomersContent(satisfiedCustomers)
  const franchiseContent = selectFranchiseContent(franchiseSection)
  const storeLocationContent = selectStoreLocationContent(storeLocation)
  const ctaBannerContent = selectCtaBannerContent(ctaBanner)
  const satisfiedCustomersMidpoint = Math.ceil(
    satisfiedCustomersContent.customers.length / 2
  )
  const satisfiedCustomersRow1 = satisfiedCustomersContent.customers
    .slice(0, satisfiedCustomersMidpoint)
    .map((customer) => ({
      id: customer.key,
      name: customer.name,
      imageUrl: customer.imageUrl,
    }))
  const satisfiedCustomersRow2 = satisfiedCustomersContent.customers
    .slice(satisfiedCustomersMidpoint)
    .map((customer) => ({
      id: customer.key,
      name: customer.name,
      imageUrl: customer.imageUrl,
    }))
  const clientStoriesContent: SanityBlogPostListItem[] = homepageBlogPosts

  const marketingNow = new Date()
  const getFeatured = (
    position: FeaturedCollectionPosition
  ): SanityFeaturedCollectionItem | null =>
    selectFeaturedCollectionForPosition(
      marketingData.featuredCollections,
      position,
      marketingNow
    )

  const getPromo = (position: string): SanityPromoBanner | null =>
    marketingData.promoBanners.find(
      (b) => b.isActive && cleanSanityString(b.position || "") === position
    ) ?? null

  return (
    <>
      {marketingData.activePopup && (
        <PopupAd data={marketingData.activePopup} />
      )}

      <SanityEditTarget documentId="homepage" documentType="homepage" path="hero">
        <Hero data={homepageHero} />
      </SanityEditTarget>

      <FeaturedBrand brands={shopifyBrandCards} />
      <MarqueeStrip />
      {videoFeatureContent.enabled && (
        <SanityEditTarget
          documentId="homepage"
          documentType="homepage"
          path={
            videoFeatureContent.source === "sanity"
              ? "videoFeature"
              : "videoFeature.useSanityContent"
          }
        >
          <VideoFeature data={videoFeatureContent} />
        </SanityEditTarget>
      )}

      <FeaturedCollectionBanner data={getFeatured("after_hero")} />
      <PromoBanner data={getPromo("after_hero")} />

      <SanityEditTarget documentId="homepage" documentType="homepage" path={homepageAboutContent.source === "sanity" ? "about" : "about.useCustomAbout"}>
      <AboutSection
        data={{
          useCustomAbout: true,
          kicker: homepageAboutContent.kicker,
          title: homepageAboutContent.title,
          description: homepageAboutContent.description,
          highlights: homepageAboutContent.highlights,
          primaryCta: homepageAboutContent.primaryCta,
          imageTop: homepageAboutContent.imageTop,
          imageBottom: homepageAboutContent.imageBottom,
          videoUrl: homepageAboutContent.videoUrl,
        }}
      />
      </SanityEditTarget>
      <FeaturedCollectionBanner data={getFeatured("after_about")} />
      <PromoBanner data={getPromo("after_about")} />

      <SanityEditTarget documentId="homepage" documentType="homepage" path="categories">
        <ShopByCategories data={homepageCategories} />
      </SanityEditTarget>
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
            viewAllLink="/store?tag=featured"
            maxItems={8}
          />
        )}
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        {featuredProducts.length > 0 && (
          <ProductSection
            title="Best Sellers"
            products={featuredProducts.map(mapShopifyToMedusa)}
            region={region}
            viewAllLink="/store?tag=best-seller"
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
            viewAllLink="/store?tag=new-arrival"
            maxItems={4}
          />
        )}
      </Suspense>

      <SanityEditTarget documentId="homepage" documentType="homepage" path={coffeeShowcase?.useSanityContent === true ? "coffeeShowcase" : "coffeeShowcase.useSanityContent"}>
        <CoffeeShowcase data={coffeeShowcase} />
      </SanityEditTarget>
      <FeaturedCollectionBanner data={getFeatured("after_coffee")} />
      <PromoBanner data={getPromo("after_coffee")} />

      <Suspense fallback={<ServicesSectionSkeleton />}>
        <DeferredOurServicesSection />
      </Suspense>
      <WhatWeOffer data={homepageWhatWeOffer} />
      <FeaturedCollectionBanner data={getFeatured("after_services")} />
      <PromoBanner data={getPromo("after_services")} />

      <Brands data={serviceBrandsSection} />
      <FeaturedCollectionBanner data={getFeatured("after_brands")} />
      <PromoBanner data={getPromo("after_brands")} />

      <SanityEditTarget documentId="homepage" documentType="homepage" path={satisfiedCustomersContent.source === "sanity" ? "satisfiedCustomers" : "satisfiedCustomers.useSanityContent"}>
        <SatisfiedCustomers
          sectionTitle={satisfiedCustomersContent.sectionTitle}
          row1={satisfiedCustomersRow1}
          row2={satisfiedCustomersRow2}
        />
      </SanityEditTarget>
      <FeaturedCollectionBanner data={getFeatured("after_satisfied")} />
      <PromoBanner data={getPromo("after_satisfied")} />

      <SanityEditTarget documentId="homepage" documentType="homepage" path={franchiseContent.source === "sanity" ? "franchiseSection" : "franchiseSection.useSanityContent"}>
        <Franchise
          mainTitle={franchiseContent.mainTitle}
          subtitle={franchiseContent.subtitle}
          badge1Text={franchiseContent.badge1Text}
          badge2Text={franchiseContent.badge2Text}
          ctaLabel={franchiseContent.ctaLabel}
          ctaLink={franchiseContent.ctaLink}
          leftImageUrl={franchiseContent.leftImageUrl}
          rightImageUrl={franchiseContent.rightImageUrl}
        />
      </SanityEditTarget>
      <FeaturedCollectionBanner data={getFeatured("after_franchise")} />
      <PromoBanner data={getPromo("after_franchise")} />

      <Suspense fallback={<TeamSectionSkeleton />}>
        <DeferredOurTeamSection />
      </Suspense>
      <FeaturedCollectionBanner data={getFeatured("after_team")} />
      <PromoBanner data={getPromo("after_team")} />

      <Suspense fallback={<TestimonialsSectionSkeleton />}>
        <DeferredClientTestimonialsSection />
      </Suspense>
      <FeaturedCollectionBanner data={getFeatured("after_testimonials")} />
      <PromoBanner data={getPromo("after_testimonials")} />

      <ClientStories
        stories={clientStoriesContent}
      />

      <SanityEditTarget documentId="homepage" documentType="homepage" path={storeLocationContent.source === "sanity" ? "storeLocation" : "storeLocation.useSanityContent"}>
        <StoreLocation
          storeName={storeLocationContent.storeName}
          address={storeLocationContent.address}
          phone={storeLocationContent.phone}
          hours={storeLocationContent.hours}
          googleMapsUrl={storeLocationContent.googleMapsUrl}
        />
      </SanityEditTarget>
      <SanityEditTarget documentId="homepage" documentType="homepage" path={ctaBannerContent.source === "sanity" ? "ctaBanner" : "ctaBanner.useSanityContent"}>
        <CTABanner
          preTitle={ctaBannerContent.preTitle}
          headline={ctaBannerContent.headline}
          headlineHighlight={ctaBannerContent.headlineHighlight}
          buttonLabel={ctaBannerContent.buttonLabel}
          buttonLink={ctaBannerContent.buttonLink}
          footerTagline={ctaBannerContent.footerTagline}
          socialLinks={ctaBannerContent.socialLinks}
        />
      </SanityEditTarget>
    </>

  )
}
