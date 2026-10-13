// Singletons
import { siteNavigation } from './singletons/navigation';
import { siteFooter } from './singletons/footer';
import { homepageContent } from './singletons/homepage';
import { aboutContent } from './singletons/about';
import { cateringContent } from './singletons/catering';
import { locationsContent } from './singletons/locations';
import { eventsContent } from './singletons/events';
import { menuPagesContent } from './singletons/menuPages';
import { blogPost } from './documents/blogPost';
import { testimonial } from './documents/testimonial';
import { menuCategory } from './documents/menuCategory';
import { menuItem } from './documents/menuItem';
import { meatOption } from './documents/meatOption';

// Navigation objects
import { navLink, navSubLink } from './objects/navLink';
import { footerColumn, footerLink, socialLink } from './objects/footerColumn';

export const schemaTypes = [
  // Documents
  siteNavigation,
  siteFooter,
  homepageContent,
  aboutContent,
  cateringContent,
  locationsContent,
  eventsContent,
  menuPagesContent,
  blogPost,
  testimonial,
  menuCategory,
  menuItem,
  meatOption,

  // Objects — nav
  navLink,
  navSubLink,

  // Objects — footer
  footerColumn,
  footerLink,
  socialLink,
];
