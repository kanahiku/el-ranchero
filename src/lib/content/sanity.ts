import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '../../config/cta';
import { sanityClient } from '../sanity/client';
import { resolveContentImage, type SanityImageFields } from '../sanity/image';
import type {
  BlogContentBlock,
  BlogPost,
  Testimonial,
  ContentImage,
  HomepageImages,
  AboutImages,
  CateringImages,
  LocationImages,
  MenuPagesImages,
  NavigationContent,
  NavLink,
  NavSubLink,
  MenuCategory,
  MenuItem,
  MeatOption,
} from './types';

type FetchedImage = ContentImage & SanityImageFields;

const IMAGE_PROJECTION = (field: string, fallbackAlt: string) => /* groq */ `
  "${field}": select(defined(${field}.asset) => {
    "src": ${field}.asset->url,
    "alt": coalesce(${field}.alt, "${fallbackAlt}"),
    "crop": ${field}.crop,
    "hotspot": ${field}.hotspot,
    "asset": ${field}.asset
  }, null)
`;

const COPY_REPLACEMENTS: Array<[string, string]> = [
  ["We're", 'We are'],
  ["we're", 'we are'],
  ["We've", 'We have'],
  ["we've", 'we have'],
  ["that's", 'that is'],
  ["That's", 'That is'],
  ["what's", 'what is'],
  ["What's", 'What is'],
  ["doesn't", 'does not'],
  ["Doesn't", 'Does not'],
  ["you'll", 'you will'],
  ["You'll", 'You will'],
  ["we'll", 'we will'],
  ["We'll", 'We will'],
  ["family's", 'family'],
  ["Family's", 'Family'],
  ['site’s', 'site'],
  ['Site’s', 'Site'],
];

function normalizeWebsiteCopy(value: string): string {
  let text = value;
  for (const [from, to] of COPY_REPLACEMENTS) {
    text = text.replaceAll(from, to);
  }

  return text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[ʻ‘’]/g, '')
    .replace(/(?<=[A-Za-z])'(?=[A-Za-z])/g, '')
    .normalize('NFC');
}

// ─── Homepage ────────────────────────────────────────────────────────────────

type FetchedHomepageImages = {
  heroImage?: FetchedImage | null;
  breakfastImage?: FetchedImage | null;
  cateringImage?: FetchedImage | null;
  privateEventsImage?: FetchedImage | null;
};

const HOMEPAGE_IMAGES_QUERY = /* groq */ `
  *[_type == "homepageContent" && _id == "singleton-homepage"][0] {
    ${IMAGE_PROJECTION('heroImage', 'Taqueria El Ranchero')},
    ${IMAGE_PROJECTION('breakfastImage', 'Mexican breakfast at El Ranchero')},
    ${IMAGE_PROJECTION('cateringImage', 'El Ranchero Mexican catering')},
    ${IMAGE_PROJECTION('privateEventsImage', 'El Ranchero Kapolei event space')}
  }
`;

export async function getSanityHomepageImages(): Promise<HomepageImages> {
  const doc = await sanityClient.fetch<FetchedHomepageImages | null>(HOMEPAGE_IMAGES_QUERY);

  return {
    hero: resolveContentImage(doc?.heroImage),
    breakfast: resolveContentImage(doc?.breakfastImage),
    catering: resolveContentImage(doc?.cateringImage),
    privateEvents: resolveContentImage(doc?.privateEventsImage),
  };
}

// ─── About ───────────────────────────────────────────────────────────────────

type FetchedAboutImages = {
  heroImage?: FetchedImage | null;
  madeFreshDailyImage?: FetchedImage | null;
  muralsImage?: FetchedImage | null;
  givingBackImage?: FetchedImage | null;
};

