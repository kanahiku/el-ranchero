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
import { CATERING_REQUEST_HREF } from '~/data/catering';
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

const request = (text: string): HomeLink => ({ text, href: CATERING_REQUEST_HREF });
const viewAll: HomeLink = { text: 'View all catering options', href: '/catering' };

const split = (
  anchor: string,
  tone: MenuTone,
  imageSide: 'left' | 'right',
  heading: string,
  paragraphs: string[],
  button?: HomeLink
): CateringTextSplitBlock => ({
  _type: 'cateringTextSplit',
  anchor,
  tone,
  imageSide,
  heading,
  paragraphs,
  ...(button ? { button } : {}),
});

const more = (tone: MenuTone, imageSide: 'left' | 'right', intro: string): CateringMoreOptionsBlock => ({
  _type: 'cateringMoreOptions',
  anchor: 'more-catering',
  tone,
  imageSide,
  heading: 'More Catering Options at El Ranchero',
  intro,
  button: viewAll,
});

// ── Hub ─────────────────────────────────────────────────────────────────────
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
      description: 'Bring a hearty El Ranchero favorite to the table with available burrito options for your gathering.',
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
  reviewsFootnote: 'Reviews above reflect guests’ restaurant experiences and are not presented as catering-specific testimonials.',
  reviews: [
    { quote: 'Cold drinks, great food! Fast service and the food is hot and fresh.', name: 'Ali V.', location: 'Wahiawa' },
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
  locationsSubtitle: 'Taqueria El Ranchero has two Oʻahu locations serving Wahiawa, Kapolei and surrounding communities.',
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

// ── Sub-pages ───────────────────────────────────────────────────────────────
export const cateringSubPageDefaults: CateringSubPageContent[] = [
  {
    slug: 'taco-bar',
    pageName: 'Taco Bar Catering',
    seoTitle: 'Taco Bar Catering on Oʻahu | Taqueria El Ranchero',
    seoDescription:
      "Bring our taqueria-style tacos to your next gathering. Ask about El Ranchero's taco bar catering packages, availability and options for your group.",
    heroTitle: 'Taco Bar Catering from Taqueria El Ranchero',
    heroParagraphs: [
      "When tacos are the main event, we've got a catering option built around them.",
      "Our taco bar catering packages are a signature part of what we offer at Taqueria El Ranchero. Whether you're feeding coworkers or bringing people together for a celebration, we'd love to hear what you're planning.",
      "Tell us about your event, and we'll help you find out which taco bar options are available for your group.",
    ],
    heroButton: request('Request Taco Bar Catering'),
    blocks: [
      split('packages', 'card', 'right', 'Our Taco Bar Catering', [
        'Our food takes inspiration from the taquerias of Northern California, where the tacos are the focus.',
        'At our restaurants, we grill our meats fresh every morning, prepare our vegetables daily, and make our own salsas.',
        "We also offer taco bar catering packages. Package selections and arrangements may differ from our regular restaurant menu, so we'll help you confirm what's currently available for your event.",
        "Want to see the tacos we serve at our restaurants? [Browse our Tacos & Birria menu](/menu/tacos). Regular-menu selections aren't necessarily part of a catering package.",
      ]),
      split('planning', 'page', 'left', 'Planning Your Taco Bar Catering', [
        "You don't need to have everything figured out before contacting us. It helps to know your event date, estimated guest count, where your gathering will take place, and any food preferences or dietary requests.",
        'Once we have those details, we can discuss available taco bar packages, timing, and fulfillment arrangements for your event.',
      ]),
      more(
        'card',
        'right',
        'Taco bar catering is one of the ways we help feed groups. You can also learn more about our other catering options:'
      ),
    ],
    faqsTitle: 'Taco Bar Catering FAQs',
    faqs: [
      {
        question: "What's included in your taco bar catering packages?",
        answer: [
          "We offer taco bar catering packages, and we'll help you review the current options and what's included when you submit your request.",
        ],
      },
      {
        question: 'Can I request specific meats or toppings for my taco bar?',
        answer: [
          "Let us know which meats, toppings or other selections you're interested in. We'll confirm which options are available with our current catering packages.",
        ],
      },
      {
        question: 'Do you offer taco bar catering for larger groups?',
        answer: [
          "We're experienced in catering gatherings of different sizes. Share your estimated guest count, and we'll help you determine which taco bar options may work for your event.",
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Taco Bar?',
    ctaSubtitle:
      "Tell us how many people you're feeding and what you have in mind. We'll help you review the available taco bar catering options and discuss the next steps for your gathering.",
    ctaButton: request('Request Taco Bar Catering'),
  },

  {
    slug: 'corporate',
    pageName: 'Corporate & Office Catering',
    seoTitle: 'Corporate & Office Catering | Taqueria El Ranchero',
    seoDescription:
      'Planning an office lunch or workplace meeting? Ask about corporate catering from Taqueria El Ranchero and share your event details with our team.',
    heroTitle: 'Corporate & Office Catering from Taqueria El Ranchero',
    heroParagraphs: [
      'Planning lunch for your team or food for an upcoming workplace gathering?',
      "We cater office orders and group events, whether you're feeding a small team or bringing coworkers together for a larger company meal.",
      "Tell us what you're planning, and we'll help you review the catering options available for your group.",
    ],
    heroButton: request('Request Office Catering'),
    blocks: [
      split('office-lunch', 'card', 'right', 'Office Lunch Catering', [
        'A team lunch is a good opportunity to share a meal without leaving everyone to figure out their own food plans.',
        "Whether it's a regular staff lunch, an employee appreciation meal, or a team celebration, we can help you discuss available catering selections.",
        "Interested in tacos? Ask us about our [Taco Bar Catering](/catering/taco-bar) packages. We'll confirm the current package options and what's included.",
        "Let us know how many people you're feeding and when you'd like to have lunch. We'll help you review the options for your group.",
      ]),
      split('meetings', 'page', 'left', 'Catering for Meetings & Workplace Gatherings', [
        "Have a staff meeting, training session, or company gathering on the calendar? We can discuss catering options for your event and help you work through the food details.",
        "Let us know when your team plans to eat, how many people will attend, and whether you have any food preferences or dietary requests. We'll confirm the available selections and arrangements for your gathering.",
        "If you're also looking for a place to host a company event, you can ask about our [Kapolei Event Space Rental](/events/event-space-rental). Venue rental is a separate offering from catering.",
      ]),
      split('workday', 'card', 'right', 'Catering That Fits Your Workday', [
        "Office lunches and meetings don't always follow the same schedule. Your team might have a short lunch break, a meeting with a set agenda, or employees taking breaks at different times.",
        "Let us know how your workday is structured and when your team plans to eat. We'll help you review the catering options and arrangements available so you can choose what makes sense for your workplace.",
      ]),
      more('page', 'left', 'Planning something outside the usual workday? Take a look at our other catering options:'),
    ],
    faqsTitle: 'Corporate & Office Catering FAQs',
    faqs: [
      {
        question: 'Can we order catering for a small office lunch?',
        answer: [
          "Yes. We handle smaller office orders as well as larger group gatherings. Let us know how many people you're feeding so we can discuss the options available for your team.",
        ],
      },
      {
        question: 'Can we request a taco bar for a company event?',
        answer: [
          "We offer taco bar catering packages. Tell us about your event and estimated guest count, and we'll help you confirm the available packages and what's included.",
        ],
      },
      {
        question: 'Is pickup or delivery available for office catering?',
        answer: [
          "Let us know where your workplace event is taking place and whether you'd prefer pickup or delivery. We'll confirm which fulfillment arrangements are available for your request.",
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Office Catering?',
    ctaSubtitle:
      "Have a team lunch or workplace gathering coming up? Tell us when you're planning to eat, how many people you're feeding, and what you have in mind. We'll help you review the catering options and next steps.",
    ctaButton: request('Request Office Catering'),
  },

  {
    slug: 'parties',
    pageName: 'Party Catering',
    seoTitle: 'Party Catering on Oʻahu | Taqueria El Ranchero',
    seoDescription:
      "Planning a birthday, graduation, baby shower or team party? Ask us about El Ranchero party catering and tell us what you're planning for your group.",
    heroTitle: 'Party Catering for Birthdays, Graduations & More',
    heroParagraphs: [
      "Good food is part of a good celebration. Whether you're hosting a birthday party, graduation, baby shower, or family gathering, bring the flavors of our taqueria to your next event.",
      'We offer catering for groups and can help you explore the options available for your celebration.',
    ],
    heroButton: request('Request Party Catering'),
    blocks: [
      split('birthday', 'page', 'right', 'Birthday Party Catering', [
        "Celebrating another year with family and friends? Whether it's a casual birthday get-together or a party with guests of different ages, we'd love to help you plan the food.",
        "If tacos are on your birthday menu, ask us about our [Taco Bar Catering](/catering/taco-bar) packages. We'll help you confirm the available selections and arrangements for your celebration.",
      ]),
      split('graduation', 'card', 'left', 'Graduation Party Catering', [
        'Graduation parties bring together family, friends, and classmates to celebrate a big milestone. Some celebrations have everyone sitting down for a meal, while others are open houses with guests arriving throughout the day.',
        "Tell us how your graduation party is planned, and we'll help you review the catering options available for your guest count and schedule.",
      ]),
      split('baby-shower', 'page', 'right', 'Baby Shower Catering', [
        'Between games, opening gifts, and spending time with guests, a baby shower has its own rhythm.',
        "If you're planning to serve a meal, let us know when your guests will be eating and whether there are any food preferences we should know about. We'll help you discuss the catering selections available for your celebration.",
        "If you're also looking for a venue, we offer [Event Space Rental at our Kapolei location](/events/event-space-rental), which is arranged separately from catering.",
      ]),
      split('family', 'card', 'left', 'Family Party Catering', [
        'Family reunions, anniversary celebrations, and weekend get-togethers are all good reasons to share a meal.',
        "If you're bringing together relatives of different ages, let us know what kinds of food your group enjoys. You can browse [our restaurant menu](/menu) for inspiration. Catering selections may differ, so we'll help you confirm what's currently available for your gathering.",
      ]),
      split('sports', 'page', 'right', 'Sports Team Catering', [
        "Celebrating a win, wrapping up the season, or planning a team appreciation meal? Whether you're feeding just the players or inviting coaches and families too, the size of your group can make a difference when planning the food.",
        "Let us know who's attending and when your team plans to eat. We'll help you review the available catering options for your gathering.",
      ]),
      more('card', 'left', 'Looking for another way to feed your group? Take a look at our catering options:'),
    ],
    faqsTitle: 'Party Catering FAQs',
    faqs: [
      {
        question: 'Can we request a taco bar for a birthday or graduation party?',
        answer: [
          "Yes. We offer taco bar catering packages that you can ask about for your celebration. We'll confirm the available packages and what's included when you contact us.",
        ],
      },
      {
        question: 'Do you have catering options for parties with kids?',
        answer: [
          "Our regular restaurant menu includes a Kids Menu, but catering selections may differ. Tell us if children will be attending, and we'll help you confirm which food options are available.",
        ],
      },
      {
        question: 'Can we host our party at El Ranchero too?',
        answer: [
          'We also offer [Event Space Rental](/events/event-space-rental) at our Kapolei location. Venue rental is separate from catering, so contact us to discuss the arrangements for each.',
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Party Catering?',
    ctaSubtitle:
      "Have a celebration coming up? Tell us what you're celebrating, approximately how many guests you're expecting, and what you have in mind for the food. We'll help you explore the catering options available for your gathering.",
    ctaButton: request('Request Party Catering'),
  },

  {
    slug: 'large-groups',
    pageName: 'Large Group Catering',
    seoTitle: 'Large Group Catering on Oʻahu | Taqueria El Ranchero',
    seoDescription:
      "Planning food for a large gathering? We've catered events of about 250 guests. Ask Taqueria El Ranchero about our group catering options.",
    heroTitle: 'Large Group Catering from Taqueria El Ranchero',
    heroParagraphs: [
      "Feeding a large crowd? We've catered gatherings of about 250 guests, and we'd love to hear what you're planning.",
      "Whether you're organizing a community celebration, a company event, or a big family reunion, we can help you explore our available catering options.",
      "Tell us about your gathering, and we'll help you determine what arrangements may be possible.",
    ],
    heroButton: request('Request Large Group Catering'),
    blocks: [
      split('crowd', 'page', 'right', 'Feeding a Bigger Crowd', [
        "When you're planning food for a large gathering, the number of guests is only part of the picture. Will everyone be sitting down to eat at the same time? Or will people be arriving and eating throughout the event?",
        "These details can make a difference when choosing a catering arrangement. Tell us how your gathering is planned, and we'll help you review the options available for your group.",
      ]),
      split('food', 'card', 'left', 'Choosing Food for a Large Group', [
        'From tacos to other Ranchero-style Mexican favorites, our food brings the flavors of our taqueria to group gatherings.',
        "We offer [Taco Bar Catering](/catering/taco-bar) packages, which may be worth considering for your event. Let us know what you have in mind, and we'll help you confirm the available catering selections, package details, and arrangements.",
        'You can also browse [our restaurant menu](/menu) for inspiration. Catering options may differ from what we serve at our restaurants.',
      ]),
      split(
        'space',
        'page',
        'right',
        'Need a Space for Your Gathering?',
        [
          'Still looking for a place to host your event?',
          "We also offer [Event Space Rental at our Kapolei location](/events/event-space-rental) for private gatherings. If you're considering both catering and venue rental, let us know. We'll help you find out how to inquire about each offering.",
          'Venue availability, guest capacity, and rental arrangements need to be confirmed separately from your catering order.',
        ],
        { text: 'Explore Event Space Rental', href: '/events/event-space-rental' }
      ),
      more('card', 'left', 'Have a different type of gathering in mind? Take a look at our catering options:'),
    ],
    faqsTitle: 'Large Group Catering FAQs',
    faqs: [
      {
        question: 'Is 250 guests your maximum catering capacity?',
        answer: [
          "About 250 guests is the largest group we've catered to date, but we haven't established a fixed maximum. Share your estimated guest count, and we'll help you determine whether we can accommodate your event.",
        ],
      },
      {
        question: 'Can we request taco bar catering for a large group?',
        answer: [
          "We offer taco bar catering packages. Tell us how many people you're feeding, and we'll confirm the package options and arrangements available for your gathering.",
        ],
      },
      {
        question: 'Does large group catering include an event venue?',
        answer: [
          "Catering and venue rental are separate offerings. We have [event space available for rental at our Kapolei location](/events/event-space-rental), but the venue's capacity, availability, and rental arrangements must be confirmed independently.",
        ],
      },
    ],
    ctaTitle: 'Ready to Plan Your Large Group Catering?',
    ctaSubtitle:
      "Planning a meal for a big gathering? Tell us about your event, approximately how many people you're expecting, and how you envision serving the food. We'll help you review the available catering options and next steps.",
    ctaButton: request('Request Large Group Catering'),
  },
];
