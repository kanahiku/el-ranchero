// Singletons
import { siteNavigation } from './singletons/navigation';
import { siteFooter } from './singletons/footer';
import { homepageContent } from './singletons/homepage';
import { aboutContent } from './singletons/about';
import { cateringContent } from './singletons/catering';
import { locationsContent } from './singletons/locations';
import { ingredientsContent } from './singletons/ingredients';
import { menuPagesContent } from './singletons/menuPages';
import { blogPost } from './documents/blogPost';
import { testimonial } from './documents/testimonial';
import { menuCategory } from './documents/menuCategory';
import { menuItem } from './documents/menuItem';

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
  ingredientsContent,
  menuPagesContent,
  blogPost,
  testimonial,
  menuCategory,
  menuItem,

  // Objects — nav
  navLink,
  navSubLink,

  // Objects — footer
  footerColumn,
  footerLink,
  socialLink,
];
