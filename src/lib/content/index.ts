import type {
  BlogPost,
  NavigationContent,
  Testimonial,
  MenuCategory,
  MenuItem,
  MeatOption,
} from './types';
import {
  getSanityHomepageContent,
  getSanityAbout,
  getSanityReviews,
  getSanityBlogIndex,
  getSanityContactPage,
  getSanityOrderOnline,
  getSanityLegalPage,
  getSanityCateringHub,
  getSanityCateringSubPage,
  getSanityEventsHub,
  getSanityLocationsHub,
  getSanityLocationsSubPage,
  getSanityEventsSubPage,
  getSanityMenuHub,
  getSanityMenuCategoryPage,
  getSanityMenuShared,
  getSanityBlogPost,
  getSanityBlogPosts,
  getSanityBlogPostSlugs,
  getSanitySitemapContent,
  getSanityTestimonials,
  getSanityNavigationContent,
  getSanityMenuCategories,
  getSanityMeatOptions,
} from './sanity';
import { homepageDefaults, type HomepageContent } from '../../data/pages/homepage';
import {
  blogIndexDefaults,
  contactPageDefaults,
  orderOnlineDefaults,
  type BlogIndexContent,
  type ContactPageContent,
  type OrderOnlineContent,
} from '../../data/pages/sitePages';
import { legalPageDefaults, type LegalPageContent } from '../../data/pages/legal';
import { reviewsDefaults, type ReviewsContent } from '../../data/pages/reviews';
import { aboutDefaults, type AboutContent } from '../../data/pages/about';
import {
  locationsHubDefaults,
  locationsSubPageDefaults,
  type LocationsHubContent,
  type LocationsSubPageContent,
} from '../../data/pages/locations';
import {
  eventsHubDefaults,
  eventsSubPageDefaults,
  type EventsHubContent,
  type EventsSubPageContent,
} from '../../data/pages/events';
import {
  cateringHubDefaults,
  cateringSubPageDefaults,
  type CateringHubContent,
  type CateringSubPageContent,
} from '../../data/pages/catering';
import {
  menuCategoryPageDefaults,
  menuHubDefaults,
  menuSharedDefaults,
  type MenuCategoryPageContent,
  type MenuHubContent,
  type MenuSharedContent,
} from '../../data/pages/menu';
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

// ─── Page images ─────────────────────────────────────────────────────────────
// Photos live in Sanity (one singleton per page). A missing image or an
// unreachable dataset leaves the slot empty so the grey placeholder renders.

/**
 * Homepage copy, links and photos from the Sanity "Homepage" singleton.
 * A field Sanity has no value for falls back to `homepageDefaults`, so the page
 * never renders broken while the Studio is being filled in (or if it is down).
 */
export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const doc = await getSanityHomepageContent();
    if (doc) {
      const defined = Object.fromEntries(Object.entries(doc).filter(([, value]) => value != null));
      return { ...homepageDefaults, ...defined };
    }
  } catch (error) {
    console.warn('Sanity homepage unavailable; using the built-in copy.', error);
  }
  return homepageDefaults;
}

