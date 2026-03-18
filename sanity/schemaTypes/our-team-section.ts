import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ourTeamSection',
  title: 'Homepage Our Team Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Main heading',
      type: 'string',
      description:
        'The large title shown at the top of the team section. Example: Our Team',
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Small heading under the title',
      type: 'string',
      description:
        'A short supporting line shown below the main heading. Keep this short and easy to read.',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team member cards',
      type: 'array',
      of: [{ type: 'teamMember' }],
      description:
        'Add the team member cards shown in this section. You can drag items to change their order. If left empty, the website will use its built-in default team members.',
    }),
  ],
})
