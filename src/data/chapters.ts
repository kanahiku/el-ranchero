import type { ChapterLocation } from '~/components/widgets/ChaptersList.astro';

/** Shared chapter rows for homepage + /chapters (Figma 2:323 / 64:1032). */
export const chapterLocations: ChapterLocation[] = [
  {
    name: 'Kailua ohana',
    memberCount: 142,
    href: 'https://www.meetup.com/find/?location=us--hi--Kailua&source=EVENTS',
  },
  {
    name: 'Honolulu ohana',
    memberCount: 142,
    href: 'https://www.meetup.com/find/?location=us--hi--Honolulu&source=EVENTS',
  },
  {
    name: 'Hilo · Maui · Kauai · Kona',
    memberCount: 142,
    href: 'https://www.meetup.com/find/?location=us--hi--Hilo&source=EVENTS',
  },
  {
    name: 'Waimea starting ohana',
    memberCount: 142,
    href: 'https://www.meetup.com/find/?location=us--hi--Waimea&source=EVENTS',
  },
];
