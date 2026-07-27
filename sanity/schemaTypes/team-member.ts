import { defineField, defineType } from 'sanity'

type HomepageDocument = {
  ourTeamSection?: {
    useSanityContent?: boolean
  }
}

function sanityOurTeamIsEnabled(document: unknown) {
  return (document as HomepageDocument | undefined)?.ourTeamSection?.useSanityContent === true
}

function requiredTextWhenEnabled(message: string) {
  return (value: unknown, context: { document?: unknown }) =>
    !sanityOurTeamIsEnabled(context.document) ||
    (typeof value === 'string' && value.trim().length > 0) ||
    message
}

export default defineType({
  name: 'teamMember',
  title: 'Team Member Card',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Team member name',
      type: 'string',
      description: 'Name shown on the card. Example: MARTIE or Sarah Cruz.',
      validation: (Rule) =>
        Rule.custom(requiredTextWhenEnabled('Name is required when Sanity content is enabled.')),
    }),
    defineField({
      name: 'role',
      title: 'Main role',
      type: 'string',
      description: 'Main job role shown under the name. Example: Lead Technician.',
      validation: (Rule) =>
        Rule.custom(requiredTextWhenEnabled('Role is required when Sanity content is enabled.')),
    }),
    defineField({
      name: 'title',
      title: 'Specialization',
      type: 'string',
      description: 'Specific job title or specialization shown below the main role.',
      validation: (Rule) =>
        Rule.custom(
          requiredTextWhenEnabled('Specialization is required when Sanity content is enabled.')
        ),
    }),
    defineField({
      name: 'description',
      title: 'Short introduction',
      type: 'text',
      rows: 3,
      description: 'Brief introduction shown at the bottom of the card.',
      validation: (Rule) =>
        Rule.custom(
          requiredTextWhenEnabled('Introduction is required when Sanity content is enabled.')
        ),
    }),
    defineField({
      name: 'photo',
      title: 'Team member photo',
      type: 'image',
      description: 'Portrait photo shown on the card. A vertical image works best.',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityOurTeamIsEnabled(context.document) ||
          Boolean(value) ||
          'Photo is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Photo description',
      type: 'string',
      description: 'Accessible description of the team member photo.',
      validation: (Rule) =>
        Rule.custom(
          requiredTextWhenEnabled('Photo description is required when Sanity content is enabled.')
        ),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
})
