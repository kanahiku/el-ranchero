/**
 * Fills the Sanity legal pages (legal-page-<slug>) with the copy in
 * src/data/pages/legal.ts.
 *
 *   npm run seed:legal               # dry run
 *   npm run seed:legal -- --commit   # write it
 *
 * A field that already has a value is never touched. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { legalPageDefaults } from '../src/data/pages/legal';
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
const RICH_FIELDS = new Set(['body', 'closing']);
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

for (const page of legalPageDefaults) {
  await seedDoc(
    `legal-page-${page.slug}`,
    'legalPage',
    page as unknown as Doc,
    { ctaButton: LINK, sections: { type: 'legalSection' } }
  );
}

if (!commit) console.log('\nDry run. Re-run with --commit to write.');
else console.log('\nDone.');
