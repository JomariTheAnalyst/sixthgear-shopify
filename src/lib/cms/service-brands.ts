import type {
  SanityServiceBrandItemQueryResult,
  SanityServiceBrandsSectionQueryResult,
} from './types'

export type ServiceBrandContentItem = {
  key: string
  name: string
  logoUrl: string
  logoAlt: string
  motorcycleImageUrl: string
  motorcycleImageAlt: string
  overview: string
  keySentences: string[]
  link: string | null
  linkLabel: string | null
}

export type ServiceBrandsContent = {
  source: 'sanity' | 'fallback'
  sectionTitle: string
  sectionDescription: string
  brands: ServiceBrandContentItem[]
}

export const FALLBACK_SERVICE_BRANDS_CONTENT: ServiceBrandsContent = {
  source: 'fallback',
  sectionTitle: 'Motorcycle Brands We Service & Support',
  sectionDescription:
    'Experienced in servicing Japanese, American, and European motorcycles with proper tools, care, and attention to detail.',
  brands: [
    {
      key: 'fallback-service-brand-suzuki',
      name: 'Suzuki',
      logoUrl: '/images/brands/brands-logo/suzuki-logo.svg',
      logoAlt: 'Suzuki logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/motosm.png',
      motorcycleImageAlt: 'Suzuki motorcycle',
      overview:
        'Suzuki motorcycles are known for practical performance, reliability, and everyday rideability across commuter, sport, touring, and adventure platforms. The brand has a strong reputation among riders who want machines that are easy to live with, honest to maintain, and capable of handling regular use without unnecessary complexity.',
      keySentences: [
        'Well-balanced engines make Suzuki bikes approachable for both daily riders and weekend riders.',
        "The brand's parts ecosystem and broad model range make service planning straightforward.",
        'Best suited for riders who value dependable performance, clean maintenance, and long-term usability.',
      ],
      link: null,
      linkLabel: null,
    },
    {
      key: 'fallback-service-brand-yamaha',
      name: 'Yamaha',
      logoUrl: '/images/brands/brands-logo/yamaha.svg',
      logoAlt: 'Yamaha logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/yamaha.webp',
      motorcycleImageAlt: 'Yamaha motorcycle',
      overview:
        'Yamaha blends responsive engineering with rider-focused design, from urban commuters to high-performance machines. Its motorcycles often feel sharp, refined, and predictable, giving riders confidence whether they are navigating city traffic, carving open roads, or maintaining a sport-oriented bike.',
      keySentences: [
        'Yamaha platforms reward precise setup, especially in suspension, braking, and throttle response.',
        'The brand is popular because it balances performance character with everyday practicality.',
        'A careful service approach helps preserve the smoothness and responsiveness Yamaha riders expect.',
      ],
      link: null,
      linkLabel: null,
    },
    {
      key: 'fallback-service-brand-ktm',
      name: 'KTM',
      logoUrl: '/images/brands/brands-logo/ktm-logo.svg',
      logoAlt: 'KTM logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/ktm.png',
      motorcycleImageAlt: 'KTM motorcycle',
      overview:
        'KTM brings aggressive styling, sharp handling, and performance-first engineering built for riders who want a more energetic machine. The brand has a strong identity in lightweight performance, off-road influence, and bikes that feel direct, lively, and eager when properly maintained.',
      keySentences: [
        'KTM motorcycles benefit from close attention to fluids, cooling, chain care, and electronic diagnostics.',
        'Their performance character makes correct setup more noticeable than on many softer commuter platforms.',
        'Ideal for riders who enjoy a responsive motorcycle and want it maintained with precision.',
      ],
      link: null,
      linkLabel: null,
    },
    {
      key: 'fallback-service-brand-kawasaki',
      name: 'Kawasaki',
      logoUrl: '/images/brands/brands-logo/kawasaki-logo.svg',
      logoAlt: 'Kawasaki logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/kawasaki.png',
      motorcycleImageAlt: 'Kawasaki motorcycle',
      overview:
        'Kawasaki motorcycles are recognized for strong road presence, balanced power delivery, and dependable versatility across segments. From approachable commuters to larger displacement sport and touring bikes, the brand appeals to riders who want confident acceleration, solid engineering, and a machine with personality.',
      keySentences: [
        'Kawasaki bikes often respond well to consistent preventive maintenance and correct drivetrain care.',
        "The brand's broad lineup makes accurate model-specific inspection important.",
        'A good service routine keeps the bike feeling strong, stable, and ready for longer rides.',
      ],
      link: null,
      linkLabel: null,
    },
    {
      key: 'fallback-service-brand-bmw',
      name: 'BMW',
      logoUrl: '/images/brands/brands-logo/bmw-logo.svg',
      logoAlt: 'BMW logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/BMW.png',
      motorcycleImageAlt: 'BMW motorcycle',
      overview:
        'BMW motorcycles combine premium engineering, touring comfort, and advanced rider technology for long-distance confidence and everyday refinement. Their platforms can include sophisticated electronics, braking systems, suspension features, and service requirements that need a careful, methodical workshop approach.',
      keySentences: [
        'BMW service work should respect both mechanical condition and electronic system health.',
        'Comfort, stability, and safety features depend on proper inspection and calibrated maintenance.',
        'Best for riders who expect premium road manners and want details handled correctly.',
      ],
      link: null,
      linkLabel: null,
    },
    {
      key: 'fallback-service-brand-royal-enfield',
      name: 'Royal Enfield',
      logoUrl: '/images/brands/brands-logo/royal-enfield-logo.svg',
      logoAlt: 'Royal Enfield logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/royal-enfield.png',
      motorcycleImageAlt: 'Royal Enfield motorcycle',
      overview:
        'Royal Enfield focuses on timeless styling, relaxed character, and mechanical simplicity that suits both city and open-road riding. These motorcycles carry a classic feel, but they still benefit from disciplined checks on fasteners, fluids, brakes, tires, and drivetrain condition.',
      keySentences: [
        'Royal Enfield bikes reward steady, thoughtful maintenance rather than rushed servicing.',
        'The ownership experience is about character, comfort, and confidence over outright speed.',
        'A clean service routine helps preserve the relaxed feel that makes the brand appealing.',
      ],
      link: null,
      linkLabel: null,
    },
    {
      key: 'fallback-service-brand-cfmoto',
      name: 'CFMOTO',
      logoUrl: '/images/brands/brands-logo/cfmoto.png',
      logoAlt: 'CFMOTO logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/cf moto.png',
      motorcycleImageAlt: 'CFMOTO motorcycle',
      overview:
        'CFMOTO is a modern powersports manufacturer founded in 1989 and headquartered in Hangzhou, China, with motorcycles and off-road vehicles sold across more than 100 countries and regions. The brand is known for bringing strong equipment levels, contemporary styling, and accessible performance to riders who want value without giving up technology.',
      keySentences: [
        'CFMOTO motorcycles often combine modern electronics, sharp design, and practical everyday usability.',
        'Because many models are feature-rich, service should include mechanical checks and attention to sensors, controls, and rider-assist systems.',
        'A good fit for riders who want a fresh, technology-forward motorcycle with sensible ownership costs.',
      ],
      link: null,
      linkLabel: null,
    },
    {
      key: 'fallback-service-brand-benda',
      name: 'Benda',
      logoUrl: '/images/brands/brands-logo/benda.jpg',
      logoAlt: 'Benda logo',
      motorcycleImageUrl: '/images/brands/motorcycle-images/benda.png',
      motorcycleImageAlt: 'Benda motorcycle',
      overview:
        'Benda is a design-led motorcycle brand from China with a strong focus on cruisers, distinctive silhouettes, and a more expressive riding personality. The brand stands out through bold styling, modern presentation, and motorcycles built for riders who want something less ordinary on the road.',
      keySentences: [
        'Benda bikes deserve careful setup because fit, finish, comfort, and visual details are a big part of the ownership experience.',
        'Their cruiser-oriented character makes drivetrain smoothness, brake feel, tire condition, and ergonomics especially important.',
        'Best for riders who want presence, style, and a motorcycle that feels personal rather than generic.',
      ],
      link: null,
      linkLabel: null,
    },
  ],
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isCompleteBrand(
  brand: SanityServiceBrandItemQueryResult | null
): brand is SanityServiceBrandItemQueryResult & {
  _key: string
  name: string
  logoUrl: string
  logoAlt: string
  motorcycleImageUrl: string
  motorcycleImageAlt: string
  overview: string
  keySentences: string[]
} {
  if (
    !brand ||
    !isNonEmptyString(brand._key) ||
    !isNonEmptyString(brand.name) ||
    !isNonEmptyString(brand.logoUrl) ||
    !isNonEmptyString(brand.logoAlt) ||
    !isNonEmptyString(brand.motorcycleImageUrl) ||
    !isNonEmptyString(brand.motorcycleImageAlt) ||
    !isNonEmptyString(brand.overview) ||
    !Array.isArray(brand.keySentences) ||
    brand.keySentences.length === 0 ||
    !brand.keySentences.every(isNonEmptyString)
  ) {
    return false
  }

  const hasLink = isNonEmptyString(brand.link)
  const hasLinkLabel = isNonEmptyString(brand.linkLabel)

  return hasLink === hasLinkLabel
}

type CompleteSanityServiceBrands = Omit<
  SanityServiceBrandsSectionQueryResult,
  'useSanityContent' | 'sectionTitle' | 'sectionDescription' | 'brands'
> & {
  useSanityContent: true
  sectionTitle: string
  sectionDescription: string
  brands: Array<
    SanityServiceBrandItemQueryResult & {
      _key: string
      name: string
      logoUrl: string
      logoAlt: string
      motorcycleImageUrl: string
      motorcycleImageAlt: string
      overview: string
      keySentences: string[]
    }
  >
}

export function isCompleteSanityServiceBrands(
  value: SanityServiceBrandsSectionQueryResult
): value is CompleteSanityServiceBrands {
  return (
    value.useSanityContent === true &&
    isNonEmptyString(value.sectionTitle) &&
    isNonEmptyString(value.sectionDescription) &&
    Array.isArray(value.brands) &&
    value.brands.length > 0 &&
    value.brands.every(isCompleteBrand)
  )
}

export function selectServiceBrandsContent(
  value: SanityServiceBrandsSectionQueryResult | null | undefined
): ServiceBrandsContent {
  if (!value || !isCompleteSanityServiceBrands(value)) {
    return FALLBACK_SERVICE_BRANDS_CONTENT
  }

  return {
    source: 'sanity',
    sectionTitle: value.sectionTitle,
    sectionDescription: value.sectionDescription,
    brands: value.brands.map((brand) => ({
      key: brand._key,
      name: brand.name,
      logoUrl: brand.logoUrl,
      logoAlt: brand.logoAlt,
      motorcycleImageUrl: brand.motorcycleImageUrl,
      motorcycleImageAlt: brand.motorcycleImageAlt,
      overview: brand.overview,
      keySentences: brand.keySentences,
      link: isNonEmptyString(brand.link) ? brand.link : null,
      linkLabel: isNonEmptyString(brand.linkLabel) ? brand.linkLabel : null,
    })),
  }
}
