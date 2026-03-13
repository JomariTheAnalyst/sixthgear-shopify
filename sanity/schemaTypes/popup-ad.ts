import { defineField, defineType } from 'sanity'

// Each document is one popup campaign.
// Select the active one in the Marketing document.
// The popup shows on the homepage after a configured delay.
// Image is fully visible — nothing is cropped.
// Heading and button are optional — leave blank to hide them.
export default defineType({
  name: 'popupAd',
  title: 'Popup Ad Campaign',
  type: 'document',
  fields: [
    defineField({
      name: 'campaignName',
      title: 'Campaign Name (Internal)',
      type: 'string',
      description: 'Not shown to visitors. Example: March Launch, SEC Moto Drop',
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: false,
      description: 'Must be ON for popup to show. Also set this campaign as Active Popup in the Marketing doc.',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'When to start showing. Leave empty to show immediately.',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'When to stop showing. Leave empty to run indefinitely.',
    }),
    defineField({
      name: 'image',
      title: 'Popup Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Required. The image displays at its natural aspect ratio — nothing is cropped or cut off.',
    }),
    defineField({
      name: 'imageLink',
      title: 'Image Link',
      type: 'string',
      description: 'Where clicking the image navigates to. Example: /store, /collections/sec-moto',
    }),
    defineField({
      name: 'heading',
      title: 'Heading (Optional)',
      type: 'string',
      description: 'Text shown above the image. Leave blank to hide.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label (Optional)',
      type: 'string',
      description: 'Text on the button below the image. Leave blank to hide the button entirely. Example: SHOP NOW, VIEW COLLECTION',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link (Optional)',
      type: 'string',
      description: 'Where the button navigates to. Required if Button Label is set.',
    }),
    defineField({
      name: 'delay',
      title: 'Trigger Delay (seconds)',
      type: 'number',
      initialValue: 5,
      description: 'How many seconds after page load before the popup appears. Minimum 3. Default 5.',
    }),
  ],
  preview: {
    select: {
      title: 'campaignName',
      enabled: 'enabled',
    },
    prepare({ title, enabled }) {
      return {
        title: title || 'Untitled Campaign',
        subtitle: enabled ? '✅ Enabled' : '❌ Disabled',
      }
    },
  },
})
