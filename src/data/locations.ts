/**
 * Taqueria El Ranchero restaurants (Wahiawa and Kapolei).
 * Copy source: pages-content/Locations/*.docx. Used by StoreVisit and the
 * /locations/* pages. Hub-card copy lives on /locations itself.
 */
export interface StoreLocation {
  slug: string;
  name: string;
  /** Title and H1. */
  heading: string;
  /** Shopping center the restaurant sits in. */
  shopName: string;
  addressLine1: string;
  addressLine2: string;
  /** Nearby landmark shown on the hub cards, not hours. */
  landmark?: string;
  phoneDisplay: string;
  phoneHref: string;
  hours: string;
  href: string;
  intro: string;
  /** Google Maps embed URL from the location brief. Falls back to a query embed. */
  mapsEmbedSrc?: string;
  /** Google Maps place link used by every "Get Directions" button. */
  directionsHref?: string;
  /** DoorDash store page. */
  orderPickupHref: string;
  /** Delivery ordering URL. Same DoorDash store as pickup. */
  orderDeliveryHref: string;
}

export function storeMapsQuery(store: StoreLocation): string {
  return ['Taqueria El Ranchero', store.addressLine1, store.addressLine2].join(', ');
}

export function storeDirectionsHref(store: StoreLocation): string {
  return (
    store.directionsHref ??
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeMapsQuery(store))}`
  );
}

export function storeMapEmbedSrc(store: StoreLocation): string {
  if (store.mapsEmbedSrc) return store.mapsEmbedSrc;
  return `https://maps.google.com/maps?q=${encodeURIComponent(storeMapsQuery(store))}&z=16&output=embed`;
}

export const storeLocations: StoreLocation[] = [
  {
    slug: 'wahiawa',
    name: 'Wahiawa',
    heading: 'Mexican Restaurant in Wahiawa, HI',
    shopName: 'Wahiawa Shopping Center',
    addressLine1: '823 California Ave',
    addressLine2: 'Wahiawa, HI 96786',
    phoneDisplay: '(808) 621-8226',
    phoneHref: 'tel:+18086218226',
    hours: 'Monday-Sunday: 9:00 AM-8:30 PM',
    href: '/locations/wahiawa',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d118807.78334032193!2d-157.9185514!3d21.4785894!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c005df2e6157385%3A0x308420cdf244ff60!2sTaqueria%20El%20Ranchero!5e0!3m2!1sen!2sph!4v1786723483970!5m2!1sen!2sph',
    directionsHref:
      'https://www.google.com/maps/place/Taqueria+El+Ranchero/@21.4785894,-157.9185514,12.25z/data=!4m6!3m5!1s0x7c005df2e6157385:0x308420cdf244ff60!8m2!3d21.4971101!4d-158.0255454!16s%2Fg%2F11b77try2q',
    intro:
      'Wahiawa is where the El Ranchero story began. Taqueria El Ranchero opened its first location here in 2015.',
    orderPickupHref: 'https://www.doordash.com/store/taqueria-el-ranchero-wahiawa-276575/',
    orderDeliveryHref: 'https://www.doordash.com/store/taqueria-el-ranchero-wahiawa-276575/',
  },
  {
    slug: 'kapolei',
    name: 'Kapolei',
    heading: 'Mexican Restaurant in Kapolei, HI',
    shopName: 'Ka Makana Aliʻi',
    addressLine1: '91-5431 Kapolei Pkwy #501',
    addressLine2: 'Kapolei, HI 96707',
    phoneDisplay: '(808) 693-8226',
    phoneHref: 'tel:+18086938226',
    hours: 'Monday-Sunday: 10:00 AM-9:00 PM',
    href: '/locations/kapolei',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14865.750352758614!2d-158.0501425!3d21.3332283!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006312335dd9e7%3A0x38722efab8df9697!2sTaqueria%20El%20Ranchero!5e0!3m2!1sen!2sph!4v1786671802597!5m2!1sen!2sph',
    directionsHref:
      'https://www.google.com/maps/place/Taqueria+El+Ranchero/@21.3332283,-158.0501425,15z/data=!4m6!3m5!1s0x7c006312335dd9e7:0x38722efab8df9697!8m2!3d21.3332283!4d-158.0501425!16s%2Fg%2F11nmwp8kf6',
    intro:
      'Our Kapolei restaurant at Ka Makana Aliʻi serves West Oʻahu with Ranchero-style tacos, burritos and Mexican breakfast.',
    orderPickupHref: 'https://www.doordash.com/store/taqueria-el-ranchero-kapolei-2390257/17923947/',
    orderDeliveryHref: 'https://www.doordash.com/store/taqueria-el-ranchero-kapolei-2390257/17923947/',
  },
];

export function findStore(slug: string): StoreLocation | undefined {
  return storeLocations.find((store) => store.slug === slug);
}
