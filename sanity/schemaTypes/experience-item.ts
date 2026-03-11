import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'experienceItem',
  title: 'Experience Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Card heading text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short description shown on the card. Keep under 150 characters.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Card photo. Landscape ratio recommended — 16:9 or 4:3.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isEnabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle this item on or off. Currently reserved for future use.',
    }),
  ],
})
