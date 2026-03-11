import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonialItem',
  title: 'Testimonial',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Full name of the customer. Example: Jones Charles',
    }),
    defineField({
      name: 'role',
      title: 'Role or Bike Type',
      type: 'string',
      description: 'Short label shown below the name. Example: Big Bike Owner, Adventure Rider, Daily Rider',
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'The customer review text. Do not include quotation marks — they are added automatically.',
    }),
  ],
})
