import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID ?? 'jntapqhj';
const dataset = import.meta.env.SANITY_DATASET ?? 'production';
const token = import.meta.env.SANITY_API_TOKEN || undefined;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-15',
  useCdn: false,
  perspective: 'published',
  ...(token ? { token } : {}),
});
