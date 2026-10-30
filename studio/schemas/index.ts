// Singletons
import { siteNavigation } from './singletons/navigation';
import { siteFooter } from './singletons/footer';
import { homepageContent } from './singletons/homepage';
import { reviewsContent } from './singletons/reviews';
import { blogIndexContent } from './singletons/blogIndex';
import { contactPageContent } from './singletons/contactPage';
import { orderOnlineContent } from './singletons/orderOnline';
import { locationCard } from './objects/locationCard';
import { aboutContent } from './singletons/about';
import { cateringContent } from './singletons/catering';
import { locationsContent } from './singletons/locations';
import { eventsContent } from './singletons/events';
import { menuPagesContent } from './singletons/menuPages';
import { cateringSubPage } from './documents/cateringSubPage';
import { cateringTextSplit, cateringMoreOptions } from './objects/cateringBlocks';
import { locationsSubPage } from './documents/locationsSubPage';
import { locationsTextSplit, locationsFavorites } from './objects/locationsBlocks';
import { legalPage } from './documents/legalPage';
import { eventsSubPage } from './documents/eventsSubPage';
import { eventsTextSplit, eventsDetailsTable, eventsInquiryForm } from './objects/eventsBlocks';
import { menuHubContent } from './singletons/menuHub';
import { menuCategoryPage } from './documents/menuCategoryPage';
import { menuDishList, menuMeatTable, menuTextSplit } from './objects/menuBlocks';
import { blogPost } from './documents/blogPost';
import { testimonial } from './documents/testimonial';
import { menuCategory } from './documents/menuCategory';
import { menuItem } from './documents/menuItem';
import { meatOption } from './documents/meatOption';

// Navigation objects
import { navLink, navSubLink } from './objects/navLink';
import { link, buttonLink } from './objects/links';
import { footerColumn, footerLink, socialLink } from './objects/footerColumn';

export const schemaTypes = [
  // Documents
  siteNavigation,
  siteFooter,
  homepageContent,
  aboutContent,
  blogIndexContent,
  contactPageContent,
  orderOnlineContent,
  reviewsContent,
  cateringContent,
  locationsContent,
  eventsContent,
  menuPagesContent,
  menuHubContent,
  menuCategoryPage,
  cateringSubPage,
  eventsSubPage,
  legalPage,
  locationsSubPage,
  blogPost,
  testimonial,
  menuCategory,
  menuItem,
  meatOption,

  // Objects — nav
  navLink,
  navSubLink,

  // Objects — menu page sections
  menuDishList,
  menuMeatTable,
  menuTextSplit,

  // Objects — catering page sections
  cateringTextSplit,
  cateringMoreOptions,

  // Objects — events page sections
  eventsTextSplit,
  eventsDetailsTable,
  eventsInquiryForm,
  // Objects — locations page sections
  locationCard,
  locationsTextSplit,
  locationsFavorites,

  // Objects — shared
  link,
  buttonLink,

  // Objects — footer
  footerColumn,
  footerLink,
  socialLink,
];
