import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';
import { structure, singletonTypes } from './structure';

/** Fixed-URL documents: edited in place, never created from the "+" menu. */
const fixedTypes = new Set([...singletonTypes, 'menuCategoryPage', 'cateringSubPage', 'eventsSubPage', 'locationsSubPage', 'legalPage']);

export default defineConfig({
  name: 'el-ranchero',
  title: 'El Ranchero',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'jntapqhj',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  document: {
    newDocumentOptions: (prev) => prev.filter((option) => !fixedTypes.has(option.templateId)),
  },

  schema: {
    types: schemaTypes,
  },
});
