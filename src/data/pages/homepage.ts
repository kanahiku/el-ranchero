/**
 * Homepage copy — the seed + fallback for the Sanity "Homepage" singleton
 * (`homepageContent`). Keys match the Studio schema field names exactly.
 *
 * - `npm run seed:homepage -- --commit` writes any field Sanity is missing.
 * - At render time Sanity wins; these values only fill gaps / cover an outage.
 */
import { PRIMARY_CTA_HREF, CATERING_CTA_HREF, LOCATION_CTA_HREF } from '~/config/cta';
import type { ContentImage } from '~/lib/content/types';

export interface HomeLink {
  text: string;
  href: string;
}
export interface HomeButton extends HomeLink {
  variant?: 'primary' | 'ghost';
}
export interface HomeDish {
  title: string;
  paragraphs: string[];
  href: string;
  image?: ContentImage;
}
export interface HomeEventDay {
  day: string;
  events: { name: string; description: string }[];
}
export interface HomeLocation {
  name: string;
  heading: string;
  shopName: string;
  address: string;
  paragraphs: string[];
  hours: string[];
  actions: HomeButton[];
  image?: ContentImage;
}

export interface HomepageContent {
  seoTitle: string;
  seoDescription: string;

  heroTitle: string;
  heroParagraphs: string[];
  heroActions: HomeButton[];
  heroStats: { value: string; label: string }[];
  heroImage?: ContentImage;

  breakfastHeading: string;
  breakfastParagraphs: string[];
  breakfastCta: HomeLink;
  breakfastImage?: ContentImage;

  favoritesTitle: string;
  favoritesParagraphs: string[];
  favoritesCta: HomeLink;
  favoritesDishes: HomeDish[];

  eventsHeading: string;
  eventsBody: string;
  eventsDays: HomeEventDay[];
  eventsFootnoteBefore: string;
  eventsFootnoteLink: HomeLink;
  eventsFootnoteAfter: string;
  eventsCta: HomeLink;

  locationsTitle: string;
  locationsSubtitle: string;
  locationsList: HomeLocation[];

  cateringHeading: string;
  cateringParagraphs: string[];
  cateringCta: HomeLink;
  cateringImage?: ContentImage;

  privateEventsHeading: string;
  privateEventsParagraphs: string[];
  privateEventsCta: HomeLink;
  privateEventsImage?: ContentImage;

  reviewsHeading: string;

  closingTitle: string;
  closingSubtitle: string;
  closingActions: HomeButton[];
}

