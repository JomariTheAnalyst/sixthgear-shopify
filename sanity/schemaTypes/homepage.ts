import { defineField, defineType } from 'sanity'

// Only one homepage document should ever be created - this is a singleton document.
export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'heroSection',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shopByBrands',
      title: 'Shop by Brands',
      type: 'shopByBrandsSection',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'aboutSection',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories Section',
      type: 'categoriesSection',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coffeeShowcase',
      title: 'Coffee Showcase',
      type: 'coffeeShowcase',
    }),
    defineField({
      name: 'spaceExperiences',
      title: 'Space & Experiences',
      type: 'spaceExperiences',
    }),
    defineField({
      name: 'serviceBrandsSection',
      title: 'Motorcycle Brands',
      type: 'serviceBrandsSection',
    }),
    defineField({
      name: 'satisfiedCustomers',
      title: 'Satisfied Customers',
      type: 'satisfiedCustomers',
    }),
    defineField({
      name: 'services',
      title: 'Services Section',
      type: 'servicesSection',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'franchiseSection',
      title: 'Franchise Section',
      type: 'franchiseSection',
    }),
    defineField({
      name: 'ourTeamSection',
      title: 'Our Team Section',
      type: 'ourTeamSection',
    }),
    defineField({
      name: 'clientTestimonials',
      title: 'Client Testimonials',
      type: 'clientTestimonials',
    }),
    defineField({
      name: 'storeLocation',
      title: 'Store Location',
      type: 'storeLocation',
    }),
    defineField({
      name: 'ctaBanner',
      title: 'CTA Banner',
      type: 'ctaBanner',
    }),
  ],
})
