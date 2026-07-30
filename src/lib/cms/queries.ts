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
    localContent[]{heading, body},
    internalLinks[]{label, href},
    faqItems[]{question, answer},
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
        _key,
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
    marquee {
      useSanityContent,
      items[]{
        _key,
        text
      }
    },
    shopByBrands {
      useCustomShopByBrands,
      sectionTitle,
      showNavDesktop,
      brands[]{
        _key,
        name,
        "imageUrl": image.asset->url,
        imageAlt,
        link,
        buttonText
      },
      stats[]{
        _key,
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
        _key,
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
    },
    whatWeOffer {
      useSanityContent,
      sectionName,
      heading,
      "cards": cards[]{
        _key,
        title,
        "backgroundImageUrl": backgroundImage.asset->url,
        imageAlt,
        linkUrl,
        buttonText
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
      useSanityContent,
      sectionHeading,
      "coffeeIconUrl": coffeeIcon.asset->url,
      descriptionText,
      "storyProfileLogoUrl": storyProfileLogo.asset->url,
      storyProfileName,
      storyProfileSubtitle,
      buttonText,
      buttonLink,
      coffeeItems[]{
        _key,
        "mediaType": coalesce(mediaType, "image"),
        "imageUrl": image.asset->url,
        "videoUrl": video.asset->url,
        imageAlt,
        eyebrow,
        title,
        caption
      }
    }
  }
`

export const serviceBrandsSectionQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    serviceBrandsSection {
      useSanityContent,
      sectionTitle,
      sectionDescription,
      brands[]{
        _key,
        name,
        link,
        linkLabel,
        "logoUrl": logo.asset->url,
        logoAlt,
        "motorcycleImageUrl": motorcycleImage.asset->url,
        motorcycleImageAlt,
        overview,
        keySentences
      }
    }
  }
`

export const satisfiedCustomersQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    satisfiedCustomers {
      useSanityContent,
      sectionTitle,
      customers[]{
        _key,
        name,
        "photoUrl": photo.asset->url
      }
    }
  }
`

export const franchiseSectionQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    franchiseSection {
      useSanityContent,
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
      useSanityContent,
      sectionTitle,
      sectionDescription,
      teamMembers[]{
        _key,
        name,
        role,
        title,
        description,
        "photoUrl": photo.asset->url,
        imageAlt
      }
    }
  }
`

export const clientTestimonialsQuery = groq`
  *[_type == "homepage" && _id == "homepage"][0]{
    clientTestimonials {
      useSanityContent,
      sectionTitle,
      sectionDescription,
      testimonials[]{
        _key,
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
      useSanityContent,
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
      useSanityContent,
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
        _key,
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
      _key,
      isActive,
      internalName,
      position,
      startDate,
      endDate,
      layout,
      contentPosition,
      collectionHandle,
      heading,
      subtext,
      ctaLabel,
      ctaLink,
      bannerImageAlt,
      "bannerImageUrl": bannerImage.asset->url
    }, []),
    "promoBanners": coalesce(promoBanners[] {
      _key,
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
      useSanityContent,
      title,
      shortTitle,
      description,
      "heroImageUrl": heroImage.asset->url,
      heroImageAlt,
      "imageUrl": image.asset->url
    },
    expertiseStats {
      useSanityContent,
      sectionHeading,
      sectionDescription,
      "highlights": highlights[]{
        _key,
        title,
        description
      },
      assistance {
        heading,
        description,
        buttonText,
        buttonLink
      },
      "backgroundImageUrl": backgroundImage.asset->url,
      backgroundImageAlt
    },
    brandsWeService {
      useSanityContent,
      sectionHeading,
      "brands": brands[] {
        _key,
        name,
        "logoUrl": logo.asset->url,
        logoAlt
      }
    },
    servicesGrid {
      useSanityContent,
      sectionHeading,
      useCustomServices,
      "featuredServices": featuredServices[]{
        _key,
        "service": @->{
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
    },
    processOfWork {
      useSanityContent,
      sectionHeading,
      "steps": steps[]{
        _key,
        number,
        title,
        description
      }
    },
    servicesGallery {
      useSanityContent,
      heading,
      description,
      profileName,
      profileSubtitle,
      "profileLogoUrl": profileLogo.asset->url,
      profileLogoAlt,
      buttonText,
      "items": items[]{
        _key,
        mediaType,
        "mediaUrl": select(
          mediaType == "video" => coalesce(video.asset->url, externalUrl),
          mediaType == "image" => coalesce(image.asset->url, externalUrl)
        ),
        label
      }
    },
    ctaBanner {
      useSanityContent,
      preTitle,
      headline,
      headlineHighlight,
      buttonLabel,
      buttonLink,
      footerTagline,
      socialLinks
    }
  }
`

export const aboutPageQuery = groq`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    hero {
      useSanityContent,
      title,
      description,
      "backgroundImageUrl": backgroundImage.asset->url,
      backgroundImageAlt
    },
    ourStory {
      useSanityContent,
      "items": items[]{
        _key,
        heading,
        body,
        "imageUrl": image.asset->url,
        imageAlt
      }
    },
    ourSpaceExperience {
      useSanityContent,
      sectionTitle,
      sectionDescription,
      "items": items[]{
        _key,
        title,
        description,
        "imageUrl": image.asset->url,
        imageAlt
      }
    },
    ourValues {
      useSanityContent,
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
      useSanityContent,
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
      useSanityContent,
      quoteText,
      highlightedPhrase,
      ceoName,
      ceoTitle,
      "ceoPhotoUrl": ceoPhoto.asset->url,
      ceoPhotoDescription
    },
    ctaBanner {
      useSanityContent,
      preTitle,
      headline,
      headlineHighlight,
      buttonLabel,
      buttonLink,
      footerTagline,
      socialLinks
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
