// ─── Shared primitives ────────────────────────────────────────────────────────

export interface ContentImage {
  src: string;
  alt: string;
}

export interface HomepageImages {
  hero?: ContentImage;
  localSourcing?: ContentImage;
  locations?: ContentImage;
}

export interface AboutImages {
  hero?: ContentImage;
  story?: ContentImage;
  sustainability?: ContentImage;
  vendors?: ContentImage;
}

export interface CateringImages {
  menu?: ContentImage;
  corporate?: ContentImage;
  officeLunch?: ContentImage;
  meetings?: ContentImage;
  events?: ContentImage;
  largeGroups?: ContentImage;
}

export interface LocationImages {
  directory?: ContentImage;
  kailua?: ContentImage;
  kahala?: ContentImage;
  kaneohe?: ContentImage;
  kapolei?: ContentImage;
  mililani?: ContentImage;
  pearlridge?: ContentImage;
}

export interface IngredientsImages {
  hero?: ContentImage;
  freshLocalProduce?: ContentImage;
}

export interface MenuPagesImages {
  // Menu Hub
  menuHubHero?: ContentImage;
  // Salads
  saladsHero?: ContentImage;
  saladsIngredients?: ContentImage;
  // Wraps & Subs
  wrapsHero?: ContentImage;
  wrapsIngredients?: ContentImage;
  // Soups
  soupsHero?: ContentImage;
  soupsIngredients?: ContentImage;
  // Drinks
  drinksHero?: ContentImage;
  drinksIngredients?: ContentImage;
  // Vegan
  veganIngredients?: ContentImage;
  // Vegetarian
  vegetarianHero?: ContentImage;
  vegetarianIngredients?: ContentImage;
  // Healthy Options
  healthyOptionsHero?: ContentImage;
  healthyOptionsIngredients?: ContentImage;
  // Kids
  kidsIngredients?: ContentImage;
  // Design Your Own
  designYourOwnHero?: ContentImage;
  designYourOwnBuild?: ContentImage;
  designYourOwnQuality?: ContentImage;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavSubLink {
  text: string;
  href: string;
  description?: string;
  image?: ContentImage;
}

export interface NavColumn {
  title: string;
  links: NavSubLink[];
}

export interface NavLink {
  text: string;
  href?: string;
  description?: string;
  image?: ContentImage;
  links?: NavSubLink[];
  columns?: NavColumn[];
}

export interface NavPhone {
  text: string;
  href: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  ariaLabel: string;
  icon: string;
  href: string;
}

export interface NavigationContent {
  header: {
    links: NavLink[];
    actions: { variant?: string; text?: string; href?: string }[];
    phone?: NavPhone;
  };
  footer: {
    links: FooterColumn[];
    secondaryLinks: FooterLink[];
    socialLinks: SocialLink[];
    footNote: string;
  };
}

// ─── Menu ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  title: string;
  slug?: string;
  description?: string;
  badge?: string;
  note?: string;
  image?: ContentImage;
}

export interface MenuCategory {
  title: string;
  slug?: string;
  href?: string;
  description?: string;
  items: MenuItem[];
}

// ─── Shared CMS sections (blog articles) ───────────────────────────────────────

export interface InfoCardItem {
  title: string;
  description: string;
  icon?: string;
}

export interface TimelineStep {
  title: string;
  description: string;
  icon: string;
}

// ─── Shared CMS sections ───────────────────────────────────────────────────────

export interface LinkedCardItem {
  title: string;
  description: string;
  href: string;
  linkText: string;
}

export interface CtaBannerContent {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  showAfterHoursNote?: boolean;
  extraLines?: string[];
  license?: string;
}

export interface IconPointsSection {
  _type: 'iconPointsSection';
  heading: string;
  intro?: string;
  layout?: 'auto' | 'grid' | 'band';
  items: InfoCardItem[];
}

export interface TimelineSection {
  _type: 'timelineSection';
  heading: string;
  intro?: string;
  steps: TimelineStep[];
}

export interface LinkedCardsSection {
  _type: 'linkedCardsSection';
  heading: string;
  intro?: string;
  display?: 'cards' | 'directory';
  items: LinkedCardItem[];
}

export interface InfoCardsSection {
  _type: 'infoCardsSection';
  heading: string;
  intro?: string;
  items: InfoCardItem[];
}

