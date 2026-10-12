/**
 * Seeds the menu into Sanity: categories, dishes and the "Choose Your Meat" list.
 * Source copy: src/data/menu.ts (categories, meats) and src/data/menu-seed.ts (dishes).
 *
 *   npm run seed:menu               # dry run — shows what would be created
 *   npm run seed:menu -- --commit   # create the missing documents
 *   npm run seed:menu -- --commit --force   # also overwrite documents that already exist
 *
 * Safe to re-run: existing documents are left alone (so edits and photos added in
 * the Studio survive) unless --force is passed. Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';
import { meatOptions, menuCategoryLinks } from '../src/data/menu';
import { menuItemSeed } from '../src/data/menu-seed';

const projectId = process.env.SANITY_PROJECT_ID ?? 'jntapqhj';
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_WRITE_TOKEN;
const commit = process.argv.includes('--commit');
const force = process.argv.includes('--force');

if (commit && !token) throw new Error('SANITY_WRITE_TOKEN is required with --commit.');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-15',
  useCdn: false,
  ...(token ? { token } : {}),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type Doc = { _id: string; _type: string } & Record<string, unknown>;
const docs: Doc[] = [];

// ── Categories ──────────────────────────────────────────────────────────────
menuCategoryLinks.forEach((link, index) => {
  const slug = link.href.replace(/^\/menu\//, '');
  docs.push({
    _id: `menuCategory-${slug}`,
    _type: 'menuCategory',
    title: link.label,
    slug: { _type: 'slug', current: slug },
    description: link.description,
    order: index,
    hubSpan: link.span,
    showOnFullMenu: true,
  });
});

// ── Dishes ──────────────────────────────────────────────────────────────────
for (const [categorySlug, items] of Object.entries(menuItemSeed)) {
  const orderBySection = new Map<string, number>();
  for (const item of items) {
    const order = orderBySection.get(item.section) ?? 0;
    orderBySection.set(item.section, order + 1);
    const itemSlug = `${categorySlug}-${slugify(item.title)}`;
    docs.push({
      _id: `menuItem-${itemSlug}`,
      _type: 'menuItem',
      title: item.title,
      slug: { _type: 'slug', current: itemSlug },
      description: Array.isArray(item.description) ? item.description.join('\n\n') : item.description,
      isAvailable: true,
      categoryPlacements: [
        {
          _key: 'placement',
          _type: 'categoryPlacement',
          category: { _type: 'reference', _ref: `menuCategory-${categorySlug}` },
          section: item.section,
          order,
        },
      ],
    });
  }
}

// ── Choose Your Meat ────────────────────────────────────────────────────────
meatOptions.forEach((meat, index) => {
  docs.push({
    _id: `meatOption-${slugify(meat.name)}`,
    _type: 'meatOption',
    name: meat.name,
    description: meat.description,
    order: index,
    isAvailable: true,
  });
});

const counts = docs.reduce<Record<string, number>>((acc, doc) => ({ ...acc, [doc._type]: (acc[doc._type] ?? 0) + 1 }), {});
console.log(`Project ${projectId}/${dataset} — ${docs.length} documents:`, counts);

if (!commit) {
  console.log('Dry run. Re-run with --commit to write to Sanity.');
  process.exit(0);
}

const tx = client.transaction();
for (const doc of docs) {
  if (force) tx.createOrReplace(doc);
  else tx.createIfNotExists(doc);
}
const result = await tx.commit();
console.log(`Done. ${result.results.length} operations (${force ? 'replace' : 'create if missing'}).`);
