import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'coffeeItem',
  title: 'Coffee Item',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Drink Name',
      type: 'string',
      description: 'Name of the coffee drink shown on the card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Short description shown below the drink name. Keep it under 100 characters.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Drink Image',
      type: 'image',
      description: 'Photo of the drink. Use a portrait ratio image — 2:3 works best to match the card design.',
      options: {
        hotspot: true,
      },
    }),
  ],
})
