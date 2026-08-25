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
      description: 'Optional internal specialization retained for existing team content.',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Role-focused homepage introduction. Keep it to 15 words or fewer.',
      validation: (Rule) =>
        Rule.custom(
          requiredTextWhenEnabled('Introduction is required when Sanity content is enabled.')
        ),
    }),
    defineField({
      name: 'photo',
      title: 'Professional photo',
      type: 'image',
      description: 'Default portrait shown on the card. A vertical image works best.',
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityOurTeamIsEnabled(context.document) ||
          Boolean(value) ||
          'Photo is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'wackyPhoto',
      title: 'Happy / wacky photo',
      type: 'image',
      description:
        'Optional alternate photo shown on hover. The professional photo is used if empty.',
      options: { hotspot: true },
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
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Show on homepage',
      type: 'boolean',
      initialValue: true,
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
