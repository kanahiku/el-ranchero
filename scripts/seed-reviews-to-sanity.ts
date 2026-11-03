/**
 * Fills the Sanity Reviews page (singleton-reviews) with src/data/pages/reviews.ts
 * Testimonials are managed separately (seed-real-reviews-to-sanity.ts / Studio).
 *
 *   npm run seed:reviews               # dry run
 *   npm run seed:reviews -- --commit   # write it
 *
 * Existing values are never overwritten. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { reviewsDefaults } from '../src/data/pages/reviews';

const commit = process.argv.includes('--commit');
const token = process.env.SANITY_WRITE_TOKEN;
if (commit && !token) throw new Error('SANITY_WRITE_TOKEN is required with --commit.');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? 'jntapqhj',
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-15',
  useCdn: false,
  token,
});

type Doc = Record<string, unknown>;
let counter = 0;
const key = () => `k${Date.now().toString(36)}${counter++}`;
const withKeys = (items: Doc[], type: string) => items.map((item) => ({ _key: key(), _type: type, ...item }));

// ── Page ──
const id = 'singleton-reviews';
const doc = ((await client.getDocument(id)) as Doc | null) ?? {};
const set: Doc = {};
for (const [field, value] of Object.entries(reviewsDefaults)) {
  if (doc[field] != null) continue;
  if (field === 'heroButtons' || field === 'reviewsButtons') set[field] = withKeys(value as Doc[], 'buttonLink');
  else if (field === 'ctaButton') set[field] = { _type: 'link', ...(value as Doc) };
  else set[field] = value;
}
console.log(`${Object.keys(doc).length ? 'update' : 'create'} ${id}\n   set: ${Object.keys(set).join(', ') || '—'}`);
if (commit) {
  await client.createIfNotExists({ _id: id, _type: 'reviewsContent' });
  await client.patch(id).set(set).commit();
}

// Testimonials are real reviews: see scripts/seed-real-reviews-to-sanity.ts

console.log(commit ? '\nDone.' : '\nDry run. Re-run with --commit to write.');
