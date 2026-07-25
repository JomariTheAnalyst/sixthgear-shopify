import { defineType, defineField } from 'sanity'

type CoffeeItemParent = {
  mediaType?: 'image' | 'video'
}

type HomepageDocument = {
  coffeeShowcase?: {
    useSanityContent?: boolean
  }
}

function isVideo(parent: unknown) {
  return (parent as CoffeeItemParent | undefined)?.mediaType === 'video'
}

function sanityCoffeeContentIsEnabled(document: unknown) {
  return (document as HomepageDocument | undefined)?.coffeeShowcase?.useSanityContent === true
}

export default defineType({
  name: 'coffeeItem',
  title: 'Coffee Story',
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
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      initialValue: 'image',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityCoffeeContentIsEnabled(context.document) ||
          value === 'image' ||
          value === 'video' ||
          'Media type is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Image shown for this story. Portrait images work best in the story frame.',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => isVideo(parent),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityCoffeeContentIsEnabled(context.document) ||
          isVideo(context.parent) ||
          Boolean(value) ||
          'Image is required for an image story.'
        ),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      description: 'Video shown for this story. Use a portrait video when possible.',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => !isVideo(parent),
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityCoffeeContentIsEnabled(context.document) ||
          !isVideo(context.parent) ||
          Boolean(value) ||
          'Video is required for a video story.'
        ),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Media description',
      type: 'string',
      description:
        'Short accessibility description of the image or video. Example: Barista preparing coffee for riders.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityCoffeeContentIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Media description is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label shown above the story title.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityCoffeeContentIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Eyebrow is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main title shown over the story media.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityCoffeeContentIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Title is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      description: 'Short paragraph shown below the story title.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityCoffeeContentIsEnabled(context.document) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Caption is required when Sanity content is enabled.'
        ),
    }),
  ],
})
