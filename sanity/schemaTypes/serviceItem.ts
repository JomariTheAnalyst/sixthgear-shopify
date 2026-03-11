import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'serviceItem',
  title: 'Service Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      description: 'Used for links like /services/your-slug when no custom link is provided.',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'Optional explicit link. If empty, the frontend falls back to the slug-based service URL.',
    }),
  ],
})
