# Restaurant site from this template

This repo is a **client template**: identity, design system, and page composition change. The stack (Astro, Sanity, forms, GTM, reviews, blog, legal) stays.

Replacing `src/brand.ts` and deleting this client's pages is the start, not the whole job.

With only a **Homepage** in Figma, treat that frame as the design system, then invent other pages from the same atoms and widgets — not as one-off layouts.

## What you keep (do not delete)

From `ONBOARDING.md`, every site keeps:

| Keep | Why |
|---|---|
| `/contact`, `/reviews`, `/blog`, `/privacy-policy`, `/terms-of-service`, `/accessibility` | Always-on routes |
| Sanity, forms/Resend, GTM, Search Console, JSON-LD | Infra, not this client's copy |
| Shared atoms: `Button`, `Heading`, `Text`, `Card`, `Form` | Restyle them; don't fork |
| Generic widgets: `Hero2`, `FAQs`, `Testimonials`, `Content`, `CTABanner`, `Header`, `Footer`, `Timeline` | Restyle to match the restaurant homepage |

The 32-system quiz at `/form` is **this client only**. For a restaurant, drop it and point the primary CTA at reservations or `/contact`.

---

## 1. Identity (not `brand.ts`)

`brand.ts` is colors, type, and radius only. Fill these for the restaurant:

| File | What to put |
|---|---|
| `src/config/site.ts` | Name, URL, SEO description, `formSlug`, GTM later |
| `src/config/contact.ts` | Phone, email, **full address**, **hours** (dinner vs lunch), `areaServed` |
| `src/config/social.ts` | Instagram / Facebook / TikTok / Google listing |
| `src/config/cta.ts` | e.g. "Reserve a table" → OpenTable / `/reservations` / `tel:` |
| `src/config/schema/business.ts` | `businessType: 'Restaurant'` (or `FoodEstablishment`), `priceRange: '$$$'`, cuisine later |
| `src/config/schema/pages.ts` | Drop aging routes; add Menu / About / Reservations |
| `src/data/navigation.ts` | Header/footer: Menu, About, Reservations, Contact |
| `src/config.yaml` | `metadata.title` / `openGraph.site_name` — still used for `<title>` and OG |
| `src/assets/images/logo.svg` (or `.webp`) | Restaurant logo |
| `public/favicon.svg` + regen `.ico`, `apple-touch-icon.png`, `og-image.jpg` | Favicon rule: all identity assets together |
| `.env` / `studio/.env` / `vercel.json` | New Sanity project, slug, hosts |

Hours in `contact.ts` matter more for a restaurant than for this club site. Schema.org uses them.

---

## 2. Design system from the Homepage only

Build order still holds. Don't invent inner pages until tokens and atoms match that one Figma frame.

### Phase 1 — `src/brand.ts` from Homepage

From the Homepage (Variables if they exist, otherwise repeating fills):

- Page / cream / dark section / card / accent / CTA
- Heading + body fonts and weights
- Corner radii (32px cards, 64px bands, etc.)
- Desktop **and** mobile type if both exist; only then fall back

### Phase 2 — restyle atoms

Match the Homepage buttons, headings, cards, inputs. Other pages will look like the restaurant because they use these atoms, not because you designed each page in Figma.

### Phase 3 — restyle generic widgets, then add restaurant ones

Reuse patterns you already have:

- Hero → `Hero2`
- Quotes → `Testimonials`
- FAQ → `FAQs`
- Split photo + copy → `Content` / `TextSplit`
- Ending CTA → `CTABanner`

Add **one** widget per new repeating shape, register it in `src/registry/components.json`. Typical restaurant shapes:

- Menu grid / category tabs (same idea as `BooksGrid` + filter pills)
- Hours + map + reserve band
- Dish / tasting-menu cards
- Photo gallery (`ProjectsSection`)
- Private dining / events split

Do not paste unique markup into page files.

---

## 3. Delete this client's pages and widgets

