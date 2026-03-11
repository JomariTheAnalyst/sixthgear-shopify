import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'serviceBrandsSection',
  title: 'Motorcycle Brands',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading. Default: Motorcycle Brands We Service & Support',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      rows: 2,
      description: 'Subtitle below heading. Default: Experienced in servicing Japanese, American, and European motorcycles with proper tools, care, and attention to detail.',
    }),
    defineField({
      name: 'brands',
      title: 'Brands',
      type: 'array',
      of: [{ type: 'serviceBrandItem' }],
      description: 'Brand logos to display. Leave empty to show the default hardcoded brands. No maximum limit — the grid adjusts automatically.',
    }),
  ],
})
