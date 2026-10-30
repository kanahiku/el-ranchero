/**
 * Fills the Sanity Blog page, Contact page and Order Online page singletons with
 * src/data/pages/sitePages.ts, and moves the Order Online storefront photos from
 * `singleton-locations` onto the Order Online cards.
 *
 *   npm run seed:site-pages               # dry run
 *   npm run seed:site-pages -- --commit   # write it
 *
 * A field that already has a value is never touched. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { blogIndexDefaults, contactPageDefaults, orderOnlineDefaults } from '../src/data/pages/sitePages';
import { mdToBlock } from '../src/lib/content/richText';

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
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const keyed = (items: unknown, type: string) =>
  (items as Doc[]).map((item) => ({ _key: key(), _type: type, ...item }));

async function seed(id: string, type: string, defaults: Doc, convert: (doc: Doc, set: Doc) => void, unset: string[] = []) {
  const doc = ((await client.getDocument(id)) as Doc | null) ?? {};
  const set: Doc = {};
  for (const [field, value] of Object.entries(defaults)) if (doc[field] == null) set[field] = clone(value);
  convert(doc, set);
  const toUnset = unset.filter((field) => field in doc);
  console.log(`${Object.keys(doc).length ? 'update' : 'create'} ${id}\n   set  : ${Object.keys(set).join(', ') || '—'}`);
  if (toUnset.length) console.log(`   unset: ${toUnset.join(', ')}`);
  if (commit) {
    await client.createIfNotExists({ _id: id, _type: type });
    await client.patch(id).set(set).unset(toUnset).commit();
  }
}

// Blog page
await seed('singleton-blog-index', 'blogIndexContent', blogIndexDefaults as unknown as Doc, (_doc, set) => {
  if (set.ctaButton) set.ctaButton = { _type: 'link', ...(set.ctaButton as Doc) };
});

// Contact page
await seed('singleton-contact', 'contactPageContent', contactPageDefaults as unknown as Doc, (_doc, set) => {
  if (set.formIntro) set.formIntro = (set.formIntro as string[]).map((text) => ({ _key: key(), ...mdToBlock(text) }));
  if (set.locations) set.locations = keyed(set.locations, 'contactLocation');
});

// Order Online page
const oldLocations = ((await client.getDocument('singleton-locations')) as Doc | null) ?? {};
await seed(
  'singleton-order-online',
  'orderOnlineContent',
  orderOnlineDefaults as unknown as Doc,
  (_doc, set) => {
    if (set.cards) {
      const cards = (set.cards as Doc[]).map((card) => ({
        ...card,
        _key: key(),
        _type: 'locationCard',
        actions: keyed(card.actions, 'buttonLink'),
      }));
      const photos = [oldLocations.orderOnlineWahiawaImage, oldLocations.orderOnlineKapoleiImage];
      cards.forEach((card, i) => {
        if (photos[i]) (card as Doc).image = photos[i];
      });
      set.cards = cards;
    }
    if (set.phoneButtons) set.phoneButtons = keyed(set.phoneButtons, 'buttonLink');
    if (set.ctaButton) set.ctaButton = { _type: 'link', ...(set.ctaButton as Doc) };
  }
);
if ('orderOnlineWahiawaImage' in oldLocations || 'orderOnlineKapoleiImage' in oldLocations) {
  console.log('unset orderOnline*Image on singleton-locations');
  if (commit) await client.patch('singleton-locations').unset(['orderOnlineWahiawaImage', 'orderOnlineKapoleiImage']).commit();
}

console.log(commit ? '\nDone.' : '\nDry run. Re-run with --commit to write.');
