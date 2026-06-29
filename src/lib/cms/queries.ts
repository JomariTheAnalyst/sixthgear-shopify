import { groq } from 'next-sanity'

export const allServicesQuery = groq`
  *[_type == "service"] | order(displayOrder asc) {
    _id,
    title,
    "slug": slug.current,
    icon,
    shortDescription,
    seoTitle,
    seoDescription,
    displayOrder,
    "heroImageUrl": heroImage.asset->url,
    "socialImageUrl": socialImage.asset->url
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    icon,
    shortDescription,
    fullDescription,
    "heroImageUrl": heroImage.asset->url,
    seoTitle,
    seoDescription,
    "socialImageUrl": socialImage.asset->url,
    features[]{text},
    ctaLabel,
    ctaLink,
    displayOrder
  }
`

export const homepageQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    hero {
      useCustomHero,
      heading,
      description,
      primaryLabel,
      primaryLink,
      secondaryLabel,
      secondaryLink,
      slides[]{
        "imageUrl": image.asset->url,
        "hotspot": image.hotspot,
        "mobileImageUrl": mobileImage.asset->url,
        "mobileImageRef": mobileImage.asset->_ref,
        "mobileCrop": mobileImage.crop,
        "mobileHotspot": mobileImage.hotspot,
        imageAlt,
        contentAlignment
      }
    },
    shopByBrands {
      useCustomShopByBrands,
      sectionTitle,
      showNavDesktop,
      brands[]{
        name,
        "imageUrl": image.asset->url,
        imageAlt,
        link,
        buttonText
      },
      stats[]{
        "iconUrl": iconImage.asset->url,
        title,
        description
      }
    },
    about {
      useCustomAbout,
      kicker,
      title,
      description,
      highlights,
      primaryCta,
      "imageTop": imageTop.asset->url,
      "imageBottom": imageBottom.asset->url,
      videoUrl
    },
    categories {
      useCustomCategories,
      title,
      watermarkText,
      viewAllLabel,
      viewAllLink,
      items[]{
        name,
        slug,
        "image": image.asset->url,
        imageAlt,
        buttonLabel,
        buttonLink
      }
    },
    services {
      useCustomServices,
      sectionTitle,
      sectionDescription,
      services[]{
        _key,
        title,
        description,
        "image": image.asset->url,
        slug,
        link
      }
    }
  }
`

export const homepageCollectionSectionsQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0].productCollectionSections[]{
    collectionHandle,
    sectionTitle,
    buttonLabel,
    enabled,
    displayOrder
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

export const coffeeShowcaseQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    coffeeShowcase {
      sectionHeading,
      "coffeeIconUrl": coffeeIcon.asset->url,
      descriptionText,
      buttonText,
      buttonLink,
      coffeeItems[]{
        "imageUrl": image.asset->url,
        imageAlt
      }
    }
  }
`

export const spaceExperiencesQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    spaceExperiences {
      sectionTitle,
      sectionDescription,
      items[]{
        title,
        description,
        isEnabled,
        "imageUrl": image.asset->url
      }
    }
  }
`

export const serviceBrandsSectionQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    serviceBrandsSection {
      sectionTitle,
      sectionDescription,
      brands[]{
        name,
        link,
        "logoUrl": logo.asset->url
      }
    }
  }
`

export const satisfiedCustomersQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    satisfiedCustomers {
      sectionTitle,
      customers[]{
        name,
        "photoUrl": photo.asset->url
      }
    }
  }
`

export const franchiseSectionQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    franchiseSection {
      mainTitle,
      subtitle,
      badge1Text,
      badge2Text,
      ctaLabel,
      ctaLink,
      "leftImageUrl": leftImage.asset->url,
      "rightImageUrl": rightImage.asset->url
    }
  }
`

export const ourTeamSectionQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    ourTeamSection {
      sectionTitle,
      sectionDescription,
      teamMembers[]{
        name,
        role,
        title,
        description,
        "photoUrl": photo.asset->url,
        socialLinks {
          facebook,
          instagram,
          tiktok
        }
      }
    }
  }
`

export const clientTestimonialsQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    clientTestimonials {
      sectionTitle,
      sectionDescription,
      testimonials[]{
        name,
        role,
        quote
      }
    }
  }
`