export interface EditorialSection {
  _type: 'editorialSection';
  heading: string;
  paragraphs: string[];
}

export interface ComparisonRow {
  feature: string;
  cell1: string;
  cell2: string;
  cell3?: string;
}

export interface ComparisonTableSection {
  _type: 'comparisonTableSection';
  heading: string;
  intro?: string;
  featureLabel: string;
  column1: string;
  column2: string;
  column3?: string;
  rows: ComparisonRow[];
}

export interface BulletCardItem {
  title: string;
  items: string[];
}

export interface BulletCardsSection {
  _type: 'bulletCardsSection';
  heading: string;
  intro?: string;
  items: BulletCardItem[];
}

export interface ChecklistSection {
  _type: 'checklistSection';
  heading: string;
  intro?: string;
  items: Array<{ text: string }>;
}

export interface YelpReviewItem {
  name: string;
  reviewId: string;
  userId: string;
}

export interface YelpReviewsSection {
  _type: 'yelpReviewsSection';
  heading: string;
  intro?: string;
  items?: YelpReviewItem[];
}

export interface LiveReviewsSection {
  _type: 'liveReviewsSection';
  heading: string;
  intro?: string;
  sources?: 'both' | 'google' | 'yelp';
}

export interface SplitContentSection {
  _type: 'splitContentSection';
  heading: string;
  paragraphs: string[];
  ctaText?: string;
  ctaHref?: string;
  linkText?: string;
  linkHref?: string;
  image?: ContentImage;
  imagePlaceholder?: string;
  isReversed?: boolean;
}

export interface QuoteCardItem {
  name: string;
  quote: string;
}

export interface QuoteCardsSection {
  _type: 'quoteCardsSection';
  heading: string;
  intro?: string;
  items: QuoteCardItem[];
}

export type ServiceSection = (
  | IconPointsSection
  | TimelineSection
  | LinkedCardsSection
  | InfoCardsSection
  | EditorialSection
  | ComparisonTableSection
  | BulletCardsSection
  | ChecklistSection
  | YelpReviewsSection
  | LiveReviewsSection
  | SplitContentSection
  | QuoteCardsSection
) & { surface?: 'white' | 'grey' | 'dark' };

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  author?: string;
  image?: ContentImage;
  imagePlaceholder?: string;
  meta: {
    title: string;
    description: string;
  };
  /** Page paths (no leading slash) where this post should appear in Related blogs. */
  relatedPages: string[];
  heroParagraphs: string[];
  sections: ServiceSection[];
  ctaBanner: CtaBannerContent;
  /** Fallback plain paragraphs when a CMS post has no structured sections. */
  body: string[];
  /** Article body in document order, including inline images from Sanity. */
  contentBlocks?: BlogContentBlock[];
}

export type BlogContentBlock =
  | BlogContentParagraph
  | BlogContentHeading
  | BlogContentImage
  | BlogContentList
  | BlogContentTable
  | BlogContentCallout;

export interface BlogContentParagraph {
  _type: 'paragraph';
  _key: string;
  /** Plain text — used for excerpts, lead paragraphs, and TOC. */
  text: string;
  /** HTML string with inline formatting (bold, italic, links). Use set:html to render. */
  html: string;
  quote?: boolean;
}

export interface BlogContentHeading {
  _type: 'heading';
  _key: string;
  level: 2 | 3;
  text: string;
}

export interface BlogContentImage {
  _type: 'image';
  _key: string;
  image: ContentImage;
  caption?: string;
}

export interface BlogContentList {
  _type: 'list';
  _key: string;
  listType: 'bullet' | 'number';
  items: BlogContentListItem[];
}

export interface BlogContentListItem {
  _key: string;
  /** HTML string with inline formatting. Use set:html to render. */
  html: string;
  level: number;
}

export interface BlogContentTable {
  _type: 'table';
  _key: string;
  caption?: string;
  headerRow: string[];
  rows: { _key: string; cells: string[] }[];
}

export interface BlogContentCallout {
  _type: 'callout';
  _key: string;
  calloutType: 'tip' | 'info' | 'warning' | 'note';
  text: string;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  age?: number;
  location?: string;
  tenure: string;
  order: number;
}
