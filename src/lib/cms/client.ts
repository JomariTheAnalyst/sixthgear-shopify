import type { QueryParams, SanityClient } from 'next-sanity'
import { draftMode } from 'next/headers'

import { sanityClient } from '../../../sanity/lib/client'
import { sanityFetch } from '../../../sanity/lib/live'
import { homepageQuery, collectionHeroQuery, coffeeShowcaseQuery, serviceBrandsSectionQuery, satisfiedCustomersQuery, franchiseSectionQuery, ourTeamSectionQuery, clientTestimonialsQuery, storeLocationQuery, ctaBannerQuery, marketingQuery, servicesPageQuery, allServicesQuery, serviceBySlugQuery, aboutPageQuery, homepageCollectionSectionsQuery } from './queries'
import type {
  SanityAboutSection,
  SanityAboutPage,
  SanityWhatWeOffer,
  SanityCategoriesSection,
  SanityCoffeeShowcase,
  SanityCoffeeShowcaseQueryResult,
  SanityCollectionHero,
  SanityHeroSection,
  SanityVideoFeatureSection,
  SanityMarqueeSectionQueryResult,
  SanityServicesSection,
  SanityShopByBrandsSection,
  SanityServiceBrandsSectionQueryResult,
  SanitySatisfiedCustomers,
  SanityFranchiseSection,
  SanityOurTeamSectionQueryResult,
  SanityClientTestimonials,
  SanityStoreLocation,
  SanityCtaBanner,
  SanityMarketingData,
  SanityService,
  SanityServicesPage,
  HomepageCollectionSection,
  SanityBlogCategory,
  SanityBlogPost,
  SanityBlogPostListItem,
} from './types'
import { isCompleteSanityCoffeeShowcase } from './coffee-showcase'
import { isCompleteSanityMarquee } from './marquee'
import { isCompleteSanityServiceBrands } from './service-brands'
import { isCompleteSanityWhatWeOffer } from './what-we-offer'
import { isCompleteSanityOurTeam } from './our-team'
import { isCompleteHomepageServices } from './homepage-services'
import {
  getFeaturedCollectionCampaignIssue,
  warnFeaturedCollectionInDevelopment,
} from './featured-collection'
import {
  isCompleteClientTestimonials,
  isCompleteCtaBanner,
  isCompleteFranchise,
  isCompleteHomepageAbout,
  isCompleteSatisfiedCustomers,
  isCompleteStoreLocation,
} from './homepage-editorial'
import { cleanSanityString } from './visual-editing'
import {
  latestBlogPostsQuery,
  blogPostBySlugQuery,
  homepageBlogPostsQuery,
  blogCategoriesQuery,
} from "./queries"

export const client = new Proxy(sanityClient, {
  get(target, property, receiver) {
    if (property === 'fetch') return fetchSanity

    const value = Reflect.get(target, property, receiver)
    return typeof value === 'function' ? value.bind(target) : value
  },
}) as SanityClient

type LegacyFetchOptions = {
  next?: {
    tags?: string[]
    revalidate?: number | false
  }
}

async function fetchSanity<T>(
  query: string,
  params: QueryParams = {},
  options?: LegacyFetchOptions
): Promise<T> {
  let isDraftModeEnabled = false
  try {
    isDraftModeEnabled = (await draftMode()).isEnabled
  } catch {
    // Calls outside a request use the published client contract.
  }

  if (!isDraftModeEnabled) {
    return sanityClient.fetch<T>(query, params, {
      ...options,
      perspective: 'published',
      stega: false,
      useCdn: true,
    })
  }

  const { data } = await sanityFetch({ query, params, tags: options?.next?.tags })

  return data as T
}

