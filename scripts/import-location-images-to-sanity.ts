import { createClient } from '@sanity/client';
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

type LocationImageSlot = {
  field:
    | 'directoryImage'
    | 'kailuaImage'
    | 'kahalaImage'
    | 'kaneoheImage'
    | 'kapoleiImage'
    | 'mililaniImage'
    | 'pearlridgeImage';
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
const locationsDocumentId = 'singleton-locations';
const execFileAsync = promisify(execFile);

const kailuaPath = fileURLToPath(new URL('../site-images/locations/kailua/IMG_6144.jpeg', import.meta.url));

const slots: LocationImageSlot[] = [
  {
    field: 'directoryImage',
    filePath: kailuaPath,
    alt: 'El Ranchero location on Oahu',
  },
  {
    field: 'kailuaImage',
    filePath: kailuaPath,
    alt: 'El Ranchero Kailua storefront',
  },
  {
    field: 'kahalaImage',
    filePath: fileURLToPath(new URL('../site-images/locations/kahala/IMG_1034.HEIC', import.meta.url)),
    alt: 'El Ranchero Kahala location',
  },
  {
    field: 'kaneoheImage',
    filePath: fileURLToPath(
      new URL('../site-images/locations/kaneohe/9C980029-FCFC-4CE9-8BC8-57C5E8D2B17A.jpeg', import.meta.url)
    ),
    alt: 'El Ranchero Kaneohe location',
  },
  {
    field: 'kapoleiImage',
    filePath: fileURLToPath(new URL('../site-images/locations/kapolei/IMG_2663.jpeg', import.meta.url)),
    alt: 'El Ranchero Kapolei location',
  },
  {
    field: 'mililaniImage',
    filePath: fileURLToPath(new URL('../site-images/locations/mililani/IMG_2653.jpeg', import.meta.url)),
    alt: 'El Ranchero Mililani location',
  },
  {
    field: 'pearlridgeImage',
    filePath: fileURLToPath(new URL('../site-images/locations/pearlridge/1000007055.jpg', import.meta.url)),
    alt: 'El Ranchero Pearlridge location',
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
  let sourcePath = filePath;
  let tempDir: string | undefined;

  if (/\.(heic|heif)$/i.test(filePath)) {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ranchero-location-image-'));
    sourcePath = path.join(tempDir, `${path.basename(filePath, path.extname(filePath))}.jpg`);
    await execFileAsync('sips', ['-s', 'format', 'jpeg', filePath, '--out', sourcePath]);
  }

  try {
    return await sharp(sourcePath)
      .rotate()
      .resize({ width: 1920, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
  } finally {
    if (tempDir) await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function uploadSlot(slot: LocationImageSlot) {
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
  console.log(commit ? 'Importing location images with --commit.' : 'Running location image import dry-run.');
  console.log('Images:');
  slots.forEach((slot) => console.log(`- ${slot.field}: ${slot.filePath}`));
  console.log(`Sanity: ${projectId}/${dataset}`);

  const missing: LocationImageSlot[] = [];
  for (const slot of slots) {
    try {
      await fs.access(slot.filePath);
    } catch {
      missing.push(slot);
    }
  }

  if (missing.length) {
    console.log('\nMissing location images:');
    missing.forEach((slot) => console.log(`- ${slot.filePath}`));
    throw new Error('Location image import has missing files.');
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
    .createIfNotExists({ _id: locationsDocumentId, _type: 'locationsContent' })
    .patch(locationsDocumentId, (patch) => patch.set(imageFields))
    .commit({ autoGenerateArrayKeys: true });

  console.log(`\nDone. Uploaded and patched ${uploadedSlots.length} location images.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
