/**
 * Upload the page photos in new-images/El Ranchero Website Images/ to Sanity
 * (everything except Homepage — see upload-homepage-images.mjs) and fill:
 *   - the page singletons: aboutContent, cateringContent, locationsContent,
 *     eventsContent, menuPagesContent
 *   - menuCategory.image / exploreMoreImage
 *   - menuItem.photo
 *
 *   npm run upload:site-images            # fills empty fields only
 *   npm run upload:site-images -- --force # overwrites fields that already have an image
 *
 * Re-running is safe: Sanity de-duplicates assets by file hash, and without --force an
 * image an editor already set in the Studio is left alone.
 *
 * Slots that have no photo yet (marked MISSING in _Image_Manifest.csv) are simply not
 * filled; the site shows its grey placeholder for them. The script prints them at the end,
 * together with any image file that is not mapped to a slot.
 */

import { createClient } from '@sanity/client';
import { createHash } from 'node:crypto';
import { createReadStream, existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE = join(ROOT, 'new-images', 'El Ranchero Website Images');
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

// ─── Slot tables ─────────────────────────────────────────────────────────────
// [folder, file, field, alt]

const SINGLETONS = {
  'singleton-about': {
    type: 'aboutContent',
    slots: [
      ['About', 'Hero.jpg', 'heroImage', 'Taqueria El Ranchero restaurant exterior at Ka Makana Aliʻi in Kapolei'],
      ['About', 'Made_Fresh_Daily.jpg', 'madeFreshDailyImage', 'Grilled meat being prepared on the open-fire grill at El Ranchero'],
      // ['About', 'The_Murals.jpg', 'muralsImage', …] — photo still needed from the client
      ['About', 'Giving_Back.jpg', 'givingBackImage', 'Dining room and bar inside Taqueria El Ranchero with TVs, green tile and exposed brick'],
    ],
  },
  'singleton-catering': {
    type: 'cateringContent',
    slots: [
      ['Catering', 'Hero.jpg', 'heroImage', 'Al pastor trompo turning in front of an open flame'],
      ['Catering', 'Catering_Favorites_Tacos.jpg', 'favoriteTacosImage', 'Tacos served in a red basket'],
      ['Catering', 'Catering_Favorites_Burritos.jpg', 'favoriteBurritosImage', 'Burrito cut in half to show a filling of grilled steak and beans'],
      ['Catering', 'Catering_Favorites_Mexican_Favorites.jpg', 'favoriteMexicanImage', 'Chicken enchiladas topped with crema, served with rice'],
      ['Catering', 'Catering_Favorites_Sides_and_More.jpg', 'favoriteSidesImage', 'Fresh guacamole'],
    ],
  },
  'singleton-locations': {
    type: 'locationsContent',
    slots: [
      ['Locations', 'Hero.jpg', 'hubHeroImage', 'Taqueria El Ranchero restaurant exterior at Ka Makana Aliʻi in Kapolei'],
      ['Locations', 'Wahiawa.jpg', 'hubWahiawaImage', 'Taqueria El Ranchero storefront at Wahiawa Shopping Center'],
      ['Locations', 'Kapolei.jpg', 'hubKapoleiImage', 'Taqueria El Ranchero restaurant exterior at Ka Makana Aliʻi in Kapolei'],

      ['Locations - Wahiawa', 'Hero.jpg', 'wahiawaHeroImage', 'Taqueria El Ranchero storefront sign at Wahiawa Shopping Center'],
      ['Locations - Wahiawa', 'Wahiawa_Favorites_Tacos.jpg', 'wahiawaTacosImage', 'Tacos served in a red basket'],
      // ['Locations - Wahiawa', 'Wahiawa_Favorites_California_Burrito.jpg', 'wahiawaBurritoImage', …] — no photo yet
      ['Locations - Wahiawa', 'Wahiawa_Favorites_Birria.jpg', 'wahiawaBirriaImage', 'Tacos de birria with a cup of consomé'],
      ['Locations - Wahiawa', 'Wahiawa_Favorites_Quesadillas.jpg', 'wahiawaQuesadillasImage', 'Meat quesadilla on a white plate'],
      ['Locations - Wahiawa', 'Wahiawa_Favorites_Mexican_Plates.jpg', 'wahiawaMexicanPlatesImage', 'Chicken enchiladas topped with crema, served with rice'],

      ['Locations - Kapolei', 'Hero.jpg', 'kapoleiHeroImage', 'Taqueria El Ranchero restaurant exterior at Ka Makana Aliʻi in Kapolei'],
      ['Locations - Kapolei', 'Kapolei_Favorites_Tacos.jpg', 'kapoleiTacosImage', 'Tacos served in a red basket'],
      // ['Locations - Kapolei', 'Kapolei_Favorites_California_Burrito.jpg', 'kapoleiBurritoImage', …] — no photo yet
      ['Locations - Kapolei', 'Kapolei_Favorites_Birria.jpg', 'kapoleiBirriaImage', 'Tacos de birria with a cup of consomé'],
      ['Locations - Kapolei', 'Kapolei_Favorites_Quesadillas.jpg', 'kapoleiQuesadillasImage', 'Meat quesadilla on a white plate'],
      ['Locations - Kapolei', 'Kapolei_Favorites_Mexican_Plates.jpg', 'kapoleiMexicanPlatesImage', 'Carne asada plate with rice, beans and fresh vegetables'],
    ],
  },
  'singleton-events': {
    type: 'eventsContent',
    slots: [
      ['Events', 'Hero.jpg', 'hubHeroImage', 'Dining room and bar inside Taqueria El Ranchero with TVs, green tile and exposed brick'],
      ['Events - Taco Tuesday', 'Hero.jpg', 'tacoTuesdayHeroImage', 'Tacos served in a red basket with a cup of salsa and a lime wedge'],
      // Karaoke / Latin Night / Live Concerts heroes — no photo yet
      ['Events - Event Space Rental', 'Hero.jpg', 'spaceRentalHeroImage', 'Dining room and bar inside Taqueria El Ranchero with TVs, green tile and exposed brick'],
    ],
  },
  'singleton-menu-pages': {
    type: 'menuPagesContent',
    slots: [
      ['Menu', 'Hero.jpg', 'menuHubHeroImage', 'Grilled meat being tossed on the open-fire grill'],
      ['Menu', 'Breakfast_Every_Day.jpg', 'breakfastEveryDayImage', 'Asada and eggs with breakfast potatoes'],
      ['Menu', 'Featured_Dishes_Molcajete.jpg', 'featuredMolcajeteImage', 'Steaming molcajete of grilled meats served with rice, beans and warm tortillas'],
      ['Menu', 'Featured_Dishes_Taco.jpg', 'featuredTacoImage', 'Tacos served in a red basket with salsa and a lime wedge'],
      // ['Menu', 'Featured_Dishes_California_Burrito.jpg', 'featuredCaliforniaBurritoImage', …] — no photo yet

      ['Menu - Breakfast', 'Hero.jpg', 'breakfastHeroImage', 'Asada and eggs with breakfast potatoes'],
      ['Menu - Burritos', 'Hero.jpg', 'burritosHeroImage', 'Cook slicing a foil-wrapped burrito on a cutting board'],
      ['Menu - Tacos & Birria', 'Hero.jpg', 'tacosHeroImage', 'Al pastor trompo turning in front of an open flame'],
      ['Menu - Entrees & Fajitas', 'Hero.jpg', 'entreesHeroImage', 'Sizzling beef fajitas with grilled vegetables, rice and beans'],
      ['Menu - Quesadillas & Nachos', 'Hero.jpg', 'quesadillasNachosHeroImage', 'Nachos Grande topped with meat, guacamole and sour cream'],
      ['Menu - Specials', 'Hero.jpg', 'specialsHeroImage', 'Chile relleno topped with sour cream, served with rice and beans'],
      // ['Menu - Appetizers & Sides', 'Hero.jpg', 'appetizersSidesHeroImage', …] — no photo yet
      ['Menu - Kids', 'Hero.jpg', 'kidsHeroImage', 'Kids taco served with rice and beans'],
      ['Menu - Drinks & Margaritas', 'Hero.jpg', 'drinksHeroImage', 'Passion Li Hing “Mahalo Margarita” in a martini glass'],

      ['Menu - Breakfast', 'Takeout_or_Sit_Down.jpg', 'breakfastTakeoutImage', 'Mexican omelette topped with red and green salsa and avocado'],
      ['Menu - Entrees & Fajitas', 'Molcajete_Signature_Dish.jpg', 'entreesMolcajeteImage', 'Molcajete of grilled meats and vegetables served with rice, beans and tortillas'],
    ],
  },
};

// Category card photos. image = hub card (Menu/Explore_Our_Menu_*), exploreMoreImage = 4:3 card on other menu pages.
const CATEGORIES = [
  ['menuCategory-breakfast', 'Breakfast', 'Breakfast', 'Mexican omelette with avocado and salsa'],
  ['menuCategory-burritos', 'Burritos', 'Burritos', 'Burrito cut in half'],
  ['menuCategory-tacos', 'Tacos_and_Birria', 'Tacos & Birria', 'Taco de birria dipped in consomé'],
  ['menuCategory-entrees', 'Entrees_and_Fajitas', 'Entrees & Fajitas', 'Beef fajitas with grilled vegetables'],
  ['menuCategory-quesadillas-nachos', 'Quesadillas_and_Nachos', 'Quesadillas & Nachos', 'Nachos Grande'],
  ['menuCategory-specials', 'Specials', 'Specials', 'Pozole and menudo'],
  ['menuCategory-appetizers-sides', 'Appetizers_and_Sides', 'Appetizers & Sides', 'Fresh guacamole'],
  ['menuCategory-kids', 'Kids_Menu', 'Kids Menu', 'Kids cheese quesadilla'],
  ['menuCategory-drinks', 'Drinks_and_Margaritas', 'Drinks & Margaritas', 'Passion Li Hing “Mahalo Margarita”'],
];
// One folder per category page holds the 4:3 "Explore More" copy of every OTHER category; Kids has the Burritos page's copy of Kids, etc.
const EXPLORE_MORE_FOLDER = (stem) => (stem === 'Kids_Menu' ? 'Menu - Burritos' : 'Menu - Kids');

// Menu item photos: [folder, file stem, menuItem _id, title (used for alt text)]
const MENU_ITEMS = [
  ['Menu - Breakfast', 'Breakfast_Menu_Breakfast_Burrito', 'menuItem-breakfast-breakfast-burrito', 'Breakfast Burrito'],
  ['Menu - Breakfast', 'Breakfast_Menu_Chilaquiles', 'menuItem-breakfast-chilaquiles', 'Chilaquiles'],
  ['Menu - Breakfast', 'Breakfast_Menu_Huevos_con_Chorizo', 'menuItem-breakfast-huevos-con-chorizo', 'Huevos con Chorizo'],
  ['Menu - Breakfast', 'Breakfast_Menu_Mexican_Omelette', 'menuItem-breakfast-mexican-omelette', 'Mexican Omelette'],
  ['Menu - Breakfast', 'Breakfast_Menu_Asada_and_Eggs', 'menuItem-breakfast-asada-and-eggs', 'Asada and Eggs'],

  ['Menu - Burritos', 'Burritos_Burrito', 'menuItem-burritos-burrito', 'Burrito'],
  ['Menu - Burritos', 'Burritos_Seafood_Burrito', 'menuItem-burritos-seafood-burrito', 'Seafood Burrito'],
  ['Menu - Burritos', 'Burritos_Wet_Burrito', 'menuItem-burritos-wet-burrito', 'Wet Burrito'],

  ['Menu - Tacos & Birria', 'Tacos_Taco', 'menuItem-tacos-taco', 'Taco'],
  ['Menu - Tacos & Birria', 'Tacos_Taco_Grande', 'menuItem-tacos-taco-grande', 'Taco Grande'],
  ['Menu - Tacos & Birria', 'Tacos_Seafood_Taco', 'menuItem-tacos-seafood-taco', 'Seafood Taco'],
  ['Menu - Tacos & Birria', 'Birria_Tacos_de_Birria', 'menuItem-tacos-tacos-de-birria', 'Tacos de Birria'],

  ['Menu - Entrees & Fajitas', 'Entrees_Chicken_Enchiladas', 'menuItem-entrees-chicken-enchiladas', 'Chicken Enchiladas'],
  ['Menu - Entrees & Fajitas', 'Entrees_Taquitos', 'menuItem-entrees-taquitos', 'Taquitos'],
  ['Menu - Entrees & Fajitas', 'Entrees_Beef_Fajitas', 'menuItem-entrees-beef-fajitas', 'Beef Fajitas'],
  ['Menu - Entrees & Fajitas', 'Entrees_Chicken_Fajitas', 'menuItem-entrees-chicken-fajitas', 'Chicken Fajitas'],
  ['Menu - Entrees & Fajitas', 'Entrees_Carne_Asada', 'menuItem-entrees-carne-asada', 'Carne Asada'],

  ['Menu - Quesadillas & Nachos', 'Quesadillas_Quesadilla', 'menuItem-quesadillas-nachos-quesadilla', 'Quesadilla'],
  ['Menu - Quesadillas & Nachos', 'Quesadillas_Meat_Quesadilla', 'menuItem-quesadillas-nachos-meat-quesadilla', 'Meat Quesadilla'],
  ['Menu - Quesadillas & Nachos', 'Nachos_Nachos', 'menuItem-quesadillas-nachos-nachos', 'Nachos'],
  ['Menu - Quesadillas & Nachos', 'Nachos_Nachos_Grande', 'menuItem-quesadillas-nachos-nachos-grande', 'Nachos Grande'],

  ['Menu - Specials', 'Daily_Specials_Sope', 'menuItem-specials-sope', 'Sope'],
  ['Menu - Specials', 'Daily_Specials_Torta', 'menuItem-specials-torta', 'Torta'],
  ['Menu - Specials', 'Daily_Specials_Torta_Cubana', 'menuItem-specials-torta-cubana', 'Torta Cubana'],
  ['Menu - Specials', 'Daily_Specials_California_Fries', 'menuItem-specials-california-fries', 'California Fries'],
  ['Menu - Specials', 'Daily_Specials_Tamales', 'menuItem-specials-tamales', 'Tamales'],
  ['Menu - Specials', 'Daily_Specials_Taquitos', 'menuItem-specials-taquitos', 'Taquitos'],
  ['Menu - Specials', 'Daily_Specials_Tostada_de_Ceviche', 'menuItem-specials-tostada-de-ceviche', 'Tostada de Ceviche'],
  ['Menu - Specials', 'Daily_Specials_Elote', 'menuItem-specials-elote', 'Elote'],
  ['Menu - Specials', 'Weekend_Specials_Pozole', 'menuItem-specials-pozole', 'Pozole'],
  ['Menu - Specials', 'Weekend_Specials_Menudo', 'menuItem-specials-menudo', 'Menudo'],
  ['Menu - Specials', 'Weekend_Specials_Campechana', 'menuItem-specials-campechana', 'Campechana'],
  ['Menu - Specials', 'Weekend_Specials_Chile_Relleno', 'menuItem-specials-chile-relleno', 'Chile Relleno'],

  ['Menu - Appetizers & Sides', 'Appetizers_Guacamole', 'menuItem-appetizers-sides-guacamole', 'Guacamole'],
  ['Menu - Appetizers & Sides', 'Appetizers_Chorizo_Queso', 'menuItem-appetizers-sides-chorizo-queso', 'Chorizo Queso'],
  ['Menu - Appetizers & Sides', 'Appetizers_Bean_Dip', 'menuItem-appetizers-sides-bean-dip', 'Bean Dip'],
  ['Menu - Appetizers & Sides', 'Sides_Pico_de_Gallo', 'menuItem-appetizers-sides-pico-de-gallo', 'Pico de Gallo'],
  ['Menu - Appetizers & Sides', 'Sides_Queso_Sauce', 'menuItem-appetizers-sides-queso-sauce', 'Queso Sauce'],
  ['Menu - Appetizers & Sides', 'Sides_Rice', 'menuItem-appetizers-sides-rice', 'Rice'],
  ['Menu - Appetizers & Sides', 'Sides_Beans', 'menuItem-appetizers-sides-beans', 'Beans'],

  ['Menu - Kids', 'Kids_Menu_Cheese_Quesadilla', 'menuItem-kids-cheese-quesadilla', 'Cheese Quesadilla'],
  ['Menu - Kids', 'Kids_Menu_Taco', 'menuItem-kids-taco', 'Taco'],

  ['Menu - Drinks & Margaritas', 'Signature_Margaritas_Passion_Li_Hing_Mahalo_Margarita', 'menuItem-drinks-passion-li-hing-mahalo-margarita', 'Passion Li Hing “Mahalo Margarita”'],
  ['Menu - Drinks & Margaritas', 'Signature_Margaritas_Michelada', 'menuItem-drinks-michelada', 'Michelada'],
  ['Menu - Drinks & Margaritas', 'Other_Drinks_Aguas_Frescas', 'menuItem-drinks-aguas-frescas', 'Aguas Frescas'],
  ['Menu - Drinks & Margaritas', 'Other_Drinks_Jarritos', 'menuItem-drinks-jarritos', 'Jarritos'],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const used = new Set(); // every file path that a slot consumed
const assetCache = new Map(); // sha1 → asset _id (the same photo is reused across pages)

function resolveFile(folder, file) {
  const path = join(SOURCE, folder, file);
  return existsSync(path) ? path : null;
}

async function uploadAsset(path) {
  used.add(path);
  const hash = createHash('sha1').update(readFileSync(path)).digest('hex');
  if (assetCache.has(hash)) return assetCache.get(hash);
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: basename(path),
    contentType: 'image/jpeg',
  });
  assetCache.set(hash, asset._id);
  return asset._id;
}

