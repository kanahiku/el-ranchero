export interface StoreLocation {
  slug: string;
  name: string;
  /** Title and H1 — includes landmark where the sitemap requires it. */
  heading: string;
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
  /** Direct Heartland POS pickup ordering URL for this location. */
  orderPickupHref: string;
  /** Direct delivery ordering URL (order.online) for this location. */
  orderDeliveryHref: string;
}

export function storeMapsQuery(store: StoreLocation): string {
  return ['El Ranchero', store.shopName, store.addressLine1, store.addressLine2].join(', ');
}

export function storeDirectionsHref(store: StoreLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeMapsQuery(store))}`;
}

export function storeMapEmbedSrc(store: StoreLocation): string {
  if (store.mapsEmbedSrc) return store.mapsEmbedSrc;
  return `https://maps.google.com/maps?q=${encodeURIComponent(storeMapsQuery(store))}&z=16&output=embed`;
}

export const storeLocations: StoreLocation[] = [
  {
    slug: 'kailua',
    name: 'Kailua',
    heading: 'Kailua',
    shopName: 'Kailua Shopping Center',
    addressLine1: '600 Kailua Road #103',
    addressLine2: 'Kailua, HI 96734',
    phoneDisplay: '(808) 262-2016',
    phoneHref: 'tel:+18082622016',
    hours: 'Monday - Saturday: 10:00 AM to 8:00 PM · Sunday: 11:00 AM to 8:00 PM',
    href: '/locations/kailua',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6307.5935711244365!2d-157.74407953743653!3d21.393773480266518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c0014dcf0f60443%3A0xa48f700fd70e45ff!2sKailua%20Shopping%20Center!5e1!3m2!1sen!2sph!4v1789498286774!5m2!1sen!2sph',
    intro:
      'Kailua Shopping Center is where our story began in 2006. Stop by for fresh salads and wraps served with true local hospitality.',
    orderPickupHref: 'https://alohasaladskailua.hrpos.heartland.us/menu',
    orderDeliveryHref: 'https://order.online/store/aloha-salads-kailua-275899/?delivery=true&hideModal=true',
  },
  {
    slug: 'kahala',
    name: 'Kahala',
    heading: 'Kahala',
    shopName: 'Kahala Mall',
    addressLine1: '4211 Waialae Avenue',
    addressLine2: 'Honolulu, HI 96816',
    landmark: 'Next to Starbucks',
    phoneDisplay: '(808) 735-8334',
    phoneHref: 'tel:+18087358334',
    hours: 'Monday - Saturday: 10:00 AM to 8:00 PM · Sunday: 11:00 AM to 7:00 PM',
    href: '/locations/kahala',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56268.985814691194!2d-157.79088!3d21.283216!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006d608472b023%3A0x7df6dfbaf0346c88!2sAloha%20Salads!5e1!3m2!1sen!2sph!4v1788465224598!5m2!1sen!2sph',
    intro:
      'Kahala Mall is your neighborhood stop for crisp greens and fresh local fish. It is the perfect spot for a healthy grab-and-go meal.',
    orderPickupHref: 'https://alohasaladskahala.hrpos.heartland.us/menu',
    orderDeliveryHref: 'https://order.online/store/aloha-salads-honolulu-276199/?delivery=true&hideModal=true',
  },
  {
    slug: 'kaneohe',
    name: 'Kaneohe',
    heading: 'Kaneohe / Windward Mall',
    shopName: 'Windward Mall',
    addressLine1: '46-056 Kamehameha Hwy #F-2',
    addressLine2: 'Kaneohe, HI 96744',
    phoneDisplay: '(808) 234-6414',
    phoneHref: 'tel:+18082346414',
    hours: 'Monday - Saturday: 11:00 AM to 7:00 PM · Sunday: 11:00 AM to 6:00 PM',
    href: '/locations/kaneohe',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d449890.64104716387!2d-158.0817572!3d21.3684132!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006bd6aef3c96f%3A0xd571e94ef8632356!2sAloha%20Salads!5e1!3m2!1sen!2sph!4v1788467490827!5m2!1sen!2sph',
    intro:
      'Windward Mall is conveniently located for a fresh post-shopping meal or a quick family lunch.',
    orderPickupHref: 'https://alohasaladskaneohe.hrpos.heartland.us/menu',
    orderDeliveryHref: 'https://order.online/store/aloha-salads-kaneohe-27645368/?hideModal=true&pickup=true',
  },
  {
    slug: 'kapolei',
    name: 'Kapolei',
    heading: 'Kapolei',
    shopName: 'Kapolei Commons',
    addressLine1: '4450 Kapolei Parkway',
    addressLine2: 'Kapolei, HI 96707',
    landmark: 'Next to Target',
    phoneDisplay: '(808) 692-9829',
    phoneHref: 'tel:+18086929829',
    hours: 'Monday - Saturday: 10:00 AM to 8:00 PM · Sunday: 11:00 AM to 7:00 PM',
    href: '/locations/kapolei',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56250.67233191676!2d-158.068371!3d21.331035!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006327b0f280b3%3A0x3645d60b174c0125!2sAloha%20Salads!5e1!3m2!1sen!2sph!4v1788467950623!5m2!1sen!2sph',
    intro:
      'Kapolei Commons serves West Oahu with hearty salads alongside refreshing Big Island mamaki mint tea.',
    orderPickupHref: 'https://alohasaladskapolei.hrpos.heartland.us/menu',
    orderDeliveryHref: 'https://order.online/store/aloha-salads-kapolei-275987/?delivery=true&hideModal=true',
  },
  {
    slug: 'mililani',
    name: 'Mililani',
    heading: 'Mililani',
    shopName: 'Mililani Town Center',
    addressLine1: '95-1249 Meheula Parkway, Suite No. A107',
    addressLine2: 'Mililani, HI 96789',
    phoneDisplay: '(808) 623-1122',
    phoneHref: 'tel:+18086231122',
    hours: 'Monday - Saturday: 11:00 AM to 8:00 PM · Sunday: 11:00 AM to 7:00 PM',
    href: '/locations/mililani',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28101.750033920067!2d-158.0069756!3d21.4537402!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c00670933c5e6b7%3A0x544852c9d73eaf20!2sTown%20Center%20of%20Mililani!5e1!3m2!1sen!2sph!4v1788468690659!5m2!1sen!2sph',
    intro:
      'Mililani is your local destination for wholesome, scratch-made food featuring ingredients sourced from Hawaii farmers.',
    orderPickupHref: 'https://alohasaladsmililani.hrpos.heartland.us/menu',
    orderDeliveryHref: 'https://order.online/store/aloha-salads-mililani-276015/?delivery=true&hideModal=true',
  },
  {
    slug: 'pearlridge',
    name: 'Pearlridge',
    heading: 'Pearlridge / Aiea',
    shopName: 'Pearlridge Center Downtown',
    addressLine1: '98-1008 Moanalua Rd',
    addressLine2: 'Aiea, HI 96701',
    phoneDisplay: '(808) 484-7811',
    phoneHref: 'tel:+18084847811',
    hours: 'Monday - Friday: 10:00 AM to 8:00 PM · Saturday: 11:00 AM to 7:00 PM · Sunday: 11:00 AM to 6:00 PM',
    href: '/locations/pearlridge',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3715.1542770230867!2d-157.9428952!3d21.3838292!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006f4d57b24cd5%3A0x2c024eb1e3fbb260!2sPearlridge%20Center!5e0!3m2!1sen!2sph!4v1788469712525!5m2!1sen!2sph',
    intro:
      'Pearlridge / Aiea features custom salad bowls packed with fresh ingredients and local flavors right in the heart of the community.',
    orderPickupHref: 'https://alohasaladspearlridge.hrpos.heartland.us/menu',
    orderDeliveryHref: 'https://order.online/store/aloha-salads-aiea-605768/?delivery=true&hideModal=true',
  },
];

export function findStore(slug: string): StoreLocation | undefined {
  return storeLocations.find((store) => store.slug === slug);
}
