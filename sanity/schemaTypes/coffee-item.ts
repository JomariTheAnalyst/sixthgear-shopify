import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'coffeeItem',
  title: 'Gallery Photo',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Old drink name field',
      type: 'string',
      description: 'This old field is no longer used on the website.',
      readOnly: true,
      hidden: true,
      deprecated: {
        reason: 'This field is no longer used. The section now works as an image gallery.',
      },
    }),
    defineField({
      name: 'description',
      title: 'Old drink description field',
      type: 'text',
      rows: 2,
      description: 'This old field is no longer used on the website.',
      readOnly: true,
      hidden: true,
      deprecated: {
        reason: 'This field is no longer used. The section now works as an image gallery.',
      },
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description:
        'Upload one image for the coffee gallery slider. Landscape or square images work best for this section.',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image description',
      type: 'string',
      description:
        'Short description of the photo for accessibility. Example: Close-up of roasted coffee beans',
    }),
  ],
})
