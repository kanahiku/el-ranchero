import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '../../config/cta';
import type { HomepageContent } from '../../data/pages/homepage';
import type {
  BlogIndexContent,
  ContactPageContent,
  OrderOnlineContent,
} from '../../data/pages/sitePages';
import type { LegalPageContent } from '../../data/pages/legal';
import type { ReviewsContent } from '../../data/pages/reviews';
import type { AboutContent } from '../../data/pages/about';
import type { LocationsHubContent, LocationsSubPageContent } from '../../data/pages/locations';
import type { EventsHubContent, EventsSubPageContent } from '../../data/pages/events';
import type { CateringHubContent, CateringSubPageContent } from '../../data/pages/catering';
import type { MenuCategoryPageContent, MenuHubContent, MenuSharedContent } from '../../data/pages/menu';
import { sanityClient } from '../sanity/client';
import { resolveContentImage, type SanityImageFields } from '../sanity/image';
import type {
  BlogContentBlock,
  BlogPost,
  Testimonial,
  ContentImage,
  NavigationContent,
  NavLink,
  NavSubLink,
  MenuCategory,
  MenuItem,
  MeatOption,
} from './types';

type FetchedImage = ContentImage & SanityImageFields;

const IMAGE_PROJECTION = (field: string, fallbackAlt: string) => /* groq */ `
  "${field}": select(defined(${field}.asset) => {
    "src": ${field}.asset->url,
    "alt": coalesce(${field}.alt, "${fallbackAlt}"),
    "crop": ${field}.crop,
    "hotspot": ${field}.hotspot,
    "asset": ${field}.asset
  }, null)
`;

const COPY_REPLACEMENTS: Array<[string, string]> = [
  ["We're", 'We are'],
  ["we're", 'we are'],
  ["We've", 'We have'],
  ["we've", 'we have'],
  ["that's", 'that is'],
  ["That's", 'That is'],
  ["what's", 'what is'],
  ["What's", 'What is'],
  ["doesn't", 'does not'],
  ["Doesn't", 'Does not'],
  ["you'll", 'you will'],
  ["You'll", 'You will'],
  ["we'll", 'we will'],
  ["We'll", 'We will'],
  ["family's", 'family'],
  ["Family's", 'Family'],
  ['site’s', 'site'],
  ['Site’s', 'Site'],
];

function normalizeWebsiteCopy(value: string): string {
  let text = value;
  for (const [from, to] of COPY_REPLACEMENTS) {
    text = text.replaceAll(from, to);
  }

  return text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[ʻ‘’]/g, '')
    .replace(/(?<=[A-Za-z])'(?=[A-Za-z])/g, '')
    .normalize('NFC');
}

// ─── Page images ─────────────────────────────────────────────────────────────
// One singleton per page group (`homepageContent`, `aboutContent`, …). Each holds
// named image fields; a field with no image resolves to `undefined` so the widget
// shows its grey placeholder.

/** Homepage: every field of the `homepageContent` singleton, images resolved to CDN URLs. */
export async function getSanityHomepageContent(): Promise<Partial<HomepageContent> | null> {
  type Raw = Record<string, unknown> & {
    favoritesDishes?: Array<Record<string, unknown>>;
    locationsList?: Array<Record<string, unknown>>;
  };
  const doc = await sanityClient.fetch<Raw | null>(/* groq */ `
    *[_type == "homepageContent" && _id == "singleton-homepage"][0]{
      seoTitle, seoDescription,
      heroTitle, heroParagraphs, heroActions[]{text, href, variant}, heroStats[]{value, label},
      ${IMAGE_PROJECTION('heroImage', 'Taqueria El Ranchero')},
      breakfastHeading, breakfastParagraphs, breakfastCta{text, href},
      ${IMAGE_PROJECTION('breakfastImage', 'Mexican breakfast at El Ranchero')},
      favoritesTitle, favoritesParagraphs, favoritesCta{text, href},
      favoritesDishes[]{title, paragraphs, href, ${IMAGE_PROJECTION('image', 'Dish at El Ranchero')}},
      eventsHeading, eventsBody, eventsDays[]{day, events[]{name, description}},
      eventsFootnoteBefore, eventsFootnoteLink{text, href}, eventsFootnoteAfter, eventsCta{text, href},
      locationsTitle, locationsSubtitle,
      locationsList[]{name, heading, shopName, address, paragraphs, hours, actions[]{text, href, variant},
        ${IMAGE_PROJECTION('image', 'El Ranchero restaurant')}},
      cateringHeading, cateringParagraphs, cateringCta{text, href},
      ${IMAGE_PROJECTION('cateringImage', 'El Ranchero Mexican catering')},
      privateEventsHeading, privateEventsParagraphs, privateEventsCta{text, href},
      ${IMAGE_PROJECTION('privateEventsImage', 'El Ranchero Kapolei event space')},
      reviewsHeading,
      closingTitle, closingSubtitle, closingActions[]{text, href, variant}
    }
  `);
  if (!doc) return null;

  const withImage = <T extends Record<string, unknown>>(item: T) => ({
    ...item,
    image: resolveContentImage(item.image as FetchedImage | null),
  });
  const out: Record<string, unknown> = { ...doc };
  for (const key of ['heroImage', 'breakfastImage', 'cateringImage', 'privateEventsImage']) {
    out[key] = resolveContentImage(doc[key] as FetchedImage | null);
  }
  if (doc.favoritesDishes) out.favoritesDishes = doc.favoritesDishes.map(withImage);
  if (doc.locationsList) out.locationsList = doc.locationsList.map(withImage);
  return out as Partial<HomepageContent>;
}

