export type ReviewSource = 'google' | 'yelp';

export interface Review {
  id: string;
  authorName: string;
  text: string;
  rating: number;
  date: string;
  source: ReviewSource;
  sourceUrl: string;
}

export interface ReviewFeed {
  reviews: Review[];
  viewAll: Partial<Record<ReviewSource, string>>;
}

export interface ReviewProviderConfig {
  apiKey: string;
  id: string;
  viewAllUrl: string;
}

export const REVIEW_FETCH_LIMITS = {
  google: 5,
  yelp: 3,
} as const;

/** Shown on the site. 3 per source so card grids stay 3 or 6, never 5. */
export const REVIEW_DISPLAY_LIMITS = {
  google: 3,
  yelp: 3,
} as const;
