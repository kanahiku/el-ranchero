/**
 * Catering page copy — the seed + fallback for the Sanity documents behind
 * /catering and its four sub-pages. Keys match the Studio schema field names.
 *
 *   cateringContent        → /catering            (singleton-catering)
 *   cateringSubPage ×4     → /catering/<slug>     (catering-page-<slug>)
 *
 * Rich paragraphs are strings that may hold `[label](href)` links; Sanity stores
 * them as Portable Text. `npm run seed:catering -- --commit` fills what Sanity
 * is missing; at render time Sanity wins.
 */
import type { ContentImage } from '~/lib/content/types';
import type { HomeLink } from './homepage';
import type { MenuTone } from './menu';

/** Markdown-link strings (defaults) or Portable Text blocks (from Sanity). */
export type Rich = Array<string | Record<string, unknown>>;

export interface CateringTextSplitBlock {
  _type: 'cateringTextSplit';
  anchor: string;
  tone: MenuTone;
  /** Which side the photo sits on. */
  imageSide: 'left' | 'right';
  heading: string;
  paragraphs: Rich;
  button?: HomeLink;
  image?: ContentImage;
}
export interface CateringMoreOptionsBlock {
  _type: 'cateringMoreOptions';
  anchor: string;
  tone: MenuTone;
  imageSide: 'left' | 'right';
  heading: string;
  intro: string;
  button: HomeLink;
  image?: ContentImage;
}
export type CateringBlock = CateringTextSplitBlock | CateringMoreOptionsBlock;

export interface CateringFaq {
  question: string;
  answer: Rich;
}

export interface CateringSubPageContent {
  slug: string;
  pageName: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  heroButton: HomeLink;
  blocks: CateringBlock[];
  faqsTitle: string;
  faqs: CateringFaq[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: HomeLink;
}

export interface CateringHubContent {
  seoTitle: string;
  seoDescription: string;

  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  heroButton: HomeLink;

  formHeading: string;
  formParagraphs: string[];
  formMessageLabel: string;
  formButtonLabel: string;
  callPrompt: string;
  phoneDisplay: string;
  phoneHref: string;

  favoritesTitle: string;
  favoritesIntro: string[];
  favoritesItems: { title: string; description: string; image?: ContentImage }[];
  favoritesFootnote: string;

  occasionsHeading: string;
  occasionsIntro: string[];
  occasionsBullets: string[];
  occasionsOutro: string[];
  occasionsImage?: ContentImage;

  whyHeading: string;
  whyParagraphs: string[];
  whyImage?: ContentImage;

  reviewsHeading: string;
  reviewsSubtitle: string;
  reviewsFootnote: string;
  reviews: { quote: string; name: string; location: string }[];
  reviewLinks: HomeLink[];

  stepsTitle: string;
  steps: { title: string; description: string }[];

  planningHeading: string;
  planningIntro: string[];
  planningChecklist: string[];
  planningOutro: string[];
  planningImage?: ContentImage;

  exploreHeading: string;
  exploreParagraphs: Rich;
  exploreOptionsLead: string;
  exploreButton: HomeLink;
  exploreImage?: ContentImage;

  locationsTitle: string;
  locationsSubtitle: string;
  locationsFootnote: string;

