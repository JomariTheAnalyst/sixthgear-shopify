export interface SanityHeroSection {
  useCustomHero?: boolean | null
  heading: string | null
  description: string | null
  primaryLabel: string | null
  primaryLink: string | null
  secondaryLabel: string | null
  secondaryLink: string | null
  slides: {
    imageUrl: string
    imageAlt: string
    contentAlignment?: "left" | "right" | null
  }[] | null
}

export interface SanityShopByBrandsSection {
  useCustomShopByBrands?: boolean | null
  sectionTitle?: string | null
  showNavDesktop?: boolean | null
  brands: {
    name: string
    imageUrl: string
    imageAlt: string
    link: string
    buttonText: string
  }[] | null
  stats: {
    iconUrl?: string
    icon?: string
    title: string
    description: string
  }[] | null
}

export interface SanityAboutSection {
  useCustomAbout?: boolean | null
  kicker?: string | null
  title?: string | null
  description?: string | null
  highlights?: string[] | null
  primaryCta?: {
    text: string
    link: string
  } | null
  imageTop?: string | null
  imageBottom?: string | null
  videoUrl?: string | null
}

export interface SanityCategoriesSection {
  useCustomCategories?: boolean | null
  title?: string | null
  watermarkText?: string | null
  viewAllLabel?: string | null
  viewAllLink?: string | null
  items: {
    name: string
    slug: string
    image: string
  }[] | null
}

export interface SanityServiceItem {
  _key?: string | null
  title?: string | null
  description?: string | null
  image?: string | null
  slug?: string | null
  link?: string | null
}

export interface SanityServicesSection {
  useCustomServices?: boolean | null
  sectionTitle?: string | null
  sectionDescription?: string | null
  services?: SanityServiceItem[] | null
}

export interface SanityCollectionHero {
  handle: string
  heading: string
  badge: string | null
  description: string | null
  backgroundImageUrl: string | null
}

export interface SanityCoffeeItem {
  id?: number
  name: string
  description: string
  imageUrl: string | null
}

export interface SanityCoffeeShowcase {
  mainHeadingLine1?: string | null
  highlightedWord?: string | null
  mainHeadingLine2?: string | null
  descriptionText?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  coffeeItems?: SanityCoffeeItem[] | null
}

export interface SanityExperienceItem {
  title: string
  description: string
  imageUrl: string | null
  isEnabled: boolean
}

export interface SanitySpaceExperiences {
  sectionTitle?: string | null
  sectionDescription?: string | null
  items?: SanityExperienceItem[] | null
}

export interface SanityServiceBrandItem {
  name: string
  logoUrl: string | null
  link: string | null
}

export interface SanityServiceBrandsSection {
  sectionTitle?: string | null
  sectionDescription?: string | null
  brands?: SanityServiceBrandItem[] | null
}

export interface SanityCustomerItem {
  name: string | null
  photoUrl: string | null
}

export interface SanitySatisfiedCustomers {
  sectionTitle?: string | null
  customers?: SanityCustomerItem[] | null
}

export interface SanityFranchiseSection {
  mainTitle?: string | null
  subtitle?: string | null
  badge1Text?: string | null
  badge2Text?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  leftImageUrl?: string | null
  rightImageUrl?: string | null
}

export interface SanityTeamMember {
  name: string
  role: string
  title: string | null
  description: string | null
  photoUrl: string | null
  socialLinks: {
    facebook: string | null
    instagram: string | null
    tiktok: string | null
  } | null
}

export interface SanityOurTeamSection {
  sectionTitle: string | null
  sectionDescription: string | null
  teamMembers: SanityTeamMember[] | null
}

export interface SanityTestimonialItem {
  name: string
  role: string | null
  quote: string
}

export interface SanityClientTestimonials {
  sectionTitle: string | null
  sectionDescription: string | null
  testimonials: SanityTestimonialItem[] | null
}

export interface SanityStoreLocation {
  storeName: string | null
  address: string | null
  phone: string | null
  hours: string | null
  googleMapsUrl: string | null
}

export interface SanityCtaBanner {
  preTitle: string | null
  headline: string | null
  headlineHighlight: string | null
  buttonLabel: string | null
  buttonLink: string | null
  footerTagline: string | null
  socialLinks: {
    instagram: string | null
    facebook: string | null
    tiktok: string | null
  } | null
}

export interface SanityPopupAd {
  _id: string
  campaignName: string
  enabled: boolean
  startDate: string | null
  endDate: string | null
  imageUrl: string | null
  imageLink: string | null
  heading: string | null
  buttonLabel: string | null
  buttonLink: string | null
  delay: number | null
}

export interface SanityFeaturedCollectionItem {
  isActive: boolean
  internalName: string | null
  position: string | null
  layout: 'image_left' | 'image_right' | null
  contentPosition: 'bottom-left' | 'bottom-center' | 'bottom-right' | null
  bannerImageUrl: string | null
  collectionHandle: string | null
  heading: string | null
  subtext: string | null
  ctaLabel: string | null
}

export interface SanityAnnouncementMessage {
  text: string
  link: string | null
  isActive: boolean
}

export interface SanityAnnouncementBar {
  isActive: boolean
  backgroundColor: 'orange' | 'black' | 'white' | null
  rotationSpeed: number | null
  messages: SanityAnnouncementMessage[] | null
}

export interface SanityPromoBanner {
  isActive: boolean
  internalName: string | null
  position: string | null
  imageUrl: string | null
  heading: string | null
  buttonLabel: string | null
  buttonLink: string | null
  buttonPosition:
    | 'top_left'
    | 'top_center'
    | 'top_right'
    | 'bottom_left'
    | 'bottom_center'
    | 'bottom_right'
    | null
}

export interface SanityMarketingData {
  announcementBar: SanityAnnouncementBar | null
  activePopup: SanityPopupAd | null
  featuredCollections: SanityFeaturedCollectionItem[]
  promoBanners: SanityPromoBanner[]
}


