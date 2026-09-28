import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepageCollectionSection',
  title: 'Homepage Product Row',
  type: 'object',
  fields: [
    defineField({
      name: 'collectionHandle',
      title: 'Shopify collection handle',
      type: 'string',
      description:
        'Exact collection handle from Shopify. Example: helmet, riding-jackets, new-arrivals.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Custom heading for this product row',
      type: 'string',
      description:
        "Optional custom title shown above this product row. Leave blank to use the collection title from Shopify.",
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button text',
      type: 'string',
      description:
        'Text shown on the button beside the heading. Leave blank to use the default button text.',
    }),
    defineField({
      name: 'productLimit',
      title: 'Number of products to show',
      type: 'number',
      description:
        'How many products this row shows (4 to 24). Leave blank to show 12. A "View All" card is added when the collection has more.',
      initialValue: 12,
      validation: (Rule) => Rule.integer().min(4).max(24),
    }),
    defineField({
      name: 'enabled',
      title: 'Show this product row on the homepage',
      type: 'boolean',
      description:
        'Turn this on to show this product row on the homepage.',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description:
        'Lower numbers appear first. Use 1, 2, 3 and so on.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
