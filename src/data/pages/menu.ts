/**
 * Menu page copy — the seed + fallback for the Sanity documents behind /menu
 * and every /menu/* category page. Keys match the Studio schema field names.
 *
 *   menuHubContent        → /menu                 (singleton-menu-hub)
 *   menuCategoryPage ×9   → /menu/<slug>          (menu-page-<slug>)
 *   menuPagesContent      → sections shared by all of them (singleton-menu-pages)
 *
 * `npm run seed:menu-pages -- --commit` fills whatever Sanity is missing. At
 * render time Sanity wins; these values only fill gaps / cover an outage.
 */
import { PRIMARY_CTA_HREF } from '~/config/cta';
import type { ContentImage } from '~/lib/content/types';
import type { HomeButton, HomeDish, HomeLink } from './homepage';

export type MenuTone = 'page' | 'card';

export interface MenuDishListBlock {
  _type: 'menuDishList';
  anchor: string;
  /** Which group of dishes (Menu item → "Section on the page"). */
  menuSection: string;
  tone: MenuTone;
  title: string;
  intro?: string;
}
export interface MenuMeatTableBlock {
  _type: 'menuMeatTable';
  anchor: string;
  tone: MenuTone;
  heading: string;
  intro?: string;
  note?: string;
}
export interface MenuTextSplitBlock {
  _type: 'menuTextSplit';
  anchor: string;
  tone: MenuTone;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  afterBullets?: string[];
  motif?: 'none' | 'plant';
  image?: ContentImage;
}
export type MenuBlock = MenuDishListBlock | MenuMeatTableBlock | MenuTextSplitBlock;

export interface MenuHubContent {
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  heroActions: HomeButton[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  breakfastHeading: string;
  breakfastParagraphs: string[];
  breakfastImage?: ContentImage;
  featuredTitle: string;
  featuredDishes: HomeDish[];
  meatHeading: string;
  meatIntro: string;
  meatNote: string;
  orderTitle: string;
  orderSubtitle: string;
}

export interface MenuCategoryPageContent {
  slug: string;
  pageName: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTagline?: string;
  heroTitle: string;
  heroParagraphs: string[];
  heroActions: HomeButton[];
  blocks: MenuBlock[];
  orderTitle: string;
  orderSubtitle: string;
  moreTitle: string;
  moreSubtitle: string;
  moreCta: HomeLink;
}

export interface MenuSharedContent {
  orderLocations: { name: string; address: string; buttonText: string; buttonHref: string }[];
  footnoteBefore: string;
  footnoteLink: HomeLink;
  footnoteAfter: string;
  allergyTitle: string;
  allergyDescription: string;
}

// ── Shared ──────────────────────────────────────────────────────────────────
export const menuSharedDefaults: MenuSharedContent = {
  orderLocations: [
    {
      name: 'Wahiawa',
      address: '823 California Ave, Unit A5, Wahiawa, HI 96786',
      buttonText: 'Order Wahiawa Takeout',
      buttonHref: 'https://www.doordash.com/store/taqueria-el-ranchero-wahiawa-276575/',
    },
    {
      name: 'Kapolei',
      address: '91-5431 Kapolei Pkwy #501, Kapolei, HI 96707',
      buttonText: 'Order Kapolei Takeout',
      buttonHref: 'https://www.doordash.com/store/taqueria-el-ranchero-kapolei-2390257/',
    },
  ],
  footnoteBefore: 'For restaurant information and directions, visit our',
  footnoteLink: { text: 'Locations page', href: '/locations' },
  footnoteAfter: '.',
  allergyTitle: 'Food Allergy Information',
  allergyDescription:
    'Our food may contain or have come in contact with peanuts, tree nuts, soy, eggs, wheat, fish, shellfish, sesame or dairy products. Please speak to your server if you have any concerns.',
};

// ── Hub ─────────────────────────────────────────────────────────────────────
export const menuHubDefaults: MenuHubContent = {
  seoTitle: 'Mexican Food Menu in Wahiawa & Kapolei | El Ranchero',
  seoDescription:
    "Explore Taqueria El Ranchero's menu, from Mexican breakfast and burritos to tacos, birria, fajitas and drinks. Order from Wahiawa or Kapolei.",
  heroTitle: 'Mexican Food Menu in Wahiawa & Kapolei',
  heroParagraphs: [
    'Explore the Mexican food menu at Taqueria El Ranchero, inspired by the taquerias of Northern California. From tacos and burritos to our signature Molcajete, our dishes reflect the straightforward cooking and fresh daily preparation behind El Ranchero.',
    'Both our Wahiawa and Kapolei restaurants serve the same menu. Browse by category below, then choose your location when you’re ready to order.',
  ],
  heroActions: [{ variant: 'primary', text: 'Order Now', href: PRIMARY_CTA_HREF }],
  categoriesTitle: 'Explore Our Menu',
  categoriesSubtitle: 'Find the dishes you’re looking for with our menu categories.',
  breakfastHeading: 'Breakfast Every Day, Starting at 7 AM',
  breakfastParagraphs: [
    'Breakfast is available at both El Ranchero locations from 7 AM to 12 PM daily.',
    'Our Breakfast Burrito is a convenient option when you’re picking up food on the go. It comes with your choice of bacon, ham, chorizo or veggie, along with eggs, beans, cheese, potatoes, tomato, onion and jalapeño.',
    'If you’re sitting down for breakfast, explore dishes such as Chilaquiles, Huevos con Chorizo and Asada and Eggs.',
  ],
  featuredTitle: 'Featured Dishes From Our Menu',
  featuredDishes: [
    {
      title: 'Molcajete',
      href: '/menu/entrees',
      paragraphs: [
        'Our signature Molcajete brings grilled meats, vegetables and savory sauces together in a traditional volcanic stone mortar.',
        'Served with beans, rice and your choice of corn or flour tortillas, the Molcajete is designed for sharing between two to three people.',
        'Explore Entrees & Fajitas.',
      ],
    },
    {
      title: 'Taco',
      href: '/menu/tacos',
      paragraphs: [
        'Our Taco comes with your choice of meat, onion, cilantro and salsa. You can choose from the meat options listed below.',
        'Explore Tacos & Birria.',
      ],
    },
    {
      title: 'California Burrito',
      href: '/menu/burritos',
      paragraphs: [
        'Our California Burrito combines your choice of meat with cheese, fries, guacamole and sour cream.',
        'Explore Burritos.',
      ],
    },
  ],
  meatHeading: 'Choose Your Meat',
  meatIntro: 'For dishes that offer a choice of meat, El Ranchero’s menu includes the following options:',
  meatNote: 'Available choices depend on the dish. Check the relevant menu category or ordering options for details.',
  orderTitle: 'Order From Your Nearest El Ranchero',
  orderSubtitle: 'Ready to order? Choose your preferred location to view its DoorDash takeout menu.',
};
