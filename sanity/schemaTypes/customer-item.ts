import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'customerItem',
  title: 'Customer Photo',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer Name or Label',
      type: 'string',
      initialValue: 'Sixth Gear Rider',
      description: 'Label shown below the polaroid photo. Default is Sixth Gear Rider.',
    }),
    defineField({
      name: 'photo',
      title: 'Customer Photo',
      type: 'image',
      description: 'Customer photo shown in the polaroid frame. Portrait or square photos work best.',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
