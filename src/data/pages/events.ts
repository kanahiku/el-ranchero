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

export const IG = 'https://www.instagram.com/rancheroevents/';
export const HANDLE = '@rancheroevents';

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

export const locationLinks: HomeLink[] = [
  { text: 'Wahiawa Location', href: '/locations/wahiawa' },
  { text: 'Kapolei Location', href: '/locations/kapolei' },
];
export const viewAll: HomeLink = { text: 'View All Events', href: '/events' };
export const followButton: HomeLink = { text: `Follow ${HANDLE}`, href: IG };

export const split = (
  anchor: string,
  tone: MenuTone,
  imageSide: 'left' | 'right',
  heading: string,
  paragraphs: string[],
  extra: Partial<EventsTextSplitBlock> = {}
): EventsTextSplitBlock => ({ _type: 'eventsTextSplit', anchor, tone, imageSide, heading, paragraphs, ...extra });

export const details = (
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
    {
      day: 'Tuesday',
      event: 'Taco Tuesday',
      location: 'Check weekly post',
      detailsText: 'Taco Tuesday details',
      detailsHref: '/events/taco-tuesday',
    },
    {
      day: 'Wednesday',
      event: 'Free Karaoke',
      location: 'Wahiawa & Kapolei',
      detailsText: 'Karaoke Wednesday details',
      detailsHref: '/events/karaoke-wednesday',
    },
    {
      day: 'Friday',
      event: 'Promoter nights',
      location: 'Varies by event',
      detailsText: 'Current Instagram posts',
      detailsHref: IG,
    },
    {
      day: 'Saturday',
      event: 'Latin Night',
      location: 'Check weekly post',
      detailsText: 'Saturday Latin Night details',
      detailsHref: '/events/latin-night',
    },
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
    {
      label: 'Karaoke Wednesday',
      href: '/events/karaoke-wednesday',
      when: 'Wednesdays',
      details: 'Free karaoke at both locations',
    },
    {
      label: 'Latin Night',
      href: '/events/latin-night',
      when: 'Saturdays',
      details: 'Music from across Latin America',
    },
    {
      label: 'Live Concerts',
      href: '/events/concerts',
      when: 'Special dates',
      details: 'Performances by Mexican bands',
    },
    {
      label: 'Event Space Rental',
      href: '/events/event-space-rental',
      when: 'By inquiry',
      details: 'Private gatherings at Kapolei',
    },
  ],
};

// ── Sub-pages ───────────────────────────────────────────────────────────────
