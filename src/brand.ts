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
    /** Headings (h1–h4, section titles). Single-weight display face. */
    heading: {
      name: 'Smokum',
      cssVariable: '--font-smokum',
      provider: 'google' as const,
      displayWeight: '400',
      weights: ['400'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['serif'] as string[],
    },
    /** Eyebrows, ticker, quotes — script accent. */
    eyebrow: {
      name: 'Kaushan Script',
      cssVariable: '--font-kaushan',
      provider: 'google' as const,
      weights: ['400'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['cursive'] as string[],
    },
    /** Paragraphs and UI text. */
    body: {
      name: 'Host Grotesk',
      cssVariable: '--font-host-grotesk',
      provider: 'google' as const,
      weights: ['300', '400', '500', '600', '700', '800'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['sans-serif'] as string[],
    },
    /** CTAs / buttons. */
    button: {
      name: 'Rye',
      cssVariable: '--font-rye',
      provider: 'google' as const,
      weights: ['400'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['serif'] as string[],
    },
  },

  /** Figma "Taqueria El Ranchero (For Review)" — Variant 1 (2083:1854). */
  colors: {
    accent: '#A3201C', // chile red — buttons, eyebrows, highlights
    accentHover: '#8A1A17',
    heading: '#2A1A12', // ink brown — type, borders, hard shadows
    muted: '#5B4636', // secondary body
    blogText: '#3A3A3A', // blog article body
    eyebrow: '#A3201C',
    page: '#F4E9D4', // paper
    sectionGrey: '#DCD3C2', // image / motif placeholder grey
    sectionDark: '#A3201C', // red band
    sectionGreen: '#1F4D2B', // green band
    card: '#FFF8EA', // cream card / polaroid
    cardMist: '#F4E9D4',
    cardDark: '#2A1A12',
    ctaBg: '#E9A23B', // marigold
    ctaEnd: '#2A1A12',
    ctaTan: '#2A1A12',
    tanText: '#2A1A12',
    tanBody: '#4A3728', // paragraph on paper
    ctaPink: '#FFF8EA',
    ctaPinkText: '#A3201C',
    featureCard: '#FFF8EA',
    primary: '#A3201C',
    secondary: '#9C8B78', // taupe — dividers
    navy: '#2A1A12', // ink — hover state for red buttons
    white: '#FFFFFF',
    cream: '#FFF8EA', // text on red / green / ink bands
    nav: '#F4E9D4',
    black: '#2A1A12',
    header: '#F4E9D4',
    headerText: '#2A1A12',
    headerAccent: '#A3201C',
    headerAccentHover: '#8A1A17',
    gradientFrom: '#F4E9D4',
    gradientTo: '#F4E9D4',
    pageWashFrom: '#F4E9D4',
    pageWashTo: '#F4E9D4',
    /** Extra fills used by the homepage frames. */
    marigold: '#E9A23B',
    blush: '#F6DCCF', // body on red
    sage: '#D6E2D3', // body on green
    sand: '#CDBBA4', // body on ink
    taupe: '#9C8B78', // legal text on ink
  },

  type: {
    /**
     * Figma desktop: hero 138 / section 84 / panel 56 / card 44 / ticket 34.
     * No mobile type in the file — optical scale for Smokum (condensed, so it
     * can stay large on a 390px screen).
     * Faces: Smokum headings, Kaushan Script eyebrows, Host Grotesk body, Rye buttons.
     */
    h1: { size: '138px', mobile: '68px', lineHeight: '0.82', tracking: '0' },
    h2: { size: '84px', mobile: '46px', lineHeight: '0.88', tracking: '-0.01em' },
    h3: { size: '56px', mobile: '38px', lineHeight: '0.9', tracking: '0' },
    h4: { size: '44px', mobile: '32px', lineHeight: '0.95', tracking: '0' },
    /** Ticket titles. */
    h5: { size: '34px', mobile: '28px', lineHeight: '0.95', tracking: '0' },
    /** Closing CTA headline. */
    display: { size: '104px', mobile: '52px', lineHeight: '0.86', tracking: '0' },
    body: { size: '16px', mobile: '16px', lineHeight: '1.55', tracking: '0' },
    bodyLg: { size: '18px', mobile: '17px', lineHeight: '1.55', tracking: '0' },
    button: { size: '15px', mobile: '14px', lineHeight: '1', tracking: '0.04em' },
    /** Kaushan Script, rotated a few degrees in the layout. */
    eyebrow: { size: '40px', mobile: '28px', lineHeight: '1.1', tracking: '0' },
    small: { size: '15px', mobile: '15px', lineHeight: '1.5', tracking: '0' },
    caption: { size: '13px', mobile: '13px', lineHeight: '1.4', tracking: '0' },
    /** Rye small-caps labels (day names, footer column titles). */
    label: { size: '14px', mobile: '13px', lineHeight: '1', tracking: '0.08em' },
    ticker: { size: '18px', mobile: '14px', lineHeight: '1', tracking: '0.04em' },
    quote: { size: '22px', mobile: '18px', lineHeight: '1.2', tracking: '0' },
  },

  radius: {
    base: '2px',
    lg: '2px',
    xl: '2px',
    hero: '2px',
    full: '9999px',
  },

} as const;

export type Brand = typeof brand;
type BrandFont = Brand['fonts'][keyof Brand['fonts']];

/** Strip # and expand 3-digit hex. */
export function hexToChannels(hex: string): string {
  const raw = hex.replace('#', '').trim();
  const h =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n)) return '0 0 0';
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** `rgb(237 217 116)` or `rgb(237 217 116 / 50%)`. */
export function rgb(hex: string, alpha?: number): string {
  const channels = hexToChannels(hex);
  if (alpha === undefined) return `rgb(${channels})`;
  const a = alpha <= 1 ? `${Math.round(alpha * 100)}%` : String(alpha);
  return `rgb(${channels} / ${a})`;
}

/** Per-variant CTA colors — red fill (primary), ink outline (secondary), cream fill (light). */
function ctaButtonVars(c: Brand['colors']): string {
  const primary = `
    --aw-color-btn-primary-bg: ${rgb(c.accent)};
    --aw-color-btn-primary-text: ${rgb(c.cream)};
    --aw-color-btn-primary-border: ${rgb(c.heading)};
    --aw-color-btn-primary-bg-hover: ${rgb(c.accentHover)};
    --aw-color-btn-primary-text-hover: ${rgb(c.cream)};
    --aw-color-btn-primary-border-hover: ${rgb(c.heading)};`;

  const secondary = `
    --aw-color-btn-secondary-bg: transparent;
    --aw-color-btn-secondary-text: ${rgb(c.heading)};
    --aw-color-btn-secondary-border: ${rgb(c.heading)};
    --aw-color-btn-secondary-bg-hover: ${rgb(c.heading)};
    --aw-color-btn-secondary-text-hover: ${rgb(c.cream)};
    --aw-color-btn-secondary-border-hover: ${rgb(c.heading)};`;

  /** Outline on paper (Figma "Secondary"). */
  const ghostLight = `
    --aw-color-btn-ghost-light-bg: transparent;
    --aw-color-btn-ghost-light-text: ${rgb(c.heading)};
    --aw-color-btn-ghost-light-border: ${rgb(c.heading)};
    --aw-color-btn-ghost-light-bg-hover: ${rgb(c.heading)};
    --aw-color-btn-ghost-light-text-hover: ${rgb(c.cream)};
    --aw-color-btn-ghost-light-border-hover: ${rgb(c.heading)};`;

  /** Cream fill with red type (Figma "Light") for red / green / marigold bands. */
  const ghostDark = `
    --aw-color-btn-ghost-dark-bg: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-text: ${rgb(c.accent)};
    --aw-color-btn-ghost-dark-border: ${rgb(c.heading)};
    --aw-color-btn-ghost-dark-bg-hover: ${rgb(c.marigold)};
    --aw-color-btn-ghost-dark-text-hover: ${rgb(c.heading)};
    --aw-color-btn-ghost-dark-border-hover: ${rgb(c.heading)};
    --aw-btn-shadow: ${rgb(c.heading)};`;

  return [primary, secondary, ghostLight, ghostDark].join('');
}

/** Defines the font's CSS variable (loaded from Google Fonts in Layout.astro). */
function fontFamilyVar(font: BrandFont): string {
  const stack = [`'${font.name}'`, ...font.fallbacks].join(', ');
  return `${font.cssVariable}: ${stack};`;
}

function rootVars(b: Brand): string {
  const { colors: c, fonts: f, radius: r, type: t } = b;
  const accent = rgb(c.accent);
  const accentHover = rgb(c.accentHover);
  const heading = rgb(c.heading);
  const muted = rgb(c.muted);

  return `
    ${fontFamilyVar(f.heading)}
    ${fontFamilyVar(f.eyebrow)}
    ${fontFamilyVar(f.body)}
    ${fontFamilyVar(f.button)}
    --aw-font-sans: var(${f.body.cssVariable});
    --aw-font-serif: var(${f.heading.cssVariable});
    --aw-font-heading: var(${f.heading.cssVariable});
    --aw-font-script: var(${f.eyebrow.cssVariable});
    --aw-font-rough: var(${f.heading.cssVariable});
    --aw-font-button: var(${f.button.cssVariable});
    --aw-weight-heading: ${f.heading.displayWeight};

    --aw-tracking-heading: ${t.h2.tracking};
    --aw-text-h1: ${t.h1.size};
    --aw-text-h1-mobile: ${t.h1.mobile};
    --aw-leading-h1: ${t.h1.lineHeight};
    --aw-text-h2: ${t.h2.size};
    --aw-text-h2-mobile: ${t.h2.mobile};
    --aw-leading-h2: ${t.h2.lineHeight};
    --aw-text-h3: ${t.h3.size};
    --aw-text-h3-mobile: ${t.h3.mobile};
    --aw-leading-h3: ${t.h3.lineHeight};
    --aw-text-h4: ${t.h4.size};
    --aw-text-h4-mobile: ${t.h4.mobile};
    --aw-leading-h4: ${t.h4.lineHeight};
    --aw-text-h5: ${t.h5.size};
    --aw-text-h5-mobile: ${t.h5.mobile};
    --aw-leading-h5: ${t.h5.lineHeight};
    --aw-text-display: ${t.display.size};
    --aw-text-display-mobile: ${t.display.mobile};
    --aw-leading-display: ${t.display.lineHeight};
    --aw-text-body: ${t.body.size};
    --aw-text-body-mobile: ${t.body.mobile};
    --aw-leading-body: ${t.body.lineHeight};
    --aw-tracking-body: ${t.body.tracking};
    --aw-text-body-lg: ${t.bodyLg.size};
    --aw-text-body-lg-mobile: ${t.bodyLg.mobile};
    --aw-tracking-body-lg: ${t.bodyLg.tracking};
    --aw-text-button: ${t.button.size};
    --aw-tracking-button: ${t.button.tracking};
    --aw-text-eyebrow: ${t.eyebrow.size};
    --aw-text-eyebrow-mobile: ${t.eyebrow.mobile};
    --aw-tracking-eyebrow: ${t.eyebrow.tracking};
    --aw-text-small: ${t.small.size};
    --aw-leading-small: ${t.small.lineHeight};
    --aw-text-caption: ${t.caption.size};
    --aw-text-label: ${t.label.size};
    --aw-text-label-mobile: ${t.label.mobile};
    --aw-tracking-label: ${t.label.tracking};
    --aw-text-ticker: ${t.ticker.size};
    --aw-text-ticker-mobile: ${t.ticker.mobile};
    --aw-text-quote: ${t.quote.size};
    --aw-text-quote-mobile: ${t.quote.mobile};
    --aw-leading-quote: ${t.quote.lineHeight};

    --aw-color-primary: ${rgb(c.primary)};
    --aw-color-secondary: ${rgb(c.secondary)};
    --aw-color-accent: ${accent};
    --aw-color-accent-hover: ${accentHover};

    --aw-color-text-heading: ${heading};
    --aw-color-text-default: ${heading};
    --aw-color-text-muted: ${muted};
    --aw-color-text-blog: ${rgb(c.blogText)};
    --aw-color-text-eyebrow: ${rgb(c.eyebrow)};
    --aw-color-text-contrast: ${rgb(c.cream)};
    --aw-color-bg-page: ${rgb(c.page)};
    --aw-color-bg-header: ${rgb(c.header)};
    --aw-color-header-text: ${rgb(c.headerText)};
    --aw-color-header-accent: ${rgb(c.headerAccent)};
    --aw-color-header-accent-hover: ${rgb(c.headerAccentHover)};
    --aw-color-header-scrolled-bg: ${rgb(c.headerText)};
    --aw-color-header-scrolled-text: ${rgb(c.header)};
    --aw-color-header-scrolled-accent: ${rgb(c.marigold)};
    --aw-color-header-scrolled-accent-hover: ${rgb(c.cream)};
    --aw-color-bg-page-end: ${rgb(c.page)};
    --aw-color-bg-section-white: ${rgb(c.page)};
    --aw-color-bg-section-grey: ${rgb(c.sectionGrey)};
    --aw-color-bg-section-dark: ${rgb(c.sectionDark)};
    --aw-color-bg-section-green: ${rgb(c.sectionGreen)};
    --aw-color-bg-card: ${rgb(c.card)};
    --aw-color-bg-card-dark: ${rgb(c.cardDark)};
    --aw-color-bg-card-light: ${rgb(c.cardMist)};
    --aw-color-bg-feature-card: ${rgb(c.featureCard)};
    --aw-color-bg-cta: ${rgb(c.ctaBg)};
    --aw-color-bg-cta-end: ${rgb(c.ctaEnd)};
    --aw-color-text-tan: ${rgb(c.tanText)};
    --aw-color-text-tan-body: ${rgb(c.tanBody)};
    --aw-color-bg-cta-pink: ${rgb(c.ctaPink)};
    --aw-color-text-cta-pink: ${rgb(c.ctaPinkText)};
    --aw-color-gradient-from: ${rgb(c.gradientFrom)};
    --aw-color-gradient-to: ${rgb(c.gradientTo)};
    --aw-color-page-wash-from: ${rgb(c.pageWashFrom)};
    --aw-color-page-wash-to: ${rgb(c.pageWashTo)};
    --aw-shadow-card-mist: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.cardMist)};
    --aw-shadow-card-pink: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.ctaPink)};
    --aw-color-marigold: ${rgb(c.marigold)};
    --aw-color-blush: ${rgb(c.blush)};
    --aw-color-sage: ${rgb(c.sage)};
    --aw-color-sand: ${rgb(c.sand)};
    --aw-color-taupe: ${rgb(c.taupe)};
    --aw-color-ink: ${heading};
    --aw-color-nav-glass: ${rgb(c.nav, 0.25)};

    --aw-color-card-heading-dark: ${rgb(c.white)};
    --aw-color-card-body-dark: ${rgb(c.white, 0.6)};
    --aw-color-card-link-dark: ${rgb(c.cream)};

    --aw-color-card-heading-light: var(--aw-color-text-heading);
    --aw-color-card-body-light: var(--aw-color-text-muted);
    --aw-color-card-link-light: var(--aw-color-btn-link);

    --aw-color-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-card-border-light: transparent;

    --aw-color-bg-card-outlined: ${rgb(c.white)};
    --aw-color-card-border-outlined: ${rgb(c.black, 0.12)};
    --aw-color-card-heading-outlined: var(--aw-color-text-heading);
    --aw-color-card-body-outlined: var(--aw-color-text-muted);
    --aw-color-card-link-outlined: var(--aw-color-btn-link);

    --aw-color-bg-card-glass: ${rgb(c.white, 0.08)};
    --aw-color-card-border-glass: ${rgb(c.white, 0.15)};
    --aw-color-card-heading-glass: ${rgb(c.white)};
    --aw-color-card-body-glass: ${rgb(c.white, 0.7)};
    --aw-color-card-link-glass: ${rgb(c.cream)};

    ${ctaButtonVars(c)}

    --aw-color-btn-link: ${rgb(c.accent)};
    --aw-color-btn-link-hover: ${accentHover};

    --aw-color-headline-light: var(--aw-color-text-heading);
    --aw-color-headline-dark: ${rgb(c.white)};
    --aw-color-headline-subtitle-light: var(--aw-color-text-muted);
    --aw-color-headline-subtitle-dark: ${rgb(c.white, 0.7)};

    --aw-color-timeline-icon-light: var(--aw-color-text-heading);
    --aw-color-timeline-icon-border-light: transparent;
    --aw-color-timeline-icon-bg-light: var(--aw-color-bg-cta);
    --aw-color-timeline-step-light: var(--aw-color-text-muted);
    --aw-color-timeline-title-light: var(--aw-color-text-heading);
    --aw-color-timeline-desc-light: var(--aw-color-text-muted);

    --aw-color-timeline-icon-dark: var(--aw-color-text-heading);
    --aw-color-timeline-icon-border-dark: transparent;
    --aw-color-timeline-icon-bg-dark: var(--aw-color-bg-cta);
    --aw-color-timeline-title-dark: ${rgb(c.white)};
    --aw-color-timeline-desc-dark: ${rgb(c.white, 0.6)};

    --aw-color-testimonial-card-bg-light: ${rgb(c.card)};
    --aw-color-testimonial-card-border-light: transparent;
    --aw-color-testimonial-text-light: var(--aw-color-text-muted);
    --aw-color-testimonial-name-light: var(--aw-color-text-heading);
    --aw-color-testimonial-job-light: var(--aw-color-text-muted);
    --aw-color-testimonial-hr-light: rgb(226 232 240);

    --aw-color-testimonial-card-bg-dark: ${rgb(c.white, 0.05)};
    --aw-color-testimonial-card-border-dark: ${rgb(c.white, 0.15)};
    --aw-color-testimonial-text-dark: ${rgb(c.white, 0.7)};
    --aw-color-testimonial-name-dark: ${rgb(c.white)};
    --aw-color-testimonial-job-dark: ${rgb(c.white, 0.5)};
    --aw-color-testimonial-hr-dark: ${rgb(c.white, 0.1)};

    --aw-color-faq-border-light: ${rgb(c.secondary, 0.45)};
    --aw-color-faq-question-light: var(--aw-color-text-heading);
    --aw-color-faq-answer-light: var(--aw-color-text-muted);
    --aw-color-faq-toggle-border-light: rgb(209 213 219);
    --aw-color-faq-toggle-text-light: rgb(107 114 128);
    --aw-color-faq-toggle-active-light: var(--aw-color-accent);

    --aw-color-faq-border-dark: ${rgb(c.white, 0.2)};
    --aw-color-faq-question-dark: ${rgb(c.white)};
    --aw-color-faq-answer-dark: var(--aw-color-accent);
    --aw-color-faq-toggle-border-dark: ${rgb(c.white, 0.3)};
    --aw-color-faq-toggle-text-dark: ${rgb(c.white, 0.5)};
    --aw-color-faq-toggle-active-dark: var(--aw-color-accent);

    --aw-color-projects-card-bg-light: ${rgb(c.card)};
    --aw-color-projects-card-border-light: transparent;
    --aw-color-projects-title-light: var(--aw-color-text-heading);
    --aw-color-projects-desc-light: var(--aw-color-text-muted);

    --aw-color-projects-card-bg-dark: ${rgb(c.cardDark)};
    --aw-color-projects-card-border-dark: ${rgb(c.accent, 0.6)};
    --aw-color-projects-title-dark: ${rgb(c.white)};
    --aw-color-projects-desc-dark: ${rgb(c.white, 0.6)};

    --aw-color-bg-page-dark: ${rgb(c.navy)};



    --aw-shadow-card: 4px 4px 30px rgb(0 0 0 / 5%), 3px 3px 0 ${rgb(c.secondary)};
    --aw-shadow-header: 0 0.25rem 3.5rem 0 color-mix(in srgb, var(--aw-color-text-heading) 8%, transparent);
    --aw-border-card: ${rgb(c.secondary, 0.16)};

    --aw-radius: ${r.base};
    --aw-radius-lg: ${r.lg};
    --aw-radius-xl: ${r.xl};
    --aw-radius-hero: ${r.hero};
    --aw-radius-full: ${r.full};
  `.trim();
}

/** Full stylesheet injected by CustomStyles.astro. */
export function brandStylesheet(b: Brand = brand): string {
  const accent = rgb(b.colors.accent, 0.3);
  return `:root {
  ${rootVars(b)}

  ::selection {
    background-color: ${accent};
  }
}

/* The site is dark by default, so OS dark mode keeps the same tokens. */
.dark {
  ${rootVars(b)}

  ::selection {
    background-color: ${accent};
    color: snow;
  }
}`;
}

/** Google Fonts stylesheet URL for all brand families. */
export function brandGoogleFontsHref(): string {
  const family = (font: BrandFont) =>
    `family=${font.name.replace(/ /g, '+')}:wght@${[...font.weights].sort().join(';')}`;
  return `https://fonts.googleapis.com/css2?${brandFonts().map(family).join('&')}&display=swap`;
}

function brandFonts(): BrandFont[] {
  const { heading, eyebrow, body, button } = brand.fonts;
  return [heading, eyebrow, body, button];
}

/** Astro Fonts API entries — used by astro.config.ts and Layout.astro. */
export function brandFontConfig() {
  return brandFonts().map((font) => ({
    name: font.name,
    cssVariable: font.cssVariable,
    provider: font.provider,
    weights: font.weights,
    styles: font.styles,
    subsets: font.subsets,
    fallbacks: font.fallbacks,
    preload: true,
  }));
}
