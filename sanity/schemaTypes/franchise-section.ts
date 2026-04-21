import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'franchiseSection',
  title: 'Franchise Invitation Section',
  type: 'object',
  fields: [
    defineField({
      name: 'mainTitle',
      title: 'Main heading',
      type: 'string',
      description:
        'Large headline shown in this section. Write it as a normal sentence or phrase.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Short supporting paragraph',
      type: 'text',
      rows: 3,
      description: 'Short paragraph shown under the main heading.',
    }),
    defineField({
      name: 'badge1Text',
      title: 'Top highlight note',
      type: 'text',
      rows: 2,
      description: 'Short note shown in the upper highlight box inside this section.',
    }),
    defineField({
      name: 'badge2Text',
      title: 'Bottom highlight note',
      type: 'text',
      rows: 3,
      description: 'Short note shown in the lower highlight box inside this section.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button text',
      type: 'string',
      description: 'Text shown on the button in this section. Example: Contact Us',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'string',
      description: 'Where the button should go when clicked.',
    }),
    defineField({
      name: 'leftImage',
      title: 'Left photo',
      type: 'image',
      description: 'Photo shown on the left side of this section. A portrait image works best.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'rightImage',
      title: 'Right photo',
      type: 'image',
      description: 'Photo shown on the right side of this section. A portrait image works best.',
      options: {
        hotspot: true,
      },
    }),
  ],
})
