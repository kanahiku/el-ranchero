import type { NavigationContent } from '~/lib/content/types';
import { CONTACT, PRIMARY_CTA_LABEL, PRIMARY_CTA_HREF, SOCIAL } from '~/config';

export const navigationData: NavigationContent = {
  header: {
    links: [
      {
        text: 'menu',
        href: '/menu',
        links: [
          { text: 'Breakfast', href: '/menu/breakfast' },
          { text: 'Burritos', href: '/menu/burritos' },
          { text: 'Tacos & Birria', href: '/menu/tacos' },
          { text: 'Entrees & Fajitas', href: '/menu/entrees' },
          { text: 'Quesadillas & Nachos', href: '/menu/quesadillas-nachos' },
          { text: 'Specials', href: '/menu/specials' },
          { text: 'Appetizers & Sides', href: '/menu/appetizers-sides' },
          { text: 'Kids Menu', href: '/menu/kids' },
          { text: 'Drinks & Margaritas', href: '/menu/drinks' },
        ],
      },
      {
        text: 'catering',
        href: '/catering',
      },
      {
        text: 'events',
        href: '/events',
        links: [
          { text: 'Taco Tuesday', href: '/events/taco-tuesday' },
          { text: 'Karaoke Wednesday', href: '/events/karaoke-wednesday' },
          { text: 'Latin Night', href: '/events/latin-night' },
          { text: 'Live Concerts', href: '/events/concerts' },
          { text: 'Event Space Rental', href: '/events/event-space-rental' },
        ],
      },
      {
        text: 'locations',
        href: '/locations',
        links: [
          { text: 'Wahiawa', href: '/locations/wahiawa' },
          { text: 'Kapolei', href: '/locations/kapolei' },
        ],
      },
      {
        text: 'about',
        href: '/about',
        links: [
          { text: 'Our Story', href: '/about' },
          { text: 'Blog', href: '/blog' },
        ],
      },
    ],
    actions: [{ variant: 'primary', text: PRIMARY_CTA_LABEL, href: PRIMARY_CTA_HREF }],
  },

  footer: {
    links: [
      {
        title: 'menu',
        links: [
          { text: 'Breakfast', href: '/menu/breakfast' },
          { text: 'Burritos', href: '/menu/burritos' },
          { text: 'Tacos & Birria', href: '/menu/tacos' },
          { text: 'Entrees & Fajitas', href: '/menu/entrees' },
          { text: 'Quesadillas & Nachos', href: '/menu/quesadillas-nachos' },
          { text: 'Specials', href: '/menu/specials' },
          { text: 'Appetizers & Sides', href: '/menu/appetizers-sides' },
          { text: 'Kids Menu', href: '/menu/kids' },
          { text: 'Drinks & Margaritas', href: '/menu/drinks' },
        ],
      },
      {
        title: 'locations',
        links: [
          { text: 'Wahiawa', href: '/locations/wahiawa' },
          { text: 'Kapolei', href: '/locations/kapolei' },
        ],
      },
      {
        title: 'el ranchero',
        links: [
          { text: 'Our Story', href: '/about' },
          { text: 'Catering', href: '/catering' },
          { text: 'Order Online', href: PRIMARY_CTA_HREF },
          { text: 'Blog', href: '/blog' },
          { text: 'Contact', href: '/contact' },
        ],
      },
    ],
    secondaryLinks: [
      { text: 'Privacy Policy', href: '/privacy-policy' },
      { text: 'Terms', href: '/terms' },
      { text: 'Accessibility', href: '/accessibility' },
    ],
    socialLinks: SOCIAL.nav as unknown as NavigationContent['footer']['socialLinks'],
    footNote: `&copy; ${new Date().getFullYear()} ${CONTACT.businessName}. All rights reserved.`,
  },
};
