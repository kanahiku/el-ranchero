import type {
  BlogPost,
  NavigationContent,
  Testimonial,
  MenuCategory,
  MenuItem,
  MeatOption,
  HomepageImages,
  AboutImages,
  CateringImages,
  LocationImages,
  EventsImages,
  MenuPagesImages,
} from './types';
import {
  getSanityHomepageImages,
  getSanityAboutImages,
  getSanityCateringImages,
  getSanityLocationImages,
  getSanityEventsImages,
  getSanityMenuPagesImages,
  getSanityBlogPost,
  getSanityBlogPosts,
  getSanityBlogPostSlugs,
  getSanityTestimonials,
  getSanityNavigationContent,
  getSanityMenuCategories,
  getSanityMeatOptions,
} from './sanity';
import { blogPosts as localBlogPosts } from '../../data/pages/blogPosts';
import { navigationData } from '../../data/navigation';
import { interiorPaths } from '../../data/pages/interior';
import { meatOptions as fallbackMeatOptions, menuCategoryLinks } from '../../data/menu';
import { menuItemSeed } from '../../data/menu-seed';
import { MENU_SECTION_KEYS, type MenuSectionKey } from './menuSections';

const LEGAL_FOOTER_LINKS = [
  { text: 'Privacy Policy', href: '/privacy-policy' },
  { text: 'Terms', href: '/terms' },
  { text: 'Accessibility', href: '/accessibility' },
];

const HIDDEN_NAV_HREFS = new Set(['/chapters', '/guidebooks']);
const HIDDEN_NAV_LABELS = new Set(['chapters', 'guidebooks', 'guidebook series']);

function isHiddenNavLink(link: { text: string; href?: string }): boolean {
  return (link.href != null && HIDDEN_NAV_HREFS.has(link.href)) || HIDDEN_NAV_LABELS.has(link.text.toLowerCase());
}

function hidePagesFromUi(nav: NavigationContent): NavigationContent {
  return {
    ...nav,
    header: {
      ...nav.header,
      links: nav.header.links.filter((link) => !isHiddenNavLink(link)),
    },
    footer: {
      ...nav.footer,
      links: nav.footer.links
        .filter((column) => column.title.toLowerCase() !== 'chapters')
        .map((column) => ({
          ...column,
          links: column.links.filter((link) => !isHiddenNavLink(link)),
        })),
    },
  };
}

function ensureLegalFooterLinks(nav: NavigationContent): NavigationContent {
  const existing = nav.footer.secondaryLinks ?? [];
  const byHref = new Map(existing.map((link) => [link.href, link]));
  const merged = LEGAL_FOOTER_LINKS.map((link) => byHref.get(link.href) ?? link);

  for (const link of existing) {
    if (!merged.some((item) => item.href === link.href)) merged.push(link);
  }

  return {
    ...nav,
    footer: { ...nav.footer, secondaryLinks: merged },
  };
}

export async function getNavigationContent(): Promise<NavigationContent> {
  try {
    const nav = await getSanityNavigationContent();
    if (nav?.header && nav?.footer) {
      return hidePagesFromUi(ensureLegalFooterLinks(nav));
    }
  } catch (error) {
    console.warn('Sanity navigation unavailable; using local fallback.', error);
  }
  return hidePagesFromUi(ensureLegalFooterLinks(navigationData));
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const [sanitySlugs, localSlugs] = await Promise.all([
    getSanityBlogPostSlugs().catch(() => [] as string[]),
    Promise.resolve(localBlogPosts.map((post) => post.slug)),
  ]);
  return [...new Set([...localSlugs, ...sanitySlugs])];
}

const STATIC_PATHS = [
  '/',
  '/blog',
  '/reviews',
  '/privacy-policy',
  '/terms',
  '/accessibility',
  '/contact',
  ...interiorPaths,
];

export async function getPublicContentPaths(): Promise<string[]> {
  const postSlugs = await getBlogPostSlugs();
  return [...STATIC_PATHS, ...postSlugs.map((slug) => `/blog/${slug.replace(/^\/+/, '')}`)];
}

export function getBlogPermalink(slug: string): string {
  return `/blog/${slug}`;
}

function overlayCmsFields(local: BlogPost, sanity: BlogPost): BlogPost {
  return {
    ...local,
    title: sanity.title || local.title,
    excerpt: sanity.excerpt || local.excerpt,
    publishDate: sanity.publishDate || local.publishDate,
    author: sanity.author || local.author,
    image: sanity.image?.src ? sanity.image : local.image,
    relatedPages: sanity.relatedPages.length ? sanity.relatedPages : local.relatedPages,
    contentBlocks: sanity.contentBlocks?.length ? sanity.contentBlocks : local.contentBlocks,
  };
}

