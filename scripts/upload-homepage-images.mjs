/**
 * Upload new-images/El Ranchero Website Images/Homepage/ to Sanity and fill the
 * `homepageContent` singleton (`singleton-homepage`).
 *
 *   npm run upload:homepage-images            # fills empty fields only
 *   npm run upload:homepage-images -- --force # overwrites fields that already have an image
 *
 * Re-running is safe: Sanity de-duplicates assets by file hash, and without
 * --force an image an editor already set in the Studio is left alone.
 */

import { createClient } from '@sanity/client';
import { createReadStream, existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE_DIR = join(ROOT, 'new-images', 'El Ranchero Website Images', 'Homepage');
const DOC_ID = 'singleton-homepage';
const FORCE = process.argv.includes('--force');

const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!TOKEN) {
  console.error('Set SANITY_WRITE_TOKEN in .env (Editor token) before running this script.');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'jntapqhj',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2026-09-15',
  useCdn: false,
  token: TOKEN,
});

// field name in studio/schemas/singletons/homepage.ts → file + alt text
const IMAGES = [
  {
    field: 'heroImage',
    file: 'Hero.jpg',
    alt: 'Sizzling molcajete of grilled steak, shrimp and chorizo served in a volcanic stone bowl at Taqueria El Ranchero',
  },
  {
    field: 'breakfastImage',
    file: 'Mexican_Breakfast.jpg',
    alt: 'Mexican omelette topped with red and green salsa, avocado and queso fresco, served with breakfast potatoes',
  },
  {
    field: 'molcajeteImage',
    file: 'Food_Favorites_Molcajete.jpg',
    alt: 'Steaming molcajete of grilled meats and nopales served with rice, beans and warm tortillas',
  },
  {
    field: 'tacosBirriaImage',
    file: 'Food_Favorites_Tacos_and_Birria.jpg',
    alt: 'Taco de birria being dipped into a cup of consomé',
  },
  {
    field: 'burritosImage',
    file: 'Food_Favorites_Burritos.jpg',
    alt: 'Burrito cut in half to show a filling of grilled steak and beans',
  },
  {
    field: 'wahiawaImage',
    file: 'Locations_Wahiawa.jpg',
    alt: 'Taqueria El Ranchero storefront at Wahiawa Shopping Center',
  },
  {
    field: 'kapoleiImage',
    file: 'Locations_Kapolei.jpg',
    alt: 'Taqueria El Ranchero restaurant exterior at Ka Makana Aliʻi in Kapolei',
  },
  {
    field: 'cateringImage',
    file: 'Catering.jpg',
    alt: 'Cook slicing a foil-wrapped burrito on a cutting board',
  },
  {
    field: 'privateEventsImage',
    file: 'Private_Event_Kapolei.jpg',
    alt: 'Dining room and bar inside Taqueria El Ranchero with TVs, green tile and exposed brick',
  },
];

async function main() {
  console.log(`\nEl Ranchero — Homepage image upload${FORCE ? ' (--force)' : ''}\n`);

  await client.createIfNotExists({ _id: DOC_ID, _type: 'homepageContent' });
  const existing = (await client.getDocument(DOC_ID)) ?? {};

  const patch = {};
  let skipped = 0;

  for (const { field, file, alt } of IMAGES) {
    const path = join(SOURCE_DIR, file);
    if (!existsSync(path)) {
      console.warn(`  !  ${file} not found — skipped`);
      skipped++;
      continue;
    }
    if (!FORCE && existing[field]?.asset?._ref) {
      console.log(`  =  ${field} already set — left alone`);
      skipped++;
      continue;
    }

    const asset = await client.assets.upload('image', createReadStream(path), {
      filename: basename(path),
      contentType: 'image/jpeg',
    });
    patch[field] = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt };
    console.log(`  ↑  ${field.padEnd(20)} ← ${file} (${asset._id})`);
  }

  if (Object.keys(patch).length) {
    await client.patch(DOC_ID).set(patch).commit();
  }

  console.log(`\nDone — ${Object.keys(patch).length} set, ${skipped} skipped.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
