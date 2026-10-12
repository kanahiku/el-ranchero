/**
 * Seeds placeholder content into Sanity so the blog and the testimonials carousel
 * have something to show while the real copy is written:
 *   - 3 dummy testimonials
 *   - 1 test blog post that uses every block the article template supports
 *
 *   npm run seed:test-content               # dry run
 *   npm run seed:test-content -- --commit   # write (replaces these documents if they exist)
 *
 * Documents have fixed IDs (testimonial-test-*, blogPost-test-post) so re-running updates
 * them instead of duplicating. Delete them in the Studio when real content is in.
 * Needs SANITY_WRITE_TOKEN.
 */
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID ?? 'jntapqhj';
const dataset = process.env.SANITY_DATASET ?? 'production';
const token = process.env.SANITY_WRITE_TOKEN;
const commit = process.argv.includes('--commit');

if (commit && !token) throw new Error('SANITY_WRITE_TOKEN is required with --commit.');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-09-15',
  useCdn: false,
  ...(token ? { token } : {}),
});

// ── Testimonials ────────────────────────────────────────────────────────────
const testimonials = [
  {
    _id: 'testimonial-test-1',
    name: 'Test Reviewer One',
    location: 'Wahiawa',
    platform: 'google',
    order: 0,
    quote:
      'Dummy review: the breakfast burrito is huge and the salsa is made fresh. We stop in every Saturday on the way out of Wahiawa.',
  },
  {
    _id: 'testimonial-test-2',
    name: 'Test Reviewer Two',
    location: 'Kapolei',
    platform: 'yelp',
    order: 1,
    quote:
      'Dummy review: great spot for a family dinner. The Molcajete was sizzling when it hit the table and the margaritas were just right.',
  },
  {
    _id: 'testimonial-test-3',
    name: 'Test Reviewer Three',
    location: 'Google Review',
    platform: 'google',
    order: 2,
    quote:
      'Dummy review: Taco Tuesday and karaoke on Wednesday are the best part of my week. Friendly staff and a fun crowd.',
  },
].map((doc) => ({ ...doc, _type: 'testimonial' }));

// ── Test blog post ──────────────────────────────────────────────────────────
let keyCounter = 0;
const key = () => `k${(keyCounter += 1)}`;

type Span = string | { text: string; marks?: string[] };
type Def = { _key: string; _type: 'link'; href: string; blank: boolean };

function block(style: string, spans: Span[], extra: Record<string, unknown> = {}, defs: Def[] = []) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: defs,
    children: spans.map((span) => ({
      _type: 'span',
      _key: key(),
      text: typeof span === 'string' ? span : span.text,
      marks: typeof span === 'string' ? [] : (span.marks ?? []),
    })),
    ...extra,
  };
}

const p = (...spans: Span[]) => block('normal', spans);
const h = (style: 'h2' | 'h3' | 'h4', text: string) => block(style, [text]);
const li = (listItem: 'bullet' | 'number', text: Span[], level = 1) => block('normal', text, { listItem, level });

const menuLink: Def = { _key: 'link-menu', _type: 'link', href: '/menu', blank: false };
const doorDashLink: Def = {
  _key: 'link-doordash',
  _type: 'link',
  href: 'https://www.doordash.com/store/taqueria-el-ranchero-wahiawa-276575/',
  blank: true,
};

const body = [
  p(
    'This is a test article. It exists to check that every kind of content an editor can add in Sanity ',
    'shows up correctly on the El Ranchero blog: headings, text styles, lists, quotes, tables and callouts.'
  ),

  h('h2', 'Headings and text styles'),
  p(
    'Paragraphs can include ',
    { text: 'bold text', marks: ['strong'] },
    ', ',
    { text: 'italic text', marks: ['em'] },
    ', ',
    { text: 'underlined text', marks: ['underline'] },
    ' and ',
    { text: 'inline code', marks: ['code'] },
    '. You can also combine them, like ',
    { text: 'bold and italic', marks: ['strong', 'em'] },
    '.'
  ),
  block(
    'normal',
    [
      'Links work too: browse the ',
      { text: 'full menu', marks: ['link-menu'] },
      ' (same tab) or ',
      { text: 'order Wahiawa takeout on DoorDash', marks: ['link-doordash'] },
      ' (new tab).',
    ],
    {},
    [menuLink, doorDashLink]
  ),

  h('h3', 'Lists'),
  p('A bulleted list of things we serve every morning:'),
  li('bullet', ['Breakfast Burrito with bacon, ham, chorizo or veggie']),
  li('bullet', ['Chilaquiles with salsa, eggs and queso fresco']),
  li('bullet', ['Huevos Rancheros over a corn tortilla']),
  li('bullet', ['Sides to share:']),
  li('bullet', ['Beans'], 2),
  li('bullet', ['Potatoes'], 2),
  p('A numbered list for how to order:'),
  li('number', ['Pick your location: Wahiawa or Kapolei.']),
  li('number', ['Choose a dish and your meat.']),
  li('number', [{ text: 'Check out on DoorDash', marks: ['strong'] }, ' and pick up at the counter.']),

  h('h4', 'A smaller heading'),
  p('Heading 4 is useful for short labels inside a longer section.'),

  block('blockquote', ['“Good food, good music, good people. That is El Ranchero.”']),

  h('h2', 'Tables'),
  p('Tables are good for hours, options or comparisons.'),
  {
    _type: 'table',
    _key: key(),
    caption: 'Location hours at a glance',
    headerRow: ['Location', 'Days', 'Hours'],
    rows: [
      { _key: key(), cells: ['Wahiawa', 'Daily', '9:00 AM – 8:30 PM'] },
      { _key: key(), cells: ['Kapolei', 'Mon – Sun', '10:00 AM – 9:00 PM'] },
    ],
  },

  h('h2', 'Callout boxes'),
  { _type: 'callout', _key: key(), type: 'tip', text: 'Tip: order a Wet Burrito with red or green sauce for an extra-saucy meal.' },
  { _type: 'callout', _key: key(), type: 'info', text: 'Info: breakfast is served every day from 7 AM to 12 PM at both locations.' },
  { _type: 'callout', _key: key(), type: 'warning', text: 'Warning: our food may contain or come in contact with common allergens. Please tell your server about any concerns.' },
  { _type: 'callout', _key: key(), type: 'note', text: 'Note: this is test content and can be deleted from the Studio at any time.' },

  h('h2', 'Wrapping up'),
  p('If everything above looks right, the blog template is ready for real articles.'),
];

const blogPost = {
  _id: 'blogPost-test-post',
  _type: 'blogPost',
  title: 'Test Post: Everything an El Ranchero Article Can Include',
  slug: { _type: 'slug', current: 'test-post' },
  excerpt:
    'A test article that shows every content block the blog supports: headings, text styles, links, lists, quotes, tables and callout boxes.',
  publishDate: new Date().toISOString(),
  author: 'El Ranchero',
  relatedPages: ['menu', 'menu/tacos', 'locations'],
  body,
};

const docs: Array<{ _id: string; _type: string } & Record<string, unknown>> = [...testimonials, blogPost];
console.log(`Project ${projectId}/${dataset}: ${testimonials.length} testimonials + 1 blog post (${body.length} body blocks).`);

if (!commit) {
  console.log('Dry run. Re-run with --commit to write to Sanity.');
  process.exit(0);
}

const tx = client.transaction();
for (const doc of docs) tx.createOrReplace(doc);
const result = await tx.commit();
console.log(`Done. ${result.results.length} documents written.`);
