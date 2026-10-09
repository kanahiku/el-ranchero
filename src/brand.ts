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
    /** Headings, buttons, eyebrows, ticker, quotes. */
    heading: {
      name: 'Cinzel',
      cssVariable: '--font-cinzel',
      provider: 'google' as const,
      weights: ['400', '500', '600', '700'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['serif'] as string[],
    },
    /** Body copy and UI text. */
    body: {
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-plus-jakarta-sans',
      provider: 'google' as const,
      weights: ['400', '500', '600', '700'] as string[],
      styles: ['normal'] as string[],
      subsets: ['latin'] as string[],
      fallbacks: ['sans-serif'] as string[],
    },
  },

  /** Style Guide 110:2377 — named fills. Hover tints are derived. */
  colors: {
    accent: '#7F1D1D', // maroon — links, buttons, highlights
    accentHover: '#991B1B', // red-800
    heading: '#09090B', // near-black
    muted: '#78350F', // brown
    eyebrow: '#78350F', // brown
    page: '#FFFFFF', // white page
    sectionGrey: '#FEF3C7', // warm cream band
    sectionDark: '#7F1D1D', // maroon band
    sectionGreen: '#064E3B', // deep green band (emerald-900) — FAQ
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
     * mobile sizes are an optical scale (not a flat %), so Cinzel
     * still has a clear h1 > h2 > h3 step on a 390px screen.
     * Faces: headings, button, tag/accent/quote = Cinzel; body = Plus Jakarta Sans.
     */
    h1: { size: '72px', mobile: '40px', lineHeight: '1', tracking: '0' },
    h2: { size: '52px', mobile: '28px', lineHeight: '1', tracking: '0' },
    h3: { size: '26px', mobile: '22px', lineHeight: '1', tracking: '0' },
    /** Extra — not in the Style Guide. */
    h4: { size: '24px', mobile: '18px', lineHeight: '1', tracking: '0' },
    body: { size: '14px', mobile: '14px', lineHeight: '1.3', tracking: '-0.01em' },
    bodyLg: { size: '16px', mobile: '15px', lineHeight: '1.3', tracking: '-0.01em' },
    button: { size: '14px', mobile: '14px', lineHeight: '1', tracking: '0' },
    /** Figma `tag`; bumped slightly for retained cursive section labels. */
    eyebrow: { size: '19px', mobile: '19px', lineHeight: '1', tracking: '0' },
    small: { size: '12px', mobile: '12px', lineHeight: '1.3', tracking: '-0.01em' },
    caption: { size: '11px', mobile: '11px', lineHeight: '1.3', tracking: '0' },
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

/** Per-variant CTA colors — hibiscus fill, cream ghost on photos. */
function ctaButtonVars(c: Brand['colors']): string {
  const primary = `
    --aw-color-btn-primary-bg: ${rgb(c.accent)};
    --aw-color-btn-primary-text: ${rgb(c.cream)};
    --aw-color-btn-primary-border: ${rgb(c.accent)};
    --aw-color-btn-primary-bg-hover: ${rgb(c.navy)};
    --aw-color-btn-primary-text-hover: ${rgb(c.cream)};
    --aw-color-btn-primary-border-hover: ${rgb(c.navy)};`;

  const secondary = `
    --aw-color-btn-secondary-bg: ${rgb(c.ctaTan)};
    --aw-color-btn-secondary-text: ${rgb(c.cream)};
    --aw-color-btn-secondary-border: ${rgb(c.ctaTan)};
    --aw-color-btn-secondary-bg-hover: ${rgb(c.tanText)};
    --aw-color-btn-secondary-text-hover: ${rgb(c.cream)};
    --aw-color-btn-secondary-border-hover: ${rgb(c.tanText)};`;

  const ghostLight = `
    --aw-color-btn-ghost-light-bg: transparent;
    --aw-color-btn-ghost-light-text: ${rgb(c.heading)};
    --aw-color-btn-ghost-light-border: ${rgb(c.heading)};
    --aw-color-btn-ghost-light-bg-hover: ${rgb(c.accent)};
    --aw-color-btn-ghost-light-text-hover: ${rgb(c.cream)};
    --aw-color-btn-ghost-light-border-hover: ${rgb(c.accent)};`;

  const ghostDark = `
    --aw-color-btn-ghost-dark-bg: transparent;
    --aw-color-btn-ghost-dark-text: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-border: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-bg-hover: ${rgb(c.cream, 0.12)};
    --aw-color-btn-ghost-dark-text-hover: ${rgb(c.cream)};
    --aw-color-btn-ghost-dark-border-hover: ${rgb(c.cream)};`;

  return [primary, secondary, ghostLight, ghostDark].join('');
}

function rootVars(b: Brand): string {
  const { colors: c, fonts: f, radius: r, type: t } = b;
  const accent = rgb(c.accent);
  const accentHover = rgb(c.accentHover);
  const heading = rgb(c.heading);
  const muted = rgb(c.muted);

  return `
    --aw-font-sans: var(${f.body.cssVariable});
    --aw-font-serif: var(${f.heading.cssVariable});
    --aw-font-heading: var(${f.heading.cssVariable});
    --aw-font-script: var(${f.heading.cssVariable});
    --aw-font-rough: var(${f.heading.cssVariable});

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
    --aw-text-body: ${t.body.size};
    --aw-text-body-mobile: ${t.body.mobile};
    --aw-leading-body: ${t.body.lineHeight};
    --aw-tracking-body: ${t.body.tracking};
    --aw-text-body-lg: ${t.bodyLg.size};
    --aw-text-body-lg-mobile: ${t.bodyLg.mobile};
    --aw-tracking-body-lg: ${t.bodyLg.tracking};
    --aw-text-button: ${t.button.size};
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
    --aw-color-text-eyebrow: ${rgb(c.eyebrow)};
    --aw-color-text-contrast: ${rgb(c.cream)};
    --aw-color-bg-page: ${rgb(c.page)};
    --aw-color-bg-header: ${rgb(c.header)};
    --aw-color-header-text: ${rgb(c.headerText)};
    --aw-color-header-accent: ${rgb(c.headerAccent)};
    --aw-color-header-accent-hover: ${rgb(c.headerAccentHover)};
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

/** Astro Fonts API entries — used by astro.config.ts and Layout.astro. */
export function brandFontConfig() {
  const { heading, body } = brand.fonts;
  return [heading, body].map((font) => ({
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
