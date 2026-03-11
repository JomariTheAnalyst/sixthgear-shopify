import { defineType, defineField } from 'sanity'

// Controls the polaroid marquee section.
// All customer photos are managed in one list — the first half automatically goes 
// to row 1 scrolling left, the second half goes to row 2 scrolling right. Add an 
// even number of photos for balanced rows.
export default defineType({
  name: 'satisfiedCustomers',
  title: 'Satisfied Customers',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Heading text. Default: Sixthgear Satisfied Customers',
    }),
    defineField({
      name: 'customers',
      title: 'Customer Photos',
      type: 'array',
      of: [{ type: 'customerItem' }],
      description: 'All customer photos in one list. They are split evenly into two marquee rows automatically. Add photos in multiples of 2 for best results. Minimum 6 recommended per row — at least 12 total.',
    }),
  ],
})
