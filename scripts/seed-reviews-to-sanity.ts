/**
 * Fills the Sanity Reviews page (singleton-reviews) with src/data/pages/reviews.ts
 * and, if there are fewer than 9 testimonials, adds DUMMY ones (ids testimonial-dummy-N)
 * so the page has enough cards.
 * Replace the dummy reviews in Studio → Testimonials with real ones.
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

// ── Dummy testimonials ──
const DUMMY: Array<[string, string, string, 'google' | 'yelp']> = [
  ['Best breakfast burrito on the island. Huge, hot and they were so friendly at the counter.', 'Kalani M.', 'Wahiawa', 'google'],
  ['The birria tacos are the real deal. We drove from Mililani just for these and will be back.', 'Jason R.', 'Wahiawa', 'yelp'],
  ['Sat on the patio in Kapolei with the whole family. Great service, great salsa, kids cleaned their plates.', 'Leilani K.', 'Kapolei', 'google'],
  ['Karaoke Wednesday is a blast. Cold margaritas and a crowd that cheers for everyone.', 'Marcus T.', 'Kapolei', 'google'],
  ['Catered our office lunch with the taco bar. Zero leftovers and everyone asked where it was from.', 'Dana W.', 'Catering', 'yelp'],
  ['Stopped in on the way to the North Shore. Fresh, fast and the carne asada was perfect.', 'Priya S.', 'Wahiawa', 'google'],
  ['The Molcajete is a show and a meal. Worth every bite, bring friends.', 'Tomás G.', 'Kapolei', 'yelp'],
  ['Latin Night had the whole place dancing. Food was excellent too.', 'Ana C.', 'Events', 'google'],
  ['Homemade salsas, warm tortillas, fair prices. Our go-to taqueria in Central Oʻahu.', 'Eric N.', 'Wahiawa', 'yelp'],
];
const existing = await client.fetch<number>('count(*[_type == "testimonial"])');
if (existing >= DUMMY.length) {
  console.log(`\n${existing} testimonials already exist — no dummy reviews added.`);
} else {
  console.log(`\nAdding ${DUMMY.length} dummy testimonials.`);
  if (commit) {
    const tx = client.transaction();
    DUMMY.forEach(([quote, name, location, platform], i) =>
      tx.createOrReplace({ _id: `testimonial-dummy-${i + 1}`, _type: 'testimonial', quote, name, location, platform, order: 100 + i })
    );
    await tx.commit();
  }
}

console.log(commit ? '\nDone.' : '\nDry run. Re-run with --commit to write.');
