import { defineField, defineType } from 'sanity'

type MarqueeSectionParent = {
  useSanityContent?: boolean
}

function sanityContentIsEnabled(parent: unknown) {
  return (parent as MarqueeSectionParent | undefined)?.useSanityContent === true
}

export default defineType({
  name: 'marqueeSection',
  title: 'Homepage marquee',
  type: 'object',
  fields: [
    defineField({
      name: 'useSanityContent',
      title: 'Use Sanity content',
      type: 'boolean',
      initialValue: false,
      description:
        'Turn on to use the messages entered here. Turn off to use the website’s built-in fallback messages.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Messages',
      type: 'array',
      of: [{ type: 'marqueeItem' }],
      description:
        'Messages displayed in the orange scrolling marquee below the homepage hero. Drag items to change their order.',
      validation: (Rule) =>
        Rule.max(8).custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (Array.isArray(value) && value.length > 0) ||
          'Add at least one message when Sanity content is enabled.'
        ),
    }),
  ],
})
