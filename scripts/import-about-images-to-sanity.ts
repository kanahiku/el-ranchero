import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

type AboutImageSlot = {
  field: 'heroImage' | 'storyImage' | 'sustainabilityImage' | 'vendorsImage';
  filePath: string;
  alt: string;
};

type SanityImageAsset = {
  _id: string;
};

const commit = process.argv.includes('--commit');
const projectId = process.env.SANITY_PROJECT_ID ?? 'jntapqhj';
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
const aboutDocumentId = 'singleton-about';

const slots: AboutImageSlot[] = [
  {
    field: 'heroImage',
    filePath: fileURLToPath(new URL('../site-images/about/About El Ranchero.jpg', import.meta.url)),
    alt: 'El Ranchero team and restaurant scene',
  },
  {
    field: 'storyImage',
    filePath: fileURLToPath(new URL('../site-images/about/Our Story.webp', import.meta.url)),
    alt: 'El Ranchero original story and fresh food',
  },
  {
    field: 'sustainabilityImage',
    filePath: fileURLToPath(new URL('../site-images/about/Sustainability.png', import.meta.url)),
    alt: 'Fresh ingredients representing El Ranchero sustainability',
  },
  {
    field: 'vendorsImage',
    filePath: fileURLToPath(new URL('../site-images/about/Our Vendors.jpg', import.meta.url)),
    alt: 'El Ranchero vendors and local ingredients',
  },
];

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-15',
  useCdn: false,
  ...(token ? { token } : {}),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function optimizeImage(filePath: string): Promise<Buffer> {
  return sharp(filePath)
    .rotate()
    .resize({ width: 1920, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
}

async function uploadSlot(slot: AboutImageSlot) {
  const buffer = await optimizeImage(slot.filePath);
  const asset = (await client.assets.upload('image', buffer, {
    filename: `${slot.field}-${slugify(path.basename(slot.filePath, path.extname(slot.filePath)))}.jpg`,
    contentType: 'image/jpeg',
  })) as SanityImageAsset;

  return {
    field: slot.field,
    value: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: slot.alt,
    },
  };
}

async function main() {
  console.log(commit ? 'Importing about images with --commit.' : 'Running about image import dry-run.');
  console.log('Images:');
  slots.forEach((slot) => console.log(`- ${slot.field}: ${slot.filePath}`));
  console.log(`Sanity: ${projectId}/${dataset}`);

  const missing: AboutImageSlot[] = [];
  for (const slot of slots) {
    try {
      await fs.access(slot.filePath);
    } catch {
      missing.push(slot);
    }
  }

  if (missing.length) {
    console.log('\nMissing about images:');
    missing.forEach((slot) => console.log(`- ${slot.filePath}`));
    throw new Error('About image import has missing files.');
  }

  slots.forEach((slot) => console.log(`Ready: ${slot.field} <- ${path.basename(slot.filePath)}`));

  if (!commit) {
    console.log('\nDry-run only. Re-run with --commit to upload and patch Sanity.');
    return;
  }

  if (!token) throw new Error('SANITY_WRITE_TOKEN or SANITY_API_TOKEN is required when running with --commit.');

  const uploadedSlots = await Promise.all(slots.map(uploadSlot));
  const imageFields = Object.fromEntries(uploadedSlots.map(({ field, value }) => [field, value]));

  await client
    .transaction()
    .createIfNotExists({ _id: aboutDocumentId, _type: 'aboutContent' })
    .patch(aboutDocumentId, (patch) => patch.set(imageFields))
    .commit({ autoGenerateArrayKeys: true });

  console.log(`\nDone. Uploaded and patched ${uploadedSlots.length} about images.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
