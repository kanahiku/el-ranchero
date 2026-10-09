import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'jntapqhj',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME ?? 'el-ranchero',
});