export const storeLocationQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    storeLocation {
      storeName,
      address,
      phone,
      hours,
      googleMapsUrl
    }
  }
`

export const ctaBannerQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    ctaBanner {
      preTitle,
      headline,
      headlineHighlight,
      buttonLabel,
      buttonLink,
      footerTagline,
      socialLinks {
        instagram,
        facebook,
        tiktok
      }
    }
  }
`

export const marketingQuery = groq`
  *[_type == "marketing" && _id == "marketing"][0]{
    announcementBar {
      isActive,
      backgroundColor,
      rotationSpeed,
      messages[] {
        text,
        link,
        isActive
      }
    },
    "activePopup": activePopup->{
      _id,
      campaignName,
      enabled,
      startDate,
      endDate,
      "imageUrl": image.asset->url,
      "imageDimensions": image.asset->metadata.dimensions{
        width,
        height,
        aspectRatio
      },
      imageLink,
      heading,
      buttonLabel,
      buttonLink,
      delay
    },
    "featuredCollections": coalesce(featuredCollections[] {
      isActive,
      internalName,
      position,
      layout,
      contentPosition,
      collectionHandle,
      heading,
      subtext,
      ctaLabel,
      "bannerImageUrl": bannerImage.asset->url
    }, []),
    "promoBanners": coalesce(promoBanners[] {
      isActive,
      internalName,
      position,
      heading,
      buttonLabel,
      buttonLink,
      buttonPosition,
      "imageUrl": image.asset->url
    }, [])
  }
`

export const servicesPageQuery = groq`
  *[_type == "servicesPage" && _id == "servicesPage"][0]{
    hero {
      title,
      shortTitle,
      description,
      "heroImageUrl": heroImage.asset->url,
      "imageUrl": image.asset->url
    },
    expertiseStats {
      sectionHeading,
      sectionDescription,
      buttonText,
      buttonLink,
      stats[] {
        number,
        label
      }
    },
    brandsWeService {
      sectionHeading,
      brands[] {
        name,
        "logoUrl": logo.asset->url
      }
    },
    servicesGrid {
      sectionHeading,
      useCustomServices,
      "featuredServices": featuredServices[]->{
        _id,
        title,
        "slug": slug.current,
        icon,
        shortDescription,
        seoTitle,
        seoDescription,
        displayOrder,
        "heroImageUrl": heroImage.asset->url,
        "socialImageUrl": socialImage.asset->url
      }
    }
  }
`

export const aboutPageQuery = groq`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    hero {
      title,
      description,
      "backgroundImageUrl": backgroundImage.asset->url
    },
    "story": story[]{
      _key,
      heading,
      body,
      "imageUrl": image.asset->url,
      imageAlt
    },
    whatWeOffer {
      sectionName,
      heading,
      "cards": cards[]{
        _key,
        title,
        "backgroundImageUrl": backgroundImage.asset->url,
        linkUrl,
        buttonText
      }
    },
    ourValues {
      heading,
      description,
      "cards": cards[]{
        _key,
        title,
        description,
        icon
      }
    },
    whyChooseUs {
      sectionLabel,
      heading,
      subtitle,
      "items": items[]{
        _key,
        title,
        description,
        icon
      },
      "topImageUrl": topImage.asset->url,
      topImageAlt,
      "bottomImageUrl": bottomImage.asset->url,
      bottomImageAlt
    },
    ceoQuote {
      quoteText,
      highlightedPhrase,
      ceoName,
      ceoTitle,
      "ceoPhotoUrl": ceoPhoto.asset->url,
      ceoPhotoDescription
    }
  }
`

const blogPostListProjection = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  authorName,
  featured,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "socialImageUrl": socialImage.asset->url,
  "category": category->{
    title,
    "slug": slug.current,
    description
  },
  tags
`

export const latestBlogPostsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc)[0...12]{
    ${blogPostListProjection}
  }
`

export const homepageBlogPostsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt)]
  | order(featured desc, publishedAt desc)[0...6]{
    ${blogPostListProjection}
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && defined(publishedAt)][0]{
    ${blogPostListProjection},
    seoTitle,
    seoDescription,
    body[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url
      }
    }
  }
`

export const blogCategoriesQuery = groq`
  *[_type == "blogCategory" && defined(slug.current)]
  | order(title asc){
    title,
    "slug": slug.current,
    description
  }
`