export async function getBlogIndexContent(): Promise<BlogIndexContent> {
  try {
    const doc = await getSanityBlogIndex();
    if (doc) return { ...blogIndexDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity blog page unavailable; using the built-in copy.', error);
  }
  return blogIndexDefaults;
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  try {
    const doc = await getSanityContactPage();
    if (doc) return { ...contactPageDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity contact page unavailable; using the built-in copy.', error);
  }
  return contactPageDefaults;
}

export async function getOrderOnlineContent(): Promise<OrderOnlineContent> {
  try {
    const doc = await getSanityOrderOnline();
    if (doc) return { ...orderOnlineDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity order-online page unavailable; using the built-in copy.', error);
  }
  return orderOnlineDefaults;
}

/** Copy of a legal page (/privacy-policy, /terms, /accessibility). Sanity wins; defaults fill any gap. */
export async function getLegalPageContent(slug: string): Promise<LegalPageContent> {
  const defaults = legalPageDefaults.find((page) => page.slug === slug);
  if (!defaults) throw new Error(`No legal page defaults for "${slug}".`);
  try {
    const doc = await getSanityLegalPage(slug);
    if (doc) return { ...defaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn(`Sanity legal page "${slug}" unavailable; using the built-in copy.`, error);
  }
  return defaults;
}

/** Copy, links and photo of /reviews. Sanity wins; defaults fill any gap. */
export async function getReviewsContent(): Promise<ReviewsContent> {
  try {
    const doc = await getSanityReviews();
    if (doc) return { ...reviewsDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity reviews page unavailable; using the built-in copy.', error);
  }
  return reviewsDefaults;
}

/** Copy, links and photos of /about. Sanity wins; defaults fill any gap. */
export async function getAboutContent(): Promise<AboutContent> {
  try {
    const doc = await getSanityAbout();
    if (doc) return { ...aboutDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity about page unavailable; using the built-in copy.', error);
  }
  return aboutDefaults;
}

const definedOnly = <T extends object>(doc: T): Partial<T> =>
  Object.fromEntries(Object.entries(doc).filter(([, value]) => value != null)) as Partial<T>;

export async function getLocationsHubContent(): Promise<LocationsHubContent> {
  try {
    const doc = await getSanityLocationsHub();
    if (doc) return { ...locationsHubDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity locations hub unavailable; using the built-in copy.', error);
  }
  return locationsHubDefaults;
}

/** Copy, links and photos of /locations/<slug>. Sanity wins; defaults fill any gap. */
export async function getLocationsSubPageContent(slug: string): Promise<LocationsSubPageContent> {
  const defaults = locationsSubPageDefaults.find((page) => page.slug === slug);
  if (!defaults) throw new Error(`No locations page defaults for "${slug}".`);
  try {
    const doc = await getSanityLocationsSubPage(slug);
    if (doc) return { ...defaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn(`Sanity locations page "${slug}" unavailable; using the built-in copy.`, error);
  }
  return defaults;
}

export async function getEventsHubContent(): Promise<EventsHubContent> {
  try {
    const doc = await getSanityEventsHub();
    if (doc) return { ...eventsHubDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity events hub unavailable; using the built-in copy.', error);
  }
  return eventsHubDefaults;
}

/** Copy, links and photos of /events/<slug>. Sanity wins; defaults fill any gap. */
export async function getEventsSubPageContent(slug: string): Promise<EventsSubPageContent> {
  const defaults = eventsSubPageDefaults.find((page) => page.slug === slug);
  if (!defaults) throw new Error(`No events page defaults for "${slug}".`);
  try {
    const doc = await getSanityEventsSubPage(slug);
    if (doc) return { ...defaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn(`Sanity events page "${slug}" unavailable; using the built-in copy.`, error);
  }
  return defaults;
}

export async function getCateringHubContent(): Promise<CateringHubContent> {
  try {
    const doc = await getSanityCateringHub();
    if (doc) return { ...cateringHubDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity catering hub unavailable; using the built-in copy.', error);
  }
  return cateringHubDefaults;
}

/** Copy, links and photos of /catering/<slug>. Sanity wins; defaults fill any gap. */
export async function getCateringSubPageContent(slug: string): Promise<CateringSubPageContent> {
  const defaults = cateringSubPageDefaults.find((page) => page.slug === slug);
  if (!defaults) throw new Error(`No catering page defaults for "${slug}".`);
  try {
    const doc = await getSanityCateringSubPage(slug);
    if (doc) return { ...defaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn(`Sanity catering page "${slug}" unavailable; using the built-in copy.`, error);
  }
  return defaults;
}

export async function getMenuHubContent(): Promise<MenuHubContent> {
  try {
    const doc = await getSanityMenuHub();
    if (doc) return { ...menuHubDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity menu hub unavailable; using the built-in copy.', error);
  }
  return menuHubDefaults;
}

/** Copy, links and photos of /menu/<slug>. Sanity wins; defaults fill any gap. */
export async function getMenuCategoryPageContent(slug: string): Promise<MenuCategoryPageContent> {
  const defaults = menuCategoryPageDefaults.find((page) => page.slug === slug);
  if (!defaults) throw new Error(`No menu page defaults for "${slug}".`);
  try {
    const doc = await getSanityMenuCategoryPage(slug);
    if (doc) return { ...defaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn(`Sanity menu page "${slug}" unavailable; using the built-in copy.`, error);
  }
  return defaults;
}

/** Order cards + allergy notice shared by /menu and every /menu/* page. */
export async function getMenuSharedContent(): Promise<MenuSharedContent> {
  try {
    const doc = await getSanityMenuShared();
    if (doc) return { ...menuSharedDefaults, ...definedOnly(doc) };
  } catch (error) {
    console.warn('Sanity shared menu sections unavailable; using the built-in copy.', error);
  }
  return menuSharedDefaults;
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
