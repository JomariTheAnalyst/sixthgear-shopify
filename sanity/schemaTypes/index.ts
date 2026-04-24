import { type SchemaTypeDefinition } from 'sanity'

import heroSection from './hero-section'
import homepage from './homepage'
import heroSlide from './heroSlide'
import brandItem from './brandItem'
import statItem from './statItem'
import shopByBrandsSection from './shop-by-brands-section'
import aboutSection from './about-section'
import categoryItem from './categoryItem'
import categoriesSection from './categoriesSection'
import servicesSection from './services-section'
import serviceItem from './serviceItem'
import collectionHero from './collection-hero'
import coffeeItem from './coffee-item'
import coffeeShowcase from './coffee-showcase'
import experienceItem from './experience-item'
import spaceExperiences from './space-experiences'
import serviceBrandItem from './service-brand-item'
import serviceBrandsSection from './service-brands-section'
import customerItem from './customer-item'
import satisfiedCustomers from './satisfied-customers'
import franchiseSection from './franchise-section'
import teamMember from './team-member'
import ourTeamSection from './our-team-section'
import testimonialItem from './testimonial-item'
import clientTestimonials from './client-testimonials'
import storeLocation from './store-location'
import ctaBanner from './cta-banner'
import popupAd from './popup-ad'
import featuredCollection from './featured-collection'
import promoBanner from './promo-banner'
import announcementBar from './announcement-bar'
import marketing from './marketing'
import servicesPage from './services-page'
import aboutPage from './about-page'
import service from './service'
import homepageCollectionSection from './homepageCollectionSection'
import blogPost from './blog-post'
import blogCategory from './blog-category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    heroSection,
    heroSlide,
    brandItem,
    statItem,
    shopByBrandsSection,
    aboutSection,
    categoryItem,
    categoriesSection,
    servicesSection,
    serviceItem,
    collectionHero,
    coffeeItem,
    coffeeShowcase,
    experienceItem,
    spaceExperiences,
    serviceBrandItem,
    serviceBrandsSection,
    customerItem,
    satisfiedCustomers,
    franchiseSection,
    teamMember,
    ourTeamSection,
    testimonialItem,
    clientTestimonials,
    storeLocation,
    ctaBanner,
    popupAd,
    featuredCollection,
    promoBanner,
    announcementBar,
    marketing,
    servicesPage,
    aboutPage,
    service,
    blogPost,
    blogCategory,
    homepageCollectionSection,

    homepage,
  ],
}
