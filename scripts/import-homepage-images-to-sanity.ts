import { createClient } from '@sanity/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

type HomepageImageSlot = {
  field: 'heroImage' | 'localSourcingImage' | 'locationsImage';
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
const homepageDocumentId = 'singleton-homepage';

const slots: HomepageImageSlot[] = [
  {
    field: 'heroImage',
    filePath: fileURLToPath(new URL('../src/assets/images/hero-cover.webp', import.meta.url)),
    alt: 'Fresh ahi salad with island greens and avocado',
  },
  {
    field: 'localSourcingImage',
    filePath: fileURLToPath(new URL('../site-images/Home/Our Local Sourcing.png', import.meta.url)),
    alt: 'Fresh local produce and ingredients used by El Ranchero',
  },
  {
    field: 'locationsImage',
    filePath: fileURLToPath(new URL('../site-images/Home/Visit a Store Near You.jpeg', import.meta.url)),
    alt: 'El Ranchero storefront and dining area',
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

async function uploadSlot(slot: HomepageImageSlot) {
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
  console.log(commit ? 'Importing homepage images with --commit.' : 'Running homepage image import dry-run.');
  console.log('Images:');
  slots.forEach((slot) => console.log(`- ${slot.field}: ${slot.filePath}`));
  console.log(`Sanity: ${projectId}/${dataset}`);

  const missing: HomepageImageSlot[] = [];
  for (const slot of slots) {
    try {
      await fs.access(slot.filePath);
    } catch {
      missing.push(slot);
    }
  }

  if (missing.length) {
    console.log('\nMissing homepage images:');
    missing.forEach((slot) => console.log(`- ${slot.filePath}`));
    throw new Error('Homepage image import has missing files.');
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
    .createIfNotExists({ _id: homepageDocumentId, _type: 'homepageContent' })
    .patch(homepageDocumentId, (patch) => patch.set(imageFields))
    .commit({ autoGenerateArrayKeys: true });

  console.log(`\nDone. Uploaded and patched ${uploadedSlots.length} homepage images.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
