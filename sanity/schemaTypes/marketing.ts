import { defineField, defineType } from 'sanity'

// Central hub for all promotional content.
// Announcement bar, popup, featured collection banners,
// and promo wide banners — all managed here.
// Each banner type uses a position field to control
// placement on the homepage.
export default defineType({
  name: 'marketing',
  title: 'Marketing',
  type: 'document',
  fields: [
    // ─── Announcement Bar ───
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'announcementBar',
      description: 'Shown above navbar on every page sitewide.',
    }),

    // ─── Popup ───
    defineField({
      name: 'activePopup',
      title: 'Active Popup Campaign',
      type: 'reference',
      to: [{ type: 'popupAd' }],
      description: 'Select the active popup. Clear to disable. Selected campaign must also have Enabled ON and be within its date range.',
    }),

    // ─── Featured Collections ───
    defineField({
      name: 'featuredCollections',
      title: 'Featured Collection Banners',
      type: 'array',
      description: 'Image + product grid banners. Each item has a position field — boss picks where it appears. Drag to reorder. Toggle each on/off. If two items share a position only the first active one renders.',
      of: [{ type: 'featuredCollection' }],
    }),

    // ─── Promo Wide Banners ───
    defineField({
      name: 'promoBanners',
      title: 'Promo Wide Banners',
      type: 'array',
      description: 'Full viewport width image banners. Each item has a position field. Add unlimited items. Toggle each on/off independently.',
      of: [{ type: 'promoBanner' }],
    }),
  ],
})
