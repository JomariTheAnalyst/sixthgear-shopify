import { groq } from 'next-sanity'

export const homepageQuery = groq`
  *[_type == "homepage"][0]{
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
        "image": image.asset->url
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
  *[_type == "homepage"][0]{
    coffeeShowcase {
      mainHeadingLine1,
      highlightedWord,
      mainHeadingLine2,
      descriptionText,
      buttonText,
      buttonLink,
      coffeeItems[]{
        name,
        description,
        "imageUrl": image.asset->url
      }
    }
  }
`

export const spaceExperiencesQuery = groq`
  *[_type == "homepage"][0]{
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
  *[_type == "homepage"][0]{
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
  *[_type == "homepage"][0]{
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
  *[_type == "homepage"][0]{
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
  *[_type == "homepage"][0]{
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
  *[_type == "homepage"][0]{
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
  *[_type == "homepage"][0]{
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
  *[_type == "homepage"][0]{
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


