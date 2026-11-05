import type { HomepageContent } from '../../../data/pages/homepage';
import type { BlogIndexContent, ContactPageContent, OrderOnlineContent } from '../../../data/pages/sitePages';
import type { LegalPageContent } from '../../../data/pages/legal';
import type { ReviewsContent } from '../../../data/pages/reviews';
import type { AboutContent } from '../../../data/pages/about';
import type { LocationsHubContent, LocationsSubPageContent } from '../../../data/pages/locations';
import type { EventsHubContent, EventsSubPageContent } from '../../../data/pages/events';
import type { CateringHubContent, CateringSubPageContent } from '../../../data/pages/catering';
import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { ContentImage } from '../types';
import { type FetchedImage, IMAGE_PROJECTION, withResolvedImage } from './shared';

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
  const doc = await sanityClient.fetch<
    (Record<string, unknown> & { cards?: Array<Record<string, unknown>> }) | null
  >(/* groq */ `
    *[_type == "orderOnlineContent" && _id == "singleton-order-online"][0]{
      seoTitle, seoDescription, heroTitle, heroParagraphs, chooseTitle,
      cards[]{ ${LOCATION_CARD_PROJECTION} },
      note, phoneHeading, phoneText, phoneButtons[]{text, href, variant},
      ctaTitle, ctaSubtitle, ctaButton{text, href}
    }
  `);
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
  const doc = await sanityClient.fetch<
    (Record<string, unknown> & { blocks?: Array<Record<string, unknown>> }) | null
  >(/* groq */ `
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
  `);
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
