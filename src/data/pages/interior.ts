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
  { text: 'Salads', href: '/menu/salads' },
  { text: 'Wraps & Subs', href: '/menu/wraps-subs' },
  { text: 'Soups', href: '/menu/soups' },
  { text: 'Keiki / Kids Menu', href: '/menu/kids' },
  { text: 'Design Your Own Salad', href: '/menu/design-your-own-salad' },
  { text: 'Vegan Options', href: '/menu/vegan' },
  { text: 'Vegetarian Options', href: '/menu/vegetarian' },
  { text: 'Healthy Food & Menu Options', href: '/menu/healthy-options' },
  { text: 'Misc', href: '/menu/misc' },
  { text: 'Drinks', href: '/menu/drinks' },
];

const CATERING_LINKS: InteriorLink[] = [
  { text: 'Corporate Catering', href: '/catering/corporate' },
  { text: 'Office Lunch Catering', href: '/catering/office-lunches' },
  { text: 'Meeting Catering', href: '/catering/meetings' },
  { text: 'Event Catering', href: '/catering/events' },
  { text: 'Large Group Catering', href: '/catering/large-groups' },
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
        body: 'Healthy, fresh, and local is how we started, and how we still buy. The full sourcing story lives on Our Ingredients — this page is the short version of how we got here.',
        links: [
          { text: 'Our Ingredients', href: '/ingredients' },
          { text: LOCATION_CTA_LABEL, href: LOCATION_CTA_HREF },
        ],
      },
    ],
  },
  '/ingredients': {
    path: '/ingredients',
    title: 'Our Ingredients & Local Sourcing',
    metaDescription:
      'Fresh local ahi never frozen, island produce, mamaki mint tea from the Big Island, and compostable packaging.',
    heading: 'Our ingredients & local sourcing',
    lede: 'Weve bought from local farmers and fishermen since day one in Kailua. Heres what that actually means on your plate.',
    sections: [
      {
        heading: 'Never-frozen local ahi',
        body: 'Fresh local ahi, never frozen — delivered, not shipped in from far away.',
      },
      {
        heading: 'Local produce',
        body: 'Greens and vegetables from local Hawaii farms, in season whenever we can.',
      },
      {
        heading: 'Mamaki mint tea',
        body: 'Brewed from mamaki (mamaki) grown on Hawaii Island — a true taste of the islands. Search either spelling and youll land here.',
      },
      {
        heading: 'Packaging',
        body: 'All packaging is eco-friendly and compostable. Every piece of it.',
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
  '/menu/salads': {
    path: '/menu/salads',
    title: 'Salads',
    metaDescription: 'Island salads from El Ranchero — including never-frozen local ahi and design-your-own bowls.',
    heading: 'Salads',
    lede: 'The bowls people come back for, plus plenty of room to build your own.',
    sections: [{ links: [{ text: 'Design Your Own Salad', href: '/menu/design-your-own-salad' }] }],
  },
  '/menu/wraps-subs': {
    path: '/menu/wraps-subs',
    title: 'Wraps & Subs',
    metaDescription: 'Wraps and subs from El Ranchero, including hummus pita and caprese.',
    heading: 'Wraps & subs',
    lede: 'The same fresh fillings, folded or stacked.',
  },
  '/menu/soups': {
    path: '/menu/soups',
    title: 'Soups',
    metaDescription: 'Soups from El Ranchero.',
    heading: 'Soups',
    lede: 'Hot bowls to go with a salad, a wrap, or on their own.',
  },
  '/menu/kids': {
    path: '/menu/kids',
    title: 'Keiki / Kids Menu',
    metaDescription: 'Keiki menu at El Ranchero — smaller portions for kids.',
    heading: 'Keiki / kids menu',
    lede: 'Smaller plates for smaller appetites, made with the same ingredients we serve everyone else.',
  },
  '/menu/design-your-own-salad': {
    path: '/menu/design-your-own-salad',
    title: 'Build Your Own Salad',
    metaDescription:
      'Build your own salad at El Ranchero with your choice of fresh lettuce, toppings, cheese, and house-made dressing. Order online across our six Oahu locations.',
    heading: 'Design Your Own Salad',
    lede: 'Skip the menu and build your own salad: greens, toppings, extras, and a dressing, the way you like it.',
    sections: [
      {
        heading: 'Build your own salad',
        body: 'This is the page vegan, vegetarian, and anyone with a specific combination should start from. Dishes never get their own URL — the builder lives here.',
        links: [
          { text: 'Vegan options', href: '/menu/vegan' },
          { text: 'Vegetarian options', href: '/menu/vegetarian' },
        ],
      },
    ],
  },
  '/menu/vegan': {
    path: '/menu/vegan',
    title: 'Vegan Options',
    metaDescription: 'Vegan dishes at El Ranchero: Vegan Aloha Mediterranean and Vegan Mandarin Ginger.',
    heading: 'Vegan options',
    lede: 'Two dishes on the menu are vegan. For everything else, design your own salad without animal products.',
    sections: [
      {
        heading: 'On the menu',
        items: [
          { title: 'Vegan Aloha Mediterranean' },
          { title: 'Vegan Mandarin Ginger' },
        ],
        links: [{ text: 'Design Your Own Salad', href: '/menu/design-your-own-salad' }],
      },
    ],
  },
  '/menu/vegetarian': {
    path: '/menu/vegetarian',
    title: 'Vegetarian Options',
    metaDescription: 'Vegetarian menu options at El Ranchero, plus dishes that can be made vegetarian.',
    heading: 'Vegetarian options',
    lede: 'Nothing on the menu is tagged vegetarian, so this list is derived from the ingredients. Start here, or design your own salad.',
    sections: [
      {
        heading: 'Vegetarian as served',
        items: [
          { title: 'Aloha Passion' },
          { title: 'Aloha Mediterranean' },
          { title: 'The Paniolo' },
          { title: 'Maui Mozzarella' },
          { title: 'Design Your Own Salad' },
          { title: 'Hummus Pita Wrap' },
          { title: 'Caprese Sub' },
          { title: 'Vegan Aloha Mediterranean' },
          { title: 'Vegan Mandarin Ginger' },
          { title: 'Sides' },
        ],
      },
      {
        heading: 'Can be made vegetarian',
        body: 'Some dishes only fail on a protein add-on. Aloha Caesar is not vegetarian (anchovy in the Caesar dressing). Tomato Bisque / Grilled Cheese Soup Combo is excluded until the stock is confirmed.',
        links: [{ text: 'Design Your Own Salad', href: '/menu/design-your-own-salad' }],
      },
    ],
  },
  '/menu/healthy-options': {
    path: '/menu/healthy-options',
    title: 'Healthy Food & Menu Options',
    metaDescription:
      'Healthy food and menu options at El Ranchero — island-grown produce, never-frozen local ahi, and bowls you control.',
    heading: 'Healthy food & menu options',
    lede: 'Fresh, healthy food that still tastes like something you want to eat. Island-grown produce, never-frozen local ahi, and a builder if you want to keep it exactly how you like it.',
    sections: [
      {
        links: [
          { text: LOCATION_CTA_LABEL, href: LOCATION_CTA_HREF },
          { text: 'Design Your Own Salad', href: '/menu/design-your-own-salad' },
        ],
      },
    ],
  },
  '/menu/drinks': {
    path: '/menu/drinks',
    title: 'Drinks',
    metaDescription: 'Drinks at El Ranchero, including mamaki mint tea from Hawaii Island.',
    heading: 'Drinks',
    lede: 'From mamaki mint tea to the rest of the cooler. Details land here when the menu is designed.',
    sections: [{ links: [{ text: 'Our Ingredients', href: '/ingredients' }] }],
  },
  '/menu/misc': {
    path: '/menu/misc',
    title: 'Misc Menu Favorites',
    metaDescription: 'Additional El Ranchero favorites including avocado toast, dessert toast, and acai bowls.',
    heading: 'Misc menu favorites',
    lede: 'Additional favorites and cafe-style selections from the El Ranchero menu.',
    sections: [{ links: [{ text: 'Full Menu', href: '/menu' }] }],
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
        links: CATERING_LINKS,
      },
    ],
  },
  '/catering/corporate': {
    path: '/catering/corporate',
    title: 'Corporate Catering',
    metaDescription: 'Corporate catering from El Ranchero — trays for teams across Oahu.',
    heading: 'Corporate catering',
    lede: 'Fresh trays for the office, the boardroom, and the all-hands. See the catering hub for the full priced list.',
    sections: [{ links: [{ text: 'View all catering', href: CATERING_CTA_HREF }] }],
  },
  '/catering/office-lunches': {
    path: '/catering/office-lunches',
    title: 'Office Lunch Catering',
    metaDescription: 'Office lunch catering from El Ranchero.',
    heading: 'Office lunch catering',
    lede: 'Lunch that shows up ready — salads, wraps, and trays for the workday.',
    sections: [{ links: [{ text: 'View all catering', href: CATERING_CTA_HREF }] }],
  },
  '/catering/meetings': {
    path: '/catering/meetings',
    title: 'Meeting Catering',
    metaDescription: 'Meeting catering from El Ranchero.',
    heading: 'Meeting catering',
    lede: 'Keep the meeting on the food, not the logistics. Trays for working lunches and longer sessions.',
    sections: [{ links: [{ text: 'View all catering', href: CATERING_CTA_HREF }] }],
  },
  '/catering/events': {
    path: '/catering/events',
    title: 'Event Catering',
    metaDescription: 'Event catering from El Ranchero.',
    heading: 'Event catering',
    lede: 'Event trays, listed separately from party catering. Same kitchen, different use.',
    sections: [{ links: [{ text: 'View all catering', href: CATERING_CTA_HREF }] }],
  },
  '/catering/large-groups': {
    path: '/catering/large-groups',
    title: 'Large Group Catering',
    metaDescription: 'Large group catering from El Ranchero.',
    heading: 'Large group catering',
    lede: 'When the guest count goes up, start with the tray list on the catering hub and tell us the head count.',
    sections: [{ links: [{ text: 'View all catering', href: CATERING_CTA_HREF }] }],
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
  '/order-online': {
    path: '/order-online',
    title: 'Order Online',
    metaDescription: 'Order El Ranchero online for pickup or delivery from any of our six Oahu locations.',
    heading: 'Order online',
    lede: 'Pickup or delivery from any of our six stores. Choose a location to start an order.',
    sections: [
      {
        heading: 'Order from a store',
        links: storeLocations.map((store) => ({ text: store.heading, href: store.href })),
      },
    ],
  },
  '/gift-cards': {
    path: '/gift-cards',
    title: 'Gift Cards',
    metaDescription: 'Buy El Ranchero gift cards and check your balance through Heartland.',
    heading: 'Gift cards',
    lede: 'Purchase a card or check a balance through Heartland. This page will link out once the live Heartland URL is confirmed.',
    sections: [
      {
        items: [
          { title: 'Buy a gift card', description: 'Heartland checkout — URL pending.' },
          { title: 'Check balance', description: 'Heartland balance check — URL pending.' },
        ],
      },
    ],
  },
  '/nutrition-allergens': {
    path: '/nutrition-allergens',
    title: 'Nutrition & Allergen Information',
    metaDescription: 'Nutrition and allergen information for El Ranchero. Data will be published after business sign-off.',
    heading: 'Nutrition & allergen information',
    lede: 'This page is a shell until the business signs off the data. We will not invent nutritional values, allergen status, or cross-contamination claims.',
    sections: [
      {
        links: [
          { text: 'View menu', href: '/menu' },
          { text: 'Contact us', href: '/contact' },
        ],
      },
    ],
  },
  '/press': {
    path: '/press',
    title: 'Press & Media',
    metaDescription: 'Press and media coverage of El Ranchero.',
    heading: 'Press & media',
    lede: 'Coverage and mentions live here, separate from the new blog. Existing posts currently on the live site /blog/ migrate here before the editorial blog publishes.',
  },
  '/careers': {
    path: '/careers',
    title: 'Work With Us',
    metaDescription: 'Work with El Ranchero. Apply at info@elranchero.com.',
    heading: 'Work with us',
    lede: 'One general page, no individual job postings. Email info@elranchero.com to apply.',
    sections: [
      {
        heading: 'Benefits',
        items: [
          { title: 'Healthcare' },
          { title: 'Medical / dental' },
          { title: '401k for eligible employees' },
          { title: 'Discounted and free meals for staff' },
          { title: 'Parties and giveaways' },
        ],
        links: [{ text: 'Email info@elranchero.com', href: 'mailto:info@elranchero.com' }],
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
