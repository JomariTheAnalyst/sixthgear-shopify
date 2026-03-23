import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../../../sanity/env'
import { homepageQuery, collectionHeroQuery, coffeeShowcaseQuery, spaceExperiencesQuery, serviceBrandsSectionQuery, satisfiedCustomersQuery, franchiseSectionQuery, ourTeamSectionQuery, clientTestimonialsQuery, storeLocationQuery, ctaBannerQuery, marketingQuery, servicesPageQuery, allServicesQuery, serviceBySlugQuery, aboutPageQuery, homepageCollectionSectionsQuery } from './queries'
import type {
  SanityAboutSection,
  SanityAboutPage,
  SanityCategoriesSection,
  SanityCoffeeShowcase,
  SanityCollectionHero,
  SanityHeroSection,
  SanityServicesSection,
  SanityShopByBrandsSection,
  SanitySpaceExperiences,
  SanityServiceBrandsSection,
  SanitySatisfiedCustomers,
  SanityFranchiseSection,
  SanityOurTeamSection,
  SanityClientTestimonials,
  SanityStoreLocation,
  SanityCtaBanner,
  SanityMarketingData,
  SanityService,
  SanityServicesPage,
  HomepageCollectionSection,
} from './types'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

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
    console.error('[Sanity] getHomepageHero failed:', error)
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
    console.error('[Sanity] getHomepageShopByBrands failed:', error)
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

    if (!result?.about) {
    }

    return result?.about ?? null
  } catch (error) {
    console.error('[Sanity] getHomepageAbout failed:', error)
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
    console.error('[Sanity] getHomepageCategories failed:', error)
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

    if (!result?.services) {
    }

    return result?.services ?? null
  } catch (error) {
    console.error('[Sanity] getHomepageServices failed:', error)
    return null
  }
}

type HomepageCollectionSectionQueryResult = {
  collectionHandle?: string | null
  sectionTitle?: string | null
  buttonLabel?: string | null
  enabled?: boolean | null
  displayOrder?: number | null
}

function isHomepageCollectionSectionResult(
  item: HomepageCollectionSectionQueryResult | null | undefined
): item is {
  collectionHandle: string
  sectionTitle?: string | null
  buttonLabel?: string | null
  enabled: true
  displayOrder: number
} {
  return (
    typeof item?.collectionHandle === 'string' &&
    item.collectionHandle.trim().length > 0 &&
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
        collectionHandle: item.collectionHandle.trim(),
        sectionTitle: item.sectionTitle?.trim() || undefined,
        buttonLabel: item.buttonLabel?.trim() || undefined,
        enabled: true,
        displayOrder: item.displayOrder,
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (error) {
    console.error('[Sanity] getHomepageCollectionSections failed:', error)
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
    console.error('[Sanity] getCollectionHero failed:', error)
    return null
  }
}

export async function getCoffeeShowcase(): Promise<SanityCoffeeShowcase | null> {
  try {

    const result = await client.fetch<{ coffeeShowcase: SanityCoffeeShowcase | null } | null>(
      coffeeShowcaseQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (!result?.coffeeShowcase) {
    }

    return result?.coffeeShowcase ?? null
  } catch (error) {
    console.error('[Sanity] getCoffeeShowcase failed:', error)
    return null
  }
}

export async function getSpaceExperiences(): Promise<SanitySpaceExperiences | null> {
  try {

    const result = await client.fetch<{ spaceExperiences: SanitySpaceExperiences | null } | null>(
      spaceExperiencesQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (!result?.spaceExperiences) {
    }

    return result?.spaceExperiences ?? null
  } catch (error) {
    console.error('[Sanity] getSpaceExperiences failed:', error)
    return null
  }
}

export async function getServiceBrandsSection(): Promise<SanityServiceBrandsSection | null> {
  try {

    const result = await client.fetch<{ serviceBrandsSection: SanityServiceBrandsSection | null } | null>(
      serviceBrandsSectionQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (!result?.serviceBrandsSection) {
    }

    return result?.serviceBrandsSection ?? null
  } catch (error) {
    console.error('[Sanity] getServiceBrandsSection failed:', error)
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

    if (!result?.satisfiedCustomers) {
    }

    return result?.satisfiedCustomers ?? null
  } catch (error) {
    console.error('[Sanity] getSatisfiedCustomers failed:', error)
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

    if (!result?.franchiseSection) {
    }

    return result?.franchiseSection ?? null
  } catch (error) {
    console.error('[Sanity] getFranchiseSection failed:', error)
    return null
  }
}

export async function getOurTeamSection(): Promise<SanityOurTeamSection | null> {
  try {

    const result = await client.fetch<{ ourTeamSection: SanityOurTeamSection | null } | null>(
      ourTeamSectionQuery,
      {},
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    if (!result?.ourTeamSection) {
    }

    return result?.ourTeamSection ?? null
  } catch (error) {
    console.error('[Sanity] getOurTeamSection failed:', error)
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

    if (!result?.clientTestimonials) {
    }

    return result?.clientTestimonials ?? null
  } catch (error) {
    console.error('[Sanity] getClientTestimonials failed:', error)
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

    if (!result?.storeLocation) {
    }

    return result?.storeLocation ?? null
  } catch (error) {
    console.error('[Sanity] getStoreLocation failed:', error)
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

    if (!result?.ctaBanner) {
    }

    return result?.ctaBanner ?? null
  } catch (error) {
    console.error('[Sanity] getCtaBanner failed:', error)
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

    return {
      announcementBar: result?.announcementBar ?? null,
      activePopup: result?.activePopup ?? null,
      featuredCollections: result?.featuredCollections ?? [],
      promoBanners: result?.promoBanners ?? [],
    }
  } catch (error) {
    console.error('[Sanity] getMarketingData failed:', error)
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
    console.error('[Sanity] getServicesPage failed:', error)
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
    console.error('[Sanity] getAboutPage failed:', error)
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
    console.error('[Sanity] getAllServicesCMS failed:', error)
    return []
  }
}

export async function getServiceBySlug(slug: string): Promise<SanityService | null> {
  try {
    const result = await client.fetch<SanityService | null>(
      serviceBySlugQuery,
      { slug },
      {
        next: {
          revalidate: 300,
          tags: ['sanity'],
        },
      }
    )

    return result ?? null
  } catch (error) {
    console.error('[Sanity] getServiceBySlug failed:', error)
    return null
  }
}
