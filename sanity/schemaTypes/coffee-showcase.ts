import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'coffeeShowcase',
  title: 'Coffee Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      type: 'text',
      title: 'Main heading',
      rows: 3,
      description: `The large bold title shown above the description. You can write it on two lines by pressing Enter between the lines. Example:

More Than Riding Gear
We Serve Great Coffee Too

Tip: keep each line short so it fits nicely on all screen sizes.`,
    }),
    defineField({
      name: 'coffeeIcon',
      type: 'image',
      title: 'Coffee section icon',
      options: { hotspot: false },
      description:
        'Small icon shown above the heading in this section. If left empty, the website uses the default coffee icon.',
    }),
    defineField({
      name: 'descriptionText',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Main paragraph shown beside the image gallery. Keep it short and easy to read.',
    }),
    defineField({
      name: 'buttonText',
      title: 'Button text',
      type: 'string',
      description: 'Text shown on the button under the description. Example: Explore Our Products',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button link',
      type: 'url',
      description: 'Where the button should go when clicked. You can paste a full URL or use an internal link like /first-gear.',
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),
    defineField({
      name: 'coffeeItems',
      title: 'Gallery photos',
      type: 'array',
      of: [{ type: 'coffeeItem' }],
      description: 'Upload the photos used in the coffee image slider. These are visual gallery images only.',
      validation: (Rule) => Rule.max(8),
    }),
  ],
})
