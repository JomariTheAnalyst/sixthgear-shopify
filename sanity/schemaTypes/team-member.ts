import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Full name in uppercase. Example: MARTIE',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Short role label shown in gold text. Example: Lead Technician',
    }),
    defineField({
      name: 'title',
      title: 'Title / Specialization',
      type: 'string',
      description: 'More specific title shown in gray. Example: Workshop Head',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short bio shown on the card. Keep under 180 characters.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description: 'Team member photo. Portrait ratio 4:5 recommended. Face should be centered.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      description: 'Leave any field empty to hide that social icon on the card.',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
        }),
      ],
    }),
  ],
})
