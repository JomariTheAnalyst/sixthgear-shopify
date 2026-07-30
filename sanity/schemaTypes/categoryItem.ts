import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'categoryItem',
  title: 'Category Card',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Category name',
      type: 'string',
      description:
        'Name shown on the card. Example: Helmets or Riding Gear',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Backup category link value',
      type: 'string',
      description:
        'Older fallback value used only if the button link below is left empty. If you are not sure, leave the existing value as it is.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Category product image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Main product image shown on the right side of the card.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image description',
      type: 'string',
      description:
        'Short description of the image for accessibility. Example: Black full-face motorcycle helmet',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button text',
      type: 'string',
      description:
        'Text shown on the button inside this card. Example: Shop Now',
      initialValue: 'Shop Now',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button link',
      type: 'string',
      description:
        'Where the button should go when clicked. Most of the time this should be the matching Shopify collection page. Example: /collections/helmet',
    }),
  ],
})