const LOCATION_CARD_PROJECTION = /* groq */ `
  name, tagline, heading, shopName, addressLine1, addressLine2, paragraphs, hours,
  actions[]{text, href, variant},
  ${IMAGE_PROJECTION('image', 'Taqueria El Ranchero')}
`;

export async function getSanityBlogIndex(): Promise<Partial<BlogIndexContent> | null> {
  return sanityClient.fetch<Partial<BlogIndexContent> | null>(/* groq */ `
    *[_type == "blogIndexContent" && _id == "singleton-blog-index"][0]{
      seoTitle, seoDescription, heading, emptyText, ctaTitle, ctaSubtitle, ctaButton{text, href},
      backLabel, relatedHeading, postCtaTitle, postCtaSubtitle, postCtaButton{text, href}
    }
  `);
}

export async function getSanityContactPage(): Promise<Partial<ContactPageContent> | null> {
  return sanityClient.fetch<Partial<ContactPageContent> | null>(/* groq */ `
    *[_type == "contactPageContent" && _id == "singleton-contact"][0]{
      seoTitle, seoDescription, heroTitle, heroIntro,
      formTitle, formIntro, formButton, asideHeading,
      locations[]{name, intro, address, kitchenHours, barHours, directionsLabel, visitLabel}
    }
  `);
}

export async function getSanityOrderOnline(): Promise<Partial<OrderOnlineContent> | null> {
  const doc = await sanityClient.fetch<(Record<string, unknown> & { cards?: Array<Record<string, unknown>> }) | null>(
    /* groq */ `
    *[_type == "orderOnlineContent" && _id == "singleton-order-online"][0]{
      seoTitle, seoDescription, heroTitle, heroParagraphs, chooseTitle,
      cards[]{ ${LOCATION_CARD_PROJECTION} },
      note, phoneHeading, phoneText, phoneButtons[]{text, href, variant},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `
  );
  if (!doc) return null;
  return { ...doc, ...(doc.cards ? { cards: doc.cards.map(withResolvedImage) } : {}) } as Partial<OrderOnlineContent>;
}

export async function getSanityLegalPage(slug: string): Promise<Partial<LegalPageContent> | null> {
  return sanityClient.fetch<Partial<LegalPageContent> | null>(
    /* groq */ `
    *[_type == "legalPage" && slug == $slug][0]{
      seoTitle, seoDescription, heroTitle, heroIntro,
      sections[]{heading, body, bullets, closing},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `,
    { slug }
  );
}

export async function getSanityReviews(): Promise<Partial<ReviewsContent> | null> {
  const doc = await sanityClient.fetch<Record<string, unknown> | null>(/* groq */ `
    *[_type == "reviewsContent" && _id == "singleton-reviews"][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'Guests at Taqueria El Ranchero')},
      heroTitle, heroParagraphs, heroButtons[]{text, href, variant},
      reviewsEyebrow, reviewsHeading, reviewsIntro, reviewsFootnote,
      reviewsButtons[]{text, href, variant},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `);
  if (!doc) return null;
  return { ...doc, heroImage: resolveContentImage(doc.heroImage as FetchedImage | null) } as Partial<ReviewsContent>;
}

export async function getSanityAbout(): Promise<Partial<AboutContent> | null> {
  const doc = await sanityClient.fetch<(Record<string, unknown> & { blocks?: Array<Record<string, unknown>> }) | null>(
    /* groq */ `
    *[_type == "aboutContent" && _id == "singleton-about"][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'About Taqueria El Ranchero')},
      heroTitle, heroParagraphs,
      blocks[]{
        _type, anchor, tone, imageSide, heading, paragraphs, smallPrint, address,
        buttons[]{text, href, variant},
        ${IMAGE_PROJECTION('image', 'Taqueria El Ranchero')}
      }
    }
  `
  );
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    ...(doc.blocks ? { blocks: doc.blocks.map(withResolvedImage) } : {}),
  } as Partial<AboutContent>;
}

// ─── Catering pages ──────────────────────────────────────────────────────────
// /catering → `cateringContent`, /catering/<slug> → `cateringSubPage`.

export async function getSanityCateringHub(): Promise<Partial<CateringHubContent> | null> {
  const doc = await sanityClient.fetch<Record<string, unknown> | null>(/* groq */ `
    *[_type == "cateringContent" && _id == "singleton-catering"][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'El Ranchero catering')},
      heroTitle, heroParagraphs, heroButton{text, href},
      formHeading, formParagraphs, formMessageLabel, formButtonLabel, callPrompt, phoneDisplay, phoneHref,
      favoritesTitle, favoritesIntro,
      favoritesItems[]{title, description, ${IMAGE_PROJECTION('image', 'Catering from El Ranchero')}},
      favoritesFootnote,
      occasionsHeading, occasionsIntro, occasionsBullets, occasionsOutro,
      ${IMAGE_PROJECTION('occasionsImage', 'Group gathering catered by El Ranchero')},
      whyHeading, whyParagraphs,
      ${IMAGE_PROJECTION('whyImage', 'Taqueria El Ranchero')},
      reviewsHeading, reviewsSubtitle, reviewsFootnote,
      reviews[]{quote, name, location}, reviewLinks[]{text, href},
      stepsTitle, steps[]{title, description},
      planningHeading, planningIntro, planningChecklist, planningOutro,
      ${IMAGE_PROJECTION('planningImage', 'Planning catering with El Ranchero')},
      exploreHeading, exploreParagraphs, exploreOptionsLead, exploreButton{text, href},
      ${IMAGE_PROJECTION('exploreImage', 'El Ranchero menu')},
      locationsTitle, locationsSubtitle, locationsFootnote,
      faqsTitle, faqs[]{question, answer},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `);
  if (!doc) return null;
  const out: Record<string, unknown> = { ...doc };
  for (const key of ['heroImage', 'occasionsImage', 'whyImage', 'planningImage', 'exploreImage']) {
    out[key] = resolveContentImage(doc[key] as FetchedImage | null);
  }
  if (Array.isArray(doc.favoritesItems)) {
    out.favoritesItems = doc.favoritesItems.map((item) => withResolvedImage(item as Record<string, unknown>));
  }
  return out as Partial<CateringHubContent>;
}

