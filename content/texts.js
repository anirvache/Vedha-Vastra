// All wording used by the public website. Edit the words here, not inside the pages.

import { SITE } from '@/config/site';

export const TEXTS = {
  heroTitle: 'Sarees that feel like you',
  viewCollection: 'View collection',
  chatWhatsApp: 'Chat on WhatsApp',
  enquire: 'Enquire on WhatsApp',
  newArrivals: 'New arrivals',
  shopByCategory: 'Shop by category',
  noSarees: 'New sarees are on the way. Message us on WhatsApp to see what is fresh in the shop.',
  soldNote: 'This saree has found a home. Message us and we will help you find something similar.',
  aiNote: 'Studio-style images are digitally created to show the drape. Shade may vary slightly. Ask us for a real photo in daylight.',
  askSimilar: 'Ask for something similar',
};

export function enquiryText(saree, url) {
  return 'Hello ' + SITE.name + '! I am interested in this saree:\n' +
    saree.name + ' (Code: ' + saree.code + ')\n' + url + '\nIs it available?';
}

export function generalText() {
  return 'Hello ' + SITE.name + '! I would like to see your latest sarees.';
}
