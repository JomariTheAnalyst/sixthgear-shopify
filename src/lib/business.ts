import { getBaseURL } from "@lib/util/env"

const logoPath = "/images/logo/sixthgear-removebg-preview.png"

export const BUSINESS_NAP = {
  brandName: "SixthGearMoto",
  legalName: "Sixthgear Motosupply",
  name: "Sixth Gear Moto Supply Cafe + Lounge",
  shortName: "Sixth Gear Moto Supply",
  description:
    "SixthGearMoto is a rider-focused motorcycle parts shop, motorcycle service center, carwash, cafe, and lounge in Makati City, Metro Manila.",
  websiteUrl: getBaseURL(),
  logoPath,
  imagePath: logoPath,
  address: {
    streetAddress: "3610 Bautista St",
    addressLocality: "Makati City",
    addressRegion: "Metro Manila",
    addressCountry: "PH",
    postalAddress: "3610 Bautista St, Makati City, Metro Manila",
  },
  phone: "0995 093 0157",
  telephone: "+63-995-093-0157",
  telHref: "tel:09950930157",
  email: "info@sixthgear.ph",
  openingHoursText: "Monday - Sunday | 10:00 AM - 7:00 PM",
  openingHoursSpecification: [
    {
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  serviceArea: ["Makati City", "Metro Manila", "Philippines"],
  coordinates: {
    lat: 14.554651468423817,
    lng: 121.00262199651827,
  },
  googleMapsUrl: "https://maps.app.goo.gl/qbVoZTzCk7sBENrN7",
  googleBusinessProfileUrl: null,
  socialProfiles: [
    "https://www.facebook.com/camille.sixthgear",
    "https://www.instagram.com/sixthgear.moto/",
    "https://www.tiktok.com/@sixthgear.moto.su",
    "https://twitter.com/sixthgear",
    "https://linkedin.com/company/sixthgear",
  ],
  socialProfilesOfficialForSchema: false,
  paymentAccepted: null,
} as const

export const businessInfo = BUSINESS_NAP

export type BusinessInfo = typeof BUSINESS_NAP
