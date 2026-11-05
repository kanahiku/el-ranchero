import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { NavigationContent, NavLink, NavSubLink } from '../types';
import { type FetchedImage, normalizeWebsiteCopy } from './shared';

// ─── Navigation ──────────────────────────────────────────────────────────────

type FetchedNavSubLink = {
  text?: string;
  href?: string;
  description?: string;
  image?: FetchedImage | null;
};

type FetchedNavColumn = {
  title?: string;
  links?: FetchedNavSubLink[] | null;
};

type FetchedNavLink = FetchedNavSubLink & {
  links?: FetchedNavSubLink[] | null;
  columns?: FetchedNavColumn[] | null;
};

type FetchedNavigationContent = Omit<NavigationContent, 'header' | 'footer'> & {
  header?: {
    links?: FetchedNavLink[] | null;
    actions?: NavigationContent['header']['actions'];
    phone?: NavigationContent['header']['phone'];
  } | null;
  footer?: NavigationContent['footer'] | null;
};

const NAV_IMAGE_PROJECTION = /* groq */ `
  "image": select(defined(image.asset) => {
    "src": image.asset->url,
    "alt": coalesce(image.alt, ""),
    "crop": image.crop,
    "hotspot": image.hotspot,
    "asset": image.asset
  }, null)
`;

const NAV_SUB_LINK_PROJECTION = /* groq */ `
  text,
  href,
  description,
  ${NAV_IMAGE_PROJECTION}
`;

const NAVIGATION_QUERY = /* groq */ `
  {
    "header": *[_type == "siteNavigation" && _id == "singleton-navigation"][0] {
      "links": links[] {
        ${NAV_SUB_LINK_PROJECTION},
        "links": subLinks[] {
          ${NAV_SUB_LINK_PROJECTION}
        },
        "columns": columns[] {
          title,
          "links": links[] {
            ${NAV_SUB_LINK_PROJECTION}
          }
        }
      },
      "actions": actions[] { variant, text, href },
      phone
    },
    "footer": *[_type == "siteFooter" && _id == "singleton-footer"][0] {
      "links": columns[] {
        title,
        "links": links[] { text, href }
      },
      "secondaryLinks": secondaryLinks[] { text, href },
      "socialLinks": socialLinks[] { ariaLabel, icon, href },
      footNote
    }
  }
`;

function normalizeNavSubLink(link: FetchedNavSubLink | null | undefined): NavSubLink | null {
  if (!link?.text || !link.href) return null;
  const image = resolveContentImage(link.image);
  return {
    text: normalizeWebsiteCopy(link.text),
    href: link.href,
    ...(link.description ? { description: normalizeWebsiteCopy(link.description) } : {}),
    ...(image ? { image: { ...image, alt: normalizeWebsiteCopy(image.alt) } } : {}),
  };
}

function normalizeNavLink(link: FetchedNavLink | null | undefined): NavLink | null {
  if (!link?.text) return null;
  const image = resolveContentImage(link.image);
  const links = (link.links ?? [])
    .map(normalizeNavSubLink)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const columns = (link.columns ?? [])
    .map((column) => ({
      title: column?.title ? normalizeWebsiteCopy(column.title) : '',
      links: (column?.links ?? [])
        .map(normalizeNavSubLink)
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    }))
    .filter((column) => column.title && column.links.length);

  return {
    text: normalizeWebsiteCopy(link.text),
    ...(link.href ? { href: link.href } : {}),
    ...(link.description ? { description: normalizeWebsiteCopy(link.description) } : {}),
    ...(image ? { image: { ...image, alt: normalizeWebsiteCopy(image.alt) } } : {}),
    ...(links.length ? { links } : {}),
    ...(columns.length ? { columns } : {}),
  };
}

function normalizeFooter(footer: NavigationContent['footer']): NavigationContent['footer'] {
  return {
    links: footer.links.map((column) => ({
      title: normalizeWebsiteCopy(column.title),
      links: column.links.map((link) => ({ ...link, text: normalizeWebsiteCopy(link.text) })),
    })),
    secondaryLinks: footer.secondaryLinks.map((link) => ({ ...link, text: normalizeWebsiteCopy(link.text) })),
    socialLinks: footer.socialLinks.map((link) => ({ ...link, ariaLabel: normalizeWebsiteCopy(link.ariaLabel) })),
    footNote: normalizeWebsiteCopy(footer.footNote),
  };
}

export async function getSanityNavigationContent(): Promise<NavigationContent> {
  const nav = await sanityClient.fetch<FetchedNavigationContent>(NAVIGATION_QUERY);
  if (!nav.header || !nav.footer) {
    throw new Error('Sanity navigation/footer singletons are not published yet.');
  }

  return {
    header: {
      links: (nav.header?.links ?? [])
        .map(normalizeNavLink)
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      actions: (nav.header?.actions ?? []).map((action) => ({
        ...action,
        ...(action.text ? { text: normalizeWebsiteCopy(action.text) } : {}),
      })),
      ...(nav.header?.phone
        ? { phone: { ...nav.header.phone, text: normalizeWebsiteCopy(nav.header.phone.text) } }
        : {}),
    },
    footer: normalizeFooter(nav.footer),
  };
}
