/**
 * Events page copy — the seed + fallback for the Sanity documents behind
 * /events and its five sub-pages. Keys match the Studio schema field names.
 *
 *   eventsContent          → /events              (singleton-events)
 *   eventsSubPage ×5       → /events/<slug>       (events-page-<slug>)
 *
 * Rich paragraphs are strings that may hold `[label](href)` links; Sanity stores
 * them as Portable Text. `npm run seed:events -- --commit` fills what Sanity is
 * missing; at render time Sanity wins.
 */
import type { ContentImage } from '~/lib/content/types';
import type { HomeButton, HomeLink } from './homepage';
import type { MenuTone } from './menu';
import type { Rich } from './catering';

const IG = 'https://www.instagram.com/rancheroevents/';
const HANDLE = '@rancheroevents';

export interface EventsTextSplitBlock {
  _type: 'eventsTextSplit';
  anchor: string;
  tone: MenuTone;
  imageSide: 'left' | 'right';
  heading: string;
  paragraphs: Rich;
  /** Small muted line under the paragraphs. */
  smallPrint?: string;
  /** Row of text links under the paragraphs, separated by "|". */
  links?: HomeLink[];
  buttons?: HomeButton[];
  image?: ContentImage;
}
export interface EventsDetailsTableBlock {
  _type: 'eventsDetailsTable';
  anchor: string;
  tone: MenuTone;
  heading: string;
  note?: string;
  rows: { label: string; info: string }[];
  links?: HomeLink[];
}
export interface EventsInquiryFormBlock {
  _type: 'eventsInquiryForm';
  anchor: string;
  heading: string;
  intro: string;
  messageLabel: string;
  buttonLabel: string;
  footnote: Rich;
}
export type EventsBlock = EventsTextSplitBlock | EventsDetailsTableBlock | EventsInquiryFormBlock;

export interface EventsListItem {
  label: string;
  href: string;
  when: string;
  details: string;
}

export interface EventsHubContent {
  seoTitle: string;
  seoDescription: string;

  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  heroButton: HomeLink;

  weeklyHeading: string;
  weeklyNote: string;
  weeklyRows: { day: string; event: string; location: string; detailsText: string; detailsHref: string }[];
  moreOptionsLabel: string;
  moreOptionLinks: HomeLink[];
  locationInfoLabel: string;
  locationLinks: HomeLink[];

  instagramHeading: string;
  instagramText: string;
  instagramButton: HomeLink;
  instagramFeedLabel: string;
  instagramTiles: ContentImage[];

  blocks: EventsBlock[];

  /** Shared list behind every "More Events at El Ranchero" table. */
  eventsList: EventsListItem[];
}

export interface EventsSubPageContent {
  slug: string;
  pageName: string;
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  heroButton: HomeLink;
  blocks: EventsBlock[];
  moreHeading: string;
  moreIntro: string;
  moreTone: MenuTone;
  moreButton: HomeLink;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: HomeLink;
}

const locationLinks: HomeLink[] = [
  { text: 'Wahiawa Location', href: '/locations/wahiawa' },
  { text: 'Kapolei Location', href: '/locations/kapolei' },
];
const viewAll: HomeLink = { text: 'View All Events', href: '/events' };
const followButton: HomeLink = { text: `Follow ${HANDLE}`, href: IG };

const split = (
  anchor: string,
  tone: MenuTone,
  imageSide: 'left' | 'right',
  heading: string,
  paragraphs: string[],
  extra: Partial<EventsTextSplitBlock> = {}
): EventsTextSplitBlock => ({ _type: 'eventsTextSplit', anchor, tone, imageSide, heading, paragraphs, ...extra });

const details = (
  tone: MenuTone,
  heading: string,
  rows: [string, string][],
  note?: string
): EventsDetailsTableBlock => ({
  _type: 'eventsDetailsTable',
  anchor: 'details',
  tone,
  heading,
  ...(note ? { note } : {}),
  rows: rows.map(([label, info]) => ({ label, info })),
  links: locationLinks,
});