const imageValue = (assetId, alt) => ({ _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt });

/** Fill `fields` ([field, path, alt][]) on a document; skip ones that are already set unless --force. */
async function fillDocument(id, fields, { create } = {}) {
  if (create) await client.createIfNotExists({ _id: id, _type: create });
  const existing = (await client.getDocument(id)) ?? null;
  if (!existing) {
    console.warn(`  !  ${id} does not exist — skipped`);
    return { set: 0, kept: 0 };
  }

  const patch = {};
  let kept = 0;
  for (const [field, path, alt] of fields) {
    if (!FORCE && existing[field]?.asset?._ref) {
      used.add(path);
      kept++;
      continue;
    }
    patch[field] = imageValue(await uploadAsset(path), alt);
  }
  if (Object.keys(patch).length) await client.patch(id).set(patch).commit();
  return { set: Object.keys(patch).length, kept };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nEl Ranchero — page image upload${FORCE ? ' (--force)' : ''}\n`);
  const totals = { set: 0, kept: 0 };
  const add = (r) => ((totals.set += r.set), (totals.kept += r.kept));

  // Singletons
  for (const [id, { type, slots }] of Object.entries(SINGLETONS)) {
    const fields = [];
    for (const [folder, file, field, alt] of slots) {
      const path = resolveFile(folder, file);
      if (!path) {
        console.warn(`  !  ${folder}/${file} not found — ${field} left empty`);
        continue;
      }
      fields.push([field, path, alt]);
    }
    const r = await fillDocument(id, fields, { create: type });
    add(r);
    console.log(`  ✓  ${id.padEnd(22)} ${r.set} set, ${r.kept} kept`);
  }

  // Menu categories
  for (const [id, stem, title, alt] of CATEGORIES) {
    const hub = resolveFile('Menu', `Explore_Our_Menu_${stem}.jpg`);
    const more = resolveFile(EXPLORE_MORE_FOLDER(stem), `Explore_More_${stem}.jpg`);
    const fields = [];
    if (hub) fields.push(['image', hub, `${alt} — ${title} category`]);
    if (more) fields.push(['exploreMoreImage', more, `${alt} — ${title} category`]);
    const r = await fillDocument(id, fields);
    add(r);
    console.log(`  ✓  ${id.padEnd(34)} ${r.set} set, ${r.kept} kept`);
  }

  // Menu items — a few at a time
  const queue = [...MENU_ITEMS];
  let itemsDone = 0;
  const worker = async () => {
    for (let row = queue.shift(); row; row = queue.shift()) {
      const [folder, stem, id, title] = row;
      const path = resolveFile(folder, `${stem}.jpg`);
      if (!path) {
        console.warn(`  !  ${folder}/${stem}.jpg not found — ${id} left empty`);
        continue;
      }
      try {
        const r = await fillDocument(id, [['photo', path, `${title} at Taqueria El Ranchero`]]);
        add(r);
        itemsDone++;
      } catch (error) {
        console.error(`  ✗  ${id}: ${error.message}`);
      }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(`  ✓  ${itemsDone} menu items`);

  // Any photo in the folder that no slot used (Homepage is handled by upload-homepage-images.mjs)
  const unused = [];
  for (const folder of readdirSync(SOURCE, { withFileTypes: true })) {
    if (!folder.isDirectory() || folder.name === 'Homepage') continue;
    for (const file of readdirSync(join(SOURCE, folder.name))) {
      const path = join(SOURCE, folder.name, file);
      if (/\.(jpe?g|png|webp)$/i.test(file) && !used.has(path)) unused.push(relative(SOURCE, path));
    }
  }
  const sameAsUsed = (rel) => {
    // "Explore More" copies are byte-identical to ones already uploaded (checked by hash)
    const hash = createHash('sha1').update(readFileSync(join(SOURCE, rel))).digest('hex');
    return assetCache.has(hash);
  };
  const orphaned = unused.filter((rel) => !sameAsUsed(rel));

  console.log(`\nDone — ${totals.set} fields set, ${totals.kept} kept, ${assetCache.size} unique assets.`);
  if (orphaned.length) {
    console.log('\nPhotos not mapped to any slot:');
    for (const rel of orphaned) console.log(`  - ${rel}`);
  } else {
    console.log('Every photo in the folder is mapped to a slot (or is a duplicate of one that is).');
  }
  console.log();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
