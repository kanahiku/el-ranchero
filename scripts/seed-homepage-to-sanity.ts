/**
 * Fills the Sanity "Homepage" singleton (`singleton-homepage`) with the copy in
 * src/data/pages/homepage.ts, and moves the old per-tile photo fields
 * (molcajeteImage, wahiawaImage, …) into the new dish / location cards.
 *
 *   npm run seed:homepage               # dry run — shows what would change
 *   npm run seed:homepage -- --commit   # write it
 *
 * Safe to re-run: a field that already has a value in Sanity is never touched,
 * so edits made in the Studio survive. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { homepageDefaults } from '../src/data/pages/homepage';

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

const ID = 'singleton-homepage';
/** Old top-level photo field → [array field, index] it now lives in. */
const MOVED_IMAGES: Record<string, [string, number]> = {
  molcajeteImage: ['favoritesDishes', 0],
  tacosBirriaImage: ['favoritesDishes', 1],
  burritosImage: ['favoritesDishes', 2],
  wahiawaImage: ['locationsList', 0],
  kapoleiImage: ['locationsList', 1],
};

let counter = 0;
/** Sanity arrays need a unique `_key` per item. */
function withKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item && typeof item === 'object' ? withKeys({ _key: `k${Date.now().toString(36)}${counter++}`, ...item }) : item
    );
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withKeys(v)]));
  }
  return value;
}

/**
 * Studio needs `_type` on every named object. Applied to new and existing values
 * so a re-run repairs documents written without it. [field, _type, nested fields]
 */
type TypeRule = { type: string; nested?: Record<string, TypeRule> };
const BUTTON: TypeRule = { type: 'buttonLink' };
const LINK: TypeRule = { type: 'link' };
const TYPE_RULES: Record<string, TypeRule> = {
  heroActions: BUTTON,
  heroStats: { type: 'heroStat' },
  breakfastCta: LINK,
  favoritesCta: LINK,
  favoritesDishes: { type: 'homeDish' },
  eventsDays: { type: 'homeEventDay', nested: { events: { type: 'homeEvent' } } },
  eventsFootnoteLink: LINK,
  eventsCta: LINK,
  locationsList: { type: 'homeLocation', nested: { actions: BUTTON } },
  cateringCta: LINK,
  privateEventsCta: LINK,
  closingActions: BUTTON,
};

function applyType(value: unknown, rule: TypeRule): unknown {
  if (Array.isArray(value)) return value.map((item) => applyType(item, rule));
  if (!value || typeof value !== 'object') return value;
  const obj = { ...(value as Record<string, unknown>), _type: rule.type };
  for (const [field, nested] of Object.entries(rule.nested ?? {})) {
    if (obj[field] != null) obj[field] = applyType(obj[field], nested);
  }
  return obj;
}

const existing = (await client.getDocument(ID)) as Record<string, unknown> | null;
const draft = (await client.getDocument(`drafts.${ID}`)) as Record<string, unknown> | null;
if (draft) console.warn('A draft of the homepage exists — publish or discard it in the Studio after seeding.');

const doc = existing ?? {};
const set: Record<string, unknown> = {};

for (const [key, value] of Object.entries(homepageDefaults)) {
  if (doc[key] == null) set[key] = withKeys(value);
}

// Carry the existing tile photos into the new array items.
for (const [oldField, [arrayField, index]] of Object.entries(MOVED_IMAGES)) {
  const image = doc[oldField];
  if (!image) continue;
  const items = (set[arrayField] ?? doc[arrayField]) as Array<Record<string, unknown>> | undefined;
  if (items?.[index] && !items[index].image) {
    items[index].image = image;
    set[arrayField] = items;
  }
}

for (const [field, rule] of Object.entries(TYPE_RULES)) {
  const value = set[field] ?? doc[field];
  if (value != null) set[field] = applyType(value, rule);
}

const unset = Object.keys(MOVED_IMAGES).filter((field) => field in doc);

console.log(`${existing ? 'Updating' : 'Creating'} ${ID}`);
console.log('  set  :', Object.keys(set).join(', ') || '(nothing — already complete)');
console.log('  unset:', unset.join(', ') || '(nothing)');

if (!commit) {
  console.log('\nDry run. Re-run with --commit to write.');
} else {
  await client.createIfNotExists({ _id: ID, _type: 'homepageContent' });
  await client.patch(ID).set(set).unset(unset).commit();
  console.log('\nDone.');
}