export async function getSanityCateringSubPage(slug: string): Promise<Partial<CateringSubPageContent> | null> {
  const doc = await sanityClient.fetch<(Record<string, unknown> & { blocks?: Array<Record<string, unknown>> }) | null>(
    /* groq */ `
    *[_type == "cateringSubPage" && slug == $slug][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'El Ranchero catering')},
      heroTitle, heroParagraphs, heroButton{text, href},
      blocks[]{
        _type, anchor, tone, imageSide, heading, paragraphs, intro, button{text, href},
        ${IMAGE_PROJECTION('image', 'El Ranchero catering')}
      },
      faqsTitle, faqs[]{question, answer},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `,
    { slug }
  );
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    ...(doc.blocks ? { blocks: doc.blocks.map(withResolvedImage) } : {}),
  } as Partial<CateringSubPageContent>;
}

// ─── Locations pages ─────────────────────────────────────────────────────────
// /locations → `locationsContent`, /locations/<slug> → `locationsSubPage`.

const LOCATIONS_BLOCKS_PROJECTION = /* groq */ `
  blocks[]{
    _type, anchor, tone, imageSide, heading, paragraphs, smallPrint, address,
    buttons[]{text, href, variant},
    title, intro, footnote, button{text, href},
    items[]{title, description, ${IMAGE_PROJECTION('image', 'El Ranchero favorite')}},
    ${IMAGE_PROJECTION('image', 'Taqueria El Ranchero')}
  }
`;

/** Resolves the photo of a block and of every dish inside a favorites block. */
function resolveLocationsBlock(block: Record<string, unknown>) {
  const out: Record<string, unknown> = withResolvedImage(block);
  if (Array.isArray(block.items)) {
    out.items = block.items.map((item) => withResolvedImage(item as Record<string, unknown>));
  }
  return out;
}

export async function getSanityLocationsHub(): Promise<Partial<LocationsHubContent> | null> {
  const doc = await sanityClient.fetch<
    | (Record<string, unknown> & { blocks?: Array<Record<string, unknown>>; cards?: Array<Record<string, unknown>> })
    | null
  >(/* groq */ `
    *[_type == "locationsContent" && _id == "singleton-locations"][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'El Ranchero locations on Oahu')},
      heroTitle, heroParagraphs,
      cards[]{
        name, tagline, heading, shopName, addressLine1, addressLine2, paragraphs, hours,
        actions[]{text, href, variant},
        ${IMAGE_PROJECTION('image', 'Taqueria El Ranchero')}
      },
      ${LOCATIONS_BLOCKS_PROJECTION}
    }
  `);
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    ...(doc.cards ? { cards: doc.cards.map(withResolvedImage) } : {}),
    ...(doc.blocks ? { blocks: doc.blocks.map(resolveLocationsBlock) } : {}),
  } as Partial<LocationsHubContent>;
}

export async function getSanityLocationsSubPage(slug: string): Promise<Partial<LocationsSubPageContent> | null> {
  const doc = await sanityClient.fetch<(Record<string, unknown> & { blocks?: Array<Record<string, unknown>> }) | null>(
    /* groq */ `
    *[_type == "locationsSubPage" && slug == $slug][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'Taqueria El Ranchero')},
      heroTitle, heroParagraphs, heroButtons[]{text, href, variant},
      visitTitle,
      ${LOCATIONS_BLOCKS_PROJECTION},
      faqsTitle, faqs[]{question, answer},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `,
    { slug }
  );
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    ...(doc.blocks ? { blocks: doc.blocks.map(resolveLocationsBlock) } : {}),
  } as Partial<LocationsSubPageContent>;
}

// ─── Events pages ────────────────────────────────────────────────────────────
// /events → `eventsContent`, /events/<slug> → `eventsSubPage`.

const EVENTS_BLOCKS_PROJECTION = /* groq */ `
  blocks[]{
    _type, anchor, tone, imageSide, heading, paragraphs, smallPrint,
    links[]{text, href}, buttons[]{text, href, variant},
    rows[]{label, info}, note, intro, messageLabel, buttonLabel, footnote,
    ${IMAGE_PROJECTION('image', 'El Ranchero event')}
  }
`;

