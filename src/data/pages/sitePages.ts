/**
 * Copy for the Blog index, Contact and Order Online pages — the seed + fallback for
 * the Sanity singletons `blogIndexContent`, `contactPageContent` and
 * `orderOnlineContent`. The contact form fields themselves stay in code.
 */
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '~/config/cta';
import { findStore } from '../locations';
import type { HomeButton, HomeLink } from './homepage';
import type { LocationCard } from './locations';
import type { Rich } from './catering';

// ── Blog index ──
export interface BlogIndexContent {
  seoTitle: string;
  seoDescription: string;
  heading: string;
  emptyText: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: HomeLink;
  /** Link above each article back to the list. */
  backLabel: string;
  /** Heading of the related-articles grid under each article. */
  relatedHeading: string;
  /** Closing banner shown on every article. */
  postCtaTitle: string;
  postCtaSubtitle: string;
  postCtaButton: HomeLink;
}

export const blogIndexDefaults: BlogIndexContent = {
  seoTitle: 'Blog | Taqueria El Ranchero',
  seoDescription: 'Articles and updates from Taqueria El Ranchero.',
  heading: 'Blogs',
  emptyText: 'New articles will appear here as they are published.',
  ctaTitle: 'Have a question?',
  ctaSubtitle: 'Contact Taqueria El Ranchero and we will follow up.',
  ctaButton: { text: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF },
  backLabel: 'All articles',
  relatedHeading: 'Related Blogs',
  postCtaTitle: 'Hungry? Order From El Ranchero',
  postCtaSubtitle: 'Explore our menu, then order for pickup from Wahiawa or Kapolei.',
  postCtaButton: { text: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF },
};

// ── Contact ──
export interface ContactLocationCopy {
  name: string;
  intro: string;
  address: string;
  kitchenHours: string;
  barHours: string;
  directionsLabel: string;
  visitLabel: string;
}

export interface ContactPageContent {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroIntro: string;
  formTitle: string;
  formIntro: Rich;
  formButton: string;
  asideHeading: string;
  locations: ContactLocationCopy[];
}

const KITCHEN = 'Daily, 7:00 AM to 10:00 PM';
const BAR = 'Sunday to Thursday until midnight; Friday and Saturday until 2:00 AM';

export const contactPageDefaults: ContactPageContent = {
  seoTitle: 'Contact Taqueria El Ranchero | Wahiawa & Kapolei',
  seoDescription:
    'Contact Taqueria El Ranchero in Wahiawa or Kapolei. Find phone numbers, hours, addresses, directions, and our contact form.',
  heroTitle: 'Contact Taqueria El Ranchero',
  heroIntro:
    'Have a question about visiting us or want to share feedback? Find the contact details, hours, and directions for our Wahiawa and Kapolei restaurants below, or send us a message using the contact form.',
  formTitle: 'Send Us a Message',
  formIntro: [
    'Have a general question or feedback? Fill out the contact form below to get in touch with our team.',
    "For food catering inquiries, visit our [Catering page](/catering). If you're interested in hosting a private event at our Kapolei location, see our [Event Space Rental page](/events/event-space-rental).",
  ],
  formButton: 'Send message',
  asideHeading: 'Visit or Call Our Locations',
  locations: [
    {
      name: 'Wahiawa',
      intro: 'Our original taqueria is located in Wahiawa Shopping Center on California Avenue.',
      address: '823 California Ave, Unit A5, Wahiawa, HI 96786',
      kitchenHours: KITCHEN,
      barHours: BAR,
      directionsLabel: 'Get Directions to Wahiawa',
      visitLabel: 'See our Wahiawa location',
    },
    {
      name: 'Kapolei',
      intro: 'Find us at Ka Makana Aliʻi in Kapolei, where we offer sit-down dining and outdoor seating.',
      address: '91-5431 Kapolei Pkwy #501, Kapolei, HI 96707',
      kitchenHours: KITCHEN,
      barHours: BAR,
      directionsLabel: 'Get Directions to Kapolei',
      visitLabel: 'See our Kapolei location',
    },
  ],
};

// ── Order Online ──
export interface OrderOnlineContent {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroParagraphs: string[];
  chooseTitle: string;
  cards: LocationCard[];
  note: string;
  phoneHeading: string;
  phoneText: string;
  phoneButtons: HomeButton[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: HomeLink;
}

const wahiawa = findStore('wahiawa');
const kapolei = findStore('kapolei');
if (!wahiawa || !kapolei) throw new Error('Missing store data');

export const orderOnlineDefaults: OrderOnlineContent = {
  seoTitle: 'Order Mexican Food Online | Taqueria El Ranchero',
  seoDescription:
    'Order Mexican food from Taqueria El Ranchero in Wahiawa or Kapolei. Browse our takeout menus and choose your location to get started.',
  heroTitle: 'Order Online from Taqueria El Ranchero',
  heroParagraphs: [
    'Craving tacos, burritos, or your favorite El Ranchero meal?',
    'Choose our Wahiawa or Kapolei location to browse the takeout menu and place your order.',
  ],
  chooseTitle: 'Choose Your El Ranchero Location',
  cards: [
    {
      name: 'Wahiawa',
      heading: 'Wahiawa',
      tagline: '',
      shopName: '',
      addressLine1: '823 California Ave, Unit A5',
      addressLine2: 'Wahiawa, HI 96786',
      paragraphs: ["Ordering from Wahiawa? Browse our available takeout selections and choose what you're craving."],
      hours: [],
      actions: [
        { text: 'Wahiawa Takeout Menu', href: wahiawa.orderPickupHref, variant: 'primary' },
        { text: 'Visit Our Wahiawa Location', href: wahiawa.href, variant: 'ghost' },
      ],
    },
    {
      name: 'Kapolei',
      heading: 'Kapolei',
      tagline: '',
      shopName: '',
      addressLine1: '91-5431 Kapolei Pkwy #501',
      addressLine2: 'Kapolei, HI 96707',
      paragraphs: ['Ordering from Kapolei? Check out our available takeout selections and find your next El Ranchero meal.'],
      hours: [],
      actions: [
        { text: 'Kapolei Takeout Menu', href: kapolei.orderPickupHref, variant: 'primary' },
        { text: 'Visit Our Kapolei Location', href: kapolei.href, variant: 'ghost' },
      ],
    },
  ],
  note: "Online orders open on our ordering partner's website. Menus, prices and availability may change.",
  phoneHeading: 'Prefer to Order by Phone?',
  phoneText:
    'We also accept phone orders. Give your preferred restaurant a call, and our team can help you place your order.',
  phoneButtons: [
    { text: `Call Wahiawa — ${wahiawa.phoneDisplay}`, href: wahiawa.phoneHref, variant: 'primary' },
    { text: `Call Kapolei — ${kapolei.phoneDisplay}`, href: kapolei.phoneHref, variant: 'primary' },
  ],
  ctaTitle: 'Explore Our Menu',
  ctaSubtitle:
    'Want to see more of what we serve? Browse our restaurant menu for tacos, burritos, Mexican breakfast, and more.',
  ctaButton: { text: 'Explore Our Menu', href: '/menu' },
};

