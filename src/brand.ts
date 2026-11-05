/**
 * Brand tokens — the only file to edit when a Figma file (or a new client)
 * changes colors, type, or radius.
 *
 * Flow:
 * 1. Paste values extracted from Figma (MCP `get_variable_defs`, or walk
 *    fills/text if there is no Variables / Design System frame).
 * 2. `CustomStyles.astro` and `astro.config.ts` read this file at build time.
 * 3. Components never hardcode hex — they use Tailwind tokens backed by these CSS vars.
 *
 * Do not put contact data, GTM, nav links, or page copy here.
 * Those live in `src/config/site.ts`, `src/config/contact.ts`, and siblings.
 */

export const brand = {
  fonts: {
    /** Headings, ticker, and quotes. Bree Serif ships Regular only. */
    heading: {
      name: 'Bree Serif',
      cssVariable: '--font-bree-serif',
      provider: 'local' as const,
      /** Only Regular is in the family, so display type stays at 400. */
      displayWeight: '400',
      weights: ['400'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['serif'] as string[],
      files: [
        {
          src: './src/fonts/bree-serif/BreeSerif-Regular.ttf',
          weight: '400',
          style: 'normal' as const,
        },
      ],
    },
    /** Body copy, nav links, and CTA labels. Variable wght axis 300–900. */
    body: {
      name: 'Figtree',
      cssVariable: '--font-figtree',
      provider: 'local' as const,
      weights: ['300 900'] as string[],
      styles: ['normal', 'italic'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['sans-serif'] as string[],
      files: [
        {
          src: './src/fonts/figtree/Figtree-VariableFont_wght.ttf',
          weight: '300 900',
          style: 'normal' as const,
        },
        {
          src: './src/fonts/figtree/Figtree-Italic-VariableFont_wght.ttf',
          weight: '300 900',
          style: 'italic' as const,
        },
      ],
    },
  },

  /** Style Guide 110:2377 — named fills. Hover tints are derived. */
  colors: {
    accent: '#7F1D1D', // maroon — links, buttons, highlights
    accentHover: '#991B1B', // red-800
    heading: '#09090B', // near-black
    muted: '#78350F', // brown
    blogText: '#3A3A3A', // blog article body
    eyebrow: '#78350F', // brown
    page: '#FFFFFF', // white page
    sectionGrey: '#FEF3C7', // warm cream band
    sectionDark: '#7F1D1D', // maroon band
    footer: '#541313', // deepest maroon — site footer
    sectionGreen: '#064E3B', // deep green band (emerald-900) — FAQ
    statBand: '#607B6B', // sage — hero stats band (Figma 2083:1676)
    card: '#FFFBEB', // cream
    cardMist: '#FEF3C7',
    cardDark: '#78350F', // brown — buttons/cards sitting on maroon bands
    ctaBg: '#78350F', // brown tags / pills
    ctaEnd: '#09090B',
    ctaTan: '#78350F', // secondary (brown) button
    tanText: '#09090B', // secondary hover
    tanBody: '#78350F',
    ctaPink: '#FFFBEB',
    ctaPinkText: '#7F1D1D',
    featureCard: '#FFFBEB',
    primary: '#7F1D1D',
    secondary: '#A1A1AA', // zinc-400 — borders / dividers
    navy: '#78350F', // brown — hover state for maroon buttons
    white: '#FFFFFF',
    cream: '#FFFBEB', // text on maroon / green bands
    nav: '#FFFFFF',
    black: '#09090B',
    /** White header bar with maroon accents. */
    header: '#FFFFFF',
    headerText: '#09090B',
    headerAccent: '#7F1D1D',
    headerAccentHover: '#991B1B',
    /** Wallpaper behind transparent sections. */
    gradientFrom: '#FFFFFF',
    gradientTo: '#FFFBEB',
    pageWashFrom: '#FFFFFF',
    pageWashTo: '#FFFFFF',
  },

  type: {
    /**
     * Style Guide 110:2377 (desktop). No mobile type in the file —
     * mobile sizes are an optical scale (not a flat %), so Bree Serif
     * still has a clear h1 > h2 > h3 step on a 390px screen.
     * Faces: headings, ticker, and quotes = Bree Serif; body, nav, and CTA labels = Figtree.
     */
    h1: { size: '72px', mobile: '40px', lineHeight: '1.05', tracking: '-0.01em' },
    h2: { size: '52px', mobile: '28px', lineHeight: '1.1', tracking: '-0.01em' },
    h3: { size: '26px', mobile: '22px', lineHeight: '1.2', tracking: '0' },
    /** Extra — not in the Style Guide. */
    h4: { size: '24px', mobile: '18px', lineHeight: '1.2', tracking: '0' },
    /** Roomier than the Style Guide (14/1.3, -1%): Figtree reads best at 16px / 1.6 with no negative tracking. */
    body: { size: '16px', mobile: '16px', lineHeight: '1.6', tracking: '0' },
    bodyLg: { size: '18px', mobile: '16px', lineHeight: '1.6', tracking: '0' },
    button: { size: '14px', mobile: '14px', lineHeight: '1', tracking: '0.04em' },
    /** Figma `tag`; Figtree. */
    eyebrow: { size: '16px', mobile: '15px', lineHeight: '1.2', tracking: '0.02em' },
    small: { size: '14px', mobile: '14px', lineHeight: '1.55', tracking: '0' },
    caption: { size: '12px', mobile: '12px', lineHeight: '1.4', tracking: '0' },
    /** Footer column titles — extra, not in the Style Guide. */
    label: { size: '18px', mobile: '16px', lineHeight: '1', tracking: '0.06em' },
    /** Figma `accent`. */
    ticker: { size: '32px', mobile: '24px', lineHeight: '1', tracking: '0' },
    /** Figma `quote`. */
    quote: { size: '22px', mobile: '18px', lineHeight: '1.2', tracking: '0' },
  },

  radius: {
    base: '0px',
    lg: '0px',
    xl: '0px',
    hero: '0px',
    full: '9999px',
  },
} as const;

export type Brand = typeof brand;

export { hexToChannels, rgb, brandStylesheet } from './brandCss';

/** Local font entries for astro.config.ts. Layout.astro renders them with `<Font>`. */
export function brandFontConfig() {
  const { heading, body } = brand.fonts;
  return [heading, body].map((font) => ({
    name: font.name,
    cssVariable: font.cssVariable,
    provider: font.provider,
    fallbacks: font.fallbacks,
    files: font.files,
  }));
}
