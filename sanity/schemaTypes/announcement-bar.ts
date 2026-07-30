import { defineField, defineType } from 'sanity'

// Thin strip at the very top of every page.
// Active messages scroll continuously in a marquee.
// Toggle isActive to hide instantly sitewide.
export default defineType({
  name: 'announcementBar',
  title: 'Announcement Bar',
  type: 'object',
  fields: [
    defineField({
      name: 'isActive',
      title: 'Show Announcement Bar',
      type: 'boolean',
      initialValue: false,
      description: 'Master toggle. OFF hides bar from all pages.',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Orange', value: 'orange' },
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
        ],
      },
      initialValue: 'orange',
    }),
    defineField({
      name: 'rotationSpeed',
      title: 'Marquee Pace (seconds per message)',
      type: 'number',
      initialValue: 4,
      description:
        'Approximate seconds each message spends crossing the bar. Default 4.',
      validation: (Rule) => Rule.min(2).max(20),
    }),
    defineField({
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Message Text',
              type: 'string',
              description: 'Keep under 60 characters for mobile.',
              validation: (Rule) => Rule.required().max(60),
            }),
            defineField({
              name: 'link',
              title: 'Link (optional)',
              type: 'string',
              description: 'Internal path. Leave empty for no link.',
            }),
            defineField({
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: 'text', active: 'isActive' },
            prepare({ title, active }) {
              return {
                title: title || 'Untitled message',
                subtitle: active ? '✅ Active' : '❌ Inactive',
              }
            },
          },
        },
      ],
    }),
  ],
})
