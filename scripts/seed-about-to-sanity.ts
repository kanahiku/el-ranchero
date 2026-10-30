/**
 * Fills the Sanity About document (singleton-about) with the copy in
 * src/data/pages/about.ts and moves the photos that used to be flat fields on it
 * (hero, Made Fresh Daily, Murals, Giving Back) to where the page now reads them.
 *
 *   npm run seed:about               # dry run — shows what would change
 *   npm run seed:about -- --commit   # write it
 *
 * Safe to re-run: a field that already has a value is never touched, so Studio
 * edits survive. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { aboutDefaults } from '../src/data/pages/about';
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
const RICH_FIELDS = new Set(['paragraphs', 'answer']);
function richify(value: unknown, field = ''): unknown {
  // Restaurant-card descriptions are plain text, not Portable Text.
  if (field === 'cards') return value;
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
const BUTTON: TypeRule = { type: 'buttonLink' };
const FAQ: TypeRule = { type: 'faqItem' };
const FAVORITE: TypeRule = { type: 'locationFavorite' };

/** `_type` for the nested objects inside a page's `blocks` (blocks carry their own `_type`). */
function typeBlocks(blocks: Doc[]): Doc[] {
  return blocks.map((block) => {
    const out = { ...block };
    if (out.button) out.button = applyType(out.button, LINK);
    if (out.buttons) out.buttons = applyType(out.buttons, BUTTON);
    if (out.items) out.items = applyType(out.items, FAVORITE);
    return out;
  });
}

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
  if (set.blocks || doc.blocks) set.blocks = typeBlocks((set.blocks ?? doc.blocks) as Doc[]);
  const unset = unsetFields.filter((field) => field in doc);
  console.log(`${Object.keys(doc).length ? 'update' : 'create'} ${id}`);
  console.log(`   set  : ${Object.keys(set).join(', ') || '—'}`);
  if (unset.length) console.log(`   unset: ${unset.join(', ')}`);
  if (commit) {
    await client.createIfNotExists({ _id: id, _type: type });
    await client.patch(id).set(set).unset(unset).commit();
  }
}

const old = ((await client.getDocument('singleton-about')) as Doc | null) ?? {};
const content = JSON.parse(JSON.stringify(aboutDefaults)) as Doc;
const byAnchor = (anchor: string) => (content.blocks as Doc[]).find((block) => block.anchor === anchor)!;
if (old.madeFreshDailyImage) byAnchor('made-fresh-daily').image = old.madeFreshDailyImage;
if (old.muralsImage) byAnchor('the-murals').image = old.muralsImage;
if (old.givingBackImage) byAnchor('community').image = old.givingBackImage;

await seedDoc(
  'singleton-about',
  'aboutContent',
  content,
  {},
  (doc, set) => {
    if (doc.heroImage == null && old.heroImage) set.heroImage = old.heroImage;
  },
  ['madeFreshDailyImage', 'muralsImage', 'givingBackImage']
);

if (!commit) console.log('\nDry run. Re-run with --commit to write.');
else console.log('\nDone.');
