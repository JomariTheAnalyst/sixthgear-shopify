export interface SanityHeroSection {
  useCustomHero?: boolean | null
  heading: string | null
  description: string | null
  primaryLabel: string | null
  primaryLink: string | null
  secondaryLabel: string | null
  secondaryLink: string | null
  slides: {
    _key?: string | null
    imageUrl: string
    hotspot?: {
      x: number
      y: number
      width: number
      height: number
    } | null
    mobileImageUrl: string | null
    mobileImageRef?: string | null
    mobileCrop?: {
      top: number
      bottom: number
      left: number
      right: number
    } | null
    mobileHotspot?: {
      x: number
      y: number
      width: number
      height: number
    } | null
    imageAlt: string
    contentAlignment?: "left" | "right" | null
  }[] | null
}

export interface SanityVideoFeatureSection {
  useSanityContent?: boolean | null
  enabled?: boolean | null
  sourceType?: 'upload' | 'url' | null
  uploadedVideoUrl?: string | null
  videoUrl?: string | null
  posterUrl?: string | null
  title?: string | null
  description?: string | null
  videoLabel?: string | null
  startMuted?: boolean | null
  loop?: boolean | null
  ctaLabel?: string | null
  ctaLink?: string | null
}

export interface SanityShopByBrandsSection {
  useCustomShopByBrands?: boolean | null
  sectionTitle?: string | null
  showNavDesktop?: boolean | null
  brands: {
    _key?: string | null
    name: string
    imageUrl: string
    imageAlt: string
    link: string
    buttonText: string
  }[] | null
  stats: {
    _key?: string | null
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
    _key?: string | null
    name: string
    slug: string
    image: string
    imageAlt?: string | null
    buttonLabel?: string | null
    buttonLink?: string | null
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

export interface SanityServicesHero {
  useSanityContent?: boolean | null
  title?: string | null
  shortTitle?: string | null
  description?: string | null
  heroImageUrl?: string | null
  heroImageAlt?: string | null
  imageUrl?: string | null
}

export interface SanityServicesExpertiseHighlight {
  _key?: string | null
  title?: string | null
  description?: string | null
}

export interface SanityServicesExpertiseStats {
  useSanityContent?: boolean | null
  sectionHeading?: string | null
  sectionDescription?: string | null
  highlights?: Array<SanityServicesExpertiseHighlight | null> | null
  assistance?: {
    heading?: string | null
    description?: string | null
    buttonText?: string | null
    buttonLink?: string | null
  } | null
  backgroundImageUrl?: string | null
  backgroundImageAlt?: string | null
}

export interface SanityServicesBrandItem {
  _key?: string | null
  name?: string | null
  logoUrl?: string | null
  logoAlt?: string | null
}

export interface SanityServicesBrandsWeService {
  useSanityContent?: boolean | null
  sectionHeading?: string | null
  brands?: Array<SanityServicesBrandItem | null> | null
}

export interface SanityServiceFeature {
  text: string | null
}

export interface SanityServiceLocalContent {
  heading: string | null
  body: string | null
}

export interface SanityServiceInternalLink {
  label: string | null
  href: string | null
}

export interface SanityServiceFaqItem {
  question: string | null
  answer: string | null
}

export interface SanityService {
  _id: string
  title: string | null
  slug: string | null
  icon: string | null
  shortDescription: string | null
  fullDescription: string | null
  heroImageUrl: string | null
  seoTitle: string | null
  seoDescription: string | null
  socialImageUrl: string | null
  features: SanityServiceFeature[] | null
  localContent: SanityServiceLocalContent[] | null
  internalLinks: SanityServiceInternalLink[] | null
  faqItems: SanityServiceFaqItem[] | null
  ctaLabel: string | null
  ctaLink: string | null
  displayOrder: number | null
}

export interface SanityServicesGrid {
  useSanityContent?: boolean | null
  sectionHeading?: string | null
  useCustomServices?: boolean | null
  featuredServices?: Array<{
    _key?: string | null
    service?: SanityService | null
  } | null> | null
}

export interface SanityServicesProcessStep {
  _key?: string | null
  number?: string | null
  title?: string | null
  description?: string | null
}

export interface SanityServicesProcessOfWork {
  useSanityContent?: boolean | null
  sectionHeading?: string | null
  steps?: Array<SanityServicesProcessStep | null> | null
}

export interface SanityServicesGalleryItem {
  _key?: string | null
  mediaType?: 'video' | 'image' | null
  mediaUrl?: string | null
  label?: string | null
}

export interface SanityServicesGallery {
  useSanityContent?: boolean | null
  heading?: string | null
  description?: string | null
  profileName?: string | null
  profileSubtitle?: string | null
  profileLogoUrl?: string | null
  profileLogoAlt?: string | null
  buttonText?: string | null
  items?: Array<SanityServicesGalleryItem | null> | null
}

export interface SanityServicesPage {
  hero?: SanityServicesHero | null
  expertiseStats?: SanityServicesExpertiseStats | null
  brandsWeService?: SanityServicesBrandsWeService | null
  servicesGrid?: SanityServicesGrid | null
  processOfWork?: SanityServicesProcessOfWork | null
  servicesGallery?: SanityServicesGallery | null
  ctaBanner?: SanityCtaBanner | null
}

export interface HomepageCollectionSection {
  collectionHandle: string
  sectionTitle?: string
  buttonLabel?: string
  enabled: boolean
  displayOrder: number
}

export interface SanityAboutPageHero {
  useSanityContent?: boolean | null
  title?: string | null
  description?: string | null
  backgroundImageUrl?: string | null
  backgroundImageAlt?: string | null
}

export interface SanityAboutPageStoryItem {
  _key?: string | null
  heading?: string | null
  body?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
}

export interface SanityAboutPageWhatWeOfferCard {
  _key?: string | null
  title?: string | null
  backgroundImageUrl?: string | null
  imageAlt?: string | null
  linkUrl?: string | null
  buttonText?: string | null
}

export interface SanityAboutPageWhatWeOffer {
  useSanityContent?: boolean | null
  sectionName?: string | null
  heading?: string | null
  cards?: SanityAboutPageWhatWeOfferCard[] | null
}

export type SanityWhatWeOfferCard = SanityAboutPageWhatWeOfferCard
export type SanityWhatWeOffer = SanityAboutPageWhatWeOffer

export interface SanityOurSpaceExperienceItem {
  _key?: string | null
  title?: string | null
  description?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
}

export interface SanityAboutPageStory {
  useSanityContent?: boolean | null
  items?: Array<SanityAboutPageStoryItem | null> | null
}

export interface SanityOurSpaceExperience {
  useSanityContent?: boolean | null
  sectionTitle?: string | null
  sectionDescription?: string | null
  items?: Array<SanityOurSpaceExperienceItem | null> | null
}

export interface SanityAboutPageOurValueCard {
  _key?: string | null
  title?: string | null
  description?: string | null
  icon?: string | null
}

export interface SanityAboutPageOurValues {
  useSanityContent?: boolean | null
  heading?: string | null
  description?: string | null
  cards?: Array<SanityAboutPageOurValueCard | null> | null
}

export interface SanityAboutPageWhyChooseUsItem {
  _key?: string | null
  title?: string | null
  description?: string | null
  icon?: string | null
}

export interface SanityAboutPageWhyChooseUs {
  useSanityContent?: boolean | null
  sectionLabel?: string | null
  heading?: string | null
  subtitle?: string | null
  items?: SanityAboutPageWhyChooseUsItem[] | null
  topImageUrl?: string | null
  topImageAlt?: string | null
  bottomImageUrl?: string | null
  bottomImageAlt?: string | null
}

export interface SanityAboutPageCeoQuote {
  useSanityContent?: boolean | null
  quoteText?: string | null
  highlightedPhrase?: string | null
  ceoName?: string | null
  ceoTitle?: string | null
  ceoPhotoUrl?: string | null
  ceoPhotoDescription?: string | null
}

export interface SanityAboutPage {
  useSanityContent?: boolean | null
  hero?: SanityAboutPageHero | null
  ourStory?: SanityAboutPageStory | null
  ourSpaceExperience?: SanityOurSpaceExperience | null
  ourValues?: SanityAboutPageOurValues | null
  whyChooseUs?: SanityAboutPageWhyChooseUs | null
  ceoQuote?: SanityAboutPageCeoQuote | null
  ctaBanner?: SanityCtaBanner | null
}

export interface SanityCollectionHero {
  handle: string
  heading: string
  badge: string | null
  description: string | null
  backgroundImageUrl: string | null
}

interface SanityCoffeeItemBase {
  _key: string
  imageAlt: string
  eyebrow: string
  title: string
  caption: string
}

export interface SanityMarqueeItemQueryResult {
  _key?: string | null
  text?: string | null
}

export interface SanityMarqueeSectionQueryResult {
  useSanityContent?: boolean | null
  items?: Array<SanityMarqueeItemQueryResult | null> | null
}

export interface SanityCoffeeImageItem extends SanityCoffeeItemBase {
  mediaType: 'image'
  imageUrl: string
  videoUrl: string | null
}

export interface SanityCoffeeVideoItem extends SanityCoffeeItemBase {
  mediaType: 'video'
  imageUrl: string | null
  videoUrl: string
}

export type SanityCoffeeItem = SanityCoffeeImageItem | SanityCoffeeVideoItem

export interface SanityCoffeeShowcaseContent {
  useSanityContent: true
  sectionHeading: string
  coffeeIconUrl: string
  descriptionText: string
  storyProfileLogoUrl: string
  storyProfileName: string
  storyProfileSubtitle: string
  buttonText: string | null
  buttonLink: string | null
  coffeeItems: SanityCoffeeItem[]
}

export interface SanityCoffeeShowcaseFallbackMode {
  useSanityContent: false
}

export type SanityCoffeeShowcase =
  | SanityCoffeeShowcaseContent
  | SanityCoffeeShowcaseFallbackMode

export interface SanityCoffeeItemQueryResult {
  _key?: string | null
  mediaType?: 'image' | 'video' | null
  imageUrl?: string | null
  videoUrl?: string | null
  imageAlt?: string | null
  eyebrow?: string | null
  title?: string | null
  caption?: string | null
}

export interface SanityCoffeeShowcaseQueryResult {
  useSanityContent?: boolean | null
  sectionHeading?: string | null
  coffeeIconUrl?: string | null
  descriptionText?: string | null
  storyProfileLogoUrl?: string | null
  storyProfileName?: string | null
  storyProfileSubtitle?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  coffeeItems?: Array<SanityCoffeeItemQueryResult | null> | null
}

export interface SanityServiceBrandItemQueryResult {
  _key?: string | null
  name?: string | null
  logoUrl?: string | null
  logoAlt?: string | null
  motorcycleImageUrl?: string | null
  motorcycleImageAlt?: string | null
  overview?: string | null
  keySentences?: Array<string | null> | null
  link?: string | null
  linkLabel?: string | null
}

export interface SanityServiceBrandsSectionQueryResult {
  useSanityContent?: boolean | null
  sectionTitle?: string | null
  sectionDescription?: string | null
  brands?: Array<SanityServiceBrandItemQueryResult | null> | null
}

export interface SanityCustomerItem {
  _key?: string | null
  name: string | null
  photoUrl: string | null
}

export interface SanitySatisfiedCustomers {
  useSanityContent?: boolean | null
  sectionTitle?: string | null
  customers?: SanityCustomerItem[] | null
}

export interface SanityFranchiseSection {
  useSanityContent?: boolean | null
  mainTitle?: string | null
  subtitle?: string | null
  badge1Text?: string | null
  badge2Text?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  leftImageUrl?: string | null
  rightImageUrl?: string | null
}

export interface SanityTeamMemberQueryResult {
  _key?: string | null
  name?: string | null
  role?: string | null
  title?: string | null
  description?: string | null
  photoUrl?: string | null
  imageAlt?: string | null
}

export interface SanityOurTeamSectionQueryResult {
  useSanityContent?: boolean | null
  sectionTitle?: string | null
  sectionDescription?: string | null
  teamMembers?: Array<SanityTeamMemberQueryResult | null> | null
}

export interface SanityTestimonialItem {
  _key?: string | null
  name: string
  role: string | null
  quote: string
}

export interface SanityClientTestimonials {
  useSanityContent?: boolean | null
  sectionTitle: string | null
  sectionDescription: string | null
  testimonials: SanityTestimonialItem[] | null
}

export interface SanityStoreLocation {
  useSanityContent?: boolean | null
  storeName: string | null
  address: string | null
  phone: string | null
  hours: string | null
  googleMapsUrl: string | null
}

export interface SanityCtaBanner {
  useSanityContent?: boolean | null
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
  imageDimensions?: {
    width: number | null
    height: number | null
    aspectRatio: number | null
  } | null
  imageLink: string | null
  heading: string | null
  buttonLabel: string | null
  buttonLink: string | null
  delay: number | null
}

export interface SanityFeaturedCollectionItem {
  _key?: string | null
  isActive: boolean
  internalName: string | null
  position: string | null
  startDate: string | null
  endDate: string | null
  layout: 'image_left' | 'image_right' | null
  contentPosition: 'bottom-left' | 'bottom-center' | 'bottom-right' | null
  bannerImageUrl: string | null
  bannerImageAlt: string | null
  collectionHandle: string | null
  heading: string | null
  subtext: string | null
  ctaLabel: string | null
  ctaLink: string | null
}

export interface SanityAnnouncementMessage {
  _key?: string | null
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
  _key?: string | null
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

export interface SanityBlogCategory {
  title: string | null
  slug: string | null
  description?: string | null
}

export interface SanityPortableTextSpan {
  _type: "span"
  _key: string
  text: string
  marks?: string[]
}

export interface SanityPortableTextBlock {
  _type: string
  _key?: string
  style?: string
  listItem?: "bullet" | "number"
  level?: number
  children?: SanityPortableTextSpan[]
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
  }>
  alt?: string | null
  url?: string | null
}

export interface SanityBlogPostListItem {
  _id: string
  title: string | null
  slug: string | null
  excerpt: string | null
  publishedAt: string | null
  authorName: string | null
  featured: boolean | null
  featuredImageUrl: string | null
  featuredImageAlt?: string | null
  socialImageUrl?: string | null
  category: SanityBlogCategory | null
  tags?: string[] | null
}

export interface SanityBlogPost extends SanityBlogPostListItem {
  seoTitle: string | null
  seoDescription: string | null
  body: SanityPortableTextBlock[] | null
}
