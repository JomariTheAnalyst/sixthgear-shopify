import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../../../sanity/env'
import { homepageQuery, collectionHeroQuery, coffeeShowcaseQuery, spaceExperiencesQuery, serviceBrandsSectionQuery, satisfiedCustomersQuery, franchiseSectionQuery, ourTeamSectionQuery, clientTestimonialsQuery, storeLocationQuery, ctaBannerQuery, marketingQuery, servicesPageQuery, allServicesQuery, serviceBySlugQuery, aboutPageQuery } from './queries'
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
} from './types'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export async function getHomepageHero(): Promise<SanityHeroSection | null> {
  try {
    console.log('Fetching homepage hero from Sanity...')

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
      console.warn('[Sanity] Homepage query returned:', JSON.stringify(result))
    }

    return result?.hero ?? null
  } catch (error) {
    console.error('[Sanity] getHomepageHero failed:', error)
    return null
  }
}

export async function getHomepageShopByBrands(): Promise<SanityShopByBrandsSection | null> {
  try {
    console.log('Fetching homepage shopByBrands from Sanity...')

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
      console.warn('[Sanity] Homepage query returned no shopByBrands:', JSON.stringify(result))
    }

    return result?.shopByBrands ?? null
  } catch (error) {
    console.error('[Sanity] getHomepageShopByBrands failed:', error)
    return null
  }
}

export async function getHomepageAbout(): Promise<SanityAboutSection | null> {
  try {
    console.log('Fetching homepage about from Sanity...')

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
      console.warn('[Sanity] Homepage query returned no about:', JSON.stringify(result))
    }

    return result?.about ?? null
  } catch (error) {
    console.error('[Sanity] getHomepageAbout failed:', error)
    return null
  }
}

export async function getHomepageCategories(): Promise<SanityCategoriesSection | null> {
  try {
    console.log('Fetching homepage categories from Sanity...')

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
      console.warn('[Sanity] Homepage query returned no categories:', JSON.stringify(result))
    }

    return result?.categories ?? null
  } catch (error) {
    console.error('[Sanity] getHomepageCategories failed:', error)
    return null
  }
}

export async function getHomepageServices(): Promise<SanityServicesSection | null> {
  try {
    console.log('Fetching homepage services from Sanity...')

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
      console.warn('[Sanity] Homepage query returned no services:', JSON.stringify(result))
    }

    return result?.services ?? null
  } catch (error) {
    console.error('[Sanity] getHomepageServices failed:', error)
    return null
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
    console.log('Fetching homepage coffee showcase from Sanity...')

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
      console.warn('[Sanity] Homepage coffee showcase query returned null:', JSON.stringify(result))
    }

    return result?.coffeeShowcase ?? null
  } catch (error) {
    console.error('[Sanity] getCoffeeShowcase failed:', error)
    return null
  }
}

export async function getSpaceExperiences(): Promise<SanitySpaceExperiences | null> {
  try {
    console.log('Fetching homepage space and experiences from Sanity...')

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
      console.warn('[Sanity] Homepage space experiences query returned null:', JSON.stringify(result))
    }

    return result?.spaceExperiences ?? null
  } catch (error) {
    console.error('[Sanity] getSpaceExperiences failed:', error)
    return null
  }
}

export async function getServiceBrandsSection(): Promise<SanityServiceBrandsSection | null> {
  try {
    console.log('Fetching homepage service brands section from Sanity...')

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
      console.warn('[Sanity] Homepage service brands section query returned null:', JSON.stringify(result))
    }

    return result?.serviceBrandsSection ?? null
  } catch (error) {
    console.error('[Sanity] getServiceBrandsSection failed:', error)
    return null
  }
}

export async function getSatisfiedCustomers(): Promise<SanitySatisfiedCustomers | null> {
  try {
    console.log('Fetching homepage satisfied customers from Sanity...')

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
      console.warn('[Sanity] Homepage satisfied customers query returned null:', JSON.stringify(result))
    }

    return result?.satisfiedCustomers ?? null
  } catch (error) {
    console.error('[Sanity] getSatisfiedCustomers failed:', error)
    return null
  }
}

export async function getFranchiseSection(): Promise<SanityFranchiseSection | null> {
  try {
    console.log('Fetching homepage franchise section from Sanity...')

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
      console.warn('[Sanity] Homepage franchise section query returned null:', JSON.stringify(result))
    }

    return result?.franchiseSection ?? null
  } catch (error) {
    console.error('[Sanity] getFranchiseSection failed:', error)
    return null
  }
}

export async function getOurTeamSection(): Promise<SanityOurTeamSection | null> {
  try {
    console.log('Fetching homepage our team section from Sanity...')

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
      console.warn('[Sanity] Homepage our team section query returned null:', JSON.stringify(result))
    }

    return result?.ourTeamSection ?? null
  } catch (error) {
    console.error('[Sanity] getOurTeamSection failed:', error)
    return null
  }
}

export async function getClientTestimonials(): Promise<SanityClientTestimonials | null> {
  try {
    console.log('Fetching homepage client testimonials from Sanity...')

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
      console.warn('[Sanity] Homepage client testimonials query returned null:', JSON.stringify(result))
    }

    return result?.clientTestimonials ?? null
  } catch (error) {
    console.error('[Sanity] getClientTestimonials failed:', error)
    return null
  }
}

export async function getStoreLocation(): Promise<SanityStoreLocation | null> {
  try {
    console.log('Fetching homepage store location from Sanity...')

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
      console.warn('[Sanity] Homepage store location query returned null:', JSON.stringify(result))
    }

    return result?.storeLocation ?? null
  } catch (error) {
    console.error('[Sanity] getStoreLocation failed:', error)
    return null
  }
}

export async function getCtaBanner(): Promise<SanityCtaBanner | null> {
  try {
    console.log('Fetching homepage CTA banner from Sanity...')

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
      console.warn('[Sanity] Homepage CTA banner query returned null:', JSON.stringify(result))
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
