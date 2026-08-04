import { defineField, defineType } from 'sanity'

// Only one homepage document should ever be created - this is a singleton document.
export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Homepage Settings',
        subtitle: 'Edit the sections and content shown on the homepage',
      }
    },
  },
  fields: [
    defineField({
      name: 'hero',
      title: 'First Section of Homepage - Main Banner',
      type: 'heroSection',
      description:
        'This controls the very first banner area people see when they open the homepage.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'marquee',
      title: 'Scrolling Marquee Below Main Banner',
      type: 'marqueeSection',
      description: 'Controls the orange promotional message strip directly below the homepage hero.',
    }),
    defineField({
      name: 'shopByBrands',
      title: 'Brands Section on Homepage - 2nd section',
      type: 'shopByBrandsSection',
      description:
        'This section highlights motorcycle brands and appears near the top of the homepage.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoFeature',
      title: 'Featured Video on Homepage - 3rd section',
      type: 'videoFeatureSection',
      description:
        'Controls the video player below the brands marquee, including its media source, copy, and call to action.',
    }),
    defineField({
      name: 'about',
      title: 'About Section on Homepage - 4th section',
      type: 'aboutSection',
      description:
        'This section introduces the brand, workshop, and what customers can expect from SixthGear.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Product Categories Section on Homepage - 5th section',
      type: 'categoriesSection',
      description:
        'This section shows the main shopping categories that help people jump into the store quickly.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productCollectionSections',
      title: 'Product Rows on Homepage - 6th section',
      type: 'array',
      of: [{ type: 'homepageCollectionSection' }],
      description:
        'Choose which Shopify collections should appear as product rows on the homepage, and arrange the order they appear in.',
    }),
    defineField({
      name: 'coffeeShowcase',
      title: 'Coffee Section on Homepage - 7th section',
      type: 'coffeeShowcase',
      description:
        'This section highlights the coffee side of the business and appears in the middle of the homepage.',
    }),

    defineField({
      name: 'services',
      title: 'Motorcycle Services Section on Homepage - 8th section',
      type: 'servicesSection',
      description:
        'This section promotes the services offered by the workshop and service center.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'whatWeOffer',
      title: 'What We Offer - 9th section',
      type: 'whatWeOfferSection',
      description:
        'Controls the What We Offer carousel on the homepage. Turn off its source toggle to keep the complete built-in fallback visible.',
    }),

    defineField({
      name: 'serviceBrandsSection',
      title: 'Motorcycle Brands We Service - 10th section',
      type: 'serviceBrandsSection',
      description:
        'This section shows the motorcycle brands the workshop supports and services.',
    }),

    
    defineField({
      name: 'satisfiedCustomers',
      title: 'Customer Photos Section - 11th section',
      type: 'satisfiedCustomers',
      description:
        'This section shows customer photos in the moving photo strip on the homepage.',
    }),
   
    defineField({
      name: 'franchiseSection',
      title: 'Franchise Invitation Section - 12th section',
      type: 'franchiseSection',
      description:
        'This section invites interested partners to inquire about franchise opportunities.',
    }),
    defineField({
      name: 'ourTeamSection',
      title: 'Meet the Team Section - 13th section',
      type: 'ourTeamSection',
      description:
        'This section introduces team members and appears lower on the homepage.',
    }),
    defineField({
      name: 'clientTestimonials',
      title: 'Customer Reviews Section - 14th section',
      type: 'clientTestimonials',
      description:
        'This section shows customer reviews and testimonials on the homepage.',
    }),
    defineField({
      name: 'storeLocation',
      title: 'Store Location and Contact Section - 15th section',
      type: 'storeLocation',
      description:
        'This section shows the store name, address, hours, and directions button.',
    }),
    defineField({
      name: 'ctaBanner',
      title: 'Final Call to Action Banner - 16th section',
      type: 'ctaBanner',
      description:
        'This is the final banner near the bottom of the homepage that encourages people to keep shopping.',
    }),
  ],
})
