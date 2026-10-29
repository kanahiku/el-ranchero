/**
 * Upload the "Missing Images" batch (new-imgs/El Ranchero - Missing Images/) to Sanity.
 * Images go to the Sanity CDN only — nothing is copied into the codebase.
 *
 *   npm run upload:missing-images            # fills empty fields only
 *   npm run upload:missing-images -- --force # overwrites fields that already have an image
 *
 * Slots listed as NEEDS ASSET in _Missing_Images_Manifest.csv have no file yet and are skipped.
 */

import { createClient } from '@sanity/client';
import { createHash } from 'node:crypto';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'new-imgs', 'El Ranchero - Missing Images');
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

const BURRITO_ALT = 'California Burrito with fries, cheese and sour cream';
const tileDir = 'Events/The Latest from @rancheroevents';

// [document _id, type, [[folder/file, field, alt], …]]
const DOCS = [
  [
    'singleton-events',
    'eventsContent',
    [
      ['Events - Live Concerts/Hero/Hero.jpg', 'concertsHeroImage', 'Band performing on a red stage at El Ranchero'],
      ['Events - Karaoke Wednesday/Hero/Hero.jpg', 'karaokeHeroImage', 'Couple singing karaoke together'],
      ['Events - Latin Night/Hero/Hero.jpg', 'latinNightHeroImage', 'Dance floor on Saturday Latin Night'],
      [`${tileDir}/Instagram_Tile_1_Tejano_Band.jpg`, 'instagramTile1Image', 'Tejano band performing'],
      [`${tileDir}/Instagram_Tile_2_Karaoke_Night.jpg`, 'instagramTile2Image', 'Friends enjoying karaoke night'],
      [`${tileDir}/Instagram_Tile_3_Dance_Floor.jpg`, 'instagramTile3Image', 'Dancing under string lights'],
      [`${tileDir}/Instagram_Tile_4_Taco_Feast.jpg`, 'instagramTile4Image', 'Shared taco feast'],
      [`${tileDir}/Instagram_Tile_5_Margarita_Toast.jpg`, 'instagramTile5Image', 'Margarita toast with chips and guacamole'],
      [`${tileDir}/Instagram_Tile_6_Birria_Dip.jpg`, 'instagramTile6Image', 'Birria taco dipped in consomé'],
    ],
  ],
  [
    'singleton-about',
    'aboutContent',
    [['About/The Murals/The_Murals.jpg', 'muralsImage', 'Mural painted on the wall at Taqueria El Ranchero']],
  ],
  [
    'singleton-menu-pages',
    'menuPagesContent',
    [
      ['Menu - Appetizers & Sides/Hero/Hero.jpg', 'appetizersSidesHeroImage', 'Margarita toast with chips and guacamole'],
      ['Menu/Featured Dishes From Our Menu/California_Burrito.jpg', 'featuredCaliforniaBurritoImage', BURRITO_ALT],
    ],
  ],
  [
    'singleton-locations',
    'locationsContent',
    [
      ['Locations - Wahiawa/Wahiawa Favorites/California_Burrito.jpg', 'wahiawaBurritoImage', BURRITO_ALT],
      ['Locations - Kapolei/Kapolei Favorites/California_Burrito.jpg', 'kapoleiBurritoImage', BURRITO_ALT],
    ],
  ],
  [
    'menuItem-burritos-california-burrito',
    null,
    [['Menu - Burritos/Explore Our Burritos/California_Burrito.jpg', 'photo', BURRITO_ALT]],
  ],
];

const assetCache = new Map();

async function uploadAsset(path) {
  const hash = createHash('sha1').update(readFileSync(path)).digest('hex');
  if (assetCache.has(hash)) return assetCache.get(hash);
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: basename(path),
    contentType: 'image/jpeg',
  });
  assetCache.set(hash, asset._id);
  return asset._id;
}

let set = 0;
let kept = 0;

for (const [id, type, slots] of DOCS) {
  if (type) await client.createIfNotExists({ _id: id, _type: type });
  const existing = await client.getDocument(id);
  if (!existing) {
    console.warn(`  !  ${id} does not exist — skipped`);
    continue;
  }
  const patch = {};
  for (const [rel, field, alt] of slots) {
    const path = join(SOURCE, rel);
    if (!existsSync(path)) {
      console.warn(`  !  ${rel} not found — ${id}.${field} left empty`);
      continue;
    }
    if (!FORCE && existing[field]?.asset?._ref) {
      kept++;
      continue;
    }
    const assetId = await uploadAsset(path);
    patch[field] = { _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt };
  }
  const n = Object.keys(patch).length;
  if (n) await client.patch(id).set(patch).commit();
  set += n;
  console.log(`  ✓  ${id.padEnd(40)} ${n} set`);
}

console.log(`\nDone — ${set} fields set, ${kept} kept, ${assetCache.size} unique assets.\n`);