export async function getHomepageHero(): Promise<SanityHeroSection | null> {
  try {

    const result = await client.fetch<{ hero: SanityHeroSection | null } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    if (!result?.hero) {
    }

    return result?.hero ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getHomepageVideoFeature(): Promise<SanityVideoFeatureSection | null> {
  try {
    const result = await client.fetch<{
      videoFeature: SanityVideoFeatureSection | null
    } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    return result?.videoFeature ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Featured Video fetch failed. Rendering the built-in trailer fallback.',
        error
      )
    }
    return null
  }
}

export async function getHomepageShopByBrands(): Promise<SanityShopByBrandsSection | null> {
  try {

    const result = await client.fetch<{ shopByBrands: SanityShopByBrandsSection | null } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    if (!result?.shopByBrands) {
    }

    return result?.shopByBrands ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getHomepageAbout(): Promise<SanityAboutSection | null> {
  try {

    const result = await client.fetch<{ about: SanityAboutSection | null } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    if (
      result?.about?.useCustomAbout === true &&
      !isCompleteHomepageAbout(result.about) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Homepage About is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return result?.about ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Homepage About fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }
    return null
  }
}

export async function getHomepageCategories(): Promise<SanityCategoriesSection | null> {
  try {

    const result = await client.fetch<{ categories: SanityCategoriesSection | null } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    if (!result?.categories) {
    }

    return result?.categories ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getHomepageServices(): Promise<SanityServicesSection | null> {
  try {

    const result = await client.fetch<{ services: SanityServicesSection | null } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    if (
      result?.services?.useCustomServices === true &&
      !isCompleteHomepageServices(result.services) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Homepage Services is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return result?.services ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Homepage Services fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }
    return null
  }
}

type HomepageCollectionSectionQueryResult = {
  collectionHandle?: string | null
  sectionTitle?: string | null
  buttonLabel?: string | null
  productLimit?: number | null
  enabled?: boolean | null
  displayOrder?: number | null
}

const DEFAULT_PRODUCT_LIMIT = 12

// Rows saved before productLimit existed (or left blank) fall back to 12.
function resolveProductLimit(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_PRODUCT_LIMIT
  }

  return Math.min(24, Math.max(4, Math.round(value)))
}

function isHomepageCollectionSectionResult(
  item: HomepageCollectionSectionQueryResult | null | undefined
): item is {
  collectionHandle: string
  sectionTitle?: string | null
  buttonLabel?: string | null
  productLimit?: number | null
  enabled: true
  displayOrder: number
} {
  return (
    typeof item?.collectionHandle === 'string' &&
    cleanSanityString(item.collectionHandle).trim().length > 0 &&
    item.enabled === true &&
    typeof item.displayOrder === 'number'
  )
}

export async function getHomepageCollectionSections(): Promise<HomepageCollectionSection[]> {
  try {
    const result = await client.fetch<HomepageCollectionSectionQueryResult[] | null>(
      homepageCollectionSectionsQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    return (Array.isArray(result) ? result : [])
      .filter(isHomepageCollectionSectionResult)
      .map((item) => ({
        collectionHandle: cleanSanityString(item.collectionHandle).trim(),
        sectionTitle: item.sectionTitle || undefined,
        buttonLabel: item.buttonLabel || undefined,
        productLimit: resolveProductLimit(item.productLimit),
        enabled: true,
        displayOrder: item.displayOrder,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getCollectionHero(
  handle: string
): Promise<SanityCollectionHero | null> {
  try {
    const result = await client.fetch<SanityCollectionHero | null>(
      collectionHeroQuery,
      { handle },
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    return result ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getCoffeeShowcase(): Promise<SanityCoffeeShowcase | null> {
  try {
    const result = await client.fetch<{
      coffeeShowcase: SanityCoffeeShowcaseQueryResult | null
    } | null>(
      coffeeShowcaseQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    const coffeeShowcase = result?.coffeeShowcase

    if (!coffeeShowcase) {
      return null
    }

    if (coffeeShowcase.useSanityContent !== true) {
      return { useSanityContent: false }
    }

    if (!isCompleteSanityCoffeeShowcase(coffeeShowcase)) {
      if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
        console.warn(
          '[Sanity] Coffee Showcase is enabled but incomplete. Rendering the complete hardcoded fallback.'
        )
      }

      return null
    }

    return coffeeShowcase
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Coffee Showcase fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }

    return null
  }
}

export async function getHomepageWhatWeOffer(): Promise<SanityWhatWeOffer | null> {
  try {
    const result = await client.fetch<{
      whatWeOffer: SanityWhatWeOffer | null
    } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    const whatWeOffer = result?.whatWeOffer ?? null

    if (
      whatWeOffer?.useSanityContent === true &&
      !isCompleteSanityWhatWeOffer(whatWeOffer) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Homepage What We Offer is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return whatWeOffer
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Homepage What We Offer fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }

    return null
  }
}

export async function getHomepageMarquee(): Promise<SanityMarqueeSectionQueryResult | null> {
  try {
    const result = await client.fetch<{
      marquee: SanityMarqueeSectionQueryResult | null
    } | null>(
      homepageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    const marquee = result?.marquee ?? null

    if (
      marquee?.useSanityContent === true &&
      !isCompleteSanityMarquee(marquee) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Homepage Marquee is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return marquee
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Homepage Marquee fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }

    return null
  }
}

export async function getServiceBrandsSection(): Promise<SanityServiceBrandsSectionQueryResult | null> {
  try {
    const result = await client.fetch<{
      serviceBrandsSection: SanityServiceBrandsSectionQueryResult | null
    } | null>(
      serviceBrandsSectionQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    const serviceBrandsSection = result?.serviceBrandsSection ?? null

    if (
      serviceBrandsSection?.useSanityContent === true &&
      !isCompleteSanityServiceBrands(serviceBrandsSection) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Brands We Support is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return serviceBrandsSection
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Brands We Support fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }

    return null
  }
}

export async function getSatisfiedCustomers(): Promise<SanitySatisfiedCustomers | null> {
  try {

    const result = await client.fetch<{ satisfiedCustomers: SanitySatisfiedCustomers | null } | null>(
      satisfiedCustomersQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (
      result?.satisfiedCustomers?.useSanityContent === true &&
      !isCompleteSatisfiedCustomers(result.satisfiedCustomers) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Satisfied Customers is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return result?.satisfiedCustomers ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Satisfied Customers fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }
    return null
  }
}

export async function getFranchiseSection(): Promise<SanityFranchiseSection | null> {
  try {

    const result = await client.fetch<{ franchiseSection: SanityFranchiseSection | null } | null>(
      franchiseSectionQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (
      result?.franchiseSection?.useSanityContent === true &&
      !isCompleteFranchise(result.franchiseSection) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Franchise is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return result?.franchiseSection ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Franchise fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }
    return null
  }
}

export async function getOurTeamSection(): Promise<SanityOurTeamSectionQueryResult | null> {
  try {
    const result = await client.fetch<{
      ourTeamSection: SanityOurTeamSectionQueryResult | null
    } | null>(
      ourTeamSectionQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    const ourTeamSection = result?.ourTeamSection ?? null

    if (
      ourTeamSection?.useSanityContent === true &&
      !isCompleteSanityOurTeam(ourTeamSection) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Our Team is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return ourTeamSection
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Our Team fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }

    return null
  }
}

export async function getClientTestimonials(): Promise<SanityClientTestimonials | null> {
  try {

    const result = await client.fetch<{ clientTestimonials: SanityClientTestimonials | null } | null>(
      clientTestimonialsQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (
      result?.clientTestimonials?.useSanityContent === true &&
      !isCompleteClientTestimonials(result.clientTestimonials) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Client Testimonials is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return result?.clientTestimonials ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Client Testimonials fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }
    return null
  }
}

export async function getStoreLocation(): Promise<SanityStoreLocation | null> {
  try {

    const result = await client.fetch<{ storeLocation: SanityStoreLocation | null } | null>(
      storeLocationQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (
      result?.storeLocation?.useSanityContent === true &&
      !isCompleteStoreLocation(result.storeLocation) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] Store Location is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return result?.storeLocation ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] Store Location fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }
    return null
  }
}

export async function getCtaBanner(): Promise<SanityCtaBanner | null> {
  try {

    const result = await client.fetch<{ ctaBanner: SanityCtaBanner | null } | null>(
      ctaBannerQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (
      result?.ctaBanner?.useSanityContent === true &&
      !isCompleteCtaBanner(result.ctaBanner) &&
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'undefined'
    ) {
      console.warn(
        '[Sanity] CTA Banner is enabled but incomplete. Rendering the complete hardcoded fallback.'
      )
    }

    return result?.ctaBanner ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] CTA Banner fetch failed. Rendering the complete hardcoded fallback.',
        error
      )
    }
    return null
  }
}

export async function getMarketingData(): Promise<SanityMarketingData> {
  try {
    const result = await client.fetch<SanityMarketingData | null>(
      marketingQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    const marketingData = {
      announcementBar: result?.announcementBar ?? null,
      activePopup: result?.activePopup ?? null,
      featuredCollections: result?.featuredCollections ?? [],
      promoBanners: result?.promoBanners ?? [],
    }

    for (const campaign of marketingData.featuredCollections) {
      const issue = getFeaturedCollectionCampaignIssue(campaign)
      if (issue) {
        warnFeaturedCollectionInDevelopment(
          `Campaign "${campaign.internalName || 'Untitled'}" is active but has ${issue}. It will not render.`
        )
      }
    }

    return marketingData
  } catch (error) {
    console.error(error)
    return {
      announcementBar: null,
      activePopup: null,
      featuredCollections: [],
      promoBanners: [],
    }
  }
}

export async function getServicesPage(): Promise<SanityServicesPage | null> {
  try {
    const result = await client.fetch<SanityServicesPage | null>(
      servicesPageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    return result ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getAboutPage(): Promise<SanityAboutPage | null> {
  try {
    const result = await client.fetch<SanityAboutPage | null>(
      aboutPageQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ['sanity'],
        },
      }
    )

    return result ?? null
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
      console.warn(
        '[Sanity] About Page fetch failed. Rendering the complete hardcoded About fallbacks.',
        error
      )
    }

    return null
  }
}

export async function getAllServicesCMS(): Promise<SanityService[]> {
  try {
    const result = await client.fetch<SanityService[] | null>(
      allServicesQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getServiceBySlug(slug: string): Promise<SanityService | null> {
  try {
    const result = await client.fetch<SanityService | null>(
      serviceBySlugQuery,
      { slug: cleanSanityString(slug) },
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    return result ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getLatestBlogPosts(): Promise<SanityBlogPostListItem[]> {
  try {
    const result = await client.fetch<SanityBlogPostListItem[] | null>(
      latestBlogPostsQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ["sanity"],
        },
      }
    )

    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getHomepageBlogPosts(): Promise<SanityBlogPostListItem[]> {
  try {
    const result = await client.fetch<SanityBlogPostListItem[] | null>(
      homepageBlogPostsQuery,
      {},
      {
        next: {
          revalidate: 60,
          tags: ["sanity"],
        },
      }
    )

    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  try {
    const result = await client.fetch<SanityBlogPost | null>(
      blogPostBySlugQuery,
      { slug },
      {
        next: {
          revalidate: 60,
          tags: ["sanity"],
        },
      }
    )

    return result ?? null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getBlogCategories(): Promise<SanityBlogCategory[]> {
  try {
    const result = await client.fetch<SanityBlogCategory[] | null>(
      blogCategoriesQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ["sanity"],
        },
      }
    )

    return Array.isArray(result) ? result : []
  } catch (error) {
    console.error(error)
    return []
  }
}
