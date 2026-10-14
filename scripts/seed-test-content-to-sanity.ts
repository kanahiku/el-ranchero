/**
 * Seeds placeholder testimonials into Sanity:
 *   - 3 dummy testimonials
 *
 *   npm run seed:test-content               # dry run
 *   npm run seed:test-content -- --commit   # write (replaces these documents if they exist)
 *
 * Documents have fixed IDs (testimonial-test-*) so re-running updates them instead
 * of duplicating. Delete them in the Studio when real content is in.
 * Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID ?? 'jntapqhj';
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_WRITE_TOKEN;
const commit = process.argv.includes('--commit');

if (commit && !token) throw new Error('SANITY_WRITE_TOKEN is required with --commit.');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-15',
  useCdn: false,
  ...(token ? { token } : {}),
});

// ── Testimonials ────────────────────────────────────────────────────────────
const testimonials = [
  {
    _id: 'testimonial-test-1',
    name: 'Test Reviewer One',
    location: 'Wahiawa',
    platform: 'google',
    order: 0,
    quote:
      'Dummy review: the breakfast burrito is huge and the salsa is made fresh. We stop in every Saturday on the way out of Wahiawa.',
  },
  {
    _id: 'testimonial-test-2',
    name: 'Test Reviewer Two',
    location: 'Kapolei',
    platform: 'yelp',
    order: 1,
    quote:
      'Dummy review: great spot for a family dinner. The Molcajete was sizzling when it hit the table and the margaritas were just right.',
  },
  {
    _id: 'testimonial-test-3',
    name: 'Test Reviewer Three',
    location: 'Google Review',
    platform: 'google',
    order: 2,
    quote:
      'Dummy review: Taco Tuesday and karaoke on Wednesday are the best part of my week. Friendly staff and a fun crowd.',
  },
].map((doc) => ({ ...doc, _type: 'testimonial' }));

const docs: Array<{ _id: string; _type: string } & Record<string, unknown>> = testimonials;
console.log(`Project ${projectId}/${dataset}: ${testimonials.length} testimonials.`);

if (!commit) {
  console.log('Dry run. Re-run with --commit to write to Sanity.');
  process.exit(0);
}

const tx = client.transaction();
for (const doc of docs) tx.createOrReplace(doc);
const result = await tx.commit();
console.log(`Done. ${result.results.length} documents written.`);
