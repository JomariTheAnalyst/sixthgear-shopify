import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'serviceBrandsSection',
  title: 'Motorcycle Brands We Service',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section heading',
      type: 'string',
      description:
        'Main title shown above the brand logos. Example: Motorcycle Brands We Service & Support',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Short supporting text',
      type: 'text',
      rows: 2,
      description:
        'Short paragraph shown under the title. Keep this easy to read and focused on customer trust.',
    }),
    defineField({
      name: 'brands',
      title: 'Brand logos',
      type: 'array',
      of: [{ type: 'serviceBrandItem' }],
      description:
        'Upload the motorcycle brand logos shown in this section. Leave empty if you want the website to use its built-in default logos.',
    }),
  ],
})