export async function getSanityEventsHub(): Promise<Partial<EventsHubContent> | null> {
  const doc = await sanityClient.fetch<
    (Record<string, unknown> & { blocks?: Array<Record<string, unknown>>; instagramTiles?: FetchedImage[] }) | null
  >(/* groq */ `
    *[_type == "eventsContent" && _id == "singleton-events"][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'Events at El Ranchero')},
      heroTitle, heroParagraphs, heroButton{text, href},
      weeklyHeading, weeklyNote,
      weeklyRows[]{day, event, location, detailsText, detailsHref},
      moreOptionsLabel, moreOptionLinks[]{text, href},
      locationInfoLabel, locationLinks[]{text, href},
      instagramHeading, instagramText, instagramButton{text, href}, instagramFeedLabel,
      instagramTiles[]{"src": asset->url, "alt": coalesce(alt, "@rancheroevents post"), crop, hotspot, asset},
      ${EVENTS_BLOCKS_PROJECTION},
      eventsList[]{label, href, when, details}
    }
  `);
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    ...(doc.blocks ? { blocks: doc.blocks.map(withResolvedImage) } : {}),
    ...(doc.instagramTiles
      ? {
          instagramTiles: doc.instagramTiles
            .map((tile) => resolveContentImage(tile))
            .filter((tile): tile is ContentImage => Boolean(tile)),
        }
      : {}),
  } as Partial<EventsHubContent>;
}

export async function getSanityEventsSubPage(slug: string): Promise<Partial<EventsSubPageContent> | null> {
  const doc = await sanityClient.fetch<(Record<string, unknown> & { blocks?: Array<Record<string, unknown>> }) | null>(
    /* groq */ `
    *[_type == "eventsSubPage" && slug == $slug][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'Events at El Ranchero')},
      heroTitle, heroParagraphs, heroButton{text, href},
      ${EVENTS_BLOCKS_PROJECTION},
      moreHeading, moreIntro, moreTone, moreButton{text, href},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `,
    { slug }
  );
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    ...(doc.blocks ? { blocks: doc.blocks.map(withResolvedImage) } : {}),
  } as Partial<EventsSubPageContent>;
}

// ─── Menu pages ──────────────────────────────────────────────────────────────
// /menu → `menuHubContent`, /menu/<slug> → `menuCategoryPage`, shared bottom
// sections → `menuPagesContent`.

type RawMenuDoc = Record<string, unknown> & {
  featuredDishes?: Array<Record<string, unknown>>;
  blocks?: Array<Record<string, unknown>>;
};

const withResolvedImage = <T extends Record<string, unknown>>(item: T) => ({
  ...item,
  image: resolveContentImage(item.image as FetchedImage | null),
});

export async function getSanityMenuHub(): Promise<Partial<MenuHubContent> | null> {
  const doc = await sanityClient.fetch<RawMenuDoc | null>(/* groq */ `
    *[_type == "menuHubContent" && _id == "singleton-menu-hub"][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'El Ranchero menu')},
      heroTitle, heroParagraphs, heroActions[]{text, href, variant},
      categoriesTitle, categoriesSubtitle,
      breakfastHeading, breakfastParagraphs,
      ${IMAGE_PROJECTION('breakfastImage', 'Breakfast at El Ranchero')},
      featuredTitle,
      featuredDishes[]{title, paragraphs, href, ${IMAGE_PROJECTION('image', 'Dish at El Ranchero')}},
      meatHeading, meatIntro, meatNote,
      orderTitle, orderSubtitle
    }
  `);
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    breakfastImage: resolveContentImage(doc.breakfastImage as FetchedImage | null),
    ...(doc.featuredDishes ? { featuredDishes: doc.featuredDishes.map(withResolvedImage) } : {}),
  } as Partial<MenuHubContent>;
}

export async function getSanityMenuCategoryPage(slug: string): Promise<Partial<MenuCategoryPageContent> | null> {
  const doc = await sanityClient.fetch<RawMenuDoc | null>(
    /* groq */ `
    *[_type == "menuCategoryPage" && slug == $slug][0]{
      seoTitle, seoDescription,
      ${IMAGE_PROJECTION('heroImage', 'El Ranchero menu')},
      heroTagline, heroTitle, heroParagraphs, heroActions[]{text, href, variant},
      blocks[]{
        _type, anchor, tone, title, intro, menuSection, heading, note,
        paragraphs, bullets, afterBullets, motif,
        ${IMAGE_PROJECTION('image', 'El Ranchero')}
      },
      orderTitle, orderSubtitle, moreTitle, moreSubtitle, moreCta{text, href}
    }
  `,
    { slug }
  );
  if (!doc) return null;
  return {
    ...doc,
    heroImage: resolveContentImage(doc.heroImage as FetchedImage | null),
    ...(doc.blocks ? { blocks: doc.blocks.map(withResolvedImage) } : {}),
  } as Partial<MenuCategoryPageContent>;
}

export async function getSanityMenuShared(): Promise<Partial<MenuSharedContent> | null> {
  return sanityClient.fetch(/* groq */ `
    *[_type == "menuPagesContent" && _id == "singleton-menu-pages"][0]{
      orderLocations[]{name, address, buttonText, buttonHref},
      footnoteBefore, footnoteLink{text, href}, footnoteAfter,
      allergyTitle, allergyDescription
    }
  `);
}

// ─── Navigation ──────────────────────────────────────────────────────────────

type FetchedNavSubLink = {
  text?: string;
  href?: string;
  description?: string;
  image?: FetchedImage | null;
};

type FetchedNavColumn = {
  title?: string;
  links?: FetchedNavSubLink[] | null;
};

type FetchedNavLink = FetchedNavSubLink & {
  links?: FetchedNavSubLink[] | null;
  columns?: FetchedNavColumn[] | null;
};

type FetchedNavigationContent = Omit<NavigationContent, 'header' | 'footer'> & {
  header?: {
    links?: FetchedNavLink[] | null;
    actions?: NavigationContent['header']['actions'];
    phone?: NavigationContent['header']['phone'];
  } | null;
  footer?: NavigationContent['footer'] | null;
};

