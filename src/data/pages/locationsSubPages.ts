/** Sub-page defaults for the locations pages (split from ./locations for file size). */
import { CATERING_CTA_HREF } from '~/config/cta';
import { findStore, storeDirectionsHref } from '../locations';
import { EVENTS_INSTAGRAM_HANDLE, EVENTS_INSTAGRAM_HREF } from '../events';
import { type LocationsBlock, type LocationFaq, type LocationsSubPageContent, FAVORITES_FOOTNOTE } from './locations';

interface StoreCopy {
  slug: 'wahiawa' | 'kapolei';
  name: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroParagraphs: string[];
  foodParagraphs: string[];
  foodSmallPrint: string;
  whyHeading: string;
  whyParagraphs: string[];
  favoritesIntro: string;
  favorites: string[];
  breakfastParagraphs: string[];
  breakfastButton: string;
  findHeading: string;
  findParagraphs: string[];
  cateringParagraphs: string[];
  ctaSubtitle: string;
  faqs: LocationFaq[];
  extraBlocks?: LocationsBlock[];
}

const FAVORITE_TITLES = ['Tacos', 'California Burrito', 'Birria', 'Quesadillas', 'Mexican Plates'];

function buildStorePage(copy: StoreCopy): LocationsSubPageContent {
  const store = findStore(copy.slug)!;
  return {
    slug: copy.slug,
    pageName: `${copy.name} restaurant`,
    seoTitle: copy.seoTitle,
    seoDescription: copy.seoDescription,
    heroTitle: copy.heroTitle,
    heroParagraphs: copy.heroParagraphs,
    heroButtons: [
      { text: 'View the Menu', href: '/menu', variant: 'primary' },
      { text: 'Order on DoorDash', href: store.orderPickupHref, variant: 'ghost' },
    ],
    visitTitle: `Visit Taqueria El Ranchero in ${copy.name}`,
    blocks: [
      {
        _type: 'locationsTextSplit',
        anchor: 'food',
        tone: 'card',
        imageSide: 'right',
        heading: `Ranchero-Style Mexican Food in ${copy.name}`,
        paragraphs: copy.foodParagraphs,
        smallPrint: copy.foodSmallPrint,
      },
      {
        _type: 'locationsTextSplit',
        anchor: 'why-visit',
        tone: 'page',
        imageSide: 'left',
        heading: copy.whyHeading,
        paragraphs: copy.whyParagraphs,
      },
      {
        _type: 'locationsFavorites',
        anchor: 'favorites',
        tone: 'card',
        title: `${copy.name} Favorites`,
        intro: copy.favoritesIntro,
        items: copy.favorites.map((description, i) => ({ title: FAVORITE_TITLES[i], description })),
        footnote: FAVORITES_FOOTNOTE,
        button: { text: 'View the Menu', href: '/menu' },
      },
      {
        _type: 'locationsTextSplit',
        anchor: 'breakfast',
        tone: 'page',
        imageSide: 'right',
        heading: 'Start Your Morning Ranchero Style',
        paragraphs: copy.breakfastParagraphs,
        buttons: [{ text: copy.breakfastButton, href: store.orderPickupHref, variant: 'primary' }],
      },
      {
        _type: 'locationsTextSplit',
        anchor: 'find-us',
        tone: 'card',
        imageSide: 'left',
        heading: copy.findHeading,
        paragraphs: copy.findParagraphs,
        address: `${store.addressLine1}\n${store.addressLine2}`,
        buttons: [{ text: 'Get Directions', href: storeDirectionsHref(store), variant: 'primary' }],
      },
      {
        _type: 'locationsTextSplit',
        anchor: 'catering',
        tone: 'page',
        imageSide: 'right',
        heading: `Mexican Catering in ${copy.name}`,
        paragraphs: copy.cateringParagraphs,
        buttons: [{ text: 'Explore Catering', href: CATERING_CTA_HREF, variant: 'primary' }],
      },
      ...(copy.extraBlocks ?? []),
    ],
    faqsTitle: 'Frequently Asked Questions',
    faqs: copy.faqs,
    ctaTitle: 'Hungry Yet?',
    ctaSubtitle: copy.ctaSubtitle,
    ctaButton: { text: `Order ${copy.name} on DoorDash`, href: store.orderPickupHref },
  };
}

