import { businessInfo } from "@lib/business"

export const storeInfo = {
  name: businessInfo.name,
  shortName: businessInfo.shortName,
  address: businessInfo.address.postalAddress,
  phone: businessInfo.phone,
  hours: businessInfo.openingHoursText,
  coordinates: businessInfo.coordinates,
  googleMapsUrl: businessInfo.googleMapsUrl,
} as const

export const storeMapEmbedUrl =
  `https://maps.google.com/maps?q=${storeInfo.coordinates.lat},${storeInfo.coordinates.lng}&z=20&output=embed`

export const storeDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${storeInfo.coordinates.lat},${storeInfo.coordinates.lng}`
