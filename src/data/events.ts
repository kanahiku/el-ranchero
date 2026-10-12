/**
 * Events content shared by /events and every /events/* page.
 * Copy source: pages-content/Events/*.docx
 */

export const EVENTS_INSTAGRAM_HANDLE = '@rancheroevents';
export const EVENTS_INSTAGRAM_HREF = 'https://www.instagram.com/rancheroevents/';

export interface EventLink {
  text: string;
  href: string;
  /** Opens in a new tab. */
  external?: boolean;
}

export const eventPages = {
  tacoTuesday: { label: 'Taco Tuesday', href: '/events/taco-tuesday', when: 'Tuesdays', details: 'Weekly taco-focused event' },
  karaoke: {
    label: 'Karaoke Wednesday',
    href: '/events/karaoke-wednesday',
    when: 'Wednesdays',
    details: 'Free karaoke at both locations',
  },
  latinNight: {
    label: 'Latin Night',
    href: '/events/latin-night',
    when: 'Saturdays',
    details: 'Music from across Latin America',
  },
  concerts: {
    label: 'Live Concerts',
    href: '/events/concerts',
    when: 'Special dates',
    details: 'Performances by Mexican bands',
  },
  spaceRental: {
    label: 'Event Space Rental',
    href: '/events/event-space-rental',
    when: 'By inquiry',
    details: 'Private gatherings at Kapolei',
  },
} as const;

/** "More Events at El Ranchero" table. The current page shows "You're here" instead of a link. */
export function moreEventsRows(currentHref: string) {
  return Object.values(eventPages).map((event) =>
    event.href === currentHref
      ? [event.label, event.when, 'You’re here']
      : [{ text: event.label, href: event.href }, event.when, event.details]
  );
}

export const moreEventsColumns = ['Event', 'When', 'Details'];

export const locationLinks: EventLink[] = [
  { text: 'Wahiawa Location', href: '/locations/wahiawa' },
  { text: 'Kapolei Location', href: '/locations/kapolei' },
];

export const instagramLink: EventLink = {
  text: `Follow ${EVENTS_INSTAGRAM_HANDLE}`,
  href: EVENTS_INSTAGRAM_HREF,
  external: true,
};