// ── Hub ─────────────────────────────────────────────────────────────────────
export const eventsHubDefaults: EventsHubContent = {
  seoTitle: 'Latin Nights, Karaoke & Events on Oʻahu | El Ranchero',
  seoDescription:
    'See Taco Tuesday, free Wednesday karaoke, Friday promoter events, Saturday Latin Night and concert announcements at El Ranchero on Oʻahu.',

  heroTitle: 'Live Music, Latin Nights & Events on Oʻahu',
  heroParagraphs: [
    'At El Ranchero, the night doesn’t end with dinner. It’s where Oʻahu’s Latino community comes together for music, tacos, and a good time. And everyone’s welcome to join in.',
    'Make Tuesdays about tacos, grab the mic at free Wednesday karaoke, see what Friday’s promoters have planned, or dance the night away at Saturday Latin Night. We also bring Mexican bands to Oʻahu for special concert nights.',
    `There’s always something happening, so follow ${HANDLE} for the latest event details, times, and locations.`,
  ],
  heroButton: followButton,

  weeklyHeading: 'Weekly Events at El Ranchero',
  weeklyNote:
    'Events happen on different nights and locations. Confirm the latest times, venue and any entry terms in the current announcement.',
  weeklyRows: [
    { day: 'Tuesday', event: 'Taco Tuesday', location: 'Check weekly post', detailsText: 'Taco Tuesday details', detailsHref: '/events/taco-tuesday' },
    { day: 'Wednesday', event: 'Free Karaoke', location: 'Wahiawa & Kapolei', detailsText: 'Karaoke Wednesday details', detailsHref: '/events/karaoke-wednesday' },
    { day: 'Friday', event: 'Promoter nights', location: 'Varies by event', detailsText: 'Current Instagram posts', detailsHref: IG },
    { day: 'Saturday', event: 'Latin Night', location: 'Check weekly post', detailsText: 'Saturday Latin Night details', detailsHref: '/events/latin-night' },
  ],
  moreOptionsLabel: 'More event options:',
  moreOptionLinks: [
    { text: 'Live Concerts', href: '/events/concerts' },
    { text: 'Event Space Rental', href: '/events/event-space-rental' },
  ],
  locationInfoLabel: 'Location information:',
  locationLinks,

  instagramHeading: `The Latest from ${HANDLE}`,
  instagramText:
    'New performers, Friday promoter events and concert announcements appear on @rancheroevents. Check the current posts for confirmed dates, venues, times and any entry rules.',
  instagramButton: { text: 'View the Latest Event Announcements', href: IG },
  instagramFeedLabel: 'Latest @rancheroevents posts',
  instagramTiles: [],

  blocks: [
    split(
      'headline-concert',
      'page',
      'right',
      'Next Headline Concert',
      [
        'Big concert nights are part of the El Ranchero experience, bringing professional Mexican bands to Oʻahu for special performances.',
        'Follow @rancheroevents for the next concert announcement, or visit our Live Concerts page.',
      ],
      { buttons: [{ text: 'See Live Concerts', href: '/events/concerts', variant: 'primary' }] }
    ),
    split('promoter-nights', 'card', 'left', 'Friday Promoter Nights', [
      'Most Fridays bring an independently organized promoter or DJ event to El Ranchero. The format, music, location, admission terms and schedule may change from week to week.',
      'Check the latest @rancheroevents post for this Friday’s lineup, hosting location, start time and any entry details.',
    ]),
    split(
      'private-gatherings',
      'page',
      'right',
      'Private Gatherings & Catering',
      [
        'If the occasion is yours to plan, our Kapolei event space may be an option for private gatherings, while El Ranchero catering can help feed groups at other celebrations.',
      ],
      {
        buttons: [
          { text: 'See Event Space Rental', href: '/events/event-space-rental', variant: 'primary' },
          { text: 'See Catering Options', href: '/catering', variant: 'ghost' },
        ],
      }
    ),
  ],

  eventsList: [
    { label: 'Taco Tuesday', href: '/events/taco-tuesday', when: 'Tuesdays', details: 'Weekly taco-focused event' },
    { label: 'Karaoke Wednesday', href: '/events/karaoke-wednesday', when: 'Wednesdays', details: 'Free karaoke at both locations' },
    { label: 'Latin Night', href: '/events/latin-night', when: 'Saturdays', details: 'Music from across Latin America' },
    { label: 'Live Concerts', href: '/events/concerts', when: 'Special dates', details: 'Performances by Mexican bands' },
    { label: 'Event Space Rental', href: '/events/event-space-rental', when: 'By inquiry', details: 'Private gatherings at Kapolei' },
  ],
};

