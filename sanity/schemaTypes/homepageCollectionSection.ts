import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepageCollectionSection',
  title: 'Homepage Collection Rail',
  type: 'object',
  fields: [
    defineField({
      name: 'collectionHandle',
      title: 'Shopify Collection Handle',
      type: 'string',
      description:
        'Exact handle from Shopify admin. Example: helmets, riding-jackets, new-arrivals.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description:
        "Display title shown above the rail on the storefront. Leave blank to use Shopify's collection title.",
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Text',
      type: 'string',
      description:
        'Text shown on the button beside the section title. Example: Shop the Collection. Leave blank to use the default button text.',
    }),
    defineField({
      name: 'enabled',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description:
        'Lower numbers appear first. Use 1, 2, 3 and so on.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