const ABOUT_IMAGES_QUERY = /* groq */ `
  *[_type == "aboutContent" && _id == "singleton-about"][0] {
    ${IMAGE_PROJECTION('heroImage', 'About Taqueria El Ranchero')},
    ${IMAGE_PROJECTION('madeFreshDailyImage', 'Food prepared fresh daily at El Ranchero')},
    ${IMAGE_PROJECTION('muralsImage', 'Murals at El Ranchero')},
    ${IMAGE_PROJECTION('givingBackImage', 'El Ranchero giving back to the community')}
  }
`;

export async function getSanityAboutImages(): Promise<AboutImages> {
  const doc = await sanityClient.fetch<FetchedAboutImages | null>(ABOUT_IMAGES_QUERY);

  return {
    hero: resolveContentImage(doc?.heroImage),
    madeFreshDaily: resolveContentImage(doc?.madeFreshDailyImage),
    murals: resolveContentImage(doc?.muralsImage),
    givingBack: resolveContentImage(doc?.givingBackImage),
  };
}

// ─── Catering ────────────────────────────────────────────────────────────────

type FetchedCateringImages = {
  menuImage?: FetchedImage | null;
};

const CATERING_IMAGES_QUERY = /* groq */ `
  *[_type == "cateringContent" && _id == "singleton-catering"][0] {
    ${IMAGE_PROJECTION('menuImage', 'El Ranchero catering')}
  }
`;

export async function getSanityCateringImages(): Promise<CateringImages> {
  const doc = await sanityClient.fetch<FetchedCateringImages | null>(CATERING_IMAGES_QUERY);

  return {
    menu: resolveContentImage(doc?.menuImage),
  };
}

// ─── Locations ───────────────────────────────────────────────────────────────

type FetchedLocationImages = {
  directoryImage?: FetchedImage | null;
  wahiawaImage?: FetchedImage | null;
  kapoleiImage?: FetchedImage | null;
};

const LOCATIONS_IMAGES_QUERY = /* groq */ `
  *[_type == "locationsContent" && _id == "singleton-locations"][0] {
    ${IMAGE_PROJECTION('directoryImage', 'El Ranchero locations on Oahu')},
    ${IMAGE_PROJECTION('wahiawaImage', 'El Ranchero Wahiawa')},
    ${IMAGE_PROJECTION('kapoleiImage', 'El Ranchero Kapolei')}
  }
`;

export async function getSanityLocationImages(): Promise<LocationImages> {
  const doc = await sanityClient.fetch<FetchedLocationImages | null>(LOCATIONS_IMAGES_QUERY);

  return {
    directory: resolveContentImage(doc?.directoryImage),
    wahiawa: resolveContentImage(doc?.wahiawaImage),
    kapolei: resolveContentImage(doc?.kapoleiImage),
  };
}

// ─── Menu Pages ──────────────────────────────────────────────────────────────

type FetchedMenuPagesImages = {
  menuHubHeroImage?: FetchedImage | null;
  breakfastHeroImage?: FetchedImage | null;
  burritosHeroImage?: FetchedImage | null;
  tacosHeroImage?: FetchedImage | null;
  entreesHeroImage?: FetchedImage | null;
  quesadillasNachosHeroImage?: FetchedImage | null;
  specialsHeroImage?: FetchedImage | null;
  appetizersSidesHeroImage?: FetchedImage | null;
  kidsHeroImage?: FetchedImage | null;
  drinksHeroImage?: FetchedImage | null;
};

const MENU_PAGES_IMAGES_QUERY = /* groq */ `
  *[_type == "menuPagesContent" && _id == "singleton-menu-pages"][0] {
    ${IMAGE_PROJECTION('menuHubHeroImage', 'El Ranchero menu')},
    ${IMAGE_PROJECTION('breakfastHeroImage', 'Breakfast at El Ranchero')},
    ${IMAGE_PROJECTION('burritosHeroImage', 'Burritos at El Ranchero')},
    ${IMAGE_PROJECTION('tacosHeroImage', 'Tacos & Birria at El Ranchero')},
    ${IMAGE_PROJECTION('entreesHeroImage', 'Entrees & Fajitas at El Ranchero')},
    ${IMAGE_PROJECTION('quesadillasNachosHeroImage', 'Quesadillas & Nachos at El Ranchero')},
    ${IMAGE_PROJECTION('specialsHeroImage', 'Specials at El Ranchero')},
    ${IMAGE_PROJECTION('appetizersSidesHeroImage', 'Appetizers & Sides at El Ranchero')},
    ${IMAGE_PROJECTION('kidsHeroImage', 'Kids Menu at El Ranchero')},
    ${IMAGE_PROJECTION('drinksHeroImage', 'Drinks & Margaritas at El Ranchero')}
  }
`;