### Pages to remove (replace with restaurant routes)

- `/how-aging-works`
- `/four-pillars`
- `/books`
- `/guidebooks`
- `/podcast`
- `/chapters`
- `/fill-the-first-bucket`
- `/talk-to-your-doctor`
- `/form`
- Current `/about` copy (rebuild as restaurant story)

### Widgets that are this brand, not the template

`HowAgingWorks`, `PillarSection`, `ScheduleSection` (weekly club calendar), `ChaptersList`, `BooksGrid`, `BookSeriesFeature`, `GuideBookGrid`, `PodcastFilter`, `PodcastEpisodes`, `TalkToDoctor`, `CredentialsSection`, `PublicationsSection`, `WrittenWorkSection`, `AboutStory` (Dr. Peterson layout), etc.

Keep the generic ones listed above. Footer/Header stay; restyle them to match the Homepage chrome.

### Sanity

Drop `book` and `podcastEpisode`. Add something like `menuItem` / `menuCategory` (and maybe `event` or `privateDining` if needed). Keep `homePage`, `contactPage`, `reviewsPage`, `blogPost`, `testimonial`, navigation/footer singletons.

### Copy leftovers

Legal pages, footer CTA (`cta.ts`), quiz, seed scripts, and site identity in `src/config.yaml` / `src/config/site.ts`.

---

## 4. Homepage-only Figma → other pages with AI

`ONBOARDING.md` says not to invent layout from a copy doc. With only a Homepage, **extract rules**, then apply them.

From the Homepage, write down a short **style contract** (put it in the prompt every time you generate a page):

1. **Section rhythm** — background sequence (cream → tan → dark → photo), padding (e.g. 120px), rounded top corners (64px), image radius (32px)
2. **Type roles** — h1 hero only, h2 section, h3 pullquote, h4 cards, eyebrow all-caps
3. **CTA language** — one primary ("Reserve"), one ghost ("View menu")
4. **Card language** — same `Card` variants as home (bordered / dark / outlined)
5. **Nav** — same Header treatment (glass on photo, solid on light)

Then compose inner pages **only from those widgets**, with restaurant-standard IA:

| Route | Typical composition |
|---|---|
| `/` | Pixel-match Figma Homepage |
| `/menu` | Page hero + category filter + dish cards + CTA |
| `/about` | Split story + chef/quote + maybe credentials-style timeline |
| `/reservations` | Hours, party size note, form or embed, map |
| `/contact` | Keep the contact widget; restaurant hours + map + phone |
| `/reviews` | Keep reviews grid |
| `/blog` | Keep (events, seasonal menus, stories) |
| Legal | Keep; rewrite business name |

That is the same Figma order: tokens → atoms → widgets → pages. Inner pages are "same system, different copy and section order," not new visual languages.

---

## 5. Restaurant-specific extras

- **JSON-LD:** `Restaurant` (not `Organization`). Add `servesCuisine`, `menu` URL, `acceptsReservations`, geo if you have it.
- **Primary action:** reservation (OpenTable/Resy/`tel:`) instead of the assessment.
- **Contact form:** still the Cloudflare Worker; change fields (party size, date, dietary notes) in `Form.astro` / contact page — don't delete the Worker.
- **Reviews:** Google Places + Yelp still fit restaurants well.
- **Images:** after the homepage match, swap grey placeholders for food photography; don't bake Figma MCP localhost URLs into production.

---

## Practical sequence

1. New repo / client folder; new Sanity project; fill identity files + `.env`.
2. Extract Homepage tokens → `brand.ts`; restyle Button / Heading / Card / Header / Footer.
3. Rebuild `/` from Figma using shared widgets.
4. Delete aging pages/widgets/Sanity types; add Menu (and Reservations if needed).
5. Generate `/menu`, `/about`, `/reservations` from the style contract + the same widgets.
6. Rewrite legal + schema + nav + logo/favicons/OG.
7. `npm run build`, then connect forms, GTM, reviews.
