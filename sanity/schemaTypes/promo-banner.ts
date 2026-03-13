import { defineField, defineType } from 'sanity'

// Full viewport width promotional banner.
// Landscape image with optional heading and button.
// No product grid. Use position to place anywhere on the homepage.
export default defineType({
  name: 'promoBanner',
  title: 'Promo Wide Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'internalName',
      title: 'Internal Name',
      type: 'string',
      description: 'Not shown to visitors. Example: Motorcycle Pants Banner',
    }),
    defineField({
      name: 'position',
      title: 'Homepage Position',
      type: 'string',
      description: 'Where on the homepage this banner appears. If two items share the same position, only the first active one renders.',
      options: {
        layout: 'radio',
        list: [
          { title: 'After Hero', value: 'after_hero' },
          { title: 'After About', value: 'after_about' },
          { title: 'After Categories', value: 'after_categories' },
          { title: 'After Our Services', value: 'after_services' },
          { title: 'After Coffee Showcase', value: 'after_coffee' },
          { title: 'After Projects Section', value: 'after_projects' },
          { title: 'After Brands Section', value: 'after_brands' },
          { title: 'After Satisfied Customers', value: 'after_satisfied' },
          { title: 'After Franchise', value: 'after_franchise' },
          { title: 'After Our Team', value: 'after_team' },
          { title: 'After Testimonials', value: 'after_testimonials' },
        ],
      },
      initialValue: 'after_hero',
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Wide landscape image. Recommended ratio 21:9 or 16:5. Use hotspot to set focal point for mobile cropping.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading (Optional)',
      type: 'string',
      description: 'Large Tanker font text overlaid bottom-left. Leave blank to hide.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label (Optional)',
      type: 'string',
      description: 'Leave blank to hide button entirely.',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'Required if Button Label is set. Example: /store',
    }),
    defineField({
      name: 'buttonPosition',
      title: 'Button Position',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Top Left', value: 'top_left' },
          { title: 'Top Center', value: 'top_center' },
          { title: 'Top Right', value: 'top_right' },
          { title: 'Bottom Left', value: 'bottom_left' },
          { title: 'Bottom Center', value: 'bottom_center' },
          { title: 'Bottom Right', value: 'bottom_right' },
        ],
      },
      initialValue: 'bottom_right',
      description: 'Only applies if Button Label is set.',
    }),
  ],
  preview: {
    select: { title: 'internalName', active: 'isActive', position: 'position' },
    prepare({ title, active, position }) {
      return {
        title: title || 'Untitled Banner',
        subtitle: `${active ? '✅' : '❌'} ${position ?? ''}`,
      }
    },
  },
})