const NAV_IMAGE_PROJECTION = /* groq */ `
  "image": select(defined(image.asset) => {
    "src": image.asset->url,
    "alt": coalesce(image.alt, ""),
    "crop": image.crop,
    "hotspot": image.hotspot,
    "asset": image.asset
  }, null)
`;

const NAV_SUB_LINK_PROJECTION = /* groq */ `
  text,
  href,
  description,
  ${NAV_IMAGE_PROJECTION}
`;

const NAVIGATION_QUERY = /* groq */ `
  {
    "header": *[_type == "siteNavigation" && _id == "singleton-navigation"][0] {
      "links": links[] {
        ${NAV_SUB_LINK_PROJECTION},
        "links": subLinks[] {
          ${NAV_SUB_LINK_PROJECTION}
        },
        "columns": columns[] {
          title,
          "links": links[] {
            ${NAV_SUB_LINK_PROJECTION}
          }
        }
      },
      "actions": actions[] { variant, text, href },
      phone
    },
    "footer": *[_type == "siteFooter" && _id == "singleton-footer"][0] {
      "links": columns[] {
        title,
        "links": links[] { text, href }
      },
      "secondaryLinks": secondaryLinks[] { text, href },
      "socialLinks": socialLinks[] { ariaLabel, icon, href },
      footNote
    }
  }
`;

function normalizeNavSubLink(link: FetchedNavSubLink | null | undefined): NavSubLink | null {
  if (!link?.text || !link.href) return null;
  const image = resolveContentImage(link.image);
  return {
    text: normalizeWebsiteCopy(link.text),
    href: link.href,
    ...(link.description ? { description: normalizeWebsiteCopy(link.description) } : {}),
    ...(image ? { image: { ...image, alt: normalizeWebsiteCopy(image.alt) } } : {}),
  };
}

function normalizeNavLink(link: FetchedNavLink | null | undefined): NavLink | null {
  if (!link?.text) return null;
  const image = resolveContentImage(link.image);
  const links = (link.links ?? [])
    .map(normalizeNavSubLink)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const columns = (link.columns ?? [])
    .map((column) => ({
      title: column?.title ? normalizeWebsiteCopy(column.title) : '',
      links: (column?.links ?? [])
        .map(normalizeNavSubLink)
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    }))
    .filter((column) => column.title && column.links.length);

  return {
    text: normalizeWebsiteCopy(link.text),
    ...(link.href ? { href: link.href } : {}),
    ...(link.description ? { description: normalizeWebsiteCopy(link.description) } : {}),
    ...(image ? { image: { ...image, alt: normalizeWebsiteCopy(image.alt) } } : {}),
    ...(links.length ? { links } : {}),
    ...(columns.length ? { columns } : {}),
  };
}

function normalizeFooter(footer: NavigationContent['footer']): NavigationContent['footer'] {
  return {
    links: footer.links.map((column) => ({
      title: normalizeWebsiteCopy(column.title),
      links: column.links.map((link) => ({ ...link, text: normalizeWebsiteCopy(link.text) })),
    })),
    secondaryLinks: footer.secondaryLinks.map((link) => ({ ...link, text: normalizeWebsiteCopy(link.text) })),
    socialLinks: footer.socialLinks.map((link) => ({ ...link, ariaLabel: normalizeWebsiteCopy(link.ariaLabel) })),
    footNote: normalizeWebsiteCopy(footer.footNote),
  };
}

export async function getSanityNavigationContent(): Promise<NavigationContent> {
  const nav = await sanityClient.fetch<FetchedNavigationContent>(NAVIGATION_QUERY);
  if (!nav.header || !nav.footer) {
    throw new Error('Sanity navigation/footer singletons are not published yet.');
  }

  return {
    header: {
      links: (nav.header?.links ?? [])
        .map(normalizeNavLink)
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      actions: (nav.header?.actions ?? []).map((action) => ({
        ...action,
        ...(action.text ? { text: normalizeWebsiteCopy(action.text) } : {}),
      })),
      ...(nav.header?.phone
        ? { phone: { ...nav.header.phone, text: normalizeWebsiteCopy(nav.header.phone.text) } }
        : {}),
    },
    footer: normalizeFooter(nav.footer),
  };
}

// ─── Menu ────────────────────────────────────────────────────────────────────
// Menu copy is rendered exactly as written in Sanity (accents like "Niño" and
// "jalapeño" matter here), so it does not go through normalizeWebsiteCopy.

type FetchedMenuCategory = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  order?: number;
  hubSpan?: number;
  image?: FetchedImage | null;
  exploreMoreImage?: FetchedImage | null;
};

type FetchedMenuItem = {
  _id: string;
  title?: string;
  slug?: string;
  description?: string;
  badge?: string;
  note?: string;
  image?: FetchedImage | null;
  placements?: Array<{ categoryId?: string; section?: string; order?: number }> | null;
};

type FetchedMenuContent = {
  categories?: FetchedMenuCategory[] | null;
  items?: FetchedMenuItem[] | null;
};

const MENU_QUERY = /* groq */ `
  {
    "categories": *[_type == "menuCategory" && showOnFullMenu != false && defined(slug.current)] | order(coalesce(order, 0) asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "order": coalesce(order, 0),
      hubSpan,
      ${IMAGE_PROJECTION('image', 'Menu category')},
      ${IMAGE_PROJECTION('exploreMoreImage', 'Menu category')}
    },
    "items": *[_type == "menuItem" && isAvailable != false && defined(title)] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      badge,
      note,
      "image": select(defined(photo.asset) => {
        "src": photo.asset->url,
        "alt": coalesce(photo.alt, title),
        "crop": photo.crop,
        "hotspot": photo.hotspot,
        "asset": photo.asset
      }, null),
      "placements": categoryPlacements[defined(category._ref)][] {
        "categoryId": category._ref,
        "section": coalesce(section, "main"),
        "order": coalesce(order, 0)
      }
    }
  }
`;

