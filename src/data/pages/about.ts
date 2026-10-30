/**
 * About / Our Story copy — the seed + fallback for the Sanity `aboutContent`
 * singleton (`singleton-about`). Keys match the Studio field names.
 * Sections reuse the shared "Text + photo" block (same widget as Locations).
 * Rich paragraphs use `[label](href)` links.
 */
import type { ContentImage } from '~/lib/content/types';
import type { LocationsTextSplitBlock } from './locations';

export interface AboutContent {
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  blocks: LocationsTextSplitBlock[];
}

const section = (
  anchor: string,
  heading: string,
  tone: 'page' | 'card',
  imageSide: 'left' | 'right',
  paragraphs: string[],
  buttons?: LocationsTextSplitBlock['buttons']
): LocationsTextSplitBlock => ({
  _type: 'locationsTextSplit',
  anchor,
  tone,
  imageSide,
  heading,
  paragraphs,
  ...(buttons ? { buttons } : {}),
});

export const aboutDefaults: AboutContent = {
  seoTitle: 'Our Story | Taqueria El Ranchero in Oʻahu',
  seoDescription:
    'Learn about Taqueria El Ranchero’s Northern California taqueria influence, ranchero-style dishes, daily preparation, and two Oʻahu locations.',
  heroTitle: 'About Taqueria El Ranchero',
  heroParagraphs: [
    'At Taqueria El Ranchero, we bring Northern California-inspired Mexican taqueria cooking to Oʻahu. Our approach centers on ranchero-style food, fresh daily preparation and meals made for everyday dining.',
    'From our original restaurant in Wahiawa to our newer location in Kapolei, we focus on the straightforward cooking that defines our taqueria style.',
  ],
  blocks: [
    section('our-story', 'Our Story', 'page', 'right', [
      'Taqueria El Ranchero takes its inspiration from the Mexican taquerias of Northern California, where familiar dishes and simple preparation are central to the experience.',
      'Our first restaurant opened in Wahiawa, serving the surrounding neighborhood and people traveling through Central Oʻahu. We later expanded to Kapolei at Ka Makana Aliʻi, bringing the same menu to a full-service dining setting.',
      'Today, both restaurants share the same approach to food. Whether you’re visiting our [Wahiawa location](/locations/wahiawa) or dining with us in [Kapolei](/locations/kapolei), you’ll find the tacos, burritos and ranchero-style dishes that define El Ranchero.',
    ]),
    section('ranchero-style', 'Ranchero Style', 'card', 'left', [
      'The word ranchero refers to ranch-style cooking. For us, that means straightforward meals built around familiar ingredients such as chicken, beef, pork, rice and beans.',
      'Our food follows a Northern California taqueria approach rather than Tex-Mex or fusion cooking. We focus on recognizable dishes prepared with traditional combinations of meats, vegetables, tortillas and salsa.',
      'That approach runs throughout our menu, from everyday tacos and burritos to our signature [Molcajete](/menu/entrees), which brings grilled meats and vegetables together in a sizzling volcanic stone mortar.',
    ]),
    section('made-fresh-daily', 'Made Fresh Daily', 'page', 'right', [
      'Fresh preparation is part of our routine at El Ranchero.',
      'Each morning, our kitchen teams grill meats over an open-fire grill and prepare fresh vegetables and herbs. Our salsas are made in-house, ready to accompany the dishes served throughout the day.',
      'When you place an order, we assemble your food using ingredients prepared earlier that day. This allows us to serve tacos, burritos and other menu favorites efficiently while keeping daily preparation at the center of how we cook.',
    ]),
    section('local-partners', 'Local Partners', 'card', 'left', [
      'Our daily preparation starts with ingredients supplied through local food distributors.',
      'We receive meats through a local distributor and work with a Hawaiʻi produce supplier for vegetables and other produce. From there, our kitchen teams prepare the ingredients used in our menu each day.',
      'These supplier relationships support our approach to serving freshly prepared food at both El Ranchero locations.',
    ]),
    section('the-murals', 'The Murals', 'page', 'right', [
      'The chalk-art murals at El Ranchero are a visual connection between our two restaurants.',
      'Our Wahiawa location has a rustic, neighborhood taqueria atmosphere, while Kapolei offers a sit-down dining experience with table service and outdoor seating. Each restaurant has its own character, but the murals bring a recognizable part of El Ranchero into both spaces.',
      'They’re part of the setting guests experience when they visit us for a meal or spend an evening at the restaurant.',
    ]),
    section(
      'community',
      'A Gathering Place for the Community',
      'card',
      'left',
      [
        'Our connection to Oʻahu goes beyond the food we serve. El Ranchero is also a gathering place for the island’s Latino community, with music and events that welcome everyone.',
        'Our regular programming includes karaoke, Latin Night and live concerts featuring Mexican bands. These gatherings bring people together around music and shared cultural experiences.',
        'You can explore our [weekly events and upcoming performances](/events) to see what’s happening at El Ranchero.',
      ],
      [
        { text: 'Explore Our Menu', href: '/menu', variant: 'primary' },
        { text: 'Find a Location', href: '/locations', variant: 'ghost' },
      ]
    ),
  ],
};
