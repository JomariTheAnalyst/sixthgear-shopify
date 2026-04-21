import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'satisfiedCustomers',
  title: 'Customer Photos Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section heading',
      type: 'string',
      description:
        'Main title shown above the moving customer photo rows.',
    }),
    defineField({
      name: 'customers',
      title: 'Customer photos',
      type: 'array',
      of: [{ type: 'customerItem' }],
      description:
        'Add all customer photos here. The website automatically splits them into two moving rows. For the best result, add an even number of photos.',
    }),
  ],
})
