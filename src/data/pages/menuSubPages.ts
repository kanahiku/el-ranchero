/** Sub-page defaults for the menu pages (split from ./menu for file size). */
import { PRIMARY_CTA_HREF } from '~/config/cta';
import type { HomeButton, HomeLink } from './homepage';
import { type MenuTone, type MenuDishListBlock, type MenuMeatTableBlock, type MenuCategoryPageContent } from './menu';

// ── Category pages ──────────────────────────────────────────────────────────
const ORDER_TITLE = 'Order From Your Nearest El Ranchero';
const MORE_TITLE = 'Explore More of Our Menu';
const orderButton: HomeButton[] = [{ variant: 'primary', text: 'Order Now', href: PRIMARY_CTA_HREF }];
const viewFullMenu: HomeLink = { text: 'View Full Menu', href: '/menu' };

const common = (
  slug: string,
  pageName: string,
  c: Omit<MenuCategoryPageContent, 'slug' | 'pageName' | 'heroActions' | 'orderTitle' | 'moreTitle' | 'moreCta'>
): MenuCategoryPageContent => ({
  slug,
  pageName,
  heroActions: orderButton,
  orderTitle: ORDER_TITLE,
  moreTitle: MORE_TITLE,
  moreCta: viewFullMenu,
  ...c,
});

const dishList = (
  anchor: string,
  menuSection: string,
  tone: MenuTone,
  title: string,
  intro?: string
): MenuDishListBlock => ({ _type: 'menuDishList', anchor, menuSection, tone, title, ...(intro ? { intro } : {}) });

const MEAT_ANCHOR = 'choose-your-meat';
const meatTable = (tone: MenuTone, heading: string, intro: string, note: string): MenuMeatTableBlock => ({
  _type: 'menuMeatTable',
  anchor: MEAT_ANCHOR,
  tone,
  heading,
  intro,
  note,
});