export async function getSanityMenuPagesImages(): Promise<MenuPagesImages> {
  const doc = await sanityClient.fetch<FetchedMenuPagesImages | null>(MENU_PAGES_IMAGES_QUERY);

  return {
    menuHubHero: resolveContentImage(doc?.menuHubHeroImage),
    breakfastHero: resolveContentImage(doc?.breakfastHeroImage),
    burritosHero: resolveContentImage(doc?.burritosHeroImage),
    tacosHero: resolveContentImage(doc?.tacosHeroImage),
    entreesHero: resolveContentImage(doc?.entreesHeroImage),
    quesadillasNachosHero: resolveContentImage(doc?.quesadillasNachosHeroImage),
    specialsHero: resolveContentImage(doc?.specialsHeroImage),
    appetizersSidesHero: resolveContentImage(doc?.appetizersSidesHeroImage),
    kidsHero: resolveContentImage(doc?.kidsHeroImage),
    drinksHero: resolveContentImage(doc?.drinksHeroImage),
  };
}

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
      ...(nav.header?.phone ? { phone: { ...nav.header.phone, text: normalizeWebsiteCopy(nav.header.phone.text) } } : {}),
    },
    footer: normalizeFooter(nav.footer),
  };
}

// ─── Menu ────────────────────────────────────────────────────────────────────
// Menu copy is rendered exactly as written in Sanity (accents like "Niño" and
// "jalapeño" matter here), so it does not go through normalizeWebsiteCopy.

type FetchedMenuCategory = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  order?: number;
  hubSpan?: number;
};

type FetchedMenuItem = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  badge?: string;
  note?: string;
  image?: FetchedImage | null;
  placements?: Array<{ categoryId?: string; section?: string; order?: number }> | null;
};

type FetchedMenuContent = {
  categories?: FetchedMenuCategory[] | null;
  items?: FetchedMenuItem[] | null;
};

const MENU_QUERY = /* groq */ `
  {
    "categories": *[_type == "menuCategory" && showOnFullMenu != false && defined(slug.current)] | order(coalesce(order, 0) asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "order": coalesce(order, 0),
      hubSpan
    },
    "items": *[_type == "menuItem" && isAvailable != false && defined(title)] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      badge,
      note,
      "image": select(defined(photo.asset) => {
        "src": photo.asset->url,
        "alt": coalesce(photo.alt, title),
        "crop": photo.crop,
        "hotspot": photo.hotspot,
        "asset": photo.asset
      }, null),
      "placements": categoryPlacements[defined(category._ref)][] {
        "categoryId": category._ref,
        "section": coalesce(section, "main"),
        "order": coalesce(order, 0)
      }
    }
  }
`;

/** Blank line = new paragraph. Returns a plain string when there is only one. */
function splitParagraphs(text: string): string | string[] {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : (parts[0] ?? '');
}

function normalizeMenuItem(item: FetchedMenuItem, section: string): MenuItem | null {
  if (!item.title?.trim()) return null;
  const image = resolveContentImage(item.image);
  const description = item.description?.trim() ? splitParagraphs(item.description) : undefined;
  return {
    title: item.title.trim(),
    section,
    ...(item.slug ? { slug: item.slug } : {}),
    ...(description ? { description } : {}),
    ...(item.badge?.trim() ? { badge: item.badge.trim() } : {}),
    ...(item.note?.trim() ? { note: item.note.trim() } : {}),
    ...(image ? { image } : {}),
  };
}

