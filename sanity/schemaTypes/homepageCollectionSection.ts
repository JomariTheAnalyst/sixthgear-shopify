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
        'Exact collection handle from Shopify. Example: helmets, riding-jackets, new-arrivals.',
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
