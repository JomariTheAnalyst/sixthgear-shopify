import { defineType, defineField } from 'sanity'

type CoffeeShowcaseParent = {
  useSanityContent?: boolean
  buttonText?: string
  buttonLink?: string
}

function sanityContentIsEnabled(parent: unknown) {
  return (parent as CoffeeShowcaseParent | undefined)?.useSanityContent === true
}

export default defineType({
  name: 'coffeeShowcase',
  title: 'Coffee Section',
  type: 'object',
  fields: [
    defineField({
      name: 'useSanityContent',
      type: 'boolean',
      title: 'Use Sanity content',
      description:
        'When enabled, this entire section uses the content below. When disabled, the website uses its complete built-in version.',
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionHeading',
      type: 'text',
      title: 'Main heading',
      rows: 3,
      description: `The large bold title shown above the description. You can write it on two lines by pressing Enter between the lines. Example:

More Than Riding Gear
We Serve Great Coffee Too

Tip: keep each line short so it fits nicely on all screen sizes.`,
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Main heading is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'coffeeIcon',
      type: 'image',
      title: 'Coffee section icon',
      options: { hotspot: false },
      description:
        'Small icon shown above the heading in this section.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          Boolean(value) ||
          'Coffee section icon is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'descriptionText',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Main paragraph shown beside the image gallery. Keep it short and easy to read.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Description is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'storyProfileLogo',
      type: 'image',
      title: 'Story profile logo',
      options: { hotspot: true },
      description: 'Round logo shown at the top of the coffee story.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          Boolean(value) ||
          'Story profile logo is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'storyProfileName',
      type: 'string',
      title: 'Story profile name',
      description: 'Profile name shown beside the round logo.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Story profile name is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'storyProfileSubtitle',
      type: 'string',
      title: 'Story profile subtitle',
      description: 'Short line shown below the story profile name.',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (typeof value === 'string' && value.trim().length > 0) ||
          'Story profile subtitle is required when Sanity content is enabled.'
        ),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button text',
      type: 'string',
      description: 'Text shown on the button under the description. Example: Explore Our Products',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!sanityContentIsEnabled(context.parent)) return true

          const parent = context.parent as CoffeeShowcaseParent | undefined
          const hasText = typeof value === 'string' && value.trim().length > 0
          const hasLink =
            typeof parent?.buttonLink === 'string' && parent.buttonLink.trim().length > 0

          return hasText === hasLink || 'Button text and button link must be filled in together.'
        }),
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button link',
      type: 'url',
      description: 'Where the button should go when clicked. You can paste a full URL or use an internal link like /first-gear.',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true }).custom((value, context) => {
          if (!sanityContentIsEnabled(context.parent)) return true

          const parent = context.parent as CoffeeShowcaseParent | undefined
          const hasLink = typeof value === 'string' && value.trim().length > 0
          const hasText =
            typeof parent?.buttonText === 'string' && parent.buttonText.trim().length > 0

          return hasLink === hasText || 'Button text and button link must be filled in together.'
        }),
    }),
    defineField({
      name: 'coffeeItems',
      title: 'Coffee stories',
      type: 'array',
      of: [{ type: 'coffeeItem' }],
      description: 'Stories appear on the website in this order. Drag items to reorder them.',
      validation: (Rule) =>
        Rule.max(8).custom((value, context) =>
          !sanityContentIsEnabled(context.parent) ||
          (Array.isArray(value) && value.length > 0) ||
          'Add at least one coffee story when Sanity content is enabled.'
        ),
    }),
  ],
})
