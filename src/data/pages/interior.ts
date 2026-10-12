import { storeLocations } from '~/data/locations';
import {
  CATERING_CTA_HREF,
  CATERING_CTA_LABEL,
  LOCATION_CTA_HREF,
  LOCATION_CTA_LABEL,
  PRIMARY_CTA_HREF,
  PRIMARY_CTA_LABEL,
} from '~/config/cta';

export interface InteriorLink {
  text: string;
  href: string;
}

export interface InteriorItem {
  title: string;
  description?: string;
}

export interface InteriorSection {
  heading?: string;
  body?: string;
  links?: InteriorLink[];
  items?: InteriorItem[];
}

export interface InteriorPageContent {
  path: string;
  /** Document title (before the site name). */
  title: string;
  metaDescription: string;
  heading: string;
  lede: string;
  sections?: InteriorSection[];
}

const MENU_LINKS: InteriorLink[] = [
  { text: 'Breakfast', href: '/menu/breakfast' },
  { text: 'Burritos', href: '/menu/burritos' },
  { text: 'Tacos & Birria', href: '/menu/tacos' },
  { text: 'Entrees & Fajitas', href: '/menu/entrees' },
  { text: 'Quesadillas & Nachos', href: '/menu/quesadillas-nachos' },
  { text: 'Specials', href: '/menu/specials' },
  { text: 'Appetizers & Sides', href: '/menu/appetizers-sides' },
  { text: 'Kids Menu', href: '/menu/kids' },
  { text: 'Drinks & Margaritas', href: '/menu/drinks' },
];

const CATERING_TRAYS: InteriorItem[] = [
  { title: 'Sandwich Platter', description: '$85' },
  { title: 'Ono Island Ahi Tray', description: '$60' },
  { title: 'Kamuela Cobb Tray', description: '$55' },
  { title: 'Mandarin Ginger Tray', description: '$52' },
  { title: 'Aloha Caesar with Chicken Tray', description: '$45' },
  { title: 'Aloha Passion Tray', description: '$42' },
  { title: 'Aloha Mediterranean Tray', description: '$42' },
  { title: 'The Paniolo Tray', description: '$42' },
  { title: 'Tray of Pita Bread', description: '$24' },
];

const CATERING_SLOTS: InteriorItem[] = [
  { title: 'Servings per tray', description: 'To be confirmed.' },
  { title: 'Minimum order', description: 'To be confirmed.' },
  { title: 'Lead time', description: 'To be confirmed.' },
  { title: 'Delivery radius', description: 'To be confirmed.' },
];

function locationPage(store: (typeof storeLocations)[number]): InteriorPageContent {
  return {
    path: store.href,
    title: store.heading,
    metaDescription: `${store.heading} El Ranchero at ${store.shopName}. ${store.addressLine1}, ${store.addressLine2}.`,
    heading: store.heading,
    lede: store.intro,
    sections: [
      {
        heading: 'Visit this store',
        items: [
          { title: store.shopName, description: `${store.addressLine1}, ${store.addressLine2}` },
          { title: 'Phone', description: store.phoneDisplay },
          { title: 'Hours', description: store.hours },
        ],
        links: [
          { text: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF },
          { text: 'View menu', href: '/menu' },
          { text: CATERING_CTA_LABEL, href: CATERING_CTA_HREF },
          { text: 'All locations', href: LOCATION_CTA_HREF },
        ],
      },
    ],
  };
}

export const interiorPages: Record<string, InteriorPageContent> = {
  '/about': {
    path: '/about',
    title: 'Our Story',
    metaDescription:
      'El Ranchero opened in Kailua in 2006. Fresh, healthy, local food — now at six spots across Oahu.',
    heading: 'Our story',
    lede: 'We opened in Kailua in 2006 with one idea: fresh, healthy food should taste worth coming back for — and feel like home. Six locations later, thats still the whole plan.',
    sections: [
      {
        heading: 'From Kailua to Oahu',
        body: 'Healthy, fresh, and local is how we started, and how we still buy.',
        links: [
          { text: LOCATION_CTA_LABEL, href: LOCATION_CTA_HREF },
        ],
      },
    ],
  },
  '/menu': {
    path: '/menu',
    title: 'Menu',
    metaDescription: 'Salads, wraps, soups, keiki plates, drinks, and design-your-own bowls at El Ranchero.',
    heading: 'The menu',
    lede: 'Individual dishes live inside these categories — they never get their own URL. Start with a favorite, or skip the list and build your own.',
    sections: [
      {
        heading: 'Browse by category',
        links: MENU_LINKS,
      },
    ],
  },
  '/menu/kids': {
    path: '/menu/kids',
    title: 'Keiki / Kids Menu',
    metaDescription: 'Keiki menu at El Ranchero — smaller portions for kids.',
    heading: 'Keiki / kids menu',
    lede: 'Smaller plates for smaller appetites, made with the same ingredients we serve everyone else.',
  },
  '/menu/drinks': {
    path: '/menu/drinks',
    title: 'Drinks',
    metaDescription: 'Drinks at El Ranchero, including mamaki mint tea from Hawaii Island.',
    heading: 'Drinks',
    lede: 'From mamaki mint tea to the rest of the cooler. Details land here when the menu is designed.',
  },
  '/catering': {
    path: '/catering',
    title: 'Catering',
    metaDescription:
      'El Ranchero catering trays for offices, meetings, events, and large groups across Oahu.',
    heading: 'Catering',
    lede: 'Trays for the table, priced as they are on the current menu. Servings, minimums, lead time, and delivery radius will fill in once the shops confirm them.',
    sections: [
      {
        heading: 'Catering trays',
        items: CATERING_TRAYS,
      },
      {
        heading: 'Ordering details',
        items: CATERING_SLOTS,
      },
      {
        heading: 'Catering for',
      },
    ],
  },
  '/locations': {
    path: '/locations',
    title: 'Locations',
    metaDescription:
      'Find an El Ranchero location near you. We operate six restaurants across Oahu offering fresh meals for dine-in or fast pickup.',
    heading: 'El Ranchero Locations on Oahu',
    lede: 'Find your nearest El Ranchero. We operate six neighborhood restaurants across Oahu. Every location offers online ordering for fast pickup and convenient dine-in seating.',
    sections: [
      {
        heading: 'Find a shop',
        links: storeLocations.map((store) => ({ text: store.heading, href: store.href })),
      },
    ],
  },
  ...Object.fromEntries(storeLocations.map((store) => [store.href, locationPage(store)])),
};

export function getInteriorPage(path: string): InteriorPageContent {
  const page = interiorPages[path];
  if (!page) throw new Error(`Missing interior page for ${path}`);
  return page;
}

export const interiorPaths = Object.keys(interiorPages);
