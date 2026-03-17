import { getAllServices, getService } from "@lib/strapi/services"
import { ServiceCategory } from "@lib/services-data"

interface ServiceDetailData {
  service: ServiceCategory
  otherServices: ServiceCategory[]
}

export async function getServiceDetailData(
  slug: string
): Promise<ServiceDetailData | null> {
  const service = await getService(slug)

  if (!service) {
    return null
  }

  const allServices = await getAllServices()
  const otherServices = Array.isArray(allServices)
    ? allServices.filter((item) => item.slug !== slug)
    : []

  return {
    service,
    otherServices,
  }
}
