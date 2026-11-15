// Content for the trade and town pages.
//
// Prices mirror the rate card in the admin panel (Prices page). If you change
// a rate there, change it here too and rebuild, so the pages never promise a
// price the app won't give. "From" = call-out fee + minimum hours x hourly rate.

export const site = {
  name: 'Fixmet',
  baseUrl: 'https://www.fixmet.co.uk',
  // Customer app (Fixmet) and contractor app (Fixmet Contractors).
  appStoreUrl: 'https://apps.apple.com/gb/app/fixmet/id6762088071',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fixmet.app',
  contractorAppStoreUrl: 'https://apps.apple.com/gb/app/fixmet-contractors/id6762412056',
  contractorPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.fixmet_contractors.app',
  supportEmail: 'info@fixmet.co.uk',
  // Same as the admin "Instant job price" and "London price" settings.
  instantPercent: 125,
  londonPercent: 125,
  guarantee:
    "If the work isn't right, tell us within 7 days and we'll send someone back to fix it or refund you.",
  company: {
    legalName: 'Fixmet Solutions Ltd',
    number: '17008216',
    address: '49 Gelligaer Street, Cardiff, Wales, CF24 4LD',
    street: '49 Gelligaer Street',
    city: 'Cardiff',
    postcode: 'CF24 4LD',
  },
  // Google Search Console ownership check (kept from the old site).
  googleVerification: 'google1bf61f721282718c',
};

/**
 * slug: URL part. name/plural: how people search ("plumber", "plumbers").
 * rate/callout/minHours: the rate card. jobs: common jobs with a fixed
 * price (fixed) or a typical rate-card price for the hours given (hours, parts).
 */
