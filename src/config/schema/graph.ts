import { business } from './business';
import { pages } from './pages';
import type { BreadcrumbItem, BusinessSchema, JsonLdNode, PageSchema } from './types';
import { absoluteUrl, businessId, normalizePath, siteOrigin } from './urls';

function buildWebsiteJson(entity: BusinessSchema): JsonLdNode {
  const origin = siteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: entity.name,
    publisher: { '@id': businessId(entity.idFragment) },
  };
}

function buildBusinessJson(entity: BusinessSchema): JsonLdNode {
  const origin = siteOrigin();
  const out: JsonLdNode = {
    '@context': 'https://schema.org',
    '@type': entity.businessType,
    '@id': businessId(entity.idFragment),
    name: entity.name,
    url: `${origin}/`,
    telephone: entity.telephone,
    email: entity.email,
    priceRange: entity.priceRange,
    address: { '@type': 'PostalAddress', ...entity.address },
    description: entity.description,
  };

  if (entity.openingHoursSpecification?.length) {
    out.openingHoursSpecification = entity.openingHoursSpecification;
  }
  if (entity.hasCredential?.length) out.hasCredential = entity.hasCredential;
  if (entity.memberOf) out.memberOf = entity.memberOf;
  if (entity.award?.length) out.award = entity.award;
  if (entity.sameAs?.length) out.sameAs = entity.sameAs;
  if (entity.areaServed) out.areaServed = entity.areaServed;

  return out;
}

function buildPageNodes(page: PageSchema, entity: BusinessSchema): JsonLdNode[] {
  const nodes: JsonLdNode[] = [];

  if (page.schemaType !== 'FAQOnly') {
    const main: JsonLdNode = {
      '@context': 'https://schema.org',
      '@type': page.schemaType,
      name: page.name,
      url: absoluteUrl(page.path),
      description: page.description,
    };

    if (page.schemaType === 'Service') {
      main.serviceType = page.serviceType;
      main.provider = { '@id': businessId(entity.idFragment) };
      main.areaServed = entity.areaServed || { '@type': 'AdministrativeArea', name: 'Oahu, Hawaii' };
    }

    nodes.push(main);
  }

  if (page.faq?.length) {
    nodes.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  return nodes;
}

function buildBreadcrumbJson(page: PageSchema): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: page.breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface PageFallback {
  title?: string;
  description?: string;
}

const titleCase = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Generic WebPage + breadcrumb for routes with no entry in `pages` (CMS-driven subpages). */
function buildFallbackPage(path: string, { title, description }: PageFallback): PageSchema | undefined {
  if (!title || path === '/' || path === '/404') return undefined;
  const crumbs: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];
  const parts = path.split('/').filter(Boolean);
  let acc = '';
  parts.forEach((part, i) => {
    acc += `/${part}`;
    const parent = pagesByPath.get(acc);
    crumbs.push({ name: i === parts.length - 1 ? title : (parent?.name ?? titleCase(part)), path: acc });
  });
  return { name: title, path, schemaType: 'WebPage', description: description ?? null, faq: [], breadcrumb: crumbs };
}

export function buildBlogPostingJson(post: {
  headline: string;
  description?: string;
  path: string;
  datePublished: string;
  author?: string;
  image?: string;
}): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.headline,
    description: post.description,
    url: absoluteUrl(post.path),
    mainEntityOfPage: absoluteUrl(post.path),
    datePublished: post.datePublished,
    ...(post.author ? { author: { '@type': 'Person', name: post.author } } : {}),
    ...(post.image ? { image: post.image } : {}),
    publisher: { '@id': businessId(business.idFragment) },
  };
}

const pagesByPath = new Map(pages.map((page) => [normalizePath(page.path), page]));

/**
 * JSON-LD blocks for the current request path.
 * Homepage always includes WebSite + business type; other pages emit
 * their Service/WebPage/etc. node, FAQ when present, and breadcrumbs.
 */
export function getJsonLdBlocks(pathname: string, fallback: PageFallback = {}): JsonLdNode[] {
  if (!siteOrigin()) return [];

  const path = normalizePath(pathname);
  const blocks: JsonLdNode[] = [];
  const page = pagesByPath.get(path) ?? buildFallbackPage(path, fallback);

  if (path === '/') {
    blocks.push(buildWebsiteJson(business));
    blocks.push(buildBusinessJson(business));
  }

  if (!page) return blocks;

  blocks.push(...buildPageNodes(page, business));

  if (page.breadcrumb.length > 1) {
    blocks.push(buildBreadcrumbJson(page));
  }

  return blocks;
}
