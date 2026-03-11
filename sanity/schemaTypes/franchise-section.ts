import { defineType, defineField } from 'sanity'

// Controls the Franchise homepage section.
// All hover animations, image rotations,
// and the gear SVG are hardcoded in the
// frontend and cannot be changed here.
// Only text content, images, and links
// are managed via this document.
export default defineType({
  name: 'franchiseSection',
  title: 'Franchise Section',
  type: 'object',
  fields: [
    defineField({
      name: 'mainTitle',
      title: 'Main Title',
      type: 'string',
      description: 'Large animated heading. Default: Become A Franchise Partner. Note: line breaks are handled automatically by the component — just write the full title as one line.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      description: 'Paragraph below the title. Default: Become a franchise partner and offer your customers premium motorcycle gear, services, and great coffee at the highest level.',
    }),
    defineField({
      name: 'badge1Text',
      title: 'Orange Badge Text',
      type: 'text',
      rows: 2,
      description: 'Text on the orange badge top right. Appears on hover. Default: Do you dream of opening your own moto shop and café?',
    }),
    defineField({
      name: 'badge2Text',
      title: 'Yellow Badge Text',
      type: 'text',
      rows: 3,
      description: 'Text on the yellow badge bottom left. Appears on hover. Default: With Sixthgear, you have the opportunity to become part of an innovative brand.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      description: 'Text on the button. Default: Contact us',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      description: 'Where the button links to. Default: /contact — update this to /franchise once that page is built.',
    }),
    defineField({
      name: 'leftImage',
      title: 'Left Image',
      type: 'image',
      description: 'Photo that appears tilted on the left side on hover. Portrait ratio 4:5 recommended.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'rightImage',
      title: 'Right Image',
      type: 'image',
      description: 'Photo that appears tilted on the right side on hover. Portrait ratio 4:5 recommended.',
      options: {
        hotspot: true,
      },
    }),
  ],
})
