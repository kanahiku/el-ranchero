/**
 * Fills the Sanity catering documents with the copy in src/data/pages/catering.ts:
 *   singleton-catering          (/catering)
 *   catering-page-<slug> × 4    (/catering/<slug>)
 * and moves the photos that used to be flat fields on `singleton-catering`
 * onto the card / section that shows them.
 *
 *   npm run seed:catering               # dry run — shows what would change
 *   npm run seed:catering -- --commit   # write it
 *
 * Safe to re-run: a field that already has a value is never touched, so Studio
 * edits survive. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { cateringHubDefaults, cateringSubPageDefaults } from '../src/data/pages/catering';
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
type TypeRule = { type: string; nested?: Record<string, TypeRule> };

let counter = 0;
/** Sanity arrays need a unique `_key` per object item (strings and blocks excepted). */
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

/** Markdown-link strings → Portable Text blocks, for every rich field. */
const RICH_FIELDS = new Set(['paragraphs', 'answer', 'exploreParagraphs']);
function richify(value: unknown, field = ''): unknown {
  if (Array.isArray(value)) {
    if (RICH_FIELDS.has(field)) return value.map((item) => (typeof item === 'string' ? mdToBlock(item) : item));
    return value.map((item) => richify(item));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, richify(v, k)]));
  }
  return value;
}

function applyType(value: unknown, rule: TypeRule): unknown {
  if (Array.isArray(value)) return value.map((item) => applyType(item, rule));
  if (!value || typeof value !== 'object') return value;
  const obj: Doc = { ...(value as Doc), _type: rule.type };
  for (const [field, nested] of Object.entries(rule.nested ?? {})) {
    if (obj[field] != null) obj[field] = applyType(obj[field], nested);
  }
  return obj;
}

const LINK: TypeRule = { type: 'link' };
const FAQ: TypeRule = { type: 'faqItem' };

async function seedDoc(
  id: string,
  type: string,
  defaults: Doc,
  rules: Record<string, TypeRule>,
  extra: (doc: Doc, set: Doc) => void = () => {},
  unsetFields: string[] = []
) {
  const doc = ((await client.getDocument(id)) as Doc | null) ?? {};
  const set: Doc = {};
  for (const [key, value] of Object.entries(defaults)) {
    if (doc[key] == null) set[key] = withKeys(richify(value, key));
  }
  extra(doc, set);
  for (const [field, rule] of Object.entries(rules)) {
    const value = set[field] ?? doc[field];
    if (value != null) set[field] = applyType(value, rule);
  }
  const unset = unsetFields.filter((field) => field in doc);
  console.log(`${Object.keys(doc).length ? 'update' : 'create'} ${id}`);
  console.log(`   set  : ${Object.keys(set).join(', ') || '—'}`);
  if (unset.length) console.log(`   unset: ${unset.join(', ')}`);
  if (commit) {
    await client.createIfNotExists({ _id: id, _type: type });
    await client.patch(id).set(set).unset(unset).commit();
  }
}

const old = ((await client.getDocument('singleton-catering')) as Doc | null) ?? {};
const OLD_IMAGE_FIELDS = [
  'favoriteTacosImage',
  'favoriteBurritosImage',
  'favoriteMexicanImage',
  'favoriteSidesImage',
  'tacoBarHeroImage',
  'tacoBarPackagesImage',
  'corporateHeroImage',
  'corporateLunchImage',
  'partyHeroImage',
  'partyFamilyImage',
  'largeGroupHeroImage',
  'largeGroupFoodImage',
];

// Hub
await seedDoc(
  'singleton-catering',
  'cateringContent',
  cateringHubDefaults as unknown as Doc,
  {
    heroButton: LINK,
    favoritesItems: { type: 'cateringFavorite' },
    reviews: { type: 'cateringReview' },
    reviewLinks: LINK,
    steps: { type: 'cateringStep' },
    exploreButton: LINK,
    faqs: FAQ,
    ctaButton: LINK,
  },
  (doc, set) => {
    const items = (set.favoritesItems ?? doc.favoritesItems) as Doc[] | undefined;
    const photos = [old.favoriteTacosImage, old.favoriteBurritosImage, old.favoriteMexicanImage, old.favoriteSidesImage];
    if (items) {
      photos.forEach((photo, i) => {
        if (photo && items[i] && !items[i].image) items[i].image = photo;
      });
      set.favoritesItems = items;
    }
  },
  OLD_IMAGE_FIELDS
);

// Sub-pages
const SUB_IMAGES: Record<string, { hero: string; blocks: Record<string, string> }> = {
  'taco-bar': { hero: 'tacoBarHeroImage', blocks: { packages: 'tacoBarPackagesImage' } },
  corporate: { hero: 'corporateHeroImage', blocks: { 'office-lunch': 'corporateLunchImage' } },
  parties: { hero: 'partyHeroImage', blocks: { family: 'partyFamilyImage' } },
  'large-groups': { hero: 'largeGroupHeroImage', blocks: { food: 'largeGroupFoodImage' } },
};
for (const page of cateringSubPageDefaults) {
  const images = SUB_IMAGES[page.slug];
  await seedDoc(
    `catering-page-${page.slug}`,
    'cateringSubPage',
    page as unknown as Doc,
    { heroButton: LINK, ctaButton: LINK, faqs: FAQ },
    (doc, set) => {
      if (doc.heroImage == null && old[images.hero]) set.heroImage = old[images.hero];
      const blocks = (set.blocks ?? doc.blocks) as Doc[] | undefined;
      if (blocks) {
        for (const block of blocks) {
          const field = images.blocks[block.anchor as string];
          if (field && old[field] && !block.image) block.image = old[field];
          if (block.button) block.button = applyType(block.button, LINK);
        }
        set.blocks = blocks;
      }
    }
  );
}

if (!commit) console.log('\nDry run. Re-run with --commit to write.');
else console.log('\nDone.');
