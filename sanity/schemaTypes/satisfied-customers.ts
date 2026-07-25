import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'satisfiedCustomers',
  title: 'Customer Photos Section',
  type: 'object',
  validation: (Rule) =>
    Rule.custom((value: any) => {
      if (value?.useSanityContent !== true) return true
      const complete =
        typeof value.sectionTitle === 'string' && value.sectionTitle.trim() &&
        Array.isArray(value.customers) && value.customers.length > 0 &&
        value.customers.every((item: any) =>
          typeof item?.name === 'string' && item.name.trim() && Boolean(item.photo)
        )
      return Boolean(complete) || 'Complete the heading and every customer photo before enabling Sanity content.'
    }),
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
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
