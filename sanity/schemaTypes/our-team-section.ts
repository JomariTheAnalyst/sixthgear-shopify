import { defineType, defineField } from 'sanity'

type OurTeamSectionParent = {
  useSanityContent?: boolean
}

function sanityContentIsEnabled(parent: unknown) {
  return (parent as OurTeamSectionParent | undefined)?.useSanityContent === true
}

export default defineType({
  name: 'ourTeamSection',
  title: 'Meet the Team Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to use this complete team section. Turn off to use the website’s built-in team.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Main heading',
      type: 'string',
      description:
        'The large title shown at the top of the team section. Example: Our Team',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Main heading is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'sectionDescription',
      title: 'Short supporting text',
      type: 'string',
      description:
        'A short supporting line shown below the main heading. Keep this short and easy to read.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Supporting text is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team member cards',
      type: 'array',
      of: [{ type: 'teamMember' }],
      description:
        'Add the team member cards shown in this section. Drag items to change their order.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (Array.isArray(value) && value.length > 0) ||
          'Add at least one team member when Sanity content is enabled.'
        ),
    }),
  ],
})
