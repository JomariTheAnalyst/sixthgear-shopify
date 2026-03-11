import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'spaceExperiences',
  title: 'Space & Experiences',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading of the section. Default: Our Space & Experiences',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'string',
      description: 'Tagline below the heading. Default: Great Coffee, Good Rides, Better Conversations',
    }),
    defineField({
      name: 'items',
      title: 'Experience Items',
      type: 'array',
      of: [{ type: 'experienceItem' }],
      description: 'Cards to display in this section. Maximum 6 are shown. Leave empty to use the hardcoded default items.',
      validation: (Rule) => Rule.max(8),
    }),
  ],
})
