import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonialItem',
  title: 'Review Card',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'Name shown at the bottom of the review card. Example: Jones Charles',
    }),
    defineField({
      name: 'role',
      title: 'Short label under the name',
      type: 'string',
      description:
        'A short line shown below the customer name. Example: Big Bike Owner, Adventure Rider, Daily Rider',
    }),
    defineField({
      name: 'quote',
      title: 'Customer review',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description:
        'The review text shown on the card. Do not add quotation marks because the website adds them automatically.',
    }),
  ],
})
