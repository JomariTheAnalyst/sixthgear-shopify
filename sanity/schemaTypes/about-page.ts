import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      description:
        'This controls the large banner at the top of the About page. Use it to update the main heading, supporting text, and background image visitors see first.',
      fields: [
        defineField({
          name: 'title',
          title: 'Page Heading',
          type: 'string',
          description:
            'This is the main headline shown in large text on the About page hero. Keep it short and clear so it stays readable over the image.',
        }),
        defineField({
          name: 'description',
          title: 'Short Description',
          type: 'text',
          rows: 3,
          description:
            'This short paragraph appears below the page heading in the hero banner. Keep it concise so it remains easy to read on mobile and desktop.',
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          description:
            'This image fills the hero banner behind the text on the About page. Use a wide landscape image, ideally at least 2000 x 1200 pixels, and leave enough darker space for the text to stay readable. If you leave this empty, the website will use its built-in fallback image.',
        }),
      ],
    }),
    defineField({
      name: 'story',
      title: 'Our Story',
      type: 'array',
      description:
        'The story cards shown in the Our Story section. Each card has a heading, text, and photo. Drag to reorder.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'The bold title for this story card.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body Text',
              type: 'text',
              rows: 4,
              description: 'The main paragraph. 2-3 sentences works best.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              description:
                'The image shown beside the text. Landscape format recommended.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imageAlt',
              title: 'Image Description',
              type: 'string',
              description:
                'A short description of the photo for accessibility. Example: Sixthgear workshop with mechanics working on a motorcycle.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'body',
              media: 'image',
            },
          },
        },
      ],
    }),
  ],
})