export const trades = [
  {
    slug: 'plumber',
    name: 'Plumber',
    plural: 'plumbers',
    service: 'plumbing',
    rate: 47,
    callout: 40,
    minHours: 1,
    intro:
      'Leaks, blocked drains, dripping taps, toilets that won\'t stop running and new taps or showers fitted.',
    jobs: [
      { name: 'Fix a leak (pipe, tap or under the sink)', fixed: 95 },
      { name: 'Unblock a sink, bath or shower drain', fixed: 115 },
      { name: 'Replace a kitchen or bathroom tap', hours: 1, parts: 0 },
      { name: 'Fix a running or leaking toilet', hours: 1, parts: 15 },
      { name: 'Fit a new shower head or mixer', hours: 1.5, parts: 0 },
    ],
    faqs: [
      [
        'Do your plumbers work on boilers or gas?',
        'No. By law, work on gas appliances and gas pipes must be done by a Gas Safe registered engineer, and Fixmet doesn\'t offer gas work. If your request is about a boiler, gas hob or gas fire, the app will tell you to contact a Gas Safe engineer.',
      ],
      [
        'Can a plumber come today?',
        'Choose "Instant" in the app and we offer the job to available plumbers near you straight away. Instant jobs cost 25% more. You can also pick a time that suits you.',
      ],
    ],
  },
  {
    slug: 'electrician',
    name: 'Electrician',
    plural: 'electricians',
    service: 'electrical work',
    rate: 50,
    callout: 20,
    minHours: 1,
    intro:
      'Sockets, switches and lights that stopped working, new light fittings, ceiling fans and fault finding.',
    jobs: [
      { name: 'Replace a socket or light switch', fixed: 75 },
      { name: 'Repair or fit a ceiling fan', fixed: 95 },
      { name: 'Fit a new light fitting', hours: 1, parts: 0 },
      { name: 'Find and fix a tripping fuse', hours: 1.5, parts: 0 },
      { name: 'Fit an outdoor light', hours: 2, parts: 0 },
    ],
    faqs: [
      [
        'What about bigger electrical work?',
        'New circuits, consumer units (fuse boxes) and work in bathrooms are notifiable under Part P of the Building Regulations and must be certified. Say so in your request so the job goes to an electrician who can certify it.',
      ],
    ],
  },
  {
    slug: 'cleaner',
    name: 'Cleaner',
    plural: 'cleaners',
    service: 'cleaning',
    rate: 24,
    callout: 0,
    minHours: 2,
    intro:
      'Regular and one-off cleans, deep cleans, end of tenancy cleans, ovens and sofas.',
    jobs: [
      { name: 'Sofa cleaning', fixed: 65 },
      { name: 'Regular clean of a 1-2 bed flat', hours: 2, parts: 0 },
      { name: 'Deep clean of a 2 bed flat', hours: 5, parts: 10 },
      { name: 'End of tenancy clean (2 bed)', hours: 7, parts: 15 },
      { name: 'Oven clean', hours: 2, parts: 5 },
    ],
    faqs: [
      [
        'Do I need to provide cleaning products?',
        'Tell us in your request. Cleaners usually bring their own products; anything special is added to the price before you book, so there are no surprises.',
      ],
    ],
  },
  {
    slug: 'handyman',
    name: 'Handyman',
    plural: 'handymen',
    service: 'handyman jobs',
    rate: 33,
    callout: 0,
    minHours: 2,
    intro:
      'Shelves, TV mounting, flat-pack furniture, curtain poles, small repairs and odd jobs around the home.',
    jobs: [
      { name: 'Put up shelves or a mirror', hours: 1, parts: 0 },
      { name: 'Mount a TV on the wall', hours: 1.5, parts: 0 },
      { name: 'Assemble flat-pack furniture', hours: 2, parts: 0 },
      { name: 'Fit curtain poles or blinds', hours: 1.5, parts: 0 },
      { name: 'Half a day of odd jobs', hours: 4, parts: 0 },
    ],
    faqs: [],
  },
  {
    slug: 'painter-decorator',
    name: 'Painter and decorator',
    plural: 'painters and decorators',
    service: 'painting and decorating',
    rate: 30,
    callout: 0,
    minHours: 4,
    intro:
      'Walls, ceilings, woodwork, doors and wallpaper, from one room to a whole home.',
    jobs: [
      { name: 'Paint a bedroom (walls and ceiling)', hours: 8, parts: 40 },
      { name: 'Paint a living room', hours: 10, parts: 50 },
      { name: 'Paint doors and skirting in one room', hours: 4, parts: 15 },
      { name: 'Hang wallpaper on one wall', hours: 4, parts: 0 },
    ],
    faqs: [],
  },
  {
    slug: 'carpenter',
    name: 'Carpenter',
    plural: 'carpenters',
    service: 'carpentry',
    rate: 33,
    callout: 0,
    minHours: 2,
    intro:
      'Doors that stick or won\'t close, new internal doors, skirting, shelving, decking repairs and built-in storage.',
    jobs: [
      { name: 'Fix a sticking or dropped door', hours: 1, parts: 0 },
      { name: 'Hang a new internal door', hours: 3, parts: 15 },
      { name: 'Fit new skirting in a room', hours: 4, parts: 40 },
      { name: 'Repair a section of decking', hours: 3, parts: 40 },
    ],
    faqs: [],
  },
  {
    slug: 'gardener',
    name: 'Gardener',
    plural: 'gardeners',
    service: 'gardening',
    rate: 30,
    callout: 0,
    minHours: 2,
    intro:
      'Lawn mowing, hedge trimming, weeding, garden tidy-ups and green waste removal.',
    jobs: [
      { name: 'Mow and edge a lawn', hours: 1, parts: 0 },
      { name: 'Trim hedges', hours: 3, parts: 0 },
      { name: 'Garden tidy-up', hours: 4, parts: 0 },
    ],
    faqs: [],
  },
  {
    slug: 'window-cleaner',
    name: 'Window cleaner',
    plural: 'window cleaners',
    service: 'window cleaning',
    rate: 25,
    callout: 0,
    minHours: 1,
    intro: 'Inside and outside window cleaning, frames, sills and conservatories.',
    jobs: [
      { name: 'Outside windows of a 3 bed house', hours: 1, parts: 0 },
      { name: 'Inside and outside, 3 bed house', hours: 2, parts: 0 },
      { name: 'Conservatory clean', hours: 2.5, parts: 0 },
    ],
    faqs: [],
  },
  {
    slug: 'gutter-cleaning',
    name: 'Gutter cleaning and repair',
    plural: 'gutter cleaners',
    person: 'gutter cleaner',
    service: 'gutter cleaning and repair',
    rate: 30,
    callout: 20,
    minHours: 2,
    intro:
      'Blocked and overflowing gutters, leaking joints, downpipes and small gutter repairs.',
    jobs: [
      { name: 'Clear the gutters of a 3 bed semi', hours: 2, parts: 0 },
      { name: 'Fix a leaking gutter joint', hours: 2, parts: 15 },
    ],
    faqs: [],
  },
  {
    slug: 'removals',
    name: 'Removals',
    plural: 'removal teams',
    person: 'removal team',
    service: 'removals',
    rate: 62,
    callout: 0,
    minHours: 2,
    intro:
      'Man and van, small moves, furniture delivery and full house moves with a team.',
    jobs: [
      { name: 'Man and van for a few items', hours: 2, parts: 0 },
      { name: 'Studio or 1 bed flat move', hours: 4, parts: 0 },
      { name: '2 bed flat move', hours: 6, parts: 0 },
    ],
    faqs: [],
  },
  {
    slug: 'roofer',
    name: 'Roofer',
    plural: 'roofers',
    service: 'roofing',
    rate: 40,
    callout: 30,
    minHours: 2,
    guidePrice: true,
    intro:
      'Slipped or missing tiles, leaks, flashing, flat roof repairs and roof inspections.',
    jobs: [
      { name: 'Replace a few slipped tiles', hours: 2, parts: 30 },
      { name: 'Find and repair a roof leak', hours: 4, parts: 40 },
      { name: 'Repair lead flashing', hours: 3, parts: 50 },
    ],
    faqs: [],
  },
  {
    slug: 'builder',
    name: 'Builder',
    plural: 'builders',
    service: 'building work',
    rate: 36,
    callout: 0,
    minHours: 4,
    guidePrice: true,
    intro:
      'Brickwork, garden walls, plastering patches, small structural repairs and general building work.',
    jobs: [
      { name: 'Repair a section of garden wall', hours: 8, parts: 60 },
      { name: 'Patch plaster on a wall', hours: 4, parts: 20 },
      { name: 'Repoint brickwork (small area)', hours: 6, parts: 20 },
    ],
    faqs: [],
  },
];

