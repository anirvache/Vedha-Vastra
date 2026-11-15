// ONE PLACE for shop details. Edit here, save, and the whole website updates.

export const SITE = {
  name: 'Your Boutique Name',
  tagline: 'Handpicked sarees, chosen with love and care',
  eyebrow: 'Sarees for every occasion',

  // WhatsApp number: country code + number, digits only. No plus sign, no spaces.
  whatsapp: '919999999999',
  phoneDisplay: '+91 99999 99999',
  address: 'Shop address, City, State',
  hours: 'Monday to Saturday, 10 am to 7 pm',
  instagram: '', // full link like https://instagram.com/yourshop, or leave empty

  heroImage: '', // optional: paste a photo link (from Supabase Storage) for the home page banner

  currencySymbol: '\u20B9',

  about: [
    'Write two or three short paragraphs here about your mother: how long she has been in sarees, what she loves, and how she chooses each piece.',
    'Customers buy from people they trust. A real story and a real face matter more than fancy words.',
  ],

  trust: [
    { title: 'Handpicked', text: 'Every saree is chosen and checked by us.' },
    { title: 'Talk to a real person', text: 'Ask anything on WhatsApp before you buy.' },
    { title: 'Careful delivery', text: 'Packed with care and shipped with tracking.' },
  ],

  policies: [
    { title: 'Delivery', text: 'We ship across India. Delivery usually takes 4 to 7 days. Charges are shared on WhatsApp.' },
    { title: 'Exchange and returns', text: 'Please tell us within 48 hours of delivery if there is any problem. Write your own policy here.' },
    { title: 'Colour note', text: 'Shades can look slightly different on different screens. Ask us for a daylight photo or video.' },
  ],

  // Lists used in the admin dropdowns and website filters. Edit freely.
  categories: ['Silk', 'Cotton', 'Linen', 'Georgette', 'Wedding', 'Festive', 'Daily wear'],
  fabrics: ['Silk', 'Cotton', 'Linen', 'Georgette', 'Chiffon', 'Organza', 'Tussar', 'Crepe'],
  colours: ['Red', 'Maroon', 'Pink', 'Orange', 'Yellow', 'Green', 'Emerald', 'Blue', 'Indigo', 'Purple', 'Black', 'White', 'Cream', 'Grey', 'Gold'],
  occasions: ['Wedding', 'Festive', 'Office', 'Daily wear', 'Party', 'Gifting'],
  styles: ['Traditional', 'Festive', 'Contemporary', 'Minimal', 'Bridal', 'Office-wear'],
};
