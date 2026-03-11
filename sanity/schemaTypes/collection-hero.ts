/**
 * One document per collection. The handle field must exactly match
 * the Shopify collection handle e.g. best-sellers, hot-deals, sec-moto.
 * Case sensitive.
 */
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'collectionHero',
  title: 'Collection Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'handle',
      title: 'Collection Handle',
      type: 'slug',
      description:
        'Must match the Shopify collection handle exactly. Go to Shopify Admin, open the collection, copy the handle from the URL. Example: best-sellers',
      options: {
        source: 'heading',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Collection Heading',
      type: 'string',
      description: 'Main title shown in the hero banner',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Badge Text',
      type: 'string',
      description:
        "Optional small pill above the heading. Example: 'Exclusive Drop' or 'New Collection'. Leave empty to hide.",
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'Optional subtitle shown below the heading. Keep it under 160 characters.',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description:
        'Optional background image for the hero. A dark overlay is applied automatically. If left empty a solid dark background is used instead.',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'handle.current',
      media: 'backgroundImage',
    },
  },
})
