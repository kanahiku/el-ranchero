/**
 * Groups a menu category page can split its dishes into.
 * Keep in sync with `menuSectionOptions` in studio/schemas/documents/menuItem.ts.
 */
export const MENU_SECTION_KEYS = [
  'main',
  'birria',
  'daily',
  'weekend',
  'appetizers',
  'sides',
  'margaritas',
  'other-drinks',
  'quesadillas',
  'nachos',
] as const;

export type MenuSectionKey = (typeof MENU_SECTION_KEYS)[number];