/**
 * Towns. Keep only the places Fixmet actually covers, or customers will find
 * pages for areas where nobody can come.
 * districts: postcode districts shown on the page (local relevance for search).
 */
export const towns = [
  {
    slug: 'london',
    name: 'London',
    region: 'Greater London',
    london: true,
    districts: ['E1', 'E8', 'N1', 'N7', 'NW1', 'NW6', 'SE1', 'SE15', 'SW2', 'SW11', 'W2', 'W12'],
    areas: ['Hackney', 'Islington', 'Camden', 'Southwark', 'Lambeth', 'Wandsworth', 'Westminster', 'Tower Hamlets'],
    near: ['croydon', 'reading'],
  },
  {
    slug: 'croydon',
    name: 'Croydon',
    region: 'Greater London',
    london: true,
    districts: ['CR0', 'CR2', 'CR7', 'CR8', 'SE25'],
    areas: ['South Croydon', 'Thornton Heath', 'Purley', 'Addiscombe', 'Selhurst'],
    near: ['london'],
  },
  {
    slug: 'manchester',
    name: 'Manchester',
    region: 'Greater Manchester',
    districts: ['M1', 'M4', 'M14', 'M15', 'M16', 'M20', 'M21', 'M50'],
    areas: ['City Centre', 'Didsbury', 'Chorlton', 'Fallowfield', 'Salford Quays', 'Ancoats'],
    near: ['liverpool', 'leeds', 'sheffield'],
  },
  {
    slug: 'birmingham',
    name: 'Birmingham',
    region: 'West Midlands',
    districts: ['B1', 'B5', 'B13', 'B15', 'B17', 'B29', 'B30'],
    areas: ['City Centre', 'Edgbaston', 'Moseley', 'Harborne', 'Selly Oak', 'Kings Heath'],
    near: ['leicester', 'nottingham'],
  },
  {
    slug: 'leeds',
    name: 'Leeds',
    region: 'West Yorkshire',
    districts: ['LS1', 'LS2', 'LS6', 'LS7', 'LS8', 'LS11', 'LS17'],
    areas: ['City Centre', 'Headingley', 'Chapel Allerton', 'Roundhay', 'Kirkstall'],
    near: ['manchester', 'sheffield'],
  },
  {
    slug: 'liverpool',
    name: 'Liverpool',
    region: 'Merseyside',
    districts: ['L1', 'L3', 'L8', 'L15', 'L17', 'L18'],
    areas: ['City Centre', 'Toxteth', 'Wavertree', 'Allerton', 'Aigburth'],
    near: ['manchester'],
  },
  {
    slug: 'sheffield',
    name: 'Sheffield',
    region: 'South Yorkshire',
    districts: ['S1', 'S2', 'S7', 'S10', 'S11'],
    areas: ['City Centre', 'Ecclesall', 'Crookes', 'Nether Edge', 'Hillsborough'],
    near: ['leeds', 'manchester', 'nottingham'],
  },
  {
    slug: 'bristol',
    name: 'Bristol',
    region: 'South West',
    districts: ['BS1', 'BS3', 'BS6', 'BS7', 'BS8', 'BS16'],
    areas: ['City Centre', 'Clifton', 'Redland', 'Bedminster', 'Bishopston', 'Fishponds'],
    near: ['reading'],
  },
  {
    slug: 'nottingham',
    name: 'Nottingham',
    region: 'East Midlands',
    districts: ['NG1', 'NG2', 'NG5', 'NG7', 'NG9'],
    areas: ['City Centre', 'West Bridgford', 'Beeston', 'Sherwood', 'Lenton'],
    near: ['leicester', 'sheffield', 'birmingham'],
  },
  {
    slug: 'leicester',
    name: 'Leicester',
    region: 'East Midlands',
    districts: ['LE1', 'LE2', 'LE3', 'LE4', 'LE5'],
    areas: ['City Centre', 'Clarendon Park', 'Stoneygate', 'Belgrave', 'Aylestone'],
    near: ['nottingham', 'birmingham'],
  },
  {
    slug: 'reading',
    name: 'Reading',
    region: 'Berkshire',
    districts: ['RG1', 'RG2', 'RG4', 'RG6', 'RG30'],
    areas: ['Town Centre', 'Caversham', 'Earley', 'Tilehurst', 'Whitley'],
    near: ['london', 'bristol'],
  },
];