// ── Sub-pages ───────────────────────────────────────────────────────────────
export const eventsSubPageDefaults: EventsSubPageContent[] = [
  {
    slug: 'taco-tuesday',
    pageName: 'Taco Tuesday',
    seoTitle: 'Taco Tuesday on Oʻahu | Taqueria El Ranchero',
    seoDescription:
      'Make Tuesday taco night at El Ranchero on Oʻahu. Find Taco Tuesday details, participating locations, and the latest specials and event announcements.',
    heroTitle: 'Taco Tuesday at Taqueria El Ranchero',
    heroParagraphs: [
      'Tuesdays are for tacos at Taqueria El Ranchero!',
      'With meats grilled fresh every morning, homemade salsas, and classic taqueria-style favorites, we’ve got plenty of reasons to make tacos part of your Tuesday plans.',
      'Bring your appetite, pick your favorites, and check out what’s happening for Taco Tuesday this week.',
    ],
    heroButton: { text: 'Check Taco Tuesday Updates', href: IG },
    blocks: [
      details('page', 'Taco Tuesday Details', [
        ['When', 'Every Tuesday'],
        ['Time', 'Check the latest event announcement.'],
        ['Where', `Participating location announced through ${HANDLE}.`],
        ['Specials', 'Check the current Taco Tuesday announcement for available offers and participating taco selections.'],
      ]),
      split(
        'good-tacos',
        'card',
        'right',
        'Good Tacos Make a Good Tuesday',
        [
          'At El Ranchero, we keep our tacos true to the taqueria style that inspired our restaurant.',
          'Our regular menu features classic Tacos with your choice of meat, onion, cilantro and salsa, along with Taco Grande, seafood options and Tacos de Birria.',
          'Whether you stick with your usual order or try something different, there’s plenty to enjoy.',
        ],
        {
          smallPrint: 'Taco Tuesday offers may differ from the regular menu. Check the latest announcement for what’s included.',
          buttons: [{ text: 'See Our Tacos & Birria Menu', href: '/menu/tacos', variant: 'primary' }],
        }
      ),
    ],
    moreHeading: 'More Events at El Ranchero',
    moreIntro: 'There’s more happening throughout the week. Find your next night out or learn about our private event space.',
    moreTone: 'page',
    moreButton: viewAll,
    ctaTitle: 'See What’s Happening This Tuesday',
    ctaSubtitle: `Taco Tuesday specials and event details are shared through ${HANDLE}. Check the latest post for participating locations, times and what’s on offer before you head out.`,
    ctaButton: followButton,
  },

  {
    slug: 'karaoke-wednesday',
    pageName: 'Karaoke Wednesday',
    seoTitle: 'Free Karaoke Wednesdays on Oʻahu | El Ranchero',
    seoDescription:
      'Grab the mic at El Ranchero’s free Karaoke Wednesday in Wahiawa or Kapolei. Sing in Spanish or English, choose your favorite songs, and join the fun.',
    heroTitle: 'Free Karaoke Wednesday at El Ranchero',
    heroParagraphs: [
      'Your favorite song deserves a microphone!',
      'Every Wednesday, Taqueria El Ranchero turns up the music for a night of free karaoke at both our Wahiawa and Kapolei locations.',
      'Sing in Spanish, English, or whatever music you love. There’s no set theme, no required genre, and everyone’s welcome to join the fun.',
    ],
    heroButton: { text: 'Check Karaoke Wednesday Updates', href: IG },
    blocks: [
      details(
        'page',
        'Karaoke Wednesday Details',
        [
          ['When', 'Every Wednesday'],
          ['Admission', 'Karaoke is free.'],
          ['Where', 'Both Wahiawa and Kapolei locations.'],
          ['Music', 'Any genre, in Spanish or English.'],
          ['DJs', 'Two local DJs are part of our Karaoke Wednesday events.'],
        ],
        'Check the latest event announcement for start times and DJ details.'
      ),
      split('grab-the-mic', 'card', 'right', 'Pick Your Song and Grab the Mic', [
        'Love singing along to your favorite songs? Karaoke Wednesday is your chance to take the mic.',
        'From Spanish-language favorites to English hits, the song choice is yours. You don’t need to stick to a particular style of music.',
        'Come with friends, enjoy the music, or take your turn singing. Whether you’re a regular karaoke singer or trying it for the first time, you’re welcome at El Ranchero.',
      ]),
    ],
    moreHeading: 'More Events at El Ranchero',
    moreIntro: 'Keep the good times going throughout the week with more music, food, and events at Taqueria El Ranchero.',
    moreTone: 'page',
    moreButton: viewAll,
    ctaTitle: 'Make Wednesday Your Karaoke Night',
    ctaSubtitle: `Got a song in mind? Save it for Wednesday and join us at Wahiawa or Kapolei. Follow ${HANDLE} for the latest karaoke announcements, DJ information, and event times.`,
    ctaButton: followButton,
  },

  {
    slug: 'latin-night',
    pageName: 'Saturday Latin Night',
    seoTitle: 'Saturday Latin Night on Oʻahu | El Ranchero',
    seoDescription:
      'Spend Saturday at Latin Night at El Ranchero on Oʻahu. Enjoy music from across Latin America and tacos served until 2 a.m. Check this week’s event details.',
    heroTitle: 'Saturday Latin Night at El Ranchero',
    heroParagraphs: [
      'Saturday nights at El Ranchero have a soundtrack from across Latin America!',
      'Latin Night brings together different Latin sounds for a night of music and good company. It’s not just Mexican music or mariachi. It’s a chance to enjoy music from across Latin American cultures, with everyone welcome to join in.',
      'And when hunger hits, tacos are served until 2 a.m. at the participating location.',
    ],
    heroButton: { text: 'See This Saturday’s Latin Night', href: IG },
    blocks: [
      details(
        'page',
        'Latin Night Details',
        [
          ['When', 'Every Saturday'],
          ['Time', 'Check the latest event announcement for start times.'],
          ['Where', `Participating location announced through ${HANDLE}.`],
          ['Music', 'Latin music from across Latin America.'],
          ['Late-Night Food', 'Tacos served until 2 a.m. at the hosting location.'],
        ],
        'Check the latest announcement for event times, location and admission details before heading out.'
      ),
      split(
        'late-night-tacos',
        'card',
        'right',
        'Keep the Night Going With Tacos',
        [
          'The music isn’t the only reason to stick around.',
          'During Saturday Latin Night, El Ranchero keeps serving tacos until 2 a.m. at the participating venue, even after regular kitchen service ends.',
          'Whether you’re enjoying the music with friends or getting hungry later in the evening, tacos are part of the Latin Night experience.',
        ],
        { buttons: [{ text: 'See Our Tacos & Birria Menu', href: '/menu/tacos', variant: 'primary' }] }
      ),
    ],
    moreHeading: 'More Events at El Ranchero',
    moreIntro: 'The good times don’t stop on Saturday. Find another event to enjoy at Taqueria El Ranchero.',
    moreTone: 'page',
    moreButton: viewAll,
    ctaTitle: 'See What’s Happening This Saturday',
    ctaSubtitle: `Get the latest Latin Night details, including the hosting location, event times and announcements, through ${HANDLE}. Make your Saturday plans and join us for Latin Night!`,
    ctaButton: followButton,
  },

  {
    slug: 'concerts',
    pageName: 'Live Concerts',
    seoTitle: 'Live Mexican Band Concerts on Oʻahu | El Ranchero',
    seoDescription:
      'Catch headline concerts at El Ranchero on Oʻahu with professional Mexican bands and a full-party atmosphere. Find show announcements and venue details.',
    heroTitle: 'Live Mexican Band Concerts at El Ranchero',
    heroParagraphs: [
      'Some nights deserve a bigger stage.',
      'About three times a year, Taqueria El Ranchero brings professional, well-known Mexican bands to Oʻahu for special concerts. These are full-party nights built around the music, the crowd and getting together.',
      'Every show is its own event. Keep an eye on the next announcement for the artist, date, location and entry details.',
    ],
    heroButton: { text: 'See the Latest Concert Announcements', href: IG },
    blocks: [
      split(
        'next-concert',
        'page',
        'right',
        'The Next El Ranchero Concert',
        [
          'Big concert nights don’t happen every weekend, so the next confirmed show deserves its own announcement.',
          `Check ${HANDLE} for the next artist, date, hosting venue and event information.`,
        ],
        { buttons: [{ text: `Check ${HANDLE} for the Next Show`, href: IG, variant: 'primary' }] }
      ),
      split('full-night', 'card', 'left', 'A Full Night of Live Music', [
        'El Ranchero’s headline concerts feature professional Mexican bands and a full party atmosphere, rather than the regular weekly music schedule.',
        'Concert nights typically run from about 9:30 p.m. to 2 a.m. Check each show’s announcement for exact times, location and entry details.',
      ]),
      split(
        'plan-your-night',
        'page',
        'right',
        'Plan Your Concert Night',
        [
          'A concert announcement will tell you which El Ranchero location is hosting. We have restaurants in Wahiawa and Kapolei, but don’t assume both are hosting the same concert.',
        ],
        { links: locationLinks }
      ),
    ],
    moreHeading: 'More Events at El Ranchero',
    moreIntro: 'There’s more on the calendar between headline shows. Choose another El Ranchero event or ask about hosting your own gathering.',
    moreTone: 'card',
    moreButton: viewAll,
    ctaTitle: 'Don’t Miss the Next Show',
    ctaSubtitle: `For the latest concert updates, follow ${HANDLE}. You’ll find current announcements there as new shows are confirmed.`,
    ctaButton: followButton,
  },

  {
    slug: 'event-space-rental',
    pageName: 'Event Space Rental',
    seoTitle: 'Event Space Rental in Kapolei | Taqueria El Ranchero',
    seoDescription:
      'Plan a private gathering at Taqueria El Ranchero Kapolei. Learn about our rentable event space with a stage, TVs, microphones and speakers, and inquire.',
    heroTitle: 'Event Space Rental at El Ranchero Kapolei',
    heroParagraphs: [
      'Bring your people together somewhere that already knows how to welcome a crowd.',
      'Taqueria El Ranchero’s Kapolei location at Ka Makana Aliʻi has venue space available to rent for private events, from work gatherings to family celebrations.',
      'Tell us what you’re planning and ask about the space for your occasion.',
    ],
    heroButton: { text: 'Request Event Space Information', href: '#inquiry' },
    blocks: [
      split('gathering', 'page', 'right', 'A Place for Your Next Gathering', [
        'Our Kapolei event space is an option for corporate events, baby showers, wedding receptions and other group occasions.',
        'The right setup depends on your event. Capacity and available arrangements should be confirmed directly before you finalize plans.',
      ]),
      split('features', 'card', 'left', 'Event Space Features', [
        'The venue space includes a stage, televisions, microphones and speakers.',
        'For equipment availability, room arrangements and any food or bar options, please confirm what is included with your event inquiry.',
      ]),
      {
        _type: 'eventsInquiryForm',
        anchor: 'inquiry',
        heading: 'Ask About Event Space Availability',
        intro:
          'Have a date or occasion in mind? Share the type of event, your preferred date, estimated number of guests and any particular needs so the availability and arrangements can be discussed.',
        messageLabel: 'Preferred date, estimated guests and any particular needs',
        buttonLabel: 'Request Event Space Information',
        footnote: [
          'For information about the restaurant itself, visit the [Kapolei location page](/locations/kapolei). Planning food for a group separately? See our [Catering options](/catering).',
        ],
      },
    ],
    moreHeading: 'More Events at El Ranchero',
    moreIntro: 'Want to join an upcoming night at El Ranchero instead? Our calendar has tacos, karaoke, Latin music and special concerts too.',
    moreTone: 'card',
    moreButton: viewAll,
    ctaTitle: 'Let’s Talk About Your Event',
    ctaSubtitle:
      'Your occasion is unique. Send an event space inquiry with the details you know so far and confirm the next steps with the Kapolei team.',
    ctaButton: { text: 'Request Event Space Information', href: '#inquiry' },
  },
];
