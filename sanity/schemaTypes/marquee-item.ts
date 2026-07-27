import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'marqueeItem',
  title: 'Marquee message',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Message',
      type: 'string',
      description: 'Short promotional message shown between the star icons.',
      validation: (Rule) => Rule.required().max(80),
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare({ title }) {
      return { title: title || 'Untitled marquee message' }
    },
  },
})
