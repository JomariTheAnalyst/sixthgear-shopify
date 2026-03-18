import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'coffeeShowcase',
  title: 'Coffee Showcase',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeading',
      type: 'text',
      title: 'Main Heading',
      rows: 3,
      description: `The large bold title shown above the description. You can write it on two lines - just press Enter between the lines and each line will appear separately on the website. Example:

More Than Riding Gear
We Serve Great Coffee Too

Tip: keep each line short so it fits nicely on all screen sizes.`,
    }),
    defineField({
      name: 'coffeeIcon',
      type: 'image',
      title: 'Coffee Section Icon',
      options: { hotspot: false },
      description: `The small illustrated icon shown above the main heading on the right side of this section. Upload a PNG or SVG file. If you leave this empty the website will automatically use the default coffee icon. Recommended size: at least 200x200 pixels. Use a transparent background.`,
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
      description: 'Text shown on the button under the description. Example: Explore Our Product',
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
      description: 'Upload the photos used in the coffee image slider. These are visual gallery images only. The website does not show drink names or drink descriptions here.',
      validation: (Rule) => Rule.max(8),
    }),
  ],
})
