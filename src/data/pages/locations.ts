/**
 * Locations page copy — the seed + fallback for the Sanity documents behind
 * /locations and its two restaurant pages. Keys match the Studio field names.
 *
 *   locationsContent          → /locations            (singleton-locations)
 *   locationsSubPage ×2       → /locations/<slug>     (locations-page-<slug>)
 *
 * Address, phone, hours, map and DoorDash links of each restaurant stay in
 * src/data/locations.ts (they are shared with the footer, contact page and
 * order-online page). Rich paragraphs use `[label](href)` links.
 */
import { CATERING_CTA_HREF } from '~/config/cta';
import { findStore, storeDirectionsHref } from '../locations';
import type { ContentImage } from '~/lib/content/types';
import type { HomeButton, HomeLink } from './homepage';
import type { MenuTone } from './menu';
import type { Rich } from './catering';

export interface LocationsTextSplitBlock {
  _type: 'locationsTextSplit';
  anchor: string;
  tone: MenuTone;
  imageSide: 'left' | 'right';
  heading: string;
  paragraphs: Rich;
  smallPrint?: string;
  /** Street address shown in bold under the paragraphs (use a line break between lines). */
  address?: string;
  buttons?: HomeButton[];
  image?: ContentImage;
}
export interface LocationsFavoritesBlock {
  _type: 'locationsFavorites';
  anchor: string;
  tone: MenuTone;
  title: string;
  intro: string;
  items: { title: string; description: string; image?: ContentImage }[];
  footnote: string;
  button: HomeLink;
}
export type LocationsBlock = LocationsTextSplitBlock | LocationsFavoritesBlock;

export interface LocationCard {
  name: string;
  image?: ContentImage;
  tagline: string;
  heading: string;
  shopName: string;
  addressLine1: string;
  addressLine2: string;
  paragraphs: string[];
  hours: string[];
  actions: HomeButton[];
}

export interface LocationsHubContent {
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  cards: LocationCard[];
  blocks: LocationsBlock[];
}

export interface LocationFaq {
  question: string;
  answer: Rich;
}

export interface LocationsSubPageContent {
  slug: string;
  pageName: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  heroButtons: HomeButton[];
  visitTitle: string;
  blocks: LocationsBlock[];
  faqsTitle: string;
  faqs: LocationFaq[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: HomeLink;
}

export const wahiawa = findStore('wahiawa');
export const kapolei = findStore('kapolei');
if (!wahiawa || !kapolei) throw new Error('Missing store data');

const KITCHEN_HOURS = ['Kitchen Hours', 'Daily: 7:00 AM – 10:00 PM'];
export const FAVORITES_FOOTNOTE = 'Menu items and availability may change. Visit our menu to explore more.';

export const locationsHubDefaults: LocationsHubContent = {
  seoTitle: 'Wahiawa & Kapolei Locations | Taqueria El Ranchero',
  seoDescription:
    'Find Taqueria El Ranchero in Wahiawa and Kapolei. Get store addresses, kitchen hours, directions and DoorDash ordering for both Oʻahu locations.',
  heroTitle: 'Find Taqueria El Ranchero in Wahiawa & Kapolei',
  heroParagraphs: [
    'Looking for Taqueria El Ranchero near you? Visit us at either of our two Oʻahu restaurants, in Wahiawa and Kapolei.',
    'Both locations serve the same Ranchero-style Mexican menu, with tacos, burritos, breakfast favorites and more. Each restaurant has its own atmosphere, so choose the location that works best for your visit.',
  ],
  cards: [
    {
      name: 'Wahiawa',
      tagline: 'Our Original Neighborhood Taqueria',
      heading: 'Taqueria El Ranchero Wahiawa',
      shopName: 'Wahiawa Shopping Center',
      addressLine1: '823 California Ave, Unit A5',
      addressLine2: 'Wahiawa, HI 96786',
      paragraphs: [
        'Visit our original location at Wahiawa Shopping Center on California Avenue.',
        'With its rustic, neighborhood feel, our Wahiawa restaurant is a familiar stop for local regulars, military families and visitors traveling through Central Oʻahu toward the North Shore.',
        'Stop in for tacos, a burrito or Mexican breakfast before heading out for the day.',
      ],
      hours: KITCHEN_HOURS,
      actions: [
        { text: 'View Wahiawa Location', href: wahiawa.href, variant: 'primary' },
        { text: 'Get Directions to Wahiawa', href: storeDirectionsHref(wahiawa), variant: 'ghost' },
        { text: 'Order Wahiawa on DoorDash', href: wahiawa.orderPickupHref, variant: 'ghost' },
      ],
    },
    {
      name: 'Kapolei',
      tagline: 'Sit Down and Stay Awhile at Ka Makana Aliʻi',
      heading: 'Taqueria El Ranchero Kapolei',
      shopName: 'Ka Makana Aliʻi',
      addressLine1: '91-5431 Kapolei Pkwy #501',
      addressLine2: 'Kapolei, HI 96707',
      paragraphs: [
        'Find our Kapolei restaurant at Ka Makana Aliʻi, a convenient stop while shopping or spending time in West Oʻahu.',
        'The Kapolei location offers a sit-down restaurant experience with table service, outdoor seating and space for families and friends to enjoy a meal together.',
        'Our Kapolei restaurant also has venue space available for private events and group gatherings.',
      ],
      hours: KITCHEN_HOURS,
      actions: [
        { text: 'View Kapolei Location', href: kapolei.href, variant: 'primary' },
        { text: 'Get Directions to Kapolei', href: storeDirectionsHref(kapolei), variant: 'ghost' },
        { text: 'Order Kapolei on DoorDash', href: kapolei.orderPickupHref, variant: 'ghost' },
      ],
    },
  ],
  blocks: [
    {
      _type: 'locationsTextSplit',
      anchor: 'same-menu',
      tone: 'page',
      imageSide: 'right',
      heading: 'The Same Mexican Menu at Both Locations',
      paragraphs: [
        'Whichever restaurant you choose, you’ll find the same Taqueria El Ranchero menu, inspired by the taquerias of Northern California.',
        'Our ingredients are prepped fresh every morning, including meats grilled over an open-fire grill, fresh vegetables and homemade salsas. Meals are assembled to order.',
        'Both restaurants also serve Mexican breakfast every day from 7:00 AM to 12:00 PM.',
      ],
      buttons: [{ text: 'Explore Our Full Menu', href: '/menu', variant: 'primary' }],
    },
    {
      _type: 'locationsTextSplit',
      anchor: 'group-meal',
      tone: 'card',
      imageSide: 'left',
      heading: 'Planning a Group Meal?',
      paragraphs: [
        'El Ranchero also offers Mexican catering for workplace meals, parties and other group gatherings.',
        'For private gatherings at our Kapolei restaurant, you can also learn more about the [available event space](/events/event-space-rental) on our [Event Space Rental page](/events/event-space-rental).',
      ],
      buttons: [{ text: 'Explore Our Catering Options', href: CATERING_CTA_HREF, variant: 'primary' }],
    },
  ],
};