/** Blank line = new paragraph. Returns a plain string when there is only one. */
function splitParagraphs(text: string): string | string[] {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : (parts[0] ?? '');
}

function normalizeMenuItem(item: FetchedMenuItem, section: string): MenuItem | null {
  if (!item.title?.trim()) return null;
  const image = resolveContentImage(item.image);
  const description = item.description?.trim() ? splitParagraphs(item.description) : undefined;
  return {
    title: item.title.trim(),
    section,
    ...(item.slug ? { slug: item.slug } : {}),
    ...(description ? { description } : {}),
    ...(item.badge?.trim() ? { badge: item.badge.trim() } : {}),
    ...(item.note?.trim() ? { note: item.note.trim() } : {}),
    ...(image ? { image } : {}),
  };
}

export async function getSanityMenuCategories(): Promise<MenuCategory[]> {
  const content = await sanityClient.fetch<FetchedMenuContent>(MENU_QUERY);
  const categories = (content.categories ?? []).filter((category) => category._id && category.title);
  const items = content.items ?? [];

  return categories.map((category) => {
    const categoryItems = items
      .flatMap((item) =>
        (item.placements ?? [])
          .filter((placement) => placement.categoryId === category._id)
          .map((placement) => ({ item, section: placement.section || 'main', order: placement.order ?? 0 }))
      )
      .map(({ item, section, order }) => {
        const normalized = normalizeMenuItem(item, section);
        return normalized ? { ...normalized, order } : null;
      })
      .filter((item): item is MenuItem & { order: number } => Boolean(item))
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      .map(({ order: _order, ...item }) => item);

    const title = category.title!.trim();
    const image = resolveContentImage(category.image);
    const exploreMoreImage = resolveContentImage(category.exploreMoreImage);

    return {
      title,
      slug: category.slug,
      href: category.slug ? `/menu/${category.slug}` : undefined,
      ...(category.description ? { description: category.description.trim() } : {}),
      hubSpan: category.hubSpan === 6 ? 6 : 4,
      ...(image ? { image: { ...image, alt: image.alt === 'Menu category' ? title : image.alt } } : {}),
      ...(exploreMoreImage
        ? {
            exploreMoreImage: {
              ...exploreMoreImage,
              alt: exploreMoreImage.alt === 'Menu category' ? title : exploreMoreImage.alt,
            },
          }
        : {}),
      items: categoryItems,
    } satisfies MenuCategory;
  });
}

// ─── Meat options ("Choose Your Meat") ───────────────────────────────────────

const MEAT_OPTIONS_QUERY = /* groq */ `
  *[_type == "meatOption" && isAvailable != false && defined(name)] | order(coalesce(order, 0) asc, name asc) {
    name,
    description
  }
`;

export async function getSanityMeatOptions(): Promise<MeatOption[]> {
  const docs = await sanityClient.fetch<Array<{ name?: string; description?: string }>>(MEAT_OPTIONS_QUERY);
  return (docs ?? [])
    .filter((doc) => doc.name?.trim())
    .map((doc) => ({ name: doc.name!.trim(), description: doc.description?.trim() ?? '' }));
}

type SanityMarkDef = {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
};

type SanitySpan = {
  _type: string;
  _key?: string;
  text?: string;
  marks?: string[];
};

type SanityPortableBlock = {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: SanitySpan[];
  markDefs?: SanityMarkDef[];
  // image fields
  src?: string;
  alt?: string;
  caption?: string;
  // table fields
  headerRow?: string[];
  rows?: Array<{ _key?: string; cells?: string[] }>;
  // callout fields (projected as calloutType from the "type" Sanity field)
  calloutType?: string;
  text?: string;
  // button fields
  href?: string;
  variant?: 'ghost-light' | 'primary';
  // FAQ fields
  title?: string;
  items?: Array<{ _key?: string; question?: string; answer?: string }>;
} & SanityImageFields;

type SanityBlogPost = Omit<BlogPost, 'image' | 'relatedPages' | 'body' | 'contentBlocks'> & {
  image?: ContentImage;
  relatedPages?: string[] | null;
  body?: SanityPortableBlock[] | null;
  metaTitle?: string;
  metaDescription?: string;
};

