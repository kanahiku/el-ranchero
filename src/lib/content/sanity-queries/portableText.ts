import { resolveContentImage, type SanityImageFields } from '../../sanity/image';
import type { BlogContentBlock, BlogPost, ContentImage } from '../types';

export type SanityMarkDef = {
  _type: string;
  _key: string;
  href?: string;
  blank?: boolean;
};

export type SanitySpan = {
  _type: string;
  _key?: string;
  text?: string;
  marks?: string[];
};

export type SanityPortableBlock = {
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
  // Yelp embed fields
  reviewId?: string;
  reviewerName?: string;
  reviewerUrl?: string;
  reviewUrl?: string;
  businessName?: string;
  businessUrl?: string;
} & SanityImageFields;

export type SanityBlogPost = Omit<BlogPost, 'image' | 'relatedPages' | 'body' | 'contentBlocks'> & {
  image?: ContentImage;
  relatedPages?: string[] | null;
  body?: SanityPortableBlock[] | null;
  metaTitle?: string;
  metaDescription?: string;
};

export function portableBlockText(block: SanityPortableBlock): string {
  return Array.isArray(block.children) ? block.children.map((child) => child.text ?? '').join('') : '';
}

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function spansToHtml(children: SanitySpan[] | undefined, markDefs: SanityMarkDef[] | undefined): string {
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

const CTA_DIRECTIVE_REGEX =
  /^\s*(?:\((?:create a )?cta button\)|\[(?:insert )?cta button(?::\s*|\s+)?\])\s*(.*)$/i;
const FAQ_HEADING_REGEX =
  /frequently asked|faqs?$|^faq\b|what homeowners most often want to know|questions homeowners ask|common questions|questions to ask/i;
const FAQ_CONCLUSION_REGEX =
  /\b(?:these|those)\s+questions\b|^(?:in conclusion|to summarize|summary:|final thoughts|takeaway:)/i;

function detectCtaButton(
  block: SanityPortableBlock
): { text: string; href: string; variant?: 'ghost-light' | 'primary' } | null {
  if (block._type === 'button' || block._type === 'ctaButton') {
    if (block.text?.trim() && block.href?.trim()) {
      return {
        text: block.text.trim(),
        href: block.href.trim(),
        variant: block.variant === 'ghost-light' ? 'ghost-light' : 'primary',
      };
    }
    return null;
  }

  if (block._type !== 'block' || (block.style && block.style !== 'normal')) return null;
  const markDefs = block.markDefs;
  if (!markDefs?.length) return null;

  const linkDefs = new Map(
    markDefs.filter((def) => def._type === 'link' && def.href).map((def) => [def._key, def.href as string])
  );
  if (linkDefs.size === 0) return null;

  const fullText = portableBlockText(block).trim();
  if (!fullText) return null;

  const directiveMatch = fullText.match(CTA_DIRECTIVE_REGEX);
  const targetText = (directiveMatch ? directiveMatch[1] : fullText).replace(/^\[+|\]+$/g, '').trim();
  const linkSpans = (block.children ?? []).filter((child) => (child.marks ?? []).some((mark) => linkDefs.has(mark)));
  const linkText = linkSpans
    .map((child) => child.text ?? '')
    .join('')
    .replace(/^\[+|\]+$/g, '')
    .trim();

  if (linkText && (linkText === targetText || (directiveMatch && targetText.length === 0))) {
    const firstLinkMark = linkSpans.flatMap((child) => child.marks ?? []).find((mark) => linkDefs.has(mark));
    const href = firstLinkMark ? linkDefs.get(firstLinkMark) : undefined;
    if (href) return { text: linkText || targetText, href, variant: 'primary' };
  }

  return null;
}

function yelpReviewFromBlock(block: SanityPortableBlock, key: string): Extract<BlogContentBlock, { _type: 'yelpReview' }> | null {
  if (block._type === 'yelpEmbed' && block.reviewId?.trim()) {
    return {
      _type: 'yelpReview',
      _key: key,
      reviewId: block.reviewId.trim(),
      reviewerName: block.reviewerName?.trim() || 'Yelp reviewer',
      reviewerUrl: block.reviewerUrl?.trim() || 'https://www.yelp.com',
      reviewUrl: block.reviewUrl?.trim() || 'https://www.yelp.com',
      businessName: block.businessName?.trim() || 'El Ranchero',
      businessUrl: block.businessUrl?.trim() || 'https://www.yelp.com',
    };
  }

  const text = portableBlockText(block).replace(/\s+/g, ' ').trim();
  const match = text.match(/^Read (.+?)'s review of (.+?) on Yelp$/i);
  if (!match) return null;

  const hrefs = (block.markDefs ?? []).flatMap((def) => (def._type === 'link' && def.href ? [def.href] : []));
  const reviewerUrl = hrefs.find((href) => href.includes('/user_details')) ?? '';
  const reviewUrl = hrefs.find((href) => href.includes('hrid=')) ?? '';
  const businessUrl = hrefs.find((href) => href.includes('/biz/') && !href.includes('hrid=')) ?? '';
  const reviewId = reviewUrl.match(/[?&]hrid=([^&]+)/)?.[1] ?? '';
  if (!reviewId) return null;

  return {
    _type: 'yelpReview',
    _key: key,
    reviewId,
    reviewerName: match[1].trim(),
    reviewerUrl: reviewerUrl || 'https://www.yelp.com',
    reviewUrl,
    businessName: match[2].trim(),
    businessUrl: businessUrl || 'https://www.yelp.com',
  };
}

export function portableTextToContentBlocks(body: SanityPortableBlock[] | null | undefined): BlogContentBlock[] {
  if (!Array.isArray(body)) return [];

  const result: BlogContentBlock[] = [];

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

  let inFaqSection = false;
  let faqSectionStartKey = '';
  let faqSectionItems: { _key?: string; question: string; answer: string }[] = [];

  function flushFaqSection() {
    if (!faqSectionItems.length) {
      inFaqSection = false;
      return;
    }
    result.push({
      _type: 'faq',
      _key: `faq-section-${faqSectionStartKey}`,
      items: faqSectionItems,
    });
    faqSectionItems = [];
    inFaqSection = false;
    faqSectionStartKey = '';
  }

  body.forEach((block, index) => {
    const key = block._key || `block-${index}`;

    if (block._type === 'ctaButton' || block._type === 'button') {
      flushList();
      flushFaqSection();
      const button = detectCtaButton(block);
      if (button) result.push({ _type: 'button', _key: key, ...button });
      return;
    }

    if (block._type === 'faq') {
      flushList();
      flushFaqSection();
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

    if (block._type === 'image') {
      flushList();
      flushFaqSection();
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

    if (block._type === 'table') {
      flushList();
      flushFaqSection();
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

    const yelpReview = yelpReviewFromBlock(block, key);
    if (yelpReview) {
      flushList();
      flushFaqSection();
      result.push(yelpReview);
      return;
    }

    if (block._type === 'callout') {
      flushList();
      flushFaqSection();
      if (!block.text?.trim()) return;
      const calloutType = (['tip', 'info', 'warning', 'note'] as const).includes(
        block.calloutType as 'tip' | 'info' | 'warning' | 'note'
      )
        ? (block.calloutType as 'tip' | 'info' | 'warning' | 'note')
        : 'note';
      result.push({ _type: 'callout', _key: key, calloutType, text: block.text.trim() });
      return;
    }

    if (block._type !== 'block') return;

    const cta = detectCtaButton(block);
    if (cta) {
      flushList();
      flushFaqSection();
      result.push({ _type: 'button', _key: key, ...cta });
      return;
    }

    const text = portableBlockText(block).trim();
    if (!text) return;

    const html = spansToHtml(block.children, block.markDefs) || escapeHtml(text);

    if (block.style === 'h1' || block.style === 'h2') {
      flushList();
      flushFaqSection();
      result.push({ _type: 'heading', _key: key, level: 2, text });
      if (FAQ_HEADING_REGEX.test(text)) {
        inFaqSection = true;
        faqSectionStartKey = key;
      }
      return;
    }

    if (block.style === 'h3' || block.style === 'h4') {
      flushList();
      if (inFaqSection) {
        faqSectionItems.push({ _key: key, question: text, answer: '' });
        return;
      }
      result.push({ _type: 'heading', _key: key, level: block.style === 'h4' ? 4 : 3, text });
      return;
    }

    if (inFaqSection) {
      flushList();
      let hasBold = false;
      let hasNonBoldText = false;
      for (const child of block.children ?? []) {
        const marks = child.marks ?? [];
        if (marks.includes('strong')) hasBold = true;
        else if ((child.text ?? '').trim().length > 0) hasNonBoldText = true;
      }
      const isQuestion = (hasBold && !hasNonBoldText) || text.endsWith('?');
      if (isQuestion) {
        faqSectionItems.push({ _key: key, question: text, answer: '' });
        return;
      }
      if (faqSectionItems.length > 0) {
        if (FAQ_CONCLUSION_REGEX.test(text)) {
          flushFaqSection();
          result.push({
            _type: 'paragraph',
            _key: key,
            text,
            html,
            ...(block.style === 'blockquote' ? { quote: true } : {}),
          });
          return;
        }
        const last = faqSectionItems[faqSectionItems.length - 1];
        last.answer = last.answer ? `${last.answer}<br><br>${html}` : html;
        return;
      }
      result.push({
        _type: 'paragraph',
        _key: key,
        text,
        html,
        ...(block.style === 'blockquote' ? { quote: true } : {}),
      });
      return;
    }

    if (block.listItem === 'bullet' || block.listItem === 'number') {
      if (listType !== block.listItem) {
        flushList();
        listType = block.listItem;
        listStartKey = key;
      }
      listBuffer.push({ _key: key, html, level: block.level ?? 1 });
      return;
    }

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
  flushFaqSection();
  return result;
}

export function portableTextToParagraphs(body: SanityPortableBlock[] | null | undefined): string[] {
  return portableTextToContentBlocks(body)
    .filter((block): block is Extract<BlogContentBlock, { _type: 'paragraph' }> => block._type === 'paragraph')
    .map((block) => block.text); // plain text only — used for excerpts and lead paragraphs
}
