/**
 * Fills the Sanity menu page documents with the copy in src/data/pages/menu.ts:
 *   singleton-menu-hub        (/menu)
 *   menu-page-<slug> × 9      (/menu/<slug>)
 *   singleton-menu-pages      (shared order cards + allergy notice)
 * and moves the photos that used to live on `singleton-menu-pages` onto the
 * page that shows them.
 *
 *   npm run seed:menu-pages               # dry run — shows what would change
 *   npm run seed:menu-pages -- --commit   # write it
 *
 * Safe to re-run: a field that already has a value is never touched, so Studio
 * edits survive. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import {
  menuCategoryPageDefaults,
  menuHubDefaults,
  menuSharedDefaults,
} from '../src/data/pages/menu';

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
/** Sanity arrays need a unique `_key` per object item. */
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

/** Studio needs `_type` on every named object. */
function applyType(value: unknown, rule: TypeRule): unknown {
  if (Array.isArray(value)) return value.map((item) => applyType(item, rule));
  if (!value || typeof value !== 'object') return value;
  const obj = { ...(value as Doc), _type: rule.type };
  for (const [field, nested] of Object.entries(rule.nested ?? {})) {
    if (obj[field] != null) obj[field] = applyType(obj[field], nested);
  }
  return obj;
}

const BUTTON: TypeRule = { type: 'buttonLink' };
const LINK: TypeRule = { type: 'link' };

/** Missing fields from `defaults`, plus `_type` on typed fields; returns the patch + a log line. */
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
    if (doc[key] == null) set[key] = withKeys(value);
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

// Photos that used to sit on the shared singleton.
const old = ((await client.getDocument('singleton-menu-pages')) as Doc | null) ?? {};
const OLD_IMAGE_FIELDS = [
  'menuHubHeroImage',
  'breakfastEveryDayImage',
  'featuredMolcajeteImage',
  'featuredTacoImage',
  'featuredCaliforniaBurritoImage',
  'breakfastHeroImage',
  'burritosHeroImage',
  'tacosHeroImage',
  'entreesHeroImage',
  'quesadillasNachosHeroImage',
  'specialsHeroImage',
  'appetizersSidesHeroImage',
  'kidsHeroImage',
  'drinksHeroImage',
  'breakfastTakeoutImage',
  'entreesMolcajeteImage',
];
const HERO_FIELD: Record<string, string> = {
  breakfast: 'breakfastHeroImage',
  burritos: 'burritosHeroImage',
  tacos: 'tacosHeroImage',
  entrees: 'entreesHeroImage',
  'quesadillas-nachos': 'quesadillasNachosHeroImage',
  specials: 'specialsHeroImage',
  'appetizers-sides': 'appetizersSidesHeroImage',
  kids: 'kidsHeroImage',
  drinks: 'drinksHeroImage',
};
const BLOCK_IMAGE: Record<string, { anchor: string; field: string }> = {
  breakfast: { anchor: 'takeout-or-sit-down', field: 'breakfastTakeoutImage' },
  entrees: { anchor: 'molcajete', field: 'entreesMolcajeteImage' },
};

// Hub
await seedDoc(
  'singleton-menu-hub',
  'menuHubContent',
  menuHubDefaults as unknown as Doc,
  { heroActions: BUTTON, featuredDishes: { type: 'menuHubDish' } },
  (doc, set) => {
    if (doc.heroImage == null && old.menuHubHeroImage) set.heroImage = old.menuHubHeroImage;
    if (doc.breakfastImage == null && old.breakfastEveryDayImage) set.breakfastImage = old.breakfastEveryDayImage;
    const dishes = (set.featuredDishes ?? doc.featuredDishes) as Doc[] | undefined;
    const photos = [old.featuredMolcajeteImage, old.featuredTacoImage, old.featuredCaliforniaBurritoImage];
    if (dishes) {
      photos.forEach((photo, i) => {
        if (photo && dishes[i] && !dishes[i].image) dishes[i].image = photo;
      });
      set.featuredDishes = dishes;
    }
  }
);

// Category pages
for (const page of menuCategoryPageDefaults) {
  await seedDoc(
    `menu-page-${page.slug}`,
    'menuCategoryPage',
    page as unknown as Doc,
    { heroActions: BUTTON, moreCta: LINK },
    (doc, set) => {
      const heroPhoto = old[HERO_FIELD[page.slug]];
      if (doc.heroImage == null && heroPhoto) set.heroImage = heroPhoto;
      const blockImage = BLOCK_IMAGE[page.slug];
      const blocks = (set.blocks ?? doc.blocks) as Doc[] | undefined;
      if (blockImage && old[blockImage.field] && blocks) {
        const target = blocks.find((block) => block.anchor === blockImage.anchor);
        if (target && !target.image) target.image = old[blockImage.field];
        set.blocks = blocks;
      }
    }
  );
}

// Shared sections (+ drop the old photo fields)
await seedDoc(
  'singleton-menu-pages',
  'menuPagesContent',
  menuSharedDefaults as unknown as Doc,
  { orderLocations: { type: 'menuOrderLocation' }, footnoteLink: LINK },
  () => {},
  OLD_IMAGE_FIELDS
);

if (!commit) console.log('\nDry run. Re-run with --commit to write.');
else console.log('\nDone.');
