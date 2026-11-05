import type { MenuCategoryPageContent, MenuHubContent, MenuSharedContent } from '../../../data/pages/menu';
import { sanityClient } from '../../sanity/client';
import { resolveContentImage } from '../../sanity/image';
import type { MenuCategory, MenuItem, MeatOption } from '../types';
import { type FetchedImage, IMAGE_PROJECTION, withResolvedImage } from './shared';

// ─── Menu pages ──────────────────────────────────────────────────────────────
// /menu → `menuHubContent`, /menu/<slug> → `menuCategoryPage`, shared bottom
// sections → `menuPagesContent`.

type RawMenuDoc = Record<string, unknown> & {
  featuredDishes?: Array<Record<string, unknown>>;
  blocks?: Array<Record<string, unknown>>;
};

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
