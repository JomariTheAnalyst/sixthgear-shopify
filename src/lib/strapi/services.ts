/**
 * MotoServices Content — Fallback Data (Strapi removed)
 *
 * Previously fetched from Strapi CMS, now returns null to trigger fallbacks.
 * Will be replaced by Payload CMS in Phase 3.17-3.18.
 */

import {
  ServiceCategory,
  servicesData,
  getServiceBySlug as getLocalServiceBySlug,
  getAllServiceSlugs as getLocalServiceSlugs,
} from "@lib/services-data"

export interface MotoServicesContent {
  sectionTitle: string
  sectionDescription: string
  services: Array<{
    id: number
    title: string
    description: string
    image: string
    link?: string | null
  }>
}

/**
 * Get all services — returns local data directly (no Strapi)
 */
export async function getAllServices(): Promise<ServiceCategory[]> {
  return servicesData.map((service) => ({
    ...service,
    heroImage: service.image,
    detailImage: service.image,
  }))
}

/**
 * Get single service by slug — returns local data directly (no Strapi)
 */
export async function getService(slug: string): Promise<ServiceCategory | undefined> {
  const localService = getLocalServiceBySlug(slug)
  if (localService) {
    return {
      ...localService,
      heroImage: localService.image,
      detailImage: localService.image,
    }
  }
  return undefined
}

/**
 * Get all service slugs — returns local data directly (no Strapi)
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  return getLocalServiceSlugs()
}
