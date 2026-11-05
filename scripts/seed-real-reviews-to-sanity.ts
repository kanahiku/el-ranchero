/**
 * Replaces ALL testimonial documents in Sanity with the client's real Google + Yelp reviews.
 *
 *   npm run seed:real-reviews               # dry run
 *   npm run seed:real-reviews -- --commit   # write it
 *
 * Needs SANITY_WRITE_TOKEN. Interleaves Google and Yelp so the carousel mixes sources.
 */
import { createClient } from '@sanity/client';

const commit = process.argv.includes('--commit');
const token = process.env.SANITY_WRITE_TOKEN;
if (commit && !token) throw new Error('SANITY_WRITE_TOKEN is required with --commit.');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? 'jntapqhj',
  dataset: process.env.SANITY_DATASET ?? 'production',
  apiVersion: '2026-09-15',
  useCdn: false,
  token,
});

type Platform = 'google' | 'yelp';
type Review = { name: string; platform: Platform; quote: string };

const google: Review[] = [
  {
    name: 'Octavio Mata',
    quote:
      'It was a little pricey, but taking into account that it\u2019s in Hawaii it was definitely understandable. The tacos were really good. Definitely a good spot to hang out at the bar and eat food and relax.',
  },
  {
    name: 'Lilly Biesinger',
    quote:
      'Horchata is very good! Taco Tuesday is a great time to go for a deal on the tacos. Pretty fast service and delicious sauces!',
  },
  {
    name: 'Glen Alamo',
    quote:
      'We went to Wahiawa to escape the tsunami and I had done research ahead of our trip to Oahu for places to eat. This place was the most legit real deal Mexican taco joint I found by looking at the picture. It did not disappoint. Granted, 2 hr wait to get in because of the tsunami warning. It had what I needed, food, drinks, a TV for the news, locals to talk to. Will forever remember this place.',
  },
  {
    name: 'Jada',
    quote:
      'This place is amazing. The food is so good! If you happen to be in the area don\u2019t hesitate to stop and grab something. They have different locations as well. I am addicted to their carne asada street tacos. The chips with green sauce is fire as well. They will have a loyal customer because I will be back several times lol. I have been here 3 times already and got some delivered today.',
  },
  {
    name: 'Helen',
    quote:
      'Was really a surprise place or spot. I loved the birria tacos and a torta cubana. My husband had delicious ceviche tostadas and churro ice cream dessert. Service was excellent, made suggestions and answered our questions. It is a small place but if you\u2019re looking for good food this is the place.',
  },
  {
    name: 'Jose',
    quote:
      'Had a torta and couple of beers while watching the Anaheim Ducks spank the Vegas Knights (go Ducks). Food was great, up there with some great tortas I\u2019ve had, salsa was fire and great venue.',
  },
].map((r) => ({ ...r, platform: 'google' as const }));

const yelp: Review[] = [
  {
    name: 'Joslyn H.',
    quote:
      'Colton makes the best flaming mango! Ask for him at the bar or ask your waitress to have him make it. The aesthetics of the drink were on point too.',
  },
  {
    name: 'Miguel G.',
    quote:
      'Stopped on on my way home the other day. I picked up my order and bolted to avoid the afternoon traffic. The place was orderly and clean. Employees were cordial and welcoming. Picked up a Burrito Grande, Seafood Taco and Cali Fries. All great! Ono! Would recommend this to all. Aloha!!',
  },
  {
    name: 'Hannah F.',
    quote:
      'We stopped here on a whim with our Keiki. I was born and raised in New Mexico and have VERY high standards for Mexican food, TexMex, and New Mexican food. Let me tell you, this place is wonderful! Not only do they have exceptional service and staff, but their vibe/ambiance was so fun. The food was so delicious and authentic Mexican food - we will definitely be back soon!',
  },
  {
    name: 'Ron F.',
    quote:
      'Great restaurant! If you come, ask for Umberto as your server - the best! Also, the margarita flight for happy hour ain\u2019t all that bad.',
  },
  {
    name: 'Teven H.',
    quote:
      'Service and atmosphere was great. Our server was always filling up our waters, and knew when to let us eat and when to check in. The food was great, and they were super nice when I asked for more corn tortillas; and didn\u2019t charge me extra or anything. I look forward to going back soon.',
  },
  {
    name: 'Rose T.',
    quote:
      'Food hit the spot. Taco, beans and rice.. my go to. Service from Colton was on point. His margaritas mixed well, kept my water filled and made sure I was always good. Thanks, Colton!',
  },
].map((r) => ({ ...r, platform: 'yelp' as const }));

// Interleave sources
const ordered: Review[] = [];
for (let i = 0; i < Math.max(google.length, yelp.length); i++) {
  if (google[i]) ordered.push(google[i]);
  if (yelp[i]) ordered.push(yelp[i]);
}

const docs = ordered.map((r, i) => ({
  _id: `testimonial-real-${i + 1}`,
  _type: 'testimonial' as const,
  quote: r.quote,
  name: r.name,
  location: r.platform === 'google' ? 'Google Review' : 'Yelp Review',
  platform: r.platform,
  order: i,
}));

const existing = await client.fetch<string[]>('*[_type == "testimonial"]._id');
console.log(`Deleting ${existing.length} existing testimonials, creating ${docs.length} real ones.`);

if (commit) {
  const tx = client.transaction();
  const ids = new Set(existing.flatMap((id) => [id.replace(/^drafts\./, ''), `drafts.${id.replace(/^drafts\./, '')}`]));
  for (const id of ids) tx.delete(id);
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();
  console.log('Done.');
} else {
  console.log('Dry run. Re-run with --commit to write.');
}
