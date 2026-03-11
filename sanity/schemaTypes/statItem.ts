import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'statItem',
  title: 'Stat Item',
  type: 'object',
  fields: [
    defineField({
      name: 'iconImage',
      title: 'Icon Image',
      type: 'image',
      description: 'Upload an icon (SVG or transparent PNG recommended).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
  ],
})
