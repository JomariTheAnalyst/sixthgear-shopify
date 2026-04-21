import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ctaBanner',
  title: 'Final Call to Action Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'preTitle',
      title: 'Small line above the main message',
      type: 'string',
      description: 'Short line shown above the main banner message.',
    }),
    defineField({
      name: 'headline',
      title: 'Main banner message',
      type: 'text',
      rows: 4,
      description:
        'Large text shown in the final homepage banner. You can use line breaks if you want to control where the text wraps.',
    }),
    defineField({
      name: 'headlineHighlight',
      title: 'Words to highlight in orange',
      type: 'string',
      description:
        'Write the exact word or phrase from the main banner message that should appear in orange.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button text',
      type: 'string',
      description: 'Text shown on the button.',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button link',
      type: 'string',
      description: 'Where the button should go when clicked.',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Small text at the bottom',
      type: 'string',
      description: 'Short supporting text shown at the bottom of the banner.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media links',
      type: 'object',
      description:
        'Add the social links shown in the final homepage banner. Leave any field empty to hide that platform.',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram link',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook link',
          type: 'url',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok link',
          type: 'url',
        }),
      ],
    }),
  ],
})
