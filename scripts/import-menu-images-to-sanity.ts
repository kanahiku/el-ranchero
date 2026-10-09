import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

type PhotoSelection = {
  menuItem: string;
  cleanTopView: boolean;
  chosenPhoto: string;
};

type SanityMenuItem = {
  _id: string;
  title?: string;
  slug?: string;
};

type SanityImageAsset = {
  _id: string;
};

const menuItemAliases = new Map<string, string>([
  ['grilled cheese combo', 'grilled cheese soup combo'],
  ['hummis pita wrap', 'hummus pita wrap'],
  ['organic hibiscus mint mamaki tea', 'big island mamaki mint tea'],
]);

const commit = process.argv.includes('--commit');
const allowPartial = process.argv.includes('--allow-partial');
const projectId = process.env.SANITY_PROJECT_ID ?? 'jntapqhj';
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;
const imageDir = fileURLToPath(new URL('../src/menu-images', import.meta.url));
const photoMapPath = fileURLToPath(new URL('./data/menu-photo-map.tsv', import.meta.url));
const maxWidth = 1600;
const maxHeight = 1200;

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

function basenameWithoutExtension(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

async function readPhotoSelections(): Promise<PhotoSelection[]> {
  const raw = await fs.readFile(photoMapPath, 'utf8');
  const [header, ...rows] = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const columns = header.split('\t').map((column) => column.trim());
  const menuItemIndex = columns.indexOf('Menu Item');
  const cleanTopViewIndex = columns.indexOf('Clean Top View');
  const chosenPhotoIndex = columns.indexOf('Chosen Photo for Menu');

  if (menuItemIndex === -1 || cleanTopViewIndex === -1 || chosenPhotoIndex === -1) {
    throw new Error(`Photo map is missing required columns: ${photoMapPath}`);
  }

  return rows.map((row, index) => {
    const cells = row.split('\t').map((cell) => cell.trim());
    const menuItem = cells[menuItemIndex];
    const chosenPhoto = cells[chosenPhotoIndex];
    if (!menuItem || !chosenPhoto) throw new Error(`Photo map row ${index + 2} is missing menu item or chosen photo.`);

    return {
      menuItem,
      cleanTopView: /^yes$/i.test(cells[cleanTopViewIndex] ?? ''),
      chosenPhoto,
    };
  });
}

async function listImageFiles(): Promise<string[]> {
  const entries = await fs.readdir(imageDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function findImageFile(chosenPhoto: string, imageFiles: string[]): string[] {
  const target = normalize(chosenPhoto);
  return imageFiles.filter((file) => normalize(basenameWithoutExtension(file)) === target);
}

function findMenuItem(row: PhotoSelection, sanityItems: SanityMenuItem[]): SanityMenuItem | undefined {
  const target = normalize(menuItemAliases.get(normalize(row.menuItem)) ?? row.menuItem);
  return sanityItems.find((item) => normalize(item.title ?? '') === target || normalize(item.slug ?? '') === target);
}

async function fetchMenuItems(): Promise<SanityMenuItem[]> {
  return client.fetch<SanityMenuItem[]>(/* groq */ `
    *[_type == "menuItem"] | order(title asc) {
      _id,
      title,
      "slug": slug.current
    }
  `);
}

async function optimizeImage(fileName: string): Promise<Buffer> {
  return sharp(path.join(imageDir, fileName))
    .rotate()
    .resize({ width: maxWidth, height: maxHeight, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

async function uploadAndPatch(row: PhotoSelection, fileName: string, menuItem: SanityMenuItem): Promise<void> {
  const buffer = await optimizeImage(fileName);
  const asset = (await client.assets.upload('image', buffer, {
    filename: `${slugify(row.menuItem)}.jpg`,
    contentType: 'image/jpeg',
  })) as SanityImageAsset;

  await client
    .patch(menuItem._id)
    .set({
      photo: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: row.menuItem,
      },
    })
    .commit();
}

async function main() {
  console.log(commit ? 'Running menu image import with --commit.' : 'Running menu image import dry-run.');
  console.log(`Images: ${imageDir}`);
  console.log(`Photo map: ${photoMapPath}`);
  console.log(`Sanity: ${projectId}/${dataset}`);

  const photoSelections = await readPhotoSelections();
  const imageFiles = await listImageFiles();
  const sanityItems = await fetchMenuItems();

  const report = photoSelections.map((row) => {
    const imageMatches = findImageFile(row.chosenPhoto, imageFiles);
    const menuItem = findMenuItem(row, sanityItems);
    return { row, imageMatches, menuItem };
  });

  const missingImages = report.filter((entry) => entry.imageMatches.length === 0);
  const ambiguousImages = report.filter((entry) => entry.imageMatches.length > 1);
  const missingMenuItems = report.filter((entry) => !entry.menuItem);
  const ready = report.filter((entry) => entry.imageMatches.length === 1 && entry.menuItem);

  console.log(`\nRows: ${photoSelections.length}`);
  console.log(`Images found: ${imageFiles.length}`);
  console.log(`Sanity menu items found: ${sanityItems.length}`);
  console.log(`Ready: ${ready.length}`);
  console.log(`Missing images: ${missingImages.length}`);
  console.log(`Ambiguous images: ${ambiguousImages.length}`);
  console.log(`Missing Sanity menu items: ${missingMenuItems.length}`);

  if (missingImages.length) {
    console.log('\nMissing images:');
    missingImages.forEach(({ row }) => console.log(`- ${row.menuItem}: ${row.chosenPhoto}`));
  }

  if (ambiguousImages.length) {
    console.log('\nAmbiguous image matches:');
    ambiguousImages.forEach(({ row, imageMatches }) => console.log(`- ${row.menuItem}: ${imageMatches.join(', ')}`));
  }

  if (missingMenuItems.length) {
    console.log('\nMissing Sanity menu items:');
    missingMenuItems.forEach(({ row }) => console.log(`- ${row.menuItem}`));
  }

  if (!commit) {
    console.log('\nDry-run only. Re-run with --commit to upload and patch Sanity.');
    return;
  }

  if (!token) {
    throw new Error('SANITY_API_TOKEN is required when running with --commit.');
  }

  if (!allowPartial && (missingImages.length || ambiguousImages.length || missingMenuItems.length)) {
    throw new Error(
      'Import has unresolved rows. Fix the report above, or use --allow-partial to upload only ready rows.'
    );
  }

  for (const { row, imageMatches, menuItem } of ready) {
    console.log(`Uploading ${row.menuItem} <- ${imageMatches[0]}`);
    await uploadAndPatch(row, imageMatches[0], menuItem);
  }

  console.log(`\nDone. Uploaded and patched ${ready.length} menu items.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
