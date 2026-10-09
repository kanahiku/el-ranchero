/**
 * Regenerates every brand identity asset from the El Ranchero logo mark
 * (the rider + horse on the left of src/assets/images/logo.png):
 *
 *   public/favicon.svg, public/favicon.ico, public/favicon-32.png,
 *   public/apple-touch-icon.png, src/assets/images/og-image.jpg
 *
 *   node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';

const BRAND_BG = '#7F1D1D'; // brand.colors.accent (maroon)
const BRAND_CREAM = '#FFFBEB'; // brand.colors.cream
const BRAND_AMBER = '#FEF3C7'; // brand.colors.sectionGrey

const LOGO = 'src/assets/images/logo.png';
// Rider + horse occupy roughly the first 52px of the 185×62 logo.
const MARK_CROP = { left: 0, top: 0, width: 48, height: 62 };

/** Smooth, cream silhouette of the rider + horse (transparent PNG, 8× upscaled). */
async function buildMark() {
  let alpha = await sharp(LOGO)
    .extract(MARK_CROP)
    .ensureAlpha()
    .extractChannel(3)
    .resize(MARK_CROP.width * 8, MARK_CROP.height * 8, { kernel: 'lanczos3' })
    .blur(2)
    .threshold(110)
    // Morphological opening: erode (drops the 1px border rules that touch the
    // rider), then dilate back so the horse keeps its full shape.
    .blur(4)
    .threshold(175)
    .blur(4.5)
    .threshold(60)
    .blur(2)
    .threshold(128)
    .png()
    .toBuffer();
  // The logo's top border rule starts just right of the hat — blank it out.
  alpha = await sharp(alpha)
    .composite([{ input: { create: { width: 24 * 8, height: 9 * 8, channels: 3, background: '#000' } }, left: 27 * 8, top: 0 }])
    .greyscale()
    .png()
    .toBuffer();
  const { width, height } = await sharp(alpha).metadata();
  return sharp({
    create: { width, height, channels: 3, background: BRAND_CREAM },
  })
    .joinChannel(await sharp(alpha).greyscale().raw().toBuffer(), { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();
}

const mark = await buildMark();
const { width: mw, height: mh } = await sharp(mark).metadata();

// ── favicon.svg (square, mark centred with padding) ───────────────────────────
const SIZE = 64;
const markH = 46;
const markW = (mw / mh) * markH;
const markDataUri = `data:image/png;base64,${(await sharp(mark).resize(Math.round(markW * 4), markH * 4).png().toBuffer()).toString('base64')}`;
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="32" height="32">
  <!-- El Ranchero favicon — cream rider + horse (from logo.png) on brand maroon. Regenerate with scripts/gen-icons.mjs -->
  <rect width="${SIZE}" height="${SIZE}" rx="12" fill="${BRAND_BG}"/>
  <image href="${markDataUri}" x="${((SIZE - markW) / 2).toFixed(2)}" y="${(SIZE - markH) / 2}" width="${markW.toFixed(2)}" height="${markH}"/>
</svg>
`;
writeFileSync('public/favicon.svg', faviconSvg);

// ── raster icons ──────────────────────────────────────────────────────────────
async function square(px, { radius = 0.1875 } = {}) {
  const inner = Math.round(px * (markH / SIZE));
  const m = await sharp(mark).resize({ height: inner }).png().toBuffer();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}"><rect width="${px}" height="${px}" rx="${px * radius}" fill="#fff"/></svg>`,
  );
  return sharp({ create: { width: px, height: px, channels: 4, background: BRAND_BG } })
    .composite([{ input: m, gravity: 'center' }, { input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

// apple-touch-icon must be opaque (iOS fills transparency with black) → no rounded corners.
const apple = await sharp({ create: { width: 180, height: 180, channels: 4, background: BRAND_BG } })
  .composite([{ input: await sharp(mark).resize({ height: Math.round(180 * (markH / SIZE)) }).png().toBuffer(), gravity: 'center' }])
  .png()
  .toBuffer();

// ── og-image (1200×630) ───────────────────────────────────────────────────────
const ogBase = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${BRAND_BG}"/>
  <rect x="318" y="150" width="3" height="330" fill="${BRAND_AMBER}" opacity="0.4"/>
  <text x="360" y="305" font-family="Georgia,serif" font-size="96" fill="${BRAND_CREAM}">El Ranchero</text>
  <text x="364" y="372" font-family="Arial,sans-serif" font-size="32" letter-spacing="4" fill="${BRAND_AMBER}">TAQUERIA</text>
  <rect x="0" y="610" width="1200" height="4" fill="${BRAND_AMBER}" opacity="0.35"/>
</svg>`);
const ogMark = await sharp(mark).resize({ height: 330 }).png().toBuffer();

const ico32 = await sharp(await square(32, { radius: 0.1875 })).png().toBuffer();

await Promise.all([
  sharp(apple).toFile('public/apple-touch-icon.png'),
  sharp(ico32).toFile('public/favicon.ico'),
  sharp(ico32).toFile('public/favicon-32.png'),
  sharp(ogBase)
    .composite([{ input: ogMark, left: 130, top: 150 }])
    .jpeg({ quality: 92 })
    .toFile('src/assets/images/og-image.jpg'),
]);
console.log('✓ favicon.svg ✓ favicon.ico ✓ favicon-32.png ✓ apple-touch-icon.png ✓ og-image.jpg');
