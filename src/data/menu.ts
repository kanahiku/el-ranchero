/**
 * Menu content shared by /menu and every /menu/* category page.
 * Copy source: pages-content/Menu Pages/*.docx
 */

export interface MenuCategoryLink {
  label: string;
  href: string;
  description: string;
  /** Hub grid only — desktop column span out of 12. Sub-pages use an even 3-up grid. */
  span: 6 | 4;
}

/** Order matches the "Explore Our Menu" list in the Menu Hub doc. */
export const menuCategoryLinks: MenuCategoryLink[] = [
  {
    label: 'Breakfast',
    href: '/menu/breakfast',
    description:
      'Start your morning with a Breakfast Burrito, Chilaquiles, Huevos Rancheros and other Mexican breakfast favorites. Breakfast is served every day from 7 AM to 12 PM.',
    span: 6,
  },
  {
    label: 'Burritos',
    href: '/menu/burritos',
    description:
      'Explore our Burrito Grande, California Burrito, Seafood Burrito and other burrito options, including the Wet Burrito preparation with red or green sauce.',
    span: 6,
  },
  {
    label: 'Tacos & Birria',
    href: '/menu/tacos',
    description:
      'Browse our tacos with your choice of meat, along with Taco Grande, Tacos de Birria and Mulitas de Birria.',
    span: 4,
  },
  {
    label: 'Entrees & Fajitas',
    href: '/menu/entrees',
    description:
      'Explore Chicken Enchiladas, Beef and Chicken Fajitas, Chile Verde, Carne Asada and our signature Molcajete, served in a traditional volcanic stone mortar.',
    span: 4,
  },
  {
    label: 'Quesadillas & Nachos',
    href: '/menu/quesadillas-nachos',
    description:
      'Choose from our Quesadilla, Meat Quesadilla, Quesadilla Grande and Veggie Quesadilla, or explore Nachos and Nachos Grande.',
    span: 4,
  },
  {
    label: 'Specials',
    href: '/menu/specials',
    description:
      'Discover Sope, Torta, Torta Cubana, California Fries and other dishes listed among our Daily Specials. Our Weekend Specials, available Saturday and Sunday, include Pozole, Menudo, Campechana and Chile Relleno.',
    span: 4,
  },
  {
    label: 'Appetizers & Sides',
    href: '/menu/appetizers-sides',
    description:
      'Explore our freshly made Guacamole, Chorizo Queso and Bean Dip, along with sides such as rice, beans, pico de gallo and queso sauce.',
    span: 4,
  },
  {
    label: 'Kids Menu',
    href: '/menu/kids',
    description:
      'Our kids menu includes a Cheese Quesadilla served with fries, a Taco served with rice and beans, and a Niño Burrito with rice, beans and cheese.',
    span: 4,
  },
  {
    label: 'Drinks & Margaritas',
    href: '/menu/drinks',
    description:
      'Explore our signature margaritas, Michelada, Aguas Frescas, Jarritos, Mexican sodas and Café Mexicano.',
    span: 6,
  },
];

/** The "Choose Your Meat" list repeated across the menu pages. */
export const meatOptions = [
  { name: 'Carnitas', description: 'Fried pork' },
  { name: 'Pollo', description: 'Grilled chicken' },
  { name: 'Carne Asada', description: 'Grilled steak' },
  { name: 'Al Pastor', description: 'Marinated grilled pork' },
  { name: 'Tripas', description: 'Tripe' },
  { name: 'Buche', description: 'Pork stomach' },
  { name: 'Lengua', description: 'Beef tongue' },
  { name: 'Chorizo', description: 'Mexican sausage' },
];

export const menuLinkClass = 'text-accent underline underline-offset-4 transition-opacity hover:opacity-80';
