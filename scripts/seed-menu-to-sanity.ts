import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type SourceMenuItem = {
  title: string;
  description?: string;
};

type SourceMenuCategory = {
  title: string;
  href?: string;
  description?: string;
  items: SourceMenuItem[];
};

type SeedMenuItem = SourceMenuItem & {
  slug: string;
  placements: Array<{ categoryId: string; order: number }>;
};

const projectId = process.env.SANITY_PROJECT_ID ?? 'jntapqhj';
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;
const menuPagePath = fileURLToPath(new URL('../src/pages/menu/index.astro', import.meta.url));
const commit = process.argv.includes('--commit');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-15',
  useCdn: false,
  ...(token ? { token } : {}),
});

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_']/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(value: string): string {
  return normalize(value).replace(/\s+/g, '-');
}

function getCategorySlug(category: SourceMenuCategory): string {
  if (category.href?.startsWith('/menu/')) return path.posix.basename(category.href);
  return slugify(category.title);
}

async function readSourceMenuCategories(): Promise<SourceMenuCategory[]> {
  const page = await fs.readFile(menuPagePath, 'utf8');
  const match = page.match(/const fullMenuCategories = (\[[\s\S]*?\n\]);/);
  if (!match?.[1]) throw new Error('Could not extract fullMenuCategories from src/pages/menu/index.astro.');

  return Function(`"use strict"; return (${match[1]});`)() as SourceMenuCategory[];
}

function buildSeedItems(categories: SourceMenuCategory[]) {
  const itemsByKey = new Map<string, SeedMenuItem>();

  categories.forEach((category, categoryIndex) => {
    const categoryId = `menuCategory-${getCategorySlug(category)}`;

    category.items.forEach((item, itemIndex) => {
      const key = slugify(item.title);
      const existing = itemsByKey.get(key);

      if (existing) {
        if (!existing.placements.some((placement) => placement.categoryId === categoryId)) {
          existing.placements.push({ categoryId, order: itemIndex * 10 });
        }
        return;
      }

      itemsByKey.set(key, {
        title: item.title,
        description: item.description,
        slug: key,
        placements: [{ categoryId, order: itemIndex * 10 }],
      });
    });

    void categoryIndex;
  });

  return [...itemsByKey.values()];
}

async function main() {
  console.log(commit ? 'Seeding Sanity menu with --commit.' : 'Running Sanity menu seed dry-run.');
  console.log(`Sanity: ${projectId}/${dataset}`);

  if (commit && !token) throw new Error('SANITY_API_TOKEN is required when running with --commit.');

  const categories = await readSourceMenuCategories();
  const seedItems = buildSeedItems(categories);

  console.log(`Categories: ${categories.length}`);
  console.log(`Unique menu items: ${seedItems.length}`);

  if (!commit) {
    console.log('\nDry-run only. Re-run with --commit to seed Sanity.');
    return;
  }

  const transaction = client.transaction();

  categories.forEach((category, categoryIndex) => {
    const slug = getCategorySlug(category);
    const id = `menuCategory-${slug}`;
    transaction.createIfNotExists({
      _id: id,
      _type: 'menuCategory',
      title: category.title,
    });
    transaction.patch(id, (patch) =>
      patch.set({
        _type: 'menuCategory',
        title: category.title,
        slug: { _type: 'slug', current: slug },
        description: category.description,
        order: categoryIndex * 10,
        showOnFullMenu: true,
      })
    );
  });

  seedItems.forEach((item) => {
    const id = `menuItem-${item.slug}`;
    transaction.createIfNotExists({
      _id: id,
      _type: 'menuItem',
      title: item.title,
    });
    transaction.patch(id, (patch) =>
      patch.set({
        _type: 'menuItem',
        title: item.title,
        slug: { _type: 'slug', current: item.slug },
        description: item.description,
        isAvailable: true,
        categoryPlacements: item.placements.map((placement) => ({
          _key: `${placement.categoryId}-${placement.order}`,
          _type: 'categoryPlacement',
          category: { _type: 'reference', _ref: placement.categoryId },
          order: placement.order,
        })),
      })
    );
  });

  await transaction.commit();
  console.log(`Seeded ${categories.length} categories and ${seedItems.length} menu items.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