function portableBlockText(block: SanityPortableBlock): string {
  return Array.isArray(block.children) ? block.children.map((child) => child.text ?? '').join('') : '';
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function spansToHtml(children: SanitySpan[] | undefined, markDefs: SanityMarkDef[] | undefined): string {
  if (!Array.isArray(children)) return '';
  const defsMap = new Map((markDefs ?? []).map((d) => [d._key, d]));

  return children
    .map((span) => {
      if (span._type !== 'span') return '';
      let html = escapeHtml(span.text ?? '');
      for (const mark of span.marks ?? []) {
        const def = defsMap.get(mark);
        if (def?._type === 'link') {
          const targetAttr = def.blank !== false ? ' target="_blank" rel="noopener noreferrer"' : '';
          html = `<a href="${escapeHtml(def.href ?? '')}"${targetAttr}>${html}</a>`;
        } else if (mark === 'strong') {
          html = `<strong>${html}</strong>`;
        } else if (mark === 'em') {
          html = `<em>${html}</em>`;
        } else if (mark === 'underline') {
          html = `<u>${html}</u>`;
        } else if (mark === 'strike-through') {
          html = `<s>${html}</s>`;
        } else if (mark === 'code') {
          html = `<code>${html}</code>`;
        }
      }
      return html;
    })
    .join('');
}

function portableTextToContentBlocks(body: SanityPortableBlock[] | null | undefined): BlogContentBlock[] {
  if (!Array.isArray(body)) return [];

  const result: BlogContentBlock[] = [];

  // Buffer for consecutive list items of the same type
  let listBuffer: { _key: string; html: string; level: number }[] = [];
  let listType: 'bullet' | 'number' | null = null;
  let listStartKey = '';

  function flushList() {
    if (!listBuffer.length || !listType) return;
    result.push({ _type: 'list', _key: `list-${listStartKey}`, listType, items: listBuffer });
    listBuffer = [];
    listType = null;
    listStartKey = '';
  }

  body.forEach((block, index) => {
    const key = block._key || `block-${index}`;

    // ── CTA button ────────────────────────────────────────────────────────────
    if (block._type === 'ctaButton' || block._type === 'button') {
      flushList();
      if (!block.text?.trim() || !block.href?.trim()) return;
      result.push({
        _type: 'button',
        _key: key,
        text: block.text.trim(),
        href: block.href.trim(),
        variant: block.variant === 'ghost-light' ? 'ghost-light' : 'primary',
      });
      return;
    }

    // ── FAQ section ───────────────────────────────────────────────────────────
    if (block._type === 'faq') {
      flushList();
      const items = (block.items ?? [])
        .filter((item) => item.question?.trim() && item.answer?.trim())
        .map((item) => ({
          _key: item._key,
          question: item.question!.trim(),
          answer: item.answer!.trim(),
        }));
      if (!items.length) return;
      result.push({
        _type: 'faq',
        _key: key,
        ...(block.title?.trim() ? { title: block.title.trim() } : {}),
        items,
      });
      return;
    }

    // ── Image ─────────────────────────────────────────────────────────────────
    if (block._type === 'image') {
      flushList();
      const image = resolveContentImage({
        src: block.src,
        alt: block.alt,
        crop: block.crop,
        hotspot: block.hotspot,
        asset: block.asset,
      });
      if (!image?.src) return;
      const caption = typeof block.caption === 'string' ? block.caption.trim() : '';
      result.push({ _type: 'image', _key: key, image, ...(caption ? { caption } : {}) });
      return;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    if (block._type === 'table') {
      flushList();
      let headerRow = (block.headerRow ?? []).filter(Boolean);
      let rows = block.rows ?? [];
      if (headerRow.length < 2 && rows[0]?.cells && rows[0].cells.length >= 2) {
        headerRow = rows[0].cells;
        rows = rows.slice(1);
      }
      if (headerRow.length < 2) return;
      result.push({
        _type: 'table',
        _key: key,
        ...(block.caption ? { caption: block.caption } : {}),
        headerRow,
        rows: rows.map((row, ri) => ({
          _key: row._key || `row-${ri}`,
          cells: row.cells ?? [],
        })),
      });
      return;
    }

    // ── Callout ───────────────────────────────────────────────────────────────
    if (block._type === 'callout') {
      flushList();
      if (!block.text?.trim()) return;
      const calloutType = (['tip', 'info', 'warning', 'note'] as const).includes(
        block.calloutType as 'tip' | 'info' | 'warning' | 'note'
      )
        ? (block.calloutType as 'tip' | 'info' | 'warning' | 'note')
        : 'note';
      result.push({ _type: 'callout', _key: key, calloutType, text: block.text.trim() });
      return;
    }

    // ── Standard block ────────────────────────────────────────────────────────
    if (block._type !== 'block') return;

    const text = portableBlockText(block).trim();
    if (!text) return;

    const html = spansToHtml(block.children, block.markDefs) || escapeHtml(text);

    // Headings
    if (block.style === 'h1' || block.style === 'h2') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 2, text });
      return;
    }
    if (block.style === 'h3' || block.style === 'h4') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 3, text });
      return;
    }

    // List items
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      if (listType !== block.listItem) {
        flushList();
        listType = block.listItem;
        listStartKey = key;
      }
      listBuffer.push({ _key: key, html, level: block.level ?? 1 });
      return;
    }

    // Paragraph / blockquote
    flushList();
    result.push({
      _type: 'paragraph',
      _key: key,
      text,
      html,
      ...(block.style === 'blockquote' ? { quote: true } : {}),
    });
  });

  flushList();
  return result;
}

function portableTextToParagraphs(body: SanityPortableBlock[] | null | undefined): string[] {
  return portableTextToContentBlocks(body)
    .filter((block): block is Extract<BlogContentBlock, { _type: 'paragraph' }> => block._type === 'paragraph')
    .map((block) => block.text); // plain text only — used for excerpts and lead paragraphs
}

function normalizeBlogPost(post: SanityBlogPost): BlogPost {
  const contentBlocks = portableTextToContentBlocks(post.body);
  const body = portableTextToParagraphs(post.body);
  const excerpt = post.excerpt || body[0] || '';
  const metaTitle = post.metaTitle || post.meta?.title || post.title;
  const metaDescription = post.metaDescription || post.meta?.description || excerpt;
  return {
    title: post.title,
    slug: post.slug,
    excerpt,
    publishDate: post.publishDate,
    author: post.author,
    image: resolveContentImage(post.image as FetchedImage | undefined),
    relatedPages: (post.relatedPages ?? []).map((key) => key.replace(/^\/+/, '')).filter(Boolean),
    meta: {
      title: metaTitle,
      description: metaDescription,
    },
    heroParagraphs: body.slice(0, 2),
    sections:
      body.length > 2
        ? [
            {
              _type: 'editorialSection',
              heading: post.title,
              paragraphs: body.slice(2),
            },
          ]
        : [],
    ctaBanner: {
      title: 'Hungry? Order From El Ranchero',
      subtitle: 'Explore our menu, then order for pickup from Wahiawa or Kapolei.',
      ctaText: PRIMARY_CTA_LABEL,
      ctaHref: PRIMARY_CTA_HREF,
    },
    body,
    contentBlocks,
  };
}

