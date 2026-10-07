import { getBaseURL } from "@lib/util/env"

const logoPath = "/images/logo/sixthgear-removebg-preview.png"

// The only official social profiles. Every link on the site and the JSON-LD
// sameAs read from here.
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/sixthgear.moto.makati",
  instagram: "https://www.instagram.com/sixthgear.moto/",
  tiktok: "https://www.tiktok.com/@sixthgear.moto.su",
} as const

export const BUSINESS_NAP = {
  brandName: "SixthGear Moto",
  alternateNames: ["SixthGearMoto", "Sixth Gear Moto Supply", "Sixthgear"],
  legalName: "Sixthgear Motosupply",
  name: "Sixth Gear Moto Supply Cafe + Lounge",
  shortName: "Sixth Gear Moto Supply",
  description:
    "SixthGear Moto is a rider-focused motorcycle parts shop, motorcycle service center, carwash, cafe, and lounge in Makati City, Metro Manila.",
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
  phone: "0995 093 0157 | 0956 733 2060 | 0917 818 0495 | 0969 274 4079",
  telephone: "(02)7000-0141",
  telHref: "tel:09950930157",
  email: "support@sixthgearmoto.com",
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
    lat: 14.5544253,
    lng: 121.0025947,
  },
  googleMapsUrl: "https://maps.app.goo.gl/qbVoZTzCk7sBENrN7",
  googleBusinessProfileUrl: null,
  socialProfiles: Object.values(SOCIAL_LINKS),
  paymentAccepted: null,
} as const

export const businessInfo = BUSINESS_NAP

export type BusinessInfo = typeof BUSINESS_NAP
