import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'servicesSection',
  title: 'Services Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useCustomServices',
      title: 'Use CMS Services Section',
      type: 'boolean',
      description: 'If disabled, the site renders the hardcoded fallback services section.',
      initialValue: true,
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'string',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'serviceItem' }],
      description: 'Editors can add, remove, and reorder service cards here.',
    }),
  ],
})
