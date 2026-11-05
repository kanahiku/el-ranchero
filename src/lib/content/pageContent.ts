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
  type LocationsHubContent,
  type LocationsSubPageContent,
} from '../../data/pages/locations';
import { locationsSubPageDefaults } from '../../data/pages/locationsSubPages';
import { eventsHubDefaults, type EventsHubContent, type EventsSubPageContent } from '../../data/pages/events';
import { eventsSubPageDefaults } from '../../data/pages/eventsSubPages';
import { cateringHubDefaults, type CateringHubContent, type CateringSubPageContent } from '../../data/pages/catering';
import { cateringSubPageDefaults } from '../../data/pages/cateringSubPages';
import {
  menuHubDefaults,
  menuSharedDefaults,
  type MenuCategoryPageContent,
  type MenuHubContent,
  type MenuSharedContent,
} from '../../data/pages/menu';
import { menuCategoryPageDefaults } from '../../data/pages/menuSubPages';

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
