/**
 * Social and directory profile links.
 * Replace every URL when setting up a new site.
 */
export const SOCIAL = {
  nav: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/ElRancheroHawaii/',
    },
    {
      ariaLabel: 'Instagram',
      icon: 'tabler:brand-instagram',
      href: 'https://www.instagram.com/taqueria_el_ranchero/',
    },
    {
      ariaLabel: 'Twitter / X',
      icon: 'tabler:brand-x',
      href: 'https://twitter.com/ElRanchero',
    },
  ],

  sameAs: [
    'https://www.facebook.com/ElRancheroHawaii/',
    'https://www.instagram.com/taqueria_el_ranchero/',
    'https://twitter.com/ElRanchero',
  ],
} as const;
