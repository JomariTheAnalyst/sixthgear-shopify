import { defineType, defineField } from 'sanity'

// Controls the First Gear Coffee section on the homepage. The heading is split into three parts because each part renders in a different color — orange, white, and amber.
export default defineType({
  name: 'coffeeShowcase',
  title: 'Coffee Showcase',
  type: 'object',
  fields: [
    defineField({
      name: 'mainHeadingLine1',
      title: 'Heading — Part 1 (Orange)',
      type: 'string',
      description: 'Renders in orange. Default: Sixthgear',
    }),
    defineField({
      name: 'highlightedWord',
      title: 'Heading — Part 2 (White)',
      type: 'string',
      description: 'Renders in white immediately after Part 1 on the same line. Default: fuels more than rides.',
    }),
    defineField({
      name: 'mainHeadingLine2',
      title: 'Heading — Part 3 (Amber)',
      type: 'string',
      description: 'Renders in amber on the second line. Default: We serve coffee too.',
    }),
    defineField({
      name: 'descriptionText',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Paragraph shown below the drink cards. Keep it under 200 characters.',
    }),
    defineField({
      name: 'buttonText',
      title: 'CTA Button Label',
      type: 'string',
      description: 'Text on the button. Only shown when there are 6 or fewer drinks. Default: View Full Menu',
    }),
    defineField({
      name: 'buttonLink',
      title: 'CTA Button Link',
      type: 'url',
      description: 'Where the button links to. Default: /menu — note: for internal links like /menu you can type the path directly.',
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: 'coffeeItems',
      title: 'Coffee Drinks',
      type: 'array',
      of: [{ type: 'coffeeItem' }],
      description: 'Featured drinks to display. Maximum 6 are shown. Leave empty to use the default hardcoded drinks.',
      validation: (Rule) => Rule.max(8),
    }),
  ],
})
