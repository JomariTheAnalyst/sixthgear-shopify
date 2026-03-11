import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'serviceBrandItem',
  title: 'Brand',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
      type: 'string',
      description: 'Brand name shown below the logo e.g. Suzuki, Yamaha',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Brand Logo',
      type: 'image',
      description: 'Upload a PNG with transparent background for best results. Square logos work best.',
      options: {
        hotspot: false,
      },
    }),
    defineField({
      name: 'link',
      title: 'Collection Link',
      type: 'string',
      description: 'Optional URL to the brand collection page. Example: /collections/sec-moto — leave empty if no collection page exists yet.',
    }),
  ],
})
