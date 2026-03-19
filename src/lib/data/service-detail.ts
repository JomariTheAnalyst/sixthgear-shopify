import { getAllServicesCMS, getServiceBySlug } from "@lib/cms/client"
import { SanityService } from "@lib/cms/types"
import { ServiceCategory } from "@lib/services-data"
import { getAllServices, getService } from "@lib/strapi/services"

interface ServiceDetailData {
  service: ServiceCategory & {
    ctaLabel: string
    ctaLink: string
    icon: string | null
  }
  otherServices: Array<
    ServiceCategory & {
      ctaLabel: string
      ctaLink: string
      icon: string | null
    }
  >
}

function mergeServiceData(
  slug: string,
  cmsService: SanityService | null,
  localService?: ServiceCategory
): ServiceCategory & {
  ctaLabel: string
  ctaLink: string
  icon: string | null
} {
  const cmsItems =
    cmsService?.features
      ?.map((feature) => feature.text ?? "")
      .filter(Boolean) ?? []

  return {
    id: localService?.id ?? cmsService?._id ?? slug,
    slug,
    title: cmsService?.title ?? localService?.title ?? "",
    shortTitle: localService?.shortTitle ?? cmsService?.title ?? "",
    description:
      cmsService?.fullDescription ??
      cmsService?.shortDescription ??
      localService?.description ??
      "",
    image: cmsService?.heroImageUrl ?? localService?.image ?? "",
    heroImage: cmsService?.heroImageUrl ?? localService?.heroImage ?? "",
    detailImage:
      cmsService?.heroImageUrl ?? localService?.detailImage ?? "",
    items: cmsItems.length > 0 ? cmsItems : localService?.items ?? [],
    ctaLabel: cmsService?.ctaLabel ?? "Book This Service",
    ctaLink: cmsService?.ctaLink ?? "/contact",
    icon: cmsService?.icon ?? null,
  }
}

export async function getServiceDetailData(
  slug: string
): Promise<ServiceDetailData | null> {
  const [cmsService, localService] = await Promise.all([
    getServiceBySlug(slug),
    getService(slug),
  ])

  if (!cmsService && !localService) {
    return null
  }

  const service = mergeServiceData(slug, cmsService, localService)

  const allCMS = await getAllServicesCMS()
  let otherServices: ServiceDetailData["otherServices"] = []

  if (allCMS.length > 0) {
    const localServices = await getAllServices()

    otherServices = allCMS
      .filter((item) => item.slug && item.slug !== slug)
      .map((item) => {
        const matchedLocal = localServices.find(
          (localItem) => localItem.slug === item.slug
        )

        return mergeServiceData(
          item.slug ?? matchedLocal?.slug ?? "",
          item,
          matchedLocal
        )
      })
      .filter((item) => Boolean(item.slug))
  } else {
    const allServices = await getAllServices()
    otherServices = Array.isArray(allServices)
      ? allServices
          .filter((item) => item.slug !== slug)
          .map((item) => mergeServiceData(item.slug, null, item))
      : []
  }

  return {
    service,
    otherServices,
  }
}