function mergeBlogPosts(sanityPosts: BlogPost[], localPosts: BlogPost[]): BlogPost[] {
  const localBySlug = new Map(localPosts.map((post) => [post.slug, post]));
  const sanityBySlug = new Map(sanityPosts.map((post) => [post.slug, post]));
  const slugs = new Set([...localBySlug.keys(), ...sanityBySlug.keys()]);

  return [...slugs]
    .map((slug) => {
      const sanity = sanityBySlug.get(slug);
      const local = localBySlug.get(slug);
      if (sanity && local) return overlayCmsFields(local, sanity);
      return (sanity ?? local)!;
    })
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getSanityBlogPosts();
    if (posts.length) return mergeBlogPosts(posts, localBlogPosts);
  } catch (error) {
    console.warn('Sanity blog posts unavailable; using local articles.', error);
  }
  return [...localBlogPosts].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const local = localBlogPosts.find((post) => post.slug === slug);
  let sanity: BlogPost | undefined;
  try {
    sanity = (await getSanityBlogPost(slug)) ?? undefined;
  } catch (error) {
    console.warn(`Sanity blog post "${slug}" unavailable; checking local articles.`, error);
  }

  if (sanity && local) return overlayCmsFields(local, sanity);
  return sanity ?? local;
}

export async function getBlogPostsRelatedTo(pageSlug: string): Promise<BlogPost[]> {
  const key = pageSlug.replace(/^\/+/, '');
  const posts = await getBlogPosts();
  return posts.filter((post) => post.relatedPages.includes(key)).slice(0, 3);
}

export async function getRelatedBlogPosts(post: BlogPost, max = 3): Promise<BlogPost[]> {
  const keys = new Set(post.relatedPages);
  if (!keys.size) return [];

  const posts = await getBlogPosts();
  return posts
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score: item.relatedPages.filter((key) => keys.has(key)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.publishDate.localeCompare(a.item.publishDate))
    .slice(0, max)
    .map(({ item }) => item);
}

export type { BlogPost, NavigationContent, Testimonial };

export function formatTestimonialAttribution(item: Testimonial): string {
  return [item.name, item.location].filter(Boolean).join(' · ');
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await getSanityTestimonials();
  } catch (error) {
    console.warn('Sanity testimonials unavailable.', error);
    return [];
  }
}

// ─── Page images ─────────────────────────────────────────────────────────────
// Photos live in Sanity (one singleton per page). A missing image or an
// unreachable dataset leaves the slot empty so the grey placeholder renders.

async function imagesOrEmpty<T>(label: string, load: () => Promise<T>, empty: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.warn(`Sanity ${label} images unavailable; using placeholders.`, error);
    return empty;
  }
}

export const getHomepageImages = (): Promise<HomepageImages> =>
  imagesOrEmpty('homepage', getSanityHomepageImages, {});

export const getAboutImages = (): Promise<AboutImages> => imagesOrEmpty('about', getSanityAboutImages, {});

export const getCateringImages = (): Promise<CateringImages> =>
  imagesOrEmpty('catering', getSanityCateringImages, {});

export const getLocationImages = (): Promise<LocationImages> =>
  imagesOrEmpty('locations', getSanityLocationImages, { wahiawaFavorites: {}, kapoleiFavorites: {} });

export const getEventsImages = (): Promise<EventsImages> => imagesOrEmpty('events', getSanityEventsImages, {});

export const getMenuPagesImages = (): Promise<MenuPagesImages> =>
  imagesOrEmpty('menu pages', getSanityMenuPagesImages, {});

// ─── Menu ────────────────────────────────────────────────────────────────────
// Sanity is the source of truth (categories, dishes, "Choose Your Meat").
// If Sanity is unreachable or has no categories yet, the pages fall back to the
// seed copy in src/data so they never render empty.

function fallbackMenuCategories(): MenuCategory[] {
  return menuCategoryLinks.map((link) => {
    const slug = link.href.replace(/^\/menu\//, '');
    return {
      title: link.label,
      slug,
      href: link.href,
      description: link.description,
      hubSpan: link.span,
      items: (menuItemSeed[slug] ?? []).map(({ title, description, section }) => ({ title, description, section })),
    };
  });
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  try {
    const categories = await getSanityMenuCategories();
    if (categories.length) return categories;
    console.warn('Sanity has no menu categories yet; using the local menu fallback.');
  } catch (error) {
    console.warn('Sanity menu unavailable; using the local menu fallback.', error);
  }
  return fallbackMenuCategories();
}

export async function getMenuCategory(slug: string): Promise<MenuCategory | undefined> {
  const normalized = slug.replace(/^\/+|\/+$/g, '');
  const categories = await getMenuCategories();
  return categories.find((category) => category.slug === normalized || category.href === `/menu/${normalized}`);
}

/** Dishes of one category page, grouped by the section each dish is placed in. */
export async function getMenuSections(slug: string): Promise<Record<MenuSectionKey, MenuItem[]>> {
  const sections = Object.fromEntries(MENU_SECTION_KEYS.map((key) => [key, [] as MenuItem[]])) as Record<
    MenuSectionKey,
    MenuItem[]
  >;
  const category = await getMenuCategory(slug);
  for (const item of category?.items ?? []) {
    const key = (item.section ?? 'main') as MenuSectionKey;
    if (key in sections) sections[key].push(item);
  }
  return sections;
}

export async function getMeatOptions(): Promise<MeatOption[]> {
  try {
    const options = await getSanityMeatOptions();
    if (options.length) return options;
  } catch (error) {
    console.warn('Sanity meat options unavailable; using the local fallback.', error);
  }
  return fallbackMeatOptions;
}

export type { MenuCategory, MenuItem, MeatOption };