const BLOG_POST_CARD_PROJECTION = /* groq */ `
  title,
  "slug": slug.current,
  "metaTitle": coalesce(metaTitle, meta.title, title, ""),
  "metaDescription": coalesce(metaDescription, meta.description, excerpt, ""),
  excerpt,
  publishDate,
  author,
  "image": {
    "src": coalesce(image.asset->url, imageUrl, ""),
    "alt": coalesce(image.alt, imageAlt, title),
    "crop": image.crop,
    "hotspot": image.hotspot,
    "asset": image.asset
  },
  relatedPages
`;

const BLOG_POST_PROJECTION = /* groq */ `
  ${BLOG_POST_CARD_PROJECTION},
  body[] {
    ...,
    _type == "image" => {
      ...,
      "src": asset->url,
      "alt": coalesce(alt, ""),
      caption,
      crop,
      hotspot,
      asset
    },
    _type == "callout" => {
      _type,
      _key,
      "calloutType": type,
      text
    },
    _type == "table" => {
      _type,
      _key,
      caption,
      headerRow,
      "rows": rows[] { _key, cells }
    },
    _type == "ctaButton" => {
      _type,
      _key,
      text,
      href,
      variant
    },
    _type == "faq" => {
      _type,
      _key,
      title,
      "items": items[] { _key, question, answer }
    }
  }
`;

const BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(publishDate desc) {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

const BLOG_POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${BLOG_POST_PROJECTION}
  }
`;

const BLOG_POSTS_RELATED_TO_QUERY = /* groq */ `
  *[_type == "blogPost" && defined(slug.current) && $pageSlug in relatedPages] | order(publishDate desc) [0...3] {
    ${BLOG_POST_CARD_PROJECTION}
  }
`;

export async function getSanityBlogPosts(): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_QUERY);
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

export async function getSanityBlogPost(slug: string): Promise<BlogPost | null> {
  const post = await sanityClient.fetch<SanityBlogPost | null>(BLOG_POST_BY_SLUG_QUERY, { slug });
  if (!post?.slug || !post.title) return null;
  return normalizeBlogPost(post);
}

export async function getSanityBlogPostsRelatedTo(pageSlug: string): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<SanityBlogPost[]>(BLOG_POSTS_RELATED_TO_QUERY, { pageSlug });
  return (posts ?? []).filter((post) => post?.slug && post?.title).map(normalizeBlogPost);
}

const BLOG_POST_SLUGS_QUERY = /* groq */ `
  *[_type == "blogPost" && !(_id in path("drafts.**")) && defined(slug.current)].slug.current
`;

export interface SitemapContentEntry {
  path: string;
  lastmod?: string;
}

const SITEMAP_BLOG_POSTS_QUERY = /* groq */ `
  *[_type == "blogPost" && !(_id in path("drafts.**")) && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt,
    publishDate
  }
`;

/** Published blog URLs for the sitemap. Drafts stay out; lastmod follows the latest publish edit. */
export async function getSanitySitemapContent(): Promise<SitemapContentEntry[]> {
  const blogs = await sanityClient.fetch<Array<{ slug: string; _updatedAt?: string; publishDate?: string }>>(
    SITEMAP_BLOG_POSTS_QUERY
  );

  const entries: SitemapContentEntry[] = [];
  for (const post of blogs ?? []) {
    if (!post?.slug) continue;
    const cleanSlug = post.slug.replace(/^\/+/, '');
    const dateStr = post._updatedAt || post.publishDate;
    entries.push({
      path: `/blog/${cleanSlug}`,
      lastmod: dateStr ? dateStr.slice(0, 10) : undefined,
    });
  }
  return entries;
}

export async function getSanityBlogPostSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[]>(BLOG_POST_SLUGS_QUERY);
  return (slugs ?? []).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const TESTIMONIALS_QUERY = /* groq */ `
  *[_type == "testimonial" && defined(quote) && defined(name)] | order(coalesce(order, 0) asc, name asc) {
    _id,
    quote,
    name,
    location,
    platform,
    order
  }
`;

type SanityTestimonial = {
  _id: string;
  quote?: string;
  name?: string;
  location?: string;
  platform?: string;
  order?: number;
};

function normalizeTestimonial(doc: SanityTestimonial): Testimonial | null {
  if (!doc?._id || !doc.quote?.trim() || !doc.name?.trim()) return null;
  return {
    _id: doc._id,
    quote: doc.quote.trim(),
    name: doc.name.trim(),
    location: doc.location?.trim() || undefined,
    platform: doc.platform === 'yelp' ? 'yelp' : 'google',
    order: typeof doc.order === 'number' ? doc.order : 0,
  };
}

export async function getSanityTestimonials(): Promise<Testimonial[]> {
  const docs = await sanityClient.fetch<SanityTestimonial[]>(TESTIMONIALS_QUERY);
  return (docs ?? []).map(normalizeTestimonial).filter((item): item is Testimonial => Boolean(item));
}
