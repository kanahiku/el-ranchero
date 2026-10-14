/** Catering subpages shared by the hub, nav, and each catering page. */
export const cateringOptionPages = [
  { label: 'Taco Bar Catering', nav: 'Taco Bar', href: '/catering/taco-bar' },
  { label: 'Corporate & Office Catering', nav: 'Corporate & Office', href: '/catering/corporate' },
  { label: 'Party Catering', nav: 'Parties', href: '/catering/parties' },
  { label: 'Large Group Catering', nav: 'Large Groups', href: '/catering/large-groups' },
] as const;

export const CATERING_REQUEST_HREF = '/catering#catering-form';
