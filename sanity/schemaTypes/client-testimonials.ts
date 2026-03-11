import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'clientTestimonials',
  title: 'Client Testimonials',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading. Default: What Clients Say',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'string',
      description: 'Subtitle below heading. Default: Trusted Motorcycle Service, Gear & Rider Experience',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'testimonialItem' }],
      description: 'Customer reviews to display in the carousel. Leave empty to show the 10 hardcoded default testimonials. No maximum limit.',
    }),
  ],
})