export const menuCategoryPageDefaults: MenuCategoryPageContent[] = [
  common('breakfast', 'Breakfast', {
    seoTitle: 'Mexican Breakfast in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore Mexican breakfast at El Ranchero in Wahiawa and Kapolei, served every day from 7 AM to noon. See breakfast burritos, chilaquiles, tacos and eggs.',
    heroTagline: 'Every day, 7 AM to 12 PM',
    heroTitle: 'Mexican Breakfast in Wahiawa & Kapolei',
    heroParagraphs: [
      'Start your morning with Mexican breakfast at Taqueria El Ranchero, served daily at both our Wahiawa and Kapolei locations. If you’re heading to work, school or out for the day, our Breakfast Burrito is an easy choice to take with you.',
      'Prefer a sit-down breakfast? Explore chilaquiles, egg plates and more.',
    ],
    blocks: [
      dishList(
        'breakfast-menu',
        'main',
        'page',
        'Explore Our Breakfast Menu',
        'Choose from our breakfast dishes, including burritos, tacos and traditional egg-based plates.'
      ),
      {
        _type: 'menuTextSplit',
        anchor: 'takeout-or-sit-down',
        tone: 'card',
        heading: 'Breakfast for Takeout or a Sit-Down Meal',
        motif: 'plant',
        paragraphs: [
          'For breakfast on the go, the Breakfast Burrito and Breakfast Taco offer a choice of bacon, ham, chorizo or veggie. If you have time to sit down, explore Chilaquiles, Huevos Rancheros, Huevos con Chorizo or another breakfast plate.',
          'The breakfast menu is served from 7 AM to 12 PM every day at both El Ranchero restaurants.',
        ],
      },
    ],
    orderSubtitle: 'Choose your location to check available takeout options and order through DoorDash.',
    moreSubtitle:
      'Looking for something else? Explore more of Taqueria El Ranchero’s menu, from tacos and burritos to appetizers, drinks and more.',
  }),

  common('burritos', 'Burritos', {
    seoTitle: 'Burritos in Wahiawa & Kapolei | Taqueria El Ranchero',
    seoDescription:
      'Explore burritos at El Ranchero in Wahiawa and Kapolei, including California Burrito, Burrito Grande, seafood and Wet Burrito options. Order through DoorDash.',
    heroTitle: 'Burritos in Wahiawa & Kapolei',
    heroParagraphs: [
      'Explore the burritos at Taqueria El Ranchero, where our Northern California-inspired menu offers different combinations of meats, beans, rice, vegetables and sauces.',
      'Whether you prefer a classic burrito, a California Burrito with fries or a burrito covered in red or green sauce, you’ll find options at both our Wahiawa and Kapolei restaurants.',
    ],
    blocks: [
      dishList(
        'burrito-menu',
        'main',
        'page',
        'Explore Our Burritos',
        'Choose from our burrito menu below. For a different way to enjoy your favorite, any burrito can also be prepared as a Wet Burrito.'
      ),
      meatTable(
        'card',
        'Choose Your Meat',
        'Several of our burritos allow you to choose your preferred meat. Options listed on our menu include:',
        'These choices apply to burritos listed with a choice of meat. The Seafood Burrito offers a choice of shrimp or fish.'
      ),
    ],
    orderSubtitle:
      'Both El Ranchero locations serve the same burrito menu. Choose your preferred restaurant to check available options and order through DoorDash.',
    moreSubtitle:
      'Looking for something else? Explore more of Taqueria El Ranchero’s menu, from Mexican breakfast and tacos to appetizers, drinks and more.',
  }),

  common('tacos', 'Tacos & Birria', {
    seoTitle: 'Tacos & Birria Tacos in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore tacos, birria tacos and Mulitas de Birria at El Ranchero in Wahiawa and Kapolei. Choose from meat, veggie and seafood taco options.',
    heroTitle: 'Tacos & Birria in Wahiawa & Kapolei',
    heroParagraphs: [
      'Explore the taco menu at Taqueria El Ranchero, inspired by the taquerias of Northern California. Choose from our traditional Taco with onion, cilantro and salsa, or explore options with beans, cheese, seafood and more.',
      'Looking for birria tacos? We also serve Tacos de Birria and Mulitas de Birria at both our Wahiawa and Kapolei restaurants.',
    ],
    blocks: [
      dishList(
        'taco-menu',
        'main',
        'page',
        'Explore Our Tacos',
        'From a traditional Taco to veggie and seafood options, explore the different tacos available at El Ranchero.'
      ),
      dishList(
        'birria',
        'birria',
        'card',
        'Birria Tacos & Mulitas de Birria',
        'Looking for birria? Explore our birria options, each listed as a three-piece order on our menu.'
      ),
      meatTable(
        'page',
        'Choose Your Meat',
        'For tacos that offer a choice of meat, El Ranchero’s menu includes the following options:',
        'These choices apply to tacos listed with a choice of meat. The Seafood Taco offers a choice of shrimp or fish.'
      ),
    ],
    orderSubtitle:
      'Both El Ranchero locations serve the same taco and birria menu. Choose your preferred restaurant to check available takeout options through DoorDash.',
    moreSubtitle:
      'Looking for something else? Explore more of Taqueria El Ranchero’s menu, from Mexican breakfast and burritos to entrées, appetizers, drinks and more.',
  }),

  common('entrees', 'Entrees & Fajitas', {
    seoTitle: 'Entrees & Fajitas in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore enchiladas, fajitas, carne asada, chile verde and our signature Molcajete at El Ranchero in Wahiawa and Kapolei.',
    heroTitle: 'Mexican Entrees & Fajitas in Wahiawa & Kapolei',
    heroParagraphs: [
      'Looking for a complete Mexican meal? Explore the entrées at Taqueria El Ranchero, from Chicken Enchiladas and fajitas to Carne Asada, Chile Verde and grilled vegetables.',
      'All our entrées are served with rice and beans. Whether you’re stopping by our Wahiawa or Kapolei restaurant, you’ll find choices for a sit-down meal, including our signature Molcajete, made for sharing.',
    ],
    blocks: [
      dishList(
        'entree-menu',
        'main',
        'page',
        'Explore Our Entrees & Fajitas',
        'All our entrées are served with rice and beans.'
      ),
      {
        _type: 'menuTextSplit',
        anchor: 'molcajete',
        tone: 'card',
        heading: 'Molcajete: Our Signature Dish',
        paragraphs: [
          'Looking for a dish to share? El Ranchero’s signature Molcajete serves two to three people.',
          'Grilled meats, vegetables and savory sauces are brought together in a traditional volcanic stone mortar and served sizzling.',
          'The Molcajete comes with beans, rice and your choice of corn or flour tortillas, making it a great option when you want to share a meal at the table.',
        ],
      },
    ],
    orderSubtitle:
      'Both El Ranchero locations serve the same entrée menu. Choose your preferred restaurant to check available takeout options and order through DoorDash.',
    moreSubtitle:
      'Looking for something else? Explore more of Taqueria El Ranchero’s menu, from Mexican breakfast and burritos to tacos, appetizers, drinks and more.',
  }),

  common('quesadillas-nachos', 'Quesadillas & Nachos', {
    seoTitle: 'Quesadillas & Nachos in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore cheese, meat and veggie quesadillas, plus nachos with your choice of meat at El Ranchero in Wahiawa and Kapolei. View our menu and order online.',
    heroTitle: 'Quesadillas & Nachos in Wahiawa & Kapolei',
    heroParagraphs: [
      'Looking for a cheesy quesadilla or a plate of loaded nachos? Explore the Quesadillas & Nachos menu at Taqueria El Ranchero.',
      'Choose from a classic cheese quesadilla, meat and veggie options, or nachos topped with your choice of meat, beans, cheese and more. All six menu items are available at our Wahiawa and Kapolei restaurants.',
    ],
    blocks: [
      dishList(
        'quesadillas',
        'quesadillas',
        'page',
        'Explore Our Quesadillas',
        'From a simple cheese quesadilla to options with grilled vegetables or your choice of meat, find the quesadilla you’re looking for.'
      ),
      dishList(
        'nachos',
        'nachos',
        'card',
        'Explore Our Nachos',
        'Choose between our classic Nachos or Nachos Grande, both made with your choice of meat.'
      ),
      meatTable(
        'page',
        'Choose Your Meat',
        'Several of our quesadilla and nacho options allow you to choose your preferred meat. El Ranchero’s menu includes:',
        'Meat selections apply to the Meat Quesadilla, Quesadilla Grande, Nachos and Nachos Grande. The regular Quesadilla contains cheese only, while the Veggie Quesadilla includes grilled vegetables.'
      ),
    ],
    orderSubtitle:
      'Both El Ranchero locations serve the same quesadilla and nacho menu. Choose your preferred restaurant to check available takeout options and order through DoorDash.',
    moreSubtitle:
      'Looking for something else? Explore more of Taqueria El Ranchero’s menu, from Mexican breakfast and burritos to tacos, entrées, appetizers, drinks and more.',
  }),

  common('specials', 'Specials', {
    seoTitle: 'Mexican Food Specials in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore Mexican food specials at El Ranchero in Wahiawa and Kapolei, including tortas, tamales, California Fries and weekend-only pozole and menudo.',
    heroTitle: 'Mexican Food Specials in Wahiawa & Kapolei',
    heroParagraphs: [
      'Explore more of the Mexican food menu at Taqueria El Ranchero, from Tortas and California Fries to Tamales, Elote and seafood dishes.',
      'Our specials menu also includes traditional Mexican favorites available on Saturdays and Sundays, including Pozole, Menudo, Campechana and Chile Relleno. Browse the options below and check current availability when ordering from our Wahiawa or Kapolei restaurant.',
    ],
    blocks: [
      dishList(
        'daily-specials',
        'daily',
        'page',
        'Daily Specials',
        'Explore the dishes listed under Daily Specials on our menu, including Mexican-style sandwiches, savory snacks and other favorites.'
      ),
      meatTable(
        'card',
        'Meat Choices for Select Specials',
        'The Sope, Torta and California Fries are listed with your choice of meat. El Ranchero’s general menu includes:',
        'Check which meat selections are available for your preferred dish when ordering.'
      ),
      dishList(
        'weekend-specials',
        'weekend',
        'page',
        'Weekend Specials — Saturday & Sunday Only',
        'Looking for Pozole, Menudo or another traditional Mexican weekend favorite? El Ranchero’s Weekend Specials are available Saturday and Sunday only. Explore the dishes below.'
      ),
    ],
    orderSubtitle:
      'Explore our specials menu at either El Ranchero location. Choose your preferred restaurant to check current availability and takeout options through DoorDash.',
    moreSubtitle:
      'Looking for something else? Explore more of Taqueria El Ranchero’s menu, from Mexican breakfast and burritos to tacos, entrées, appetizers, drinks and more.',
  }),

  common('appetizers-sides', 'Appetizers & Sides', {
    seoTitle: 'Appetizers & Sides in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore freshly made guacamole, Chorizo Queso, Bean Dip, pico de gallo, rice, beans and more at El Ranchero in Wahiawa and Kapolei.',
    heroTitle: 'Appetizers & Sides in Wahiawa & Kapolei',
    heroParagraphs: [
      'Looking for something to enjoy alongside your favorite Mexican dish? Explore the appetizers and sides at Taqueria El Ranchero.',
      'Choose from freshly made Guacamole, Chorizo Queso or Bean Dip, or add a side of pico de gallo, queso sauce, rice or beans to your meal.',
    ],
    blocks: [
      dishList('appetizers', 'appetizers', 'page', 'Explore Our Appetizers'),
      dishList(
        'sides',
        'sides',
        'card',
        'Explore Our Sides',
        'Looking for something extra to go with your meal? El Ranchero offers the following sides.'
      ),
      {
        _type: 'menuTextSplit',
        anchor: 'add-ons',
        tone: 'page',
        heading: 'Add-Ons for Your Order',
        paragraphs: [
          'Want to customize your meal? Depending on the dish, El Ranchero’s listed add-on options include:',
        ],
        bullets: ['Meat', 'Pico de gallo', 'Guacamole', 'Sour cream', 'Cheese (tacos only)'],
        afterBullets: ['Available add-ons depend on the menu item. Check the options offered when placing your order.'],
      },
    ],
    orderSubtitle:
      'Both El Ranchero locations serve the same appetizers and sides menu. Choose your preferred restaurant to check available takeout options and order through DoorDash.',
    moreSubtitle:
      'Looking for something else? Explore more of Taqueria El Ranchero’s menu, from Mexican breakfast and burritos to tacos, entrées, drinks and more.',
  }),

  common('kids', 'Kids Menu', {
    seoTitle: 'Kids Menu in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore the Kids Menu at El Ranchero in Wahiawa and Kapolei, including a Cheese Quesadilla with fries, a Taco with rice and beans, and a Niño Burrito.',
    heroTitle: 'Kids Menu in Wahiawa & Kapolei',
    heroParagraphs: [
      'Dining with kids? Taqueria El Ranchero has three Kids Menu choices, each listed with its own simple combination of food and sides.',
      'Find the Kids Menu at our Wahiawa and Kapolei locations, and check ordering availability at your preferred restaurant.',
    ],
    blocks: [dishList('kids-menu', 'main', 'page', 'Explore Our Kids Menu')],
    orderSubtitle:
      'Both Taqueria El Ranchero restaurants use the same menu. Select your preferred location to check current availability and takeout options through DoorDash.',
    moreSubtitle: 'Find more Mexican food and drinks at Taqueria El Ranchero. Browse other sections of our menu.',
  }),

  common('drinks', 'Drinks & Margaritas', {
    seoTitle: 'Drinks & Margaritas in Wahiawa & Kapolei | El Ranchero',
    seoDescription:
      'Explore Black Diamond and Mahalo Margaritas, Michelada, aguas frescas, Jarritos, Mexican sodas and Café Mexicano at El Ranchero in Wahiawa and Kapolei.',
    heroTitle: 'Drinks & Margaritas in Wahiawa & Kapolei',
    heroParagraphs: [
      'From margaritas and Micheladas to aguas frescas, Mexican sodas and coffee, there’s a drink to pair with your meal at Taqueria El Ranchero.',
      'Explore the beverages featured on our menu at our Wahiawa and Kapolei restaurants. For additional bar selections, ask your server for our complete Drinks Menu.',
    ],
    blocks: [
      dishList('margaritas', 'margaritas', 'page', 'Signature Margaritas'),
      dishList('other-drinks', 'other-drinks', 'card', 'Aguas Frescas & Other Drinks'),
      {
        _type: 'menuTextSplit',
        anchor: 'hours',
        tone: 'page',
        heading: 'Bar & Kitchen Hours',
        paragraphs: [
          'Kitchen hours are 7 a.m. to 10 p.m. daily. Bar service is listed through midnight each day; Friday and Saturday closing times may be later. Please confirm late-night bar availability with your preferred location.',
          'For our complete Drinks Menu, including selections beyond those listed here, please ask your server.',
        ],
      },
    ],
    orderSubtitle:
      'Both Taqueria El Ranchero restaurants use the same menu. Select your preferred location to check current availability and takeout options through DoorDash.',
    moreSubtitle: 'Find more Mexican food and drinks at Taqueria El Ranchero. Browse other sections of our menu.',
  }),
];
