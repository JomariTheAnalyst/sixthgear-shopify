import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member Card',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Team member name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'Name shown on the card. Example: MARTIE or Sarah Cruz',
    }),
    defineField({
      name: 'role',
      title: 'Main role',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description:
        'Main job role shown under the name. Example: Lead Technician, Service Advisor, Lead Barista',
    }),
    defineField({
      name: 'title',
      title: 'Second line under the role',
      type: 'string',
      description:
        'Optional extra line for a more specific job title or specialization. Example: Workshop Head',
    }),
    defineField({
      name: 'description',
      title: 'Short introduction',
      type: 'text',
      rows: 3,
      description:
        'Short description shown on the card. Keep this brief so it stays easy to read.',
    }),
    defineField({
      name: 'photo',
      title: 'Team member photo',
      type: 'image',
      description:
        'Portrait photo shown on the card. Use a clear photo of the person. A vertical image works best.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media links',
      type: 'object',
      description:
        'Optional. These links are not shown in the current homepage team card design, but they can be kept here for future use.',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook link',
          type: 'url',
          description: 'Paste the full Facebook profile or page link.',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram link',
          type: 'url',
          description: 'Paste the full Instagram profile link.',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok link',
          type: 'url',
          description: 'Paste the full TikTok profile link.',
        }),
      ],
    }),
  ],
})
