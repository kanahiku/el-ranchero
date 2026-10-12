/**
 * Menu dishes — the starting content that gets seeded into Sanity (`npm run seed:menu`).
 *
 * At runtime the site reads the menu from Sanity. This file is also the safety net:
 * if Sanity can't be reached, the menu pages fall back to it so they never render empty.
 * Copy source: pages-content/Menu Pages/*.docx
 */
import type { MenuSectionKey } from '~/lib/content/menuSections';

export interface SeedMenuItem {
  title: string;
  /** One paragraph, or several. */
  description: string | string[];
  section: MenuSectionKey;
}

/** Keyed by menu category slug, in display order. */
export const menuItemSeed: Record<string, SeedMenuItem[]> = {
  breakfast: [
    {
      title: 'Breakfast Burrito',
      section: 'main',
      description: 'Choose bacon, ham, chorizo or veggie, with eggs, beans, cheese, potatoes, tomato, onion and jalapeño. A convenient handheld option when you’re picking up breakfast to go.',
    },
    {
      title: 'Breakfast Taco',
      section: 'main',
      description: 'Choose bacon, ham, chorizo or veggie, with eggs, beans, cheese, potatoes, tomato, onion, jalapeño and salsa.',
    },
    {
      title: 'Chilaquiles',
      section: 'main',
      description: 'Fried tortillas with salsa and eggs, cilantro, queso fresco and sour cream, served with beans and potatoes.',
    },
    {
      title: 'Huevos con Chorizo',
      section: 'main',
      description: 'Mexican sausage with eggs, salsa, cilantro and queso fresco, served with beans, potatoes and your choice of corn or flour tortillas.',
    },
    {
      title: 'Huevos Rancheros',
      section: 'main',
      description: 'Two over-easy eggs over a corn tortilla, topped with cilantro, salsa, sour cream and avocado, served with beans and potatoes.',
    },
    {
      title: 'El Americano',
      section: 'main',
      description: 'Your choice of bacon or ham, served with two eggs and potatoes.',
    },
    {
      title: 'Mexican Omelette',
      section: 'main',
      description: 'Three eggs with chorizo, salsa, avocado, sour cream and queso fresco, served with potatoes.',
    },
    {
      title: 'Asada and Eggs',
      section: 'main',
      description: 'A tender slice of carne asada served with seasoned potatoes and two eggs prepared to your liking.',
    },
  ],
  burritos: [
    {
      title: 'Burrito',
      section: 'main',
      description: 'A classic burrito filled with your choice of meat, beans, rice and pico de gallo.',
    },
    {
      title: 'Burrito Grande',
      section: 'main',
      description: 'Your choice of meat with beans, rice, cheese, pico de gallo, guacamole and sour cream.',
    },
    {
      title: 'Veggie Burrito',
      section: 'main',
      description: 'A combination of beans, rice, lettuce, cheese, pico de gallo, guacamole and sour cream.',
    },
    {
      title: 'Seafood Burrito',
      section: 'main',
      description: 'Choose shrimp or fish, combined with rice, beans and Ranchero special sauce.',
    },
    {
      title: 'California Burrito',
      section: 'main',
      description: 'Your choice of meat with cheese, fries, guacamole and sour cream.',
    },
    {
      title: 'Niño Burrito',
      section: 'main',
      description: 'A simple burrito filled with rice, beans and cheese.',
    },
    {
      title: 'Wet Burrito',
      section: 'main',
      description: 'Prefer your burrito covered in sauce? Any burrito on our menu can be prepared as a Wet Burrito with your choice of red or green sauce, along with lettuce, sour cream and queso fresco.',
    },
  ],
  tacos: [
    {
      title: 'Taco',
      section: 'main',
      description: ['Your choice of meat with onion, cilantro and salsa.', 'You can also make it a plate with two tacos served alongside rice and beans.'],
    },
    {
      title: 'Taco Grande',
      section: 'main',
      description: 'Your choice of meat with beans, cheese, onion, cilantro, salsa and sour cream.',
    },
    {
      title: 'Veggie Taco',
      section: 'main',
      description: 'Beans, cheese, lettuce, onion, cilantro, salsa and sour cream.',
    },
    {
      title: 'Seafood Taco',
      section: 'main',
      description: 'Choose shrimp or fish, served with onion, cilantro and Ranchero special sauce.',
    },
    {
      title: 'Tacos de Birria',
      section: 'birria',
      description: 'Three pieces per order.',
    },
    {
      title: 'Mulitas de Birria',
      section: 'birria',
      description: 'Three pieces per order.',
    },
  ],
  entrees: [
    {
      title: 'Chicken Enchiladas',
      section: 'main',
      description: 'Chicken enchiladas with your choice of red or green sauce, served with sour cream, queso fresco and avocado.',
    },
    {
      title: 'Taquitos',
      section: 'main',
      description: 'Four taquitos with your choice of beef or chicken, served with guacamole, sour cream and queso fresco.',
    },
    {
      title: 'Beef Fajitas',
      section: 'main',
      description: 'Beef fajitas served with your choice of corn or flour tortillas. You can also add guacamole, sour cream and pico de gallo.',
    },
    {
      title: 'Chicken Fajitas',
      section: 'main',
      description: 'Chicken fajitas served with your choice of corn or flour tortillas. Guacamole, sour cream and pico de gallo can also be added.',
    },
    {
      title: 'Chile Verde',
      section: 'main',
      description: 'Tender braised pork smothered in tomatillo sauce.',
    },
    {
      title: 'Carne Asada',
      section: 'main',
      description: 'Ten ounces of seasoned, tender beef, sliced thin and grilled.',
    },
    {
      title: 'Grilled Vegetables & Mushrooms',
      section: 'main',
      description: 'Grilled bell peppers, onions, zucchini and mushrooms, served with your choice of corn or flour tortillas.',
    },
  ],
  'quesadillas-nachos': [
    {
      title: 'Quesadilla',
      section: 'quesadillas',
      description: 'A classic quesadilla filled with cheese.',
    },
    {
      title: 'Meat Quesadilla',
      section: 'quesadillas',
      description: 'Your choice of meat with cheese.',
    },
    {
      title: 'Quesadilla Grande',
      section: 'quesadillas',
      description: 'Your choice of meat with cheese, pico de gallo, guacamole and sour cream.',
    },
    {
      title: 'Veggie Quesadilla',
      section: 'quesadillas',
      description: 'Grilled vegetables with cheese, salsa, guacamole and sour cream.',
    },
    {
      title: 'Nachos',
      section: 'nachos',
      description: 'Nachos topped with your choice of meat, beans, cheese and pico de gallo.',
    },
    {
      title: 'Nachos Grande',
      section: 'nachos',
      description: 'Your choice of meat with beans, cheese and pico de gallo, finished with guacamole and sour cream.',
    },
  ],
  specials: [
    {
      title: 'Sope',
      section: 'daily',
      description: 'Your choice of meat with beans, guacamole, lettuce, salsa, sour cream and queso fresco.',
    },
    {
      title: 'Torta',
      section: 'daily',
      description: 'A grilled Mexican-style sandwich with your choice of meat, beans, cheese, sour cream, lettuce, tomato and onion.',
    },
    {
      title: 'Torta Cubana',
      section: 'daily',
      description: 'A hearty, stacked Mexican-style sandwich with breaded beef or chicken, ham, bacon, chorizo, sausage, egg, avocado, lettuce, tomato, onion, jalapeño, mayonnaise and queso fresco.',
    },
    {
      title: 'California Fries',
      section: 'daily',
      description: 'Fries topped with your choice of meat, cheese, guacamole and sour cream.',
    },
    {
      title: 'Tamales',
      section: 'daily',
      description: 'Choose from pork or chicken tamales.',
    },
    {
      title: 'Taquitos',
      section: 'daily',
      description: 'Two taquitos with your choice of beef or chicken, served with guacamole, sour cream and queso fresco.',
    },
    {
      title: 'Tostada de Ceviche',
      section: 'daily',
      description: 'A combination of fish, lime juice, onion, cucumber, tomato, cilantro and avocado, served over a crispy tortilla.',
    },
    {
      title: 'Elote',
      section: 'daily',
      description: 'Mexican street corn.',
    },
    {
      title: 'Pozole',
      section: 'weekend',
      description: 'A traditional Mexican soup made with pork and hominy, served with lime, onion, radish and cabbage toppings.',
    },
    {
      title: 'Menudo',
      section: 'weekend',
      description: 'Tripe soup in a flavorful red broth, served with lime, onion, cilantro and your choice of corn or flour tortillas.',
    },
    {
      title: 'Campechana',
      section: 'weekend',
      description: 'A Mexican seafood cocktail with shrimp, octopus, avocado, tomato and cucumber.',
    },
    {
      title: 'Chile Relleno',
      section: 'weekend',
      description: 'A cheese-stuffed pepper served with your choice of red or green sauce, sour cream, queso fresco and avocado.',
    },
  ],
  'appetizers-sides': [
    {
      title: 'Guacamole',
      section: 'appetizers',
      description: 'Freshly made guacamole.',
    },
    {
      title: 'Chorizo Queso',
      section: 'appetizers',
      description: 'Savory chorizo-infused cheese dip served with tortilla chips.',
    },
    {
      title: 'Bean Dip',
      section: 'appetizers',
      description: 'Refried beans topped with house-made chorizo, queso fresco and fresh cilantro.',
    },
    {
      title: 'Pico de Gallo',
      section: 'sides',
      description: 'Pico de gallo.',
    },
    {
      title: 'Queso Sauce',
      section: 'sides',
      description: 'Queso sauce.',
    },
    {
      title: 'Rice',
      section: 'sides',
      description: 'A side of rice.',
    },
    {
      title: 'Beans',
      section: 'sides',
      description: 'A side of beans.',
    },
  ],
  kids: [
    {
      title: 'Cheese Quesadilla',
      section: 'main',
      description: 'A cheese quesadilla served with fries.',
    },
    {
      title: 'Taco',
      section: 'main',
      description: 'A taco served with rice and beans.',
    },
    {
      title: 'Niño Burrito',
      section: 'main',
      description: 'A burrito with rice, beans and cheese.',
    },
  ],
  drinks: [
    {
      title: 'Taqueria El Ranchero Black Diamond Margarita',
      section: 'margaritas',
      description: 'Made with El Ranchero Maestro Dobel Tequila, Cointreau and fresh lime sour.',
    },
    {
      title: 'Passion Li Hing “Mahalo Margarita”',
      section: 'margaritas',
      description: 'El Ranchero Maestro Dobel Tequila, passion fruit syrup and fresh lime sour, finished with a li hing rim.',
    },
    {
      title: 'Michelada',
      section: 'margaritas',
      description: 'El Ranchero’s own recipe, made with house-made michelada mix, chamoy and a tamarindo stick. Served with your choice of beer and a tajín rim.',
    },
    {
      title: 'Aguas Frescas',
      section: 'other-drinks',
      description: 'Choose from horchata, watermelon, pineapple and strawberry.',
    },
    {
      title: 'Jarritos',
      section: 'other-drinks',
      description: 'Assorted flavors.',
    },
    {
      title: 'Mexican Sodas',
      section: 'other-drinks',
      description: 'Coke, Fanta and Sprite.',
    },
    {
      title: 'Iced Tea',
      section: 'other-drinks',
      description: 'Refreshing iced tea.',
    },
    {
      title: 'Fountain Drinks',
      section: 'other-drinks',
      description: 'Various soda options.',
    },
    {
      title: 'Café Mexicano',
      section: 'other-drinks',
      description: 'Café Mexicano.',
    },
  ],
};