export async function getSanityMenuCategories(): Promise<MenuCategory[]> {
  const content = await sanityClient.fetch<FetchedMenuContent>(MENU_QUERY);
  const categories = (content.categories ?? []).filter((category) => category._id && category.title);
  const items = content.items ?? [];

  return categories.map((category) => {
    const categoryItems = items
      .flatMap((item) =>
        (item.placements ?? [])
          .filter((placement) => placement.categoryId === category._id)
          .map((placement) => ({ item, section: placement.section || 'main', order: placement.order ?? 0 }))
      )
      .map(({ item, section, order }) => {
        const normalized = normalizeMenuItem(item, section);
        return normalized ? { ...normalized, order } : null;
      })
      .filter((item): item is MenuItem & { order: number } => Boolean(item))
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      .map(({ order: _order, ...item }) => item);

    return {
      title: category.title!.trim(),
      slug: category.slug,
      href: category.slug ? `/menu/${category.slug}` : undefined,
      ...(category.description ? { description: category.description.trim() } : {}),
      hubSpan: category.hubSpan === 6 ? 6 : 4,
      items: categoryItems,
    } satisfies MenuCategory;
  });
}

// ─── Meat options ("Choose Your Meat") ───────────────────────────────────────

const MEAT_OPTIONS_QUERY = /* groq */ `
  *[_type == "meatOption" && isAvailable != false && defined(name)] | order(coalesce(order, 0) asc, name asc) {
    name,
    description
  }
`;

export async function getSanityMeatOptions(): Promise<MeatOption[]> {
  const docs = await sanityClient.fetch<Array<{ name?: string; description?: string }>>(MEAT_OPTIONS_QUERY);
  return (docs ?? [])
    .filter((doc) => doc.name?.trim())
    .map((doc) => ({ name: doc.name!.trim(), description: doc.description?.trim() ?? '' }));
}

type SanityMarkDef = {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
};

type SanitySpan = {
  _type: string;
  _key?: string;
  text?: string;
  marks?: string[];
};

type SanityPortableBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: SanitySpan[];
  markDefs?: SanityMarkDef[];
  // image fields
  src?: string;
  alt?: string;
  caption?: string;
  // table fields
  headerRow?: string[];
  rows?: Array<{ _key?: string; cells?: string[] }>;
  // callout fields (projected as calloutType from the "type" Sanity field)
  calloutType?: string;
  text?: string;
} & SanityImageFields;

type SanityBlogPost = Omit<BlogPost, 'image' | 'relatedPages' | 'body' | 'contentBlocks'> & {
  image?: ContentImage;
  relatedPages?: string[] | null;
  body?: SanityPortableBlock[] | null;
};

