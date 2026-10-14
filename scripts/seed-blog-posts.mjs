/**
 * Publishes the three launch blog posts to Sanity and removes the old test post.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-blog-posts.mjs
 */
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error('SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_WRITE_TOKEN are required.');
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-09-15',
  useCdn: false,
});

let keyIndex = 0;
const key = () => `blog-${++keyIndex}`;
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks });
const block = (style, text) => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [span(text)],
});
const paragraph = (text) => block('normal', text);
const heading = (text) => block('h2', text);
const subheading = (text) => block('h3', text);
const listItem = (text) => ({
  ...block('normal', text),
  listItem: 'bullet',
  level: 1,
});
const table = (caption, headerRow, rows) => ({
  _type: 'table',
  _key: key(),
  caption,
  headerRow,
  rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })),
});
const cta = (text, href) => ({
  _type: 'ctaButton',
  _key: key(),
  text,
  href,
  variant: 'primary',
});
const faq = (items) => ({
  _type: 'faq',
  _key: key(),
  title: 'Frequently Asked Questions',
  items: items.map(([question, answer]) => ({
    _type: 'blogFaqItem',
    _key: key(),
    question,
    answer,
  })),
});
const image = (assetRef, alt) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetRef },
  alt,
});

const posts = [
  {
    _id: 'blogPost-guide-to-tacos-and-birria',
    _type: 'blogPost',
    title: 'A Guide to Tacos and Birria at Taqueria El Ranchero',
    slug: { _type: 'slug', current: 'guide-to-tacos-and-birria' },
    excerpt:
      'Explore taco styles, birria, meat choices, toppings, and ordering tips before your next meal at Taqueria El Ranchero.',
    metaTitle: 'Tacos and Birria on Oʻahu | El Ranchero Guide',
    metaDescription:
      'Explore tacos and birria at Taqueria El Ranchero in Wahiawa and Kapolei, including fillings, toppings and ordering tips.',
    publishDate: '2026-10-14T06:00:00.000Z',
    author: 'Taqueria El Ranchero',
    image: image(
      'image-5fdf5a1152642203f7a43e2d17c41f661b350456-1200x1434-jpg',
      'Tacos served at Taqueria El Ranchero'
    ),
    relatedPages: ['menu', 'menu/tacos', 'locations/wahiawa', 'locations/kapolei'],
    body: [
      paragraph(
        'Tacos can be a quick meal, a shared plate, or the centerpiece of a full spread. At Taqueria El Ranchero, our menu takes inspiration from the taquerias of Northern California and brings those flavors to Wahiawa and Kapolei.'
      ),
      paragraph(
        'This guide walks through the taco and birria choices you may see on our restaurant menu, along with a few practical ways to choose your next order. Menu selections, pricing, and availability can change, so check the current DoorDash menu for your preferred location before ordering.'
      ),
      heading('Start With the Taco Style'),
      paragraph(
        'The first choice is how you want your tacos served. A classic street-style taco keeps the focus on the tortilla, filling, and fresh toppings. Crispier preparations add texture, while birria tacos bring a richer, slow-cooked flavor.'
      ),
      table(
        'Taco choices at a glance',
        ['Choice', 'What to expect', 'Good for'],
        [
          [
            'Street-style tacos',
            'A straightforward tortilla, filling, and toppings',
            'Trying several meats or sharing',
          ],
          ['Birria tacos', 'Rich, savory meat with a crisped tortilla', 'A hearty taco meal'],
          ['Seafood or veggie tacos', 'Lighter fillings with fresh toppings', 'Mixing different flavors'],
        ]
      ),
      heading('Choose a Filling That Fits Your Craving'),
      paragraph(
        'Your filling shapes most of the flavor. Grilled meats bring smoky notes, birria offers a deeper savory profile, and seafood or vegetable selections can make the meal feel lighter. If you are ordering for a group, choosing more than one filling gives everyone room to find a favorite.'
      ),
      subheading('Popular ways to build an order'),
      listItem('Choose two or three different tacos to compare flavors.'),
      listItem('Pair tacos with rice, beans, or another side for a fuller meal.'),
      listItem('Ask about available salsas when you want more heat or brightness.'),
      listItem('Check the current location menu because selections may vary.'),
      heading('What Makes Birria Different?'),
      paragraph(
        'Birria is known for its tender texture and deeply seasoned flavor. It works especially well in tacos because the meat, tortilla, and toppings balance one another. Some diners make birria the whole order, while others add one birria taco alongside grilled meat or seafood tacos.'
      ),
      heading('Wahiawa or Kapolei: Choose Your Location'),
      paragraph(
        'Both El Ranchero restaurants serve the same core menu, but current availability and online ordering are handled by location. Choose Wahiawa when you are in Central Oʻahu or Kapolei when you are in West Oʻahu, then open that restaurant’s DoorDash menu to see what is available.'
      ),
      cta('Explore Tacos & Birria', '/menu/tacos'),
      faq([
        [
          'Can I order Taqueria El Ranchero tacos online?',
          'Yes. Choose Wahiawa or Kapolei on our Order Online page to open the current DoorDash takeout menu for that restaurant.',
        ],
        [
          'Do both El Ranchero locations serve tacos and birria?',
          'Both restaurants use the same core menu. Current selections and availability can vary, so check the ordering menu for your preferred location.',
        ],
        [
          'Can tacos be ordered for a group?',
          'Yes. For larger gatherings, visit our Catering page and ask about taco bar catering packages and current group options.',
        ],
      ]),
    ],
  },
  {
    _id: 'blogPost-mexican-breakfast-on-oahu',
    _type: 'blogPost',
    title: 'What to Order for Mexican Breakfast on Oʻahu',
    slug: { _type: 'slug', current: 'mexican-breakfast-on-oahu' },
    excerpt:
      'From breakfast burritos to chilaquiles and huevos rancheros, learn what to consider when choosing a Mexican breakfast.',
    metaTitle: 'Mexican Breakfast on Oʻahu | El Ranchero',
    metaDescription:
      'Discover Mexican breakfast options at Taqueria El Ranchero in Wahiawa and Kapolei, served daily from 7 AM to noon.',
    publishDate: '2026-10-13T06:00:00.000Z',
    author: 'Taqueria El Ranchero',
    image: image(
      'image-67eb2017284f450c72f31c830befdc9e5764c942-1200x1500-jpg',
      'Mexican breakfast at Taqueria El Ranchero'
    ),
    relatedPages: ['menu', 'menu/breakfast', 'locations', 'locations/wahiawa', 'locations/kapolei'],
    body: [
      paragraph(
        'Mexican breakfast can be quick and portable or built for a slower morning at the table. Taqueria El Ranchero serves breakfast daily from 7:00 AM to 12:00 PM at both our Wahiawa and Kapolei restaurants.'
      ),
      paragraph(
        'If you are deciding between a breakfast burrito, chilaquiles, huevos rancheros, or breakfast tacos, think about how hungry you are, how much time you have, and whether you want something handheld or plated.'
      ),
      heading('Choose a Breakfast for Your Morning'),
      table(
        'Mexican breakfast options at a glance',
        ['Breakfast', 'Style', 'When it works well'],
        [
          ['Breakfast burrito', 'Handheld and filling', 'Takeout or a busy morning'],
          ['Breakfast tacos', 'Flexible and easy to share', 'Trying different fillings'],
          ['Chilaquiles', 'A saucy, plated breakfast', 'A sit-down meal'],
          ['Huevos rancheros', 'Eggs with classic Mexican flavors', 'A traditional breakfast plate'],
        ]
      ),
      heading('Breakfast Burritos for a Convenient Meal'),
      paragraph(
        'A breakfast burrito brings the main parts of breakfast together in one tortilla. It is a practical choice when you want a filling meal that travels well, whether you are heading to work, starting a day around Central Oʻahu, or picking up food before errands in Kapolei.'
      ),
      heading('Chilaquiles and Huevos Rancheros for a Sit-Down Breakfast'),
      paragraph(
        'When you have time to sit down, a plated breakfast lets the sauces, eggs, tortillas, and sides come together. Chilaquiles offer more texture and sauce in every bite, while huevos rancheros keep the eggs at the center of the plate.'
      ),
      heading('Breakfast Tacos When You Want Variety'),
      paragraph(
        'Breakfast tacos make it easy to order more than one flavor or share with someone else. They are also a useful middle ground when you want something more flexible than a plate but do not want a full burrito.'
      ),
      subheading('Before you visit'),
      listItem('Breakfast is served daily from 7:00 AM to 12:00 PM.'),
      listItem('The kitchen remains open daily until 10:00 PM.'),
      listItem('Both Wahiawa and Kapolei serve the same core breakfast menu.'),
      listItem('Current menu availability and pricing may vary by location.'),
      heading('Plan Breakfast at Wahiawa or Kapolei'),
      paragraph(
        'Visit Wahiawa for our original neighborhood taqueria experience or Kapolei for sit-down dining at Ka Makana Aliʻi. You can browse the breakfast menu first, then use the location links to check current online ordering options.'
      ),
      cta('Browse the Breakfast Menu', '/menu/breakfast'),
      faq([
        [
          'What time does El Ranchero serve breakfast?',
          'Breakfast is served daily from 7:00 AM to 12:00 PM at both the Wahiawa and Kapolei restaurants.',
        ],
        [
          'Can I order Mexican breakfast online?',
          'Yes. Use our Order Online page to choose your location and view its current DoorDash takeout menu.',
        ],
        [
          'Do both locations have the same breakfast menu?',
          'Both locations serve the same core menu, though selections, pricing, and availability may change.',
        ],
      ]),
    ],
  },
  {
    _id: 'blogPost-plan-taco-bar-catering-oahu',
    _type: 'blogPost',
    title: 'How to Plan Taco Bar Catering for an Oʻahu Gathering',
    slug: { _type: 'slug', current: 'plan-taco-bar-catering-oahu' },
    excerpt:
      'Use this practical checklist to prepare your guest count, timing, food preferences, and service details for a taco bar catering request.',
    metaTitle: 'How to Plan Taco Bar Catering on Oʻahu',
    metaDescription:
      'Plan taco bar catering on Oʻahu with tips for guest counts, timing, food preferences and requests from Taqueria El Ranchero.',
    publishDate: '2026-10-12T06:00:00.000Z',
    author: 'Taqueria El Ranchero',
    image: image(
      'image-320ebab66fc09b173f5cb8c756d8a85ad77918df-1200x960-jpg',
      'Taco bar catering from Taqueria El Ranchero'
    ),
    relatedPages: [
      'catering',
      'catering/taco-bar',
      'catering/corporate',
      'catering/parties',
      'catering/large-groups',
      'events/event-space-rental',
    ],
    body: [
      paragraph(
        'A taco bar gives guests the flexibility to build a plate around the flavors they enjoy. It can work for an office lunch, birthday, graduation, family gathering, or a larger community event.'
      ),
      paragraph(
        'You do not need every detail finalized before contacting Taqueria El Ranchero. A few key pieces of information will help our team understand your event and explain the current taco bar packages and arrangements.'
      ),
      heading('Start With the Event Basics'),
      paragraph(
        'The event date, estimated guest count, location, and meal time are the most useful starting points. These details help frame the size and timing of the request before you discuss food preferences.'
      ),
      table(
        'Information to prepare for your catering request',
        ['Detail', 'Why it helps'],
        [
          ['Event date and meal time', 'Helps confirm timing and availability'],
          ['Estimated guest count', 'Helps identify package options for the group'],
          ['Event location', 'Helps discuss pickup or available fulfillment arrangements'],
          ['Food preferences', 'Helps the team review current meat, topping, and salsa options'],
          ['Dietary requests', 'Gives the team a chance to explain what may be accommodated'],
        ]
      ),
      heading('Estimate Your Guest Count'),
      paragraph(
        'A realistic estimate is more useful than a perfect final number. Include adults and children, and mention whether everyone will eat at the same time or arrive throughout the event. El Ranchero has catered gatherings of about 250 guests, but each request is reviewed based on its own details.'
      ),
      heading('Think About How Guests Will Eat'),
      paragraph(
        'A short office lunch has different timing from an open-house graduation party. Let the team know whether guests will form one serving line, eat in shifts, or come and go. That context helps when discussing the arrangement.'
      ),
      subheading('A simple planning checklist'),
      listItem('Confirm the date and approximate serving time.'),
      listItem('Estimate the number of adults and children.'),
      listItem('Note the event address and preferred pickup or delivery arrangement.'),
      listItem('Collect important food preferences and dietary requests.'),
      listItem('Decide who will be the main contact on the event day.'),
      heading('Ask What Is Included'),
      paragraph(
        'Catering selections can differ from the regular restaurant menu. Ask what is included in the current taco bar packages, which selections are available, and what you will need to provide at the venue. This avoids assumptions and makes the final plan easier to manage.'
      ),
      heading('Catering and Venue Rental Are Separate'),
      paragraph(
        'If you also need a venue, El Ranchero offers event space rental at the Kapolei location. Catering and venue rental are separate offerings, so availability, capacity, and arrangements should be confirmed independently.'
      ),
      cta('Request Taco Bar Catering', '/catering#catering-form'),
      faq([
        [
          'What should I include in a taco bar catering request?',
          'Include your event date, estimated guest count, location, serving time, food preferences, and any dietary requests.',
        ],
        [
          'Can El Ranchero cater a large group?',
          'El Ranchero has catered gatherings of about 250 guests. Share your estimated guest count so the team can review what arrangements may be possible.',
        ],
        [
          'Does catering include the Kapolei event space?',
          'No. Catering and event space rental are separate offerings, and each must be confirmed independently.',
        ],
      ]),
    ],
  },
];

const transaction = client.transaction();
transaction.delete('blogPost-test-post');
transaction.delete('drafts.blogPost-test-post');
for (const post of posts) transaction.createOrReplace(post);

const result = await transaction.commit();
console.log(`Published ${posts.length} blog posts and removed the test post (${result.results.length} mutations).`);