export const homepageDefaults: HomepageContent = {
  seoTitle: 'Mexican Restaurant in Wahiawa & Kapolei | El Ranchero',
  seoDescription:
    'Enjoy tacos, burritos and Mexican breakfast at Taqueria El Ranchero in Wahiawa or Kapolei. View our menu and order online.',

  heroTitle: 'Hawaii’s Original Taqueria',
  heroParagraphs: [
    'Experience Northern California-inspired Mexican food at Taqueria El Ranchero in Wahiawa and Kapolei, Oʻahu. From traditional tacos and burritos to ranchero-style entrées, our food is prepared fresh daily using grilled meats and homemade salsas.',
    'Whether you’re stopping in for breakfast or picking up dinner, explore our menu and find your nearest location.',
  ],
  heroActions: [
    { variant: 'primary', text: 'Order Now', href: PRIMARY_CTA_HREF },
    { variant: 'ghost', text: 'View Our Menu', href: '/menu' },
  ],
  heroStats: [
    // TODO: founding year is pending client confirmation (see homepage doc).
    { value: '2015', label: 'Established on Oʻahu' },
    { value: '2', label: 'Oʻahu Locations' },
    { value: 'Daily', label: 'Fresh Food Preparation' },
  ],

  breakfastHeading: 'Mexican Breakfast, Every Day From 7 AM',
  breakfastParagraphs: [
    'Start your morning with a Mexican breakfast at El Ranchero. Our breakfast menu is available daily from 7 AM to 12 PM at both locations.',
    'For breakfast on the go, try our Breakfast Burrito with your choice of bacon, ham, chorizo or veggie, filled with eggs, beans, cheese, potatoes, tomato, onion and jalapeño.',
    'Prefer a sit-down breakfast? Explore our Chilaquiles, Huevos Rancheros or Huevos con Chorizo, served with traditional Mexican flavors and accompaniments.',
  ],
  breakfastCta: { text: 'Explore Our Breakfast Menu', href: '/menu/breakfast' },

  favoritesTitle: 'Discover Our Mexican Food Favorites',
  favoritesParagraphs: [
    'Our menu takes inspiration from the taquerias of San Francisco, where straightforward cooking and freshly prepared ingredients are central to the food.',
    'Meats are grilled over an open-fire grill each morning, while our salsas are made in-house. Choose from traditional Mexican dishes, including these menu favorites.',
  ],
  favoritesCta: { text: 'Explore Full Menu', href: '/menu' },
  favoritesDishes: [
    {
      title: 'Molcajete: Our Signature Dish',
      paragraphs: [
        'Savor the rich flavors of our signature Molcajete dish, a culinary masterpiece featuring grilled meats, vibrant vegetables, and savory sauces, all served sizzling in a traditional volcanic stone mortar for an authentic and unforgettable dining experience. Served with beans, rice and corn or flour tortillas.',
      ],
      href: '/menu/entrees',
    },
    {
      title: 'Tacos & Birria',
      paragraphs: [
        'Our traditional Taco comes with your choice of meat, onion, cilantro and salsa. Choose from meats such as carne asada, carnitas or al pastor.',
        'We also serve Tacos de Birria and Mulitas de Birria, with three pieces per order.',
      ],
      href: '/menu/tacos',
    },
    {
      title: 'Burritos',
      paragraphs: [
        'Try our Burrito Grande with your choice of meat, beans, rice, cheese, pico de gallo, guacamole and sour cream.',
        'Our California Burrito offers another option, combining your choice of meat with cheese, fries, guacamole and sour cream.',
      ],
      href: '/menu/burritos',
    },
  ],

  eventsHeading: 'Weekly Events at El Ranchero',
  eventsBody:
    'Food is only part of the El Ranchero experience. Our restaurants also bring people together through music and community events inspired by Latin American culture.',
  eventsDays: [
    {
      day: 'Tuesday',
      events: [
        {
          name: 'Taco Tuesday',
          description:
            'Make tacos part of your Tuesday plans. Explore our regular taco menu and check the latest event announcements for current specials.',
        },
      ],
    },
    {
      day: 'Wednesday',
      events: [
        {
          name: 'Free Karaoke Wednesday',
          description: 'Join us for karaoke hosted by local DJs. Sing in Spanish or English, with no set music theme.',
        },
      ],
    },
    {
      day: 'Friday',
      events: [
        {
          name: 'Friday DJ & Promoter Events',
          description:
            'Many Fridays feature entertainment hosted by local promoters or DJs. Check the current schedule for upcoming events and performers.',
        },
      ],
    },
    {
      day: 'Saturday',
      events: [
        {
          name: 'Saturday Latin Night',
          description:
            'Enjoy music from across Latin America and an evening centered on the Latino community. Everyone is welcome.',
        },
      ],
    },
  ],
  eventsFootnoteBefore: 'El Ranchero also hosts live concerts featuring professional Mexican bands. See the',
  eventsFootnoteLink: { text: 'Live Concerts', href: '/events/concerts' },
  eventsFootnoteAfter: 'page for upcoming performances.',
  eventsCta: { text: 'View All Events', href: '/events' },

  locationsTitle: 'Two Mexican Restaurant Locations on Oʻahu',
  locationsSubtitle:
    'Visit Taqueria El Ranchero in Wahiawa or Kapolei. Both locations serve the same menu, with different dining environments to suit your plans.',
  locationsList: [
    {
      name: 'Wahiawa',
      heading: 'Wahiawa Mexican Restaurant',
      shopName: 'Wahiawa Shopping Center',
      address: '823 California Ave, Unit A5, Wahiawa, HI 96786',
      paragraphs: [
        'Our original Wahiawa restaurant is located in Wahiawa Shopping Center. With its rustic neighborhood atmosphere, it serves local regulars and military personnel, along with travelers heading toward the North Shore.',
        'Stop by for a breakfast burrito in the morning or order tacos for takeout later in the day.',
      ],
      hours: ['Kitchen: 7 AM–10 PM daily', 'Breakfast: 7 AM–12 PM daily'],
      actions: [
        { text: 'View Wahiawa Location', href: '/locations/wahiawa', variant: 'primary' },
        {
          text: 'Order Wahiawa Takeout',
          href: 'https://www.doordash.com/store/taqueria-el-ranchero-wahiawa-276575/',
          variant: 'ghost',
        },
      ],
    },
    {
      name: 'Kapolei',
      heading: 'Kapolei Mexican Restaurant at Ka Makana Aliʻi',
      shopName: 'Ka Makana Aliʻi',
      address: '91-5431 Kapolei Pkwy #501, Kapolei, HI 96707',
      paragraphs: [
        'Located at Ka Makana Aliʻi, our Kapolei restaurant offers a sit-down dining experience with servers and outdoor seating.',
        'It’s an option for family meals or a restaurant stop while visiting the shopping center. The location also has space available for private events.',
      ],
      hours: ['Kitchen: 7 AM–10 PM daily', 'Breakfast: 7 AM–12 PM daily'],
      actions: [
        { text: 'View Kapolei Location', href: '/locations/kapolei', variant: 'primary' },
        {
          text: 'Order Kapolei Takeout',
          href: 'https://www.doordash.com/store/taqueria-el-ranchero-kapolei-2390257/',
          variant: 'ghost',
        },
      ],
    },
  ],

  cateringHeading: 'Mexican Catering for Gatherings on Oʻahu',
  cateringParagraphs: [
    'Planning an office lunch or a family celebration? Taqueria El Ranchero offers Mexican catering, including taco bar packages for group gatherings.',
    'Our catering experience includes small office orders and events serving approximately 250 guests. Contact our catering team to discuss your event, group size and available arrangements.',
  ],
  cateringCta: { text: 'Explore Our Catering Options', href: CATERING_CTA_HREF },

  privateEventsHeading: 'Host Your Private Event at El Ranchero Kapolei',
  privateEventsParagraphs: [
    'Looking for a place to host a celebration or company gathering? Our Kapolei restaurant offers a rentable event space with a stage, TVs, microphones and speakers.',
    'The venue can accommodate different types of private gatherings, including baby showers and wedding receptions, subject to booking arrangements.',
    'Contact our team to discuss your event and learn more about the space.',
  ],
  privateEventsCta: { text: 'Explore Event Space Rental', href: '/events/event-space-rental' },

  reviewsHeading: 'Customers Are Raving',

  closingTitle: 'Visit or Order From Taqueria El Ranchero',
  closingSubtitle:
    'Explore our Mexican food menu, choose your nearest restaurant or contact our team about catering for your next gathering.',
  closingActions: [
    { text: 'Order Catering', href: CATERING_CTA_HREF, variant: 'ghost' },
    { text: 'Order Now', href: PRIMARY_CTA_HREF, variant: 'primary' },
    { text: 'Find a Location', href: LOCATION_CTA_HREF, variant: 'ghost' },
  ],
};