function portableBlockText(block: SanityPortableBlock): string {
  return Array.isArray(block.children) ? block.children.map((child) => child.text ?? '').join('') : '';
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spansToHtml(children: SanitySpan[] | undefined, markDefs: SanityMarkDef[] | undefined): string {
  if (!Array.isArray(children)) return '';
  const defsMap = new Map((markDefs ?? []).map((d) => [d._key, d]));

  return children
    .map((span) => {
      if (span._type !== 'span') return '';
      let html = escapeHtml(span.text ?? '');
      for (const mark of span.marks ?? []) {
        const def = defsMap.get(mark);
        if (def?._type === 'link') {
          const targetAttr = def.blank !== false ? ' target="_blank" rel="noopener noreferrer"' : '';
          html = `<a href="${escapeHtml(def.href ?? '')}"${targetAttr}>${html}</a>`;
        } else if (mark === 'strong') {
          html = `<strong>${html}</strong>`;
        } else if (mark === 'em') {
          html = `<em>${html}</em>`;
        } else if (mark === 'underline') {
          html = `<u>${html}</u>`;
        } else if (mark === 'strike-through') {
          html = `<s>${html}</s>`;
        } else if (mark === 'code') {
          html = `<code>${html}</code>`;
        }
      }
      return html;
    })
    .join('');
}

function portableTextToContentBlocks(body: SanityPortableBlock[] | null | undefined): BlogContentBlock[] {
  if (!Array.isArray(body)) return [];

  const result: BlogContentBlock[] = [];

  // Buffer for consecutive list items of the same type
  let listBuffer: { _key: string; html: string; level: number }[] = [];
  let listType: 'bullet' | 'number' | null = null;
  let listStartKey = '';

  function flushList() {
    if (!listBuffer.length || !listType) return;
    result.push({ _type: 'list', _key: `list-${listStartKey}`, listType, items: listBuffer });
    listBuffer = [];
    listType = null;
    listStartKey = '';
  }

  body.forEach((block, index) => {
    const key = block._key || `block-${index}`;

    // ── Image ─────────────────────────────────────────────────────────────────
    if (block._type === 'image') {
      flushList();
      const image = resolveContentImage({
        src: block.src,
        alt: block.alt,
        crop: block.crop,
        hotspot: block.hotspot,
        asset: block.asset,
      });
      if (!image?.src) return;
      const caption = typeof block.caption === 'string' ? block.caption.trim() : '';
      result.push({ _type: 'image', _key: key, image, ...(caption ? { caption } : {}) });
      return;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    if (block._type === 'table') {
      flushList();
      const headerRow = (block.headerRow ?? []).filter(Boolean);
      if (headerRow.length < 2) return;
      result.push({
        _type: 'table',
        _key: key,
        ...(block.caption ? { caption: block.caption } : {}),
        headerRow,
        rows: (block.rows ?? []).map((row, ri) => ({
          _key: row._key || `row-${ri}`,
          cells: row.cells ?? [],
        })),
      });
      return;
    }

    // ── Callout ───────────────────────────────────────────────────────────────
    if (block._type === 'callout') {
      flushList();
      if (!block.text?.trim()) return;
      const calloutType = (['tip', 'info', 'warning', 'note'] as const).includes(
        block.calloutType as 'tip' | 'info' | 'warning' | 'note'
      )
        ? (block.calloutType as 'tip' | 'info' | 'warning' | 'note')
        : 'note';
      result.push({ _type: 'callout', _key: key, calloutType, text: block.text.trim() });
      return;
    }

    // ── Standard block ────────────────────────────────────────────────────────
    if (block._type !== 'block') return;

    const text = portableBlockText(block).trim();
    if (!text) return;

    const html = spansToHtml(block.children, block.markDefs) || escapeHtml(text);

    // Headings
    if (block.style === 'h1' || block.style === 'h2') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 2, text });
      return;
    }
    if (block.style === 'h3' || block.style === 'h4') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 3, text });
      return;
    }

    // List items
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      if (listType !== block.listItem) {
        flushList();
        listType = block.listItem;
        listStartKey = key;
      }
      listBuffer.push({ _key: key, html, level: block.level ?? 1 });
      return;
    }

    // Paragraph / blockquote
    flushList();
    result.push({
      _type: 'paragraph',
      _key: key,
      text,
      html,
      ...(block.style === 'blockquote' ? { quote: true } : {}),
    });
  });

  flushList();
  return result;
}

function portableTextToParagraphs(body: SanityPortableBlock[] | null | undefined): string[] {
  return portableTextToContentBlocks(body)
    .filter((block): block is Extract<BlogContentBlock, { _type: 'paragraph' }> => block._type === 'paragraph')
    .map((block) => block.text); // plain text only — used for excerpts and lead paragraphs
}

