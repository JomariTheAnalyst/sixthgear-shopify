'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { presentationLocations } from './sanity/presentation/locations'

const SINGLETON_TYPES = new Set([
  'homepage',
  'marketing',
  'aboutPage',
  'servicesPage',
])

export default defineConfig({
  name: 'default',
  title: 'Sixthgear CMS',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    presentationTool({
      name: 'visual-editor',
      title: 'Visual Editor',
      previewUrl: {
        initial: '/ph',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        locations: presentationLocations,
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema,
  document: {
    newDocumentOptions: (previous) =>
      previous.filter((option) => !SINGLETON_TYPES.has(option.templateId)),
    actions: (previous, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? previous.filter((action) => action.action !== 'duplicate')
        : previous,
  },
})