export const locationsSubPageDefaults: LocationsSubPageContent[] = [
  buildStorePage({
    slug: 'wahiawa',
    name: 'Wahiawa',
    seoTitle: 'Mexican Restaurant in Wahiawa, HI | Taqueria El Ranchero',
    seoDescription:
      'Visit Taqueria El Ranchero in Wahiawa for tacos, burritos, Mexican breakfast and more. View the menu, get directions or order on DoorDash.',
    heroTitle: 'Mexican Restaurant in Wahiawa, HI',
    heroParagraphs: [
      'Craving Mexican food in Wahiawa? Visit Taqueria El Ranchero on California Avenue for Ranchero-style tacos, burritos, Mexican breakfast favorites and more.',
      'Stop by for a meal, explore our menu before your visit or order online through DoorDash.',
    ],
    foodParagraphs: [
      'From tacos and burritos to quesadillas, Mexican plates and breakfast favorites, Taqueria El Ranchero brings a wide range of Mexican dishes to Wahiawa.',
      'Choose from available meats and fillings, try one of the restaurant’s hearty favorites or stop in for a quick meal before continuing your day.',
    ],
    foodSmallPrint:
      'Menu selections and availability may vary. Explore our menu to see more of what El Ranchero serves, then visit DoorDash for current pricing and online ordering.',
    whyHeading: 'Why Visit Taqueria El Ranchero Wahiawa?',
    whyParagraphs: [
      'Wahiawa is where the El Ranchero story began. Taqueria El Ranchero opened its first location here in 2015 and has been serving the Central Oʻahu community ever since.',
      'Located on California Avenue, the restaurant is convenient for Wahiawa residents, families, visitors and customers coming from nearby areas such as Schofield Barracks and Mililani.',
      'Whether you are stopping in for tacos, grabbing a burrito to go or starting the day with Mexican breakfast, the Wahiawa location offers plenty of ways to enjoy El Ranchero.',
      'El Ranchero is also a veteran-founded local business with roots in the Wahiawa community.',
    ],
    favoritesIntro:
      'Not sure where to start? Explore some of the Mexican favorites you may find on the Taqueria El Ranchero Wahiawa menu.',
    favorites: [
      'Choose from available meat, seafood and veggie options for a taco order that fits what you are craving.',
      'Go for something hearty with one of El Ranchero’s popular burrito options.',
      'Look for savory birria among the Mexican dishes available on the current Wahiawa menu.',
      'Keep it simple or choose from available fillings and options to make it your own.',
      'Sit down to a full meal with available Mexican plates and other El Ranchero favorites.',
    ],
    breakfastParagraphs: [
      'Looking for Mexican breakfast in Wahiawa? Start your day at Taqueria El Ranchero with morning favorites that go beyond the usual breakfast stop.',
      'Explore options such as breakfast burritos, chilaquiles, huevos rancheros, huevos con chorizo, breakfast tacos and other breakfast dishes.',
      'Selections may vary. Check DoorDash for the current Wahiawa menu, availability and pricing.',
    ],
    breakfastButton: 'View Wahiawa Menu on DoorDash',
    findHeading: 'Find Us on California Avenue',
    findParagraphs: [
      'Taqueria El Ranchero is located at 823 California Avenue in Wahiawa, serving customers throughout Wahiawa and Central Oʻahu.',
      'Whether you live nearby, are visiting the area or are coming from Schofield Barracks or another nearby community, use the link below to get directions to the restaurant.',
    ],
    cateringParagraphs: [
      'Feeding a group? Taqueria El Ranchero offers catering for parties, workplace meals, celebrations and other gatherings.',
      'Bring El Ranchero favorites to your next event and give your guests plenty to dig into.',
    ],
    ctaSubtitle: 'Stop by Taqueria El Ranchero in Wahiawa or order your favorites online through DoorDash.',
    faqs: [
      {
        question: 'Where is Taqueria El Ranchero in Wahiawa?',
        answer: ['Taqueria El Ranchero is located at 823 California Ave, Wahiawa, HI 96786.'],
      },
      {
        question: "What are Taqueria El Ranchero Wahiawa's hours?",
        answer: [
          'The Wahiawa kitchen is open daily from 7:00 AM to 10:00 PM, with breakfast served from 7:00 AM to 12:00 PM.',
        ],
      },
      {
        question: 'Can I order Taqueria El Ranchero Wahiawa online?',
        answer: [
          'Yes. Online ordering is available through DoorDash. Visit the Wahiawa DoorDash menu to see current selections, availability and pricing.',
        ],
      },
      {
        question: 'Does Taqueria El Ranchero Wahiawa serve breakfast?',
        answer: [
          'The Wahiawa menu includes Mexican breakfast favorites such as breakfast burritos, chilaquiles, huevos rancheros and breakfast tacos. Menu selections may vary, so check DoorDash for current availability.',
        ],
      },
      {
        question: 'Is Taqueria El Ranchero near Schofield Barracks?',
        answer: [
          'Taqueria El Ranchero is located in Wahiawa on California Avenue, a short drive from the Schofield Barracks area. Use our Google Maps directions to plan your visit.',
        ],
      },
      {
        question: 'Can I view the El Ranchero menu before visiting?',
        answer: [
          'Yes. Explore the Taqueria El Ranchero [menu](/menu) to see the types of dishes served, then check DoorDash for current availability and pricing.',
        ],
      },
      {
        question: 'Does Taqueria El Ranchero offer catering in Wahiawa?',
        answer: [
          'Yes. Taqueria El Ranchero offers catering for parties, workplace meals, celebrations and other group occasions. Visit our [Catering page](/catering) to learn more.',
        ],
      },
      {
        question: 'Does Taqueria El Ranchero have another Oʻahu location?',
        answer: [
          'Yes. Taqueria El Ranchero also has a location in Kapolei at Ka Makana Aliʻi. [Visit our Kapolei location](/locations/kapolei).',
        ],
      },
    ],
  }),
  buildStorePage({
    slug: 'kapolei',
    name: 'Kapolei',
    seoTitle: 'Mexican Restaurant at Ka Makana Aliʻi, Kapolei | El Ranchero',
    seoDescription:
      'Visit Taqueria El Ranchero in Kapolei for tacos, burritos, Mexican breakfast and more at Ka Makana Aliʻi. View the menu or order on DoorDash.',
    heroTitle: 'Mexican Restaurant in Kapolei at Ka Makana Aliʻi',
    heroParagraphs: [
      'Looking for Mexican food in Kapolei? Visit Taqueria El Ranchero at Ka Makana Aliʻi for Ranchero-style tacos, burritos, Mexican breakfast favorites and more.',
      'Stop by for breakfast, lunch or dinner, explore our menu before your visit, or order online through DoorDash.',
    ],
    foodParagraphs: [
      'When tacos, burritos or a full Mexican meal are calling, Taqueria El Ranchero brings Ranchero-style Mexican food to Kapolei.',
      'Explore tacos with a variety of meat and filling options, burritos, quesadillas, birria, Mexican plates and other El Ranchero favorites. Whether you are stopping in for a quick meal or sitting down with family and friends, there is plenty to choose from throughout the day.',
    ],
    foodSmallPrint:
      'Menu selections and availability may vary. Visit our menu to explore El Ranchero favorites, then check DoorDash for current pricing and online ordering.',
    whyHeading: 'Why Visit Taqueria El Ranchero Kapolei?',
    whyParagraphs: [
      'Taqueria El Ranchero has been serving Oʻahu since 2015, bringing the taqueria experience to Hawaiʻi with Mexican flavors, a wide-ranging menu and a casual place to gather over good food.',
      'Our Kapolei location at Ka Makana Aliʻi makes it easy to stop in while shopping, meeting friends or spending the day in West Oʻahu. From tacos and burritos to breakfast and hearty Mexican plates, you can find something for an everyday meal, a quick bite or a group outing.',
      'El Ranchero is also a veteran-founded local business with roots right here on Oʻahu.',
    ],
    favoritesIntro:
      'Not sure where to start? Explore some of the favorites you may find on the Taqueria El Ranchero Kapolei menu.',
    favorites: [
      'Go classic or try something different with available meat, seafood and veggie options.',
      'A filling burrito favorite for when you want something hearty.',
      'Look for savory birria among the Mexican favorites available on the Kapolei menu.',
      'A simple favorite with available fillings and options to make it your own.',
      'Sit down to a full meal with available dishes such as enchiladas, carne asada, fajitas and other Mexican favorites.',
    ],
    breakfastParagraphs: [
      'Start the day with Mexican breakfast favorites at Taqueria El Ranchero Kapolei.',
      'Explore options such as breakfast burritos, chilaquiles, huevos rancheros, huevos con chorizo, breakfast tacos and other morning favorites.',
      'Breakfast selections may vary. Check DoorDash for the current Kapolei menu, availability and pricing.',
    ],
    breakfastButton: 'View Kapolei Menu on DoorDash',
    findHeading: 'Find Us at Ka Makana Aliʻi',
    findParagraphs: [
      'Taqueria El Ranchero is located at Ka Makana Aliʻi in Kapolei, serving customers throughout Kapolei and West Oʻahu.',
      'Whether you are already visiting the shopping center or making El Ranchero your destination, you can find us at:',
    ],
    cateringParagraphs: [
      'Feeding a group? Taqueria El Ranchero offers catering for parties, workplace meals, celebrations and other gatherings.',
      'Bring El Ranchero favorites to your next event and make feeding a crowd a little easier.',
    ],
    extraBlocks: [
      {
        _type: 'locationsTextSplit',
        anchor: 'events',
        tone: 'card',
        imageSide: 'left',
        heading: 'Events at El Ranchero Kapolei',
        paragraphs: [
          'There is more happening at El Ranchero Kapolei than what is on the menu.',
          `Follow ${EVENTS_INSTAGRAM_HANDLE} on Instagram for current event announcements, entertainment and updates from the Kapolei location.`,
        ],
        buttons: [{ text: `Follow ${EVENTS_INSTAGRAM_HANDLE}`, href: EVENTS_INSTAGRAM_HREF, variant: 'primary' }],
      },
    ],
    ctaSubtitle: 'Visit Taqueria El Ranchero in Kapolei or order your favorites online through DoorDash.',
    faqs: [
      {
        question: 'Where is Taqueria El Ranchero in Kapolei?',
        answer: [
          'Taqueria El Ranchero is located at 91-5431 Kapolei Pkwy #501, Kapolei, HI 96707, at Ka Makana Aliʻi.',
        ],
      },
      {
        question: "What are Taqueria El Ranchero Kapolei's hours?",
        answer: [
          'The Kapolei kitchen is open daily from 7:00 AM to 10:00 PM, with breakfast served from 7:00 AM to 12:00 PM.',
        ],
      },
      {
        question: 'Can I order Taqueria El Ranchero Kapolei online?',
        answer: [
          'Yes. Online ordering is available through DoorDash. Visit the Kapolei DoorDash menu to see current selections, availability and pricing.',
        ],
      },
      {
        question: 'Does Taqueria El Ranchero Kapolei serve breakfast?',
        answer: [
          'The Kapolei menu includes Mexican breakfast favorites such as breakfast burritos, chilaquiles, huevos rancheros and breakfast tacos. Menu selections may vary, so check DoorDash for current availability.',
        ],
      },
      {
        question: 'Can I view the El Ranchero menu before visiting?',
        answer: [
          'Yes. Explore the Taqueria El Ranchero [menu](/menu) to see the types of dishes served, then visit DoorDash for current pricing and availability.',
        ],
      },
      {
        question: 'Does Taqueria El Ranchero offer catering in Kapolei?',
        answer: [
          'Yes. Taqueria El Ranchero offers catering for group occasions, including parties, workplace meals and celebrations. Visit our [Catering page](/catering) to learn more.',
        ],
      },
    ],
  }),
];