  faqsTitle: string;
  faqs: CateringFaq[];

  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: HomeLink;
}

export const cateringHubDefaults: CateringHubContent = {
  seoTitle: 'Mexican Catering in Wahiawa & Kapolei | Taqueria El Ranchero',
  seoDescription:
    'Planning an event or group meal? Explore Mexican catering from Taqueria El Ranchero in Wahiawa and Kapolei and submit a catering request today.',

  heroTitle: 'Mexican Catering from Taqueria El Ranchero',
  heroParagraphs: [
    'Bring Ranchero-style Mexican food to your next gathering with catering from Taqueria El Ranchero.',
    'Whether you are feeding coworkers, family, friends or a larger group, tell us what you are planning and our team can help you explore catering options for your event.',
  ],
  heroButton: { text: 'Request Catering', href: '#catering-form' },

  formHeading: 'Tell Us About Your Catering Needs',
  formParagraphs: [
    'Ready to start planning? Share a few details about your event using the form below.',
    'Let us know your event date, approximately how many people you are feeding and anything else that can help our team understand what you are looking for.',
  ],
  formMessageLabel: 'Tell us about your event, food preferences and any dietary needs',
  formButtonLabel: 'Request Catering',
  callPrompt: 'Prefer to speak with us directly?',
  phoneDisplay: '(808) 621-9000',
  phoneHref: 'tel:+18086219000',

  favoritesTitle: 'Catering Favorites',
  favoritesIntro: [
    'Planning food for a group? Bring some of the flavors people know from Taqueria El Ranchero to your next gathering.',
    'Depending on your event and current catering availability, our team can help you explore options inspired by the food served at our restaurants.',
  ],
  favoritesItems: [
    {
      title: 'Tacos',
      description:
        'A taqueria favorite that works well when you are feeding a group and want plenty of flavor and variety.',
    },
    {
      title: 'Burritos',
      description:
        'Bring a hearty El Ranchero favorite to the table with available burrito options for your gathering.',
    },
    {
      title: 'Mexican Favorites',
      description:
        'Ask about available Mexican dishes and group-friendly options that can help round out your catering order.',
    },
    {
      title: 'Sides & More',
      description: 'Complete your spread with available sides and other additions based on your event needs.',
    },
  ],
  favoritesFootnote:
    'Catering selections may differ from our regular restaurant menu. Submit a catering request to confirm current options, availability and pricing for your event.',

  occasionsHeading: 'Bring Ranchero Style to Your Next Gathering',
  occasionsIntro: [
    'Good food gives people one more reason to gather around the table.',
    'El Ranchero catering can be a fit for a range of group occasions, including:',
  ],
  occasionsBullets: [
    'Workplace meals and meetings',
    'Birthday parties',
    'Family celebrations',
    'Team gatherings',
    'Community events',
    'Group lunches and dinners',
    'Other special occasions',
  ],
  occasionsOutro: [
    'Tell us what you are planning and our team can help you explore catering options for your date and group.',
  ],

  whyHeading: 'Why Cater with Taqueria El Ranchero?',
  whyParagraphs: [
    'Taqueria El Ranchero has been serving Oʻahu since 2015, beginning with our original Wahiawa location and later expanding to Kapolei.',
    'El Ranchero is a veteran-founded local business built around the taqueria experience and Ranchero-style Mexican food.',
    'The restaurant has also earned local recognition, including Gold for Best Mexican in HONOLULU Magazine’s 2023 Hale ʻAina Awards.',
    'When you are planning food for a group, catering gives you another way to bring El Ranchero flavors to the occasion.',
  ],

  reviewsHeading: 'What Guests Are Saying',
  reviewsSubtitle: 'See what guests have shared about their experiences at Taqueria El Ranchero.',
  reviewsFootnote:
    'Reviews above reflect guests’ restaurant experiences and are not presented as catering-specific testimonials.',
  reviews: [
    {
      quote: 'Cold drinks, great food! Fast service and the food is hot and fresh.',
      name: 'Ali V.',
      location: 'Wahiawa',
    },
    {
      quote: 'Great service and spacious atmosphere. The kids menu was a plus. I really enjoyed the quesadilla.',
      name: 'Lawanda M.',
      location: 'Kapolei',
    },
    { quote: 'Outstanding food! Best Mexican I’ve had in Hawaii.', name: 'John S.', location: 'Kapolei' },
  ],
  reviewLinks: [
    {
      text: 'Read Wahiawa Google Reviews',
      href: 'https://www.google.com/maps/place/Taqueria+El+Ranchero/@21.4785894,-157.9185514,12.25z/data=!4m6!3m5!1s0x7c005df2e6157385:0x308420cdf244ff60!8m2!3d21.4971101!4d-158.0255454!16s%2Fg%2F11b77try2q?entry=tts&g_ep=EgoyMDI0MDkxMS4wKgBIAVAD',
    },
    {
      text: 'Read Kapolei Google Reviews',
      href: 'https://www.google.com/maps/place/Taqueria+El+Ranchero/@21.3332283,-158.0501425,15z/data=!4m6!3m5!1s0x7c006312335dd9e7:0x38722efab8df9697!8m2!3d21.3332283!4d-158.0501425!16s%2Fg%2F11nmwp8kf6?entry=ttu&g_ep=EgoyMDI2MDgxMS4wIKXMDSoASAFQAw%3D%3D',
    },
  ],

  stepsTitle: 'How El Ranchero Catering Works',
  steps: [
    {
      title: 'Tell Us About Your Event',
      description:
        'Complete the catering form with your preferred date, estimated guest count and any details that can help us understand what you are planning.',
    },
    {
      title: 'We’ll Review Your Request',
      description:
        'Our team can follow up to discuss current catering options, availability and other details related to your event.',
    },
    {
      title: 'Finalize Your Catering Order',
      description:
        'Once the details are confirmed, work with the El Ranchero team to finalize your selections and next steps.',
    },
  ],

  planningHeading: 'Planning Your Catering Order',
  planningIntro: [
    'You do not need to have every detail figured out before reaching out.',
    'When submitting your catering request, it helps to include:',
  ],
  planningChecklist: [
    'Event date and preferred time',
    'Estimated number of guests',
    'Type of event or gathering',
    'Food preferences or requests',
    'Dietary needs we should know about',
    'Preferred location, if applicable',
    'The best way to contact you',
  ],
  planningOutro: [
    'Providing these details helps our team better understand what you need and follow up with the right information.',
  ],

  exploreHeading: 'Explore the El Ranchero Menu',
  exploreParagraphs: [
    'Want to get a feel for the food before planning your catering order?',
    'Explore the [Taqueria El Ranchero menu](/menu) to see the Ranchero-style Mexican dishes served at our restaurants.',
    'Keep in mind that catering selections may differ from the regular restaurant menu. Submit a catering request to confirm what is currently available for your group.',
  ],
  exploreOptionsLead: 'Looking for a specific catering option? See',
  exploreButton: { text: 'Explore Our Menu', href: '/menu' },

  locationsTitle: 'Catering in Wahiawa & Kapolei',
  locationsSubtitle:
    'Taqueria El Ranchero has two Oʻahu locations serving Wahiawa, Kapolei and surrounding communities.',
  locationsFootnote:
    'Not sure which location to contact about your event? Submit your catering request with the event details and our team can help with the next steps.',

  faqsTitle: 'Catering FAQs',
  faqs: [
    {
      question: 'How do I request catering from Taqueria El Ranchero?',
      answer: [
        'Complete the catering form on this page with information about your event. You can also call (808) 621-9000 to ask about catering.',
      ],
    },
    {
      question: 'Does Taqueria El Ranchero have a catering menu?',
      answer: [
        'Catering selections may differ from the regular restaurant menu. Submit a catering request to learn about current food options for your event.',
      ],
    },
    {
      question: 'How much does El Ranchero catering cost?',
      answer: [
        'Catering pricing depends on your selections and the details of your order. Submit a catering request so the El Ranchero team can discuss current options and pricing with you.',
      ],
    },
    {
      question: 'How far in advance should I request catering?',
      answer: [
        'Availability can depend on your event date and the needs of your order. Submit your request as early as possible so the team can confirm availability.',
      ],
    },
    {
      question: 'Can El Ranchero cater a large group?',
      answer: [
        'Include your estimated guest count in your catering request. The El Ranchero team can confirm available options based on the size and needs of your group.',
      ],
    },
    {
      question: 'Can I request catering for a workplace event?',
      answer: [
        'Yes. Tell us about your workplace meal, meeting or gathering using the catering form and include your estimated guest count, date and preferred time.',
      ],
    },
    {
      question: 'Is the catering menu the same as the restaurant menu?',
      answer: [
        'Not necessarily. You can browse the [El Ranchero menu](/menu) to explore the food served at our restaurants, but catering selections and availability may differ.',
      ],
    },
    {
      question: 'Does El Ranchero offer catering from both Wahiawa and Kapolei?',
      answer: [
        'Taqueria El Ranchero has locations in both Wahiawa and Kapolei. Include your event details and preferred area when submitting your catering request so the team can help determine the appropriate next steps.',
      ],
    },
  ],

  ctaTitle: 'Ready to Plan Your Catering Order?',
  ctaSubtitle:
    'Tell us about your event, your group and what you have in mind. Submit the catering form and the El Ranchero team can help you explore the options available for your gathering.',
  ctaButton: { text: 'Request Catering', href: '#catering-form' },
};