function normalizeBlogPost(post: SanityBlogPost): BlogPost {
  const contentBlocks = portableTextToContentBlocks(post.body);
  const body = portableTextToParagraphs(post.body);
  const excerpt = post.excerpt || body[0] || '';
  return {
    title: post.title,
    slug: post.slug,
    excerpt,
    publishDate: post.publishDate,
    author: post.author,
    image: resolveContentImage(post.image as FetchedImage | undefined),
    relatedPages: (post.relatedPages ?? []).map((key) => key.replace(/^\/+/, '')).filter(Boolean),
    meta: {
      title: post.title,
      description: excerpt,
    },
    heroParagraphs: body.slice(0, 2),
    sections:
      body.length > 2
        ? [
            {
              _type: 'editorialSection',
              heading: post.title,
              paragraphs: body.slice(2),
            },
          ]
        : [],
    ctaBanner: {
      title: 'Hungry? Order From El Ranchero',
      subtitle: 'Explore our menu, then order for pickup from Wahiawa or Kapolei.',
      ctaText: PRIMARY_CTA_LABEL,
      ctaHref: PRIMARY_CTA_HREF,
    },
    body,
    contentBlocks,
  };
}

const BLOG_POST_CARD_PROJECTION = /* groq */ `
  title,
  "slug": slug.current,
  excerpt,
  publishDate,
  author,
  "image": {
    "src": coalesce(image.asset->url, imageUrl, ""),
    "alt": coalesce(image.alt, imageAlt, title),
    "crop": image.crop,
    "hotspot": image.hotspot,
    "asset": image.asset
  },
  relatedPages
`;

const BLOG_POST_PROJECTION = /* groq */ `
  ${BLOG_POST_CARD_PROJECTION},
  body[] {
    ...,
    _type == "image" => {
      ...,
      "src": asset->url,
      "alt": coalesce(alt, ""),
      caption,
      crop,
      hotspot,
      asset
    },
    _type == "callout" => {
      _type,
      _key,
      "calloutType": type,
      text
    },
    _type == "table" => {
      _type,
      _key,
      caption,
      headerRow,
      "rows": rows[] { _key, cells }
    }
  }
`;

const BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(publishDate desc) {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

const BLOG_POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${BLOG_POST_PROJECTION}
  }
`;

const BLOG_POSTS_RELATED_TO_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current) && $pageSlug in relatedPages] | order(publishDate desc) [0...3] {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

export async function getSanityBlogPosts(): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_QUERY);
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

export async function getSanityBlogPost(slug: string): Promise<BlogPost | null> {
  const post = await sanityClient.fetch<SanityBlogPost | null>(BLOG_POST_BY_SLUG_QUERY, { slug });
  if (!post?.slug || !post.title) return null;
  return normalizeBlogPost(post);
}

export async function getSanityBlogPostsRelatedTo(pageSlug: string): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_RELATED_TO_QUERY, { pageSlug });
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

const BLOG_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)].slug.current
`;

export async function getSanityBlogPostSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(BLOG_POST_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS_QUERY = /* groq */ `
  *[_type == "testimonial" && defined(quote) && defined(name)] | order(coalesce(order, 0) asc, name asc) {
    _id,
    quote,
    name,
    location,
    platform,
    order
  }
`;

type SanityTestimonial = {
  _id: string;
  quote?: string;
  name?: string;
  location?: string;
  platform?: string;
  order?: number;
};

function normalizeTestimonial(doc: SanityTestimonial): Testimonial | null {
  if (!doc?._id || !doc.quote?.trim() || !doc.name?.trim()) return null;
  return {
    _id: doc._id,
    quote: doc.quote.trim(),
    name: doc.name.trim(),
    location: doc.location?.trim() || undefined,
    platform: doc.platform === 'yelp' ? 'yelp' : 'google',
    order: typeof doc.order === 'number' ? doc.order : 0,
  };
}

export async function getSanityTestimonials(): Promise<Testimonial[]> {
  const docs = await sanityClient.fetch<SanityTestimonial[]>(TESTIMONIALS_QUERY);
  return (docs ?? []).map(normalizeTestimonial).filter((item): item is Testimonial => Boolean(item));
}
