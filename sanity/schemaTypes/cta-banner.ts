import { defineField, defineType } from 'sanity'

// Controls the CTA banner section at the bottom of the homepage.
// The headline, highlight text, button, pre-title, social links, and footer tagline
// are all managed here. Layout and styling remain hardcoded.

export default defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'preTitle',
      title: 'Pre-Title Text',
      type: 'string',
      description: "Text shown after 'Not sure where to start?' on the same line. Default: Ready to upgrade your ride?",
    }),
    defineField({
      name: 'headline',
      title: 'Main Headline',
      type: 'text',
      rows: 4,
      description: 'The large headline text. Use line breaks for each line. Default: We\'ve got\nthe gear\nwaiting for you.',
    }),
    defineField({
      name: 'headlineHighlight',
      title: 'Highlight Text',
      type: 'string',
      description: 'The exact phrase from the headline to color orange. Example: for you. — This is case-insensitive.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
      description: 'Text for the CTA button. Default: Shop Now',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'URL the button navigates to. Default: /store',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      description: 'Small text at the bottom of the banner. Default: Sixth Gear Moto Supply® is a premium service center. Based in Makati City, Working nationwide.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      description: 'Links shown as text with hover animation. Leave any field empty to hide that platform.',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
        }),
      ],
    }),
  ],
})
