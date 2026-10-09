/**
 * Site identity and public analytics IDs.
 *
 * Edit this file for every client. Secrets (Sanity, Resend, Places, Yelp) stay in `.env`.
 *
 * Sibling files:
 *   src/brand.ts           colors, fonts, radius
 *   src/config/contact.ts  phone, email, address, hours
 *   src/config/social.ts   profile URLs
 *   src/config/cta.ts      button labels
 *   src/config/schema/business.ts  schema.org extras (price range, credentials)
 */
export const site = {
  name: 'El Ranchero',
  url: 'https://example.com',
  description:
    'Island-grown produce, never-frozen local ahi, and bowls built the way you like them. Kailua-born since 2006 — six spots on Oahu.',
  footerTagline:
    'Fresh, healthy food that tastes worth coming back for — and feels like home. Six locations across Oahu.',
  trailingSlash: false,

  /** Cloudflare Worker `sites.slug`. `PUBLIC_SITE_SLUG` in env overrides this. */
  formSlug: 'el-ranchero',

  analytics: {
    /** Google Tag Manager container. Empty until the client GTM is created. */
    googleTagManagerId: '',
    /** Optional. Leave empty when tags are installed through GTM. */
    googleAnalyticsId: '',
    /** Search Console HTML-tag verification (`content=` value only). */
    googleSiteVerificationId: '',
  },
} as const;

export type SiteConfig = typeof site;

export function siteOrigin(): string {
  return site.url.replace(/\/$/, '');
}

export function siteHost(): string {
  return siteOrigin().replace(/^https?:\/\//, '');
}
