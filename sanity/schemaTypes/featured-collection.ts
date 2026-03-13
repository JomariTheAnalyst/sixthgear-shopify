import { defineField, defineType } from 'sanity'

// One featured collection campaign.
// Full-height image on one side, 4 products from Shopify on the other.
// Use position to place anywhere on the homepage.
// Toggle isActive to show or hide.
// Use layout to place image left or right.
export default defineType({
  name: 'featuredCollection',
  title: 'Featured Collection Item',
  type: 'object',
  fields: [
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle ON to show. Toggle OFF to hide without deleting.',
    }),
    defineField({
      name: 'internalName',
      title: 'Internal Name',
      type: 'string',
      description: 'Not shown to visitors. Example: SEC Moto Drop, Best Sellers Week',
    }),
    defineField({
      name: 'position',
      title: 'Homepage Position',
      type: 'string',
      description: 'Where on the homepage this banner appears. If two items share the same position, only the first active one in the list renders.',
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
      initialValue: 'after_brands',
    }),
    defineField({
      name: 'layout',
      title: 'Image Position',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Image Left — Products Right', value: 'image_left' },
          { title: 'Image Right — Products Left', value: 'image_right' },
        ],
      },
      initialValue: 'image_left',
      description: 'On mobile, image is always on top regardless of this setting.',
    }),
    defineField({
      name: 'contentPosition',
      title: 'Text & Button Position',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Bottom Left', value: 'bottom-left' },
          { title: 'Bottom Center', value: 'bottom-center' },
          { title: 'Bottom Right', value: 'bottom-right' },
        ],
      },
      initialValue: 'bottom-left',
      description: 'Where the heading, subtext, and button are positioned on the banner image.',
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Portrait or square recommended. Fills full panel height. Nothing cropped.',
    }),
    defineField({
      name: 'collectionHandle',
      title: 'Shopify Collection Handle',
      type: 'string',
      description: 'Exact handle from Shopify Admin → Collections. Examples: sec-moto, best-sellers',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Text overlaid on the image.',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtext',
      type: 'string',
      description: 'Optional supporting line. Under 80 characters.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button Label',
      type: 'string',
      description: 'Defaults to View Collection if empty.',
    }),
  ],
  preview: {
    select: { title: 'internalName', active: 'isActive', position: 'position', layout: 'layout' },
    prepare({ title, active, position, layout }) {
      const dir = layout === 'image_right' ? '→ IMG' : 'IMG ←'
      return {
        title: title || 'Untitled Campaign',
        subtitle: `${active ? '✅' : '❌'} ${position ?? ''} ${dir}`,
      }
    },
  },
})
