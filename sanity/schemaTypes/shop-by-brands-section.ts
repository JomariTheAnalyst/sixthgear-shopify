import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopByBrandsSection',
  title: 'Shop by Brands Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomShopByBrands',
      title: 'Use CMS Shop by Brands',
      type: 'boolean',
      description: 'If disabled, the site must render the FALLBACK data entirely.',
      initialValue: true,
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showNavDesktop',
      title: 'Show Desktop Navigation Arrows',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'brands',
      title: 'Brands Array',
      type: 'array',
      of: [{ type: 'brandItem' }],
      description: 'Add your brands here. Drag to reorder.',
    }),
    defineField({
      name: 'stats',
      title: 'Stats Array',
      type: 'array',
      of: [{ type: 'statItem' }],
      description: 'Add your stat items displayed under the brands here.',
    }),
  ],
})
