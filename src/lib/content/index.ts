import type { BlogPost, NavigationContent, Testimonial, MenuCategory, MenuItem, MeatOption } from './types';
import {
  getSanityBlogPost,
  getSanityBlogPosts,
  getSanityBlogPostSlugs,
  getSanitySitemapContent,
  getSanityTestimonials,
  getSanityRedirect,
  type RedirectTarget,
  getSanityNavigationContent,
  getSanityMenuCategories,
  getSanityMeatOptions,
} from './sanity';
import { navigationData } from '../../data/navigation';
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
  return getSanityBlogPostSlugs().catch(() => [] as string[]);
}

const pageModules = import.meta.glob('/src/pages/**/*.astro');

function getDiscoveredStaticPaths(): string[] {
  const paths: string[] = [];
  for (const file of Object.keys(pageModules)) {
    if (file.includes('/[') || file.endsWith('/404.astro') || file.includes('/api/')) continue;
    let route = file
      .replace(/^.*\/src\/pages/, '')
      .replace(/\/index\.astro$/, '')
      .replace(/\.astro$/, '');
    if (route === '') route = '/';
    paths.push(route);
  }
  return paths;
}

export interface SitemapEntry {
  path: string;
  lastmod?: string;
}

/**
 * Every indexable URL. Static routes come from the page files, so a new page
 * is listed without a manual edit. Published blogs are added from Sanity with
 * lastmod, and unpublished drafts are left out.
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const [sanityEntries, staticPaths] = await Promise.all([
    getSanitySitemapContent().catch(() => []),
    Promise.resolve(getDiscoveredStaticPaths()),
  ]);

  const map = new Map<string, string | undefined>();
  for (const path of staticPaths) map.set(path, undefined);

  for (const entry of sanityEntries) {
    map.set(entry.path, entry.lastmod);
  }

  return [...map.entries()].map(([path, lastmod]) => ({ path, lastmod }));
}

export async function getPublicContentPaths(): Promise<string[]> {
  const entries = await getSitemapEntries();
  return entries.map((entry) => entry.path);
}

export function getBlogPermalink(slug: string): string {
  return `/blog/${slug}`;
}

/** All published posts, newest first. Posts live only in Sanity: add, edit or delete them in Studio → Blog. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await getSanityBlogPosts();
    return [...posts].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  } catch (error) {
    console.warn('Sanity blog posts unavailable.', error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    return (await getSanityBlogPost(slug)) ?? undefined;
  } catch (error) {
    console.warn(`Sanity blog post "${slug}" unavailable.`, error);
    return undefined;
  }
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

export * from './pageContent';

/** Studio-managed redirect for a path that no longer exists (e.g. a blog post whose slug changed). */
export async function getRedirectFor(path: string): Promise<RedirectTarget | null> {
  try {
    return await getSanityRedirect(path);
  } catch {
    return null;
  }
}
