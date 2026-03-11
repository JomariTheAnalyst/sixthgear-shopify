import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'categoryItem',
  title: 'Category Item',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Category Slug',
      type: 'string',
      description: 'Used for the URL link (e.g. "bags-and-luggage")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
