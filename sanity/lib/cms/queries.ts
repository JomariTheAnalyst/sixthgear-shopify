import { groq } from 'next-sanity'

export const homepageQuery = groq`
  *[_type == "homepage"][0]{
    hero {
      trustBadge,
      heading,
      description,
      primaryLabel,
      primaryLink,
      secondaryLabel,
      secondaryLink,
      "imageUrl": image.asset->url,
      imageAlt
    }
  }
`

export const collectionHeroQuery = groq`
  *[_type == "collectionHero" && handle.current == $handle][0]{
    "handle": handle.current,
    heading,
    badge,
    description,
    "backgroundImageUrl": backgroundImage.asset->url
  }
`
