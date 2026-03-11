import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ourTeamSection',
  title: 'Our Team',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Heading text. Default: Our Team',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'string',
      description: 'Subtitle below heading. Default: Riders, Technicians, and Professionals Who Care About Your Bike',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{ type: 'teamMember' }],
      description: 'Team member cards to display. Leave empty to use the 3 hardcoded default members. Desktop always shows 3 per row.',
    }),
  ],
})
