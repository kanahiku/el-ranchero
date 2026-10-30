/**
 * Reviews page copy — the seed + fallback for the Sanity `reviewsContent`
 * singleton (`singleton-reviews`). The review cards are `testimonial` documents.
 */
import { PRIMARY_CTA_HREF } from '~/config/cta';
import type { ContentImage } from '~/lib/content/types';
import type { HomeButton, HomeLink } from './homepage';

export interface ReviewsContent {
  seoTitle: string;
  seoDescription: string;
  heroImage?: ContentImage;
  heroTitle: string;
  heroParagraphs: string[];
  heroButtons: HomeButton[];
  reviewsEyebrow: string;
  reviewsHeading: string;
  reviewsIntro: string;
  reviewsFootnote: string;
  reviewsButtons: HomeButton[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: HomeLink;
}

export const reviewsDefaults: ReviewsContent = {
  seoTitle: 'Reviews | Taqueria El Ranchero',
  seoDescription: 'Read what Google and Yelp guests say about Taqueria El Ranchero in Wahiawa and Kapolei.',
  heroTitle: 'Loved Across the Island',
  heroParagraphs: [
    'Neighbors, families and visitors have been stopping by Taqueria El Ranchero since 2015. Here is what they say about the tacos, the burritos and the good times.',
  ],
  heroButtons: [
    { text: 'Order Online', href: PRIMARY_CTA_HREF, variant: 'primary' },
    { text: 'Find a Location', href: '/locations', variant: 'ghost' },
  ],
  reviewsEyebrow: 'Reviews',
  reviewsHeading: 'What our guests are saying',
  reviewsIntro: 'Real words from guests who ate with us at our Wahiawa and Kapolei restaurants.',
  reviewsFootnote: '',
  reviewsButtons: [],
  ctaTitle: 'Come See for Yourself',
  ctaSubtitle: 'Visit us in Wahiawa or Kapolei, or order your favorites online.',
  ctaButton: { text: 'Find a Location', href: '/locations' },
};
